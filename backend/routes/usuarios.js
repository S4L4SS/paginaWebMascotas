const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/profile-pictures');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: usuario_timestamp.extension
    const uniqueName = `${req.body.userId || 'user'}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: function (req, file, cb) {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  }
});

// Servir archivos estáticos de imágenes de perfil
router.use('/profile-pictures', express.static(path.join(__dirname, '../uploads/profile-pictures')));

// Función para comparación exacta carácter por carácter
function isExactMatch(str1, str2) {
  if (typeof str1 !== 'string' || typeof str2 !== 'string') {
    return false;
  }
  if (str1.length !== str2.length) {
    return false;
  }
  for (let i = 0; i < str1.length; i++) {
    if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
      return false;
    }
  }
  return true;
}

// Login con verificación exacta
router.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  
  console.log(`[LOGIN] Intento de login con usuario: "${usuario}"`);
  
  // Buscar usuario case-insensitive primero
  connection.query(
    'SELECT * FROM usuario WHERE UPPER(usuario) = UPPER(?)',
    [usuario],
    (err, results) => {
      if (err) {
        console.log(`[LOGIN] Error en BD:`, err);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
      
      if (results.length === 0) {
        console.log(`[LOGIN] Usuario no encontrado: "${usuario}"`);
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
      
      const user = results[0];
      console.log(`[LOGIN] Usuario encontrado en BD: "${user.usuario}"`);
      console.log(`[LOGIN] Comparando "${usuario}" con "${user.usuario}"`);
      
      // Verificación EXACTA del nombre de usuario
      if (!isExactMatch(usuario, user.usuario)) {
        console.log(`[LOGIN] FALLA: Comparación exacta de usuario falló`);
        console.log(`[LOGIN] Usuario BD chars: [${user.usuario.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
        console.log(`[LOGIN] Usuario input chars: [${usuario.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
        return res.status(401).json({ 
          error: 'Usuario o contraseña incorrectos',
          debug: `Formato exacto requerido. BD: "${user.usuario}", Input: "${usuario}"`
        });
      }
      
      // Verificación EXACTA de la contraseña
      if (!isExactMatch(contrasena, user.contrasena)) {
        console.log(`[LOGIN] FALLA: Contraseña incorrecta`);
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
      
      console.log(`[LOGIN] ÉXITO: Login exitoso para "${user.usuario}"`);
      
      res.json({
        mensaje: 'Login exitoso',
        user: {
          idUsuario: user.idUsuario,
          usuario: user.usuario,
          correo: user.correo,
          rol: user.rol
        }
      });
    }
  );
});

// Register
router.post('/register', (req, res) => {
  const { usuario, correo, contrasena } = req.body;
  
  // Validar que todos los campos están presentes
  if (!usuario || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  
  // Verificar si el usuario ya existe
  connection.query('SELECT * FROM usuario WHERE usuario = ? OR correo = ?', [usuario, correo], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }
    
    // Insertar nuevo usuario con rol por defecto 'cliente'
    connection.query(
      'INSERT INTO usuario (usuario, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [usuario, correo, contrasena, 'cliente'],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
        res.json({ 
          mensaje: 'Registro exitoso', 
          user: {
            idUsuario: result.insertId,
            usuario: usuario,
            correo: correo,
            rol: 'cliente'
          }
        });
      }
    );
  });
});

// Listar usuarios
router.get('/', (req, res) => {
  connection.query('SELECT idUsuario, usuario, correo, rol FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

// Cambiar rol
router.put('/:id/rol', (req, res) => {
  const { rol } = req.body;
  const { id } = req.params;
  connection.query(
    'UPDATE usuario SET rol = ? WHERE idUsuario = ?',
    [rol, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar rol' });
      res.json({ mensaje: 'Rol actualizado' });
    }
  );
});

// Endpoint para actualizar perfil con imagen
router.put('/:id/perfil', upload.single('fotoPerfil'), (req, res) => {
  const { id } = req.params;
  const { usuario, correo, nombre, apellido, fechaNacimiento } = req.body;
  
  console.log(`[PERFIL] Actualizando perfil del usuario ID: ${id}`);
  
  const updateData = {
    usuario,
    correo,
    nombre,
    apellido,
    fechaNacimiento
  };
  
  // Si se subió una imagen, agregar la ruta
  if (req.file) {
    updateData.fotoPerfil = `/api/usuarios/profile-pictures/${req.file.filename}`;
    console.log(`[PERFIL] Nueva foto: ${updateData.fotoPerfil}`);
  }
  
  connection.query(
    'UPDATE usuario SET ? WHERE idUsuario = ?',
    [updateData, id],
    (err, result) => {
      if (err) {
        console.log(`[PERFIL] Error al actualizar:`, err);
        return res.status(500).json({ error: 'Error al actualizar perfil' });
      }
      
      // Obtener datos actualizados del usuario
      connection.query(
        'SELECT idUsuario, usuario, correo, rol, fotoPerfil, nombre, apellido, fechaNacimiento FROM usuario WHERE idUsuario = ?',
        [id],
        (err, users) => {
          if (err) {
            return res.status(500).json({ error: 'Error al obtener usuario actualizado' });
          }
          
          console.log(`[PERFIL] Perfil actualizado exitosamente`);
          res.json({ 
            mensaje: 'Perfil actualizado exitosamente',
            user: users[0]
          });
        }
      );
    }
  );
});

// Endpoint de debugging para listar usuarios
router.get('/debug/list', (req, res) => {
  console.log('[DEBUG] Listando todos los usuarios en la BD');
  connection.query('SELECT usuario, correo, rol FROM usuario', (err, results) => {
    if (err) {
      console.log('[DEBUG] Error al consultar usuarios:', err);
      return res.status(500).json({ error: 'Error en servidor' });
    }
    
    console.log('[DEBUG] Usuarios encontrados:', results.length);
    results.forEach((user, index) => {
      console.log(`[DEBUG] ${index + 1}. Usuario: "${user.usuario}" (chars: [${user.usuario.split('').map(c => c.charCodeAt(0)).join(', ')}])`);
    });
    
    res.json({
      mensaje: 'Lista de usuarios',
      usuarios: results.map(user => ({
        usuario: user.usuario,
        correo: user.correo,
        rol: user.rol,
        chars: user.usuario.split('').map(c => c.charCodeAt(0))
      }))
    });
  });
});

module.exports = router;
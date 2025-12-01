const UsuarioDAO = require('../dao/UsuarioDAO');
const path = require('path');
const fs = require('fs');

// Función para comparación exacta carácter por carácter
function isExactMatch(str1, str2) {
  // Verificar que ambos existan y sean strings
  if (typeof str1 !== 'string' || typeof str2 !== 'string') {
    return false;
  }
  
  // Verificar longitud
  if (str1.length !== str2.length) {
    return false;
  }
  
  // Comparar carácter por carácter usando códigos Unicode
  for (let i = 0; i < str1.length; i++) {
    if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
      return false;
    }
  }
  
  return true;
}

const UsuarioController = {
  login: (req, res) => {
    const { usuario, contrasena } = req.body;
    
    console.log(`[LOGIN] Intento de login con usuario: "${usuario}"`);
    
    // Buscar usuario por comparación case-insensitive para encontrar el registro
    UsuarioDAO.findByUsernameIgnoreCase(usuario, (err, user) => {
      if (err) {
        console.log(`[LOGIN] Error en BD:`, err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      
      if (!user) {
        console.log(`[LOGIN] Usuario no encontrado: "${usuario}"`);
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
      
      console.log(`[LOGIN] Usuario encontrado en BD: "${user.usuario}"`);
      console.log(`[LOGIN] Comparando "${usuario}" con "${user.usuario}"`);
      
      // Verificación EXACTA usando comparación carácter por carácter
      if (!isExactMatch(usuario, user.usuario)) {
        console.log(`[LOGIN] FALLA: Comparación exacta falló`);
        console.log(`[LOGIN] Usuario BD: [${user.usuario.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
        console.log(`[LOGIN] Usuario input: [${usuario.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
        return res.status(401).json({ 
          error: 'Usuario o contraseña incorrectos',
          debug: `Formato exacto requerido. BD: "${user.usuario}", Input: "${usuario}"`
        });
      }
      
      // Verificación de contraseña
      if (!isExactMatch(contrasena, user.contrasena)) {
        console.log(`[LOGIN] FALLA: Contraseña incorrecta`);
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
      
      console.log(`[LOGIN] ÉXITO: Login exitoso para "${user.usuario}"`);
      
      // Solo enviar los campos necesarios del usuario (INCLUYENDO fotoPerfil)
      const userData = {
        idUsuario: user.idUsuario,
        usuario: user.usuario,
        correo: user.correo,
        nombre: user.nombre,
        apellido: user.apellido,
        fechaNacimiento: user.fechaNacimiento,
        fotoPerfil: user.fotoPerfil,
        rol: user.rol || 'cliente'
      };
      res.json({ mensaje: 'Login exitoso', user: userData });
    });
  },
  register: (req, res) => {
    const { usuario, correo, contrasena, nombre, apellido, fechaNacimiento } = req.body;
    
    console.log('[REGISTER] Datos recibidos:', { usuario, correo, nombre, apellido, fechaNacimiento });
    
    // Validar campos obligatorios
    if (!usuario || !correo || !contrasena || !nombre || !apellido || !fechaNacimiento) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios (usuario, correo, contraseña, nombre, apellido, fecha de nacimiento)' 
      });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({ error: 'Formato de correo electrónico inválido' });
    }
    
    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }
    
    // Validar fecha de nacimiento (mayor de edad)
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    if (edad < 18) {
      return res.status(400).json({ error: 'Debes ser mayor de 18 años para registrarte' });
    }
    
    // Manejar foto de perfil
    let fotoPerfil = 'default-avatar.svg'; // Valor por defecto
    if (req.file) {
      try {
        // Generar nombre único para el archivo
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${usuario}_${Date.now()}${fileExtension}`;
        fotoPerfil = fileName;
        
        // Crear directorio si no existe
        const uploadDir = path.join(__dirname, '../uploads/profile-pictures');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Mover archivo a la ubicación final
        const finalPath = path.join(uploadDir, fileName);
        fs.writeFileSync(finalPath, req.file.buffer);
        
        console.log('[REGISTER] Foto de perfil guardada:', fileName);
      } catch (error) {
        console.error('[REGISTER] Error al guardar foto:', error);
        return res.status(500).json({ error: 'Error al procesar la foto de perfil' });
      }
    }
    
    // Verificar si ya existe un usuario con el mismo nombre o email
    UsuarioDAO.checkUserExists(usuario, correo, (err, exists) => {
      if (err) {
        console.error('[REGISTER] Error verificando usuario existente:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      
      if (exists) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese nombre o email' });
      }
      
      // Crear objeto con todos los datos del usuario
      const userData = {
        usuario,
        correo,
        contrasena,
        nombre,
        apellido,
        fechaNacimiento,
        fotoPerfil,
        rol: 'cliente'
      };
      
      // Si no existe, crear el usuario
      UsuarioDAO.create(userData, (err, result) => {
        if (err) {
          console.error('[REGISTER] Error creando usuario:', err);
          
          // Si hay error y se guardó una foto, eliminarla
          if (req.file && fotoPerfil !== 'default-avatar.png') {
            try {
              const photoPath = path.join(__dirname, '../uploads/profile-pictures', fotoPerfil);
              if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
              }
            } catch (deleteError) {
              console.error('[REGISTER] Error eliminando foto tras fallo:', deleteError);
            }
          }
          
          return res.status(500).json({ error: 'Error al registrar usuario' });
        }
        
        console.log('[REGISTER] Usuario registrado exitosamente:', result.insertId);
        res.json({ 
          mensaje: 'Registro exitoso', 
          id: result.insertId,
          fotoPerfil: fotoPerfil
        });
      });
    });
  },
};

module.exports = UsuarioController;

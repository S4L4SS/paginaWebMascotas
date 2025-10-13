const UsuarioDAO = require('../dao/UsuarioDAO');

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
      
      // Solo enviar los campos necesarios del usuario
      const userData = {
        idUsuario: user.idUsuario,
        usuario: user.usuario,
        correo: user.correo,
        rol: user.rol || 'cliente'
      };
      res.json({ mensaje: 'Login exitoso', user: userData });
    });
  },
  register: (req, res) => {
    const { usuario, correo, contrasena } = req.body;
    
    // Verificar si ya existe un usuario con el mismo nombre o email (ignorando mayúsculas y tildes)
    UsuarioDAO.checkUserExists(usuario, correo, (err, exists) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      if (exists) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese nombre o email' });
      }
      
      // Si no existe, crear el usuario
      UsuarioDAO.create({ usuario, correo, contrasena }, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
        res.json({ mensaje: 'Registro exitoso', id: result.insertId });
      });
    });
  },
};

module.exports = UsuarioController;

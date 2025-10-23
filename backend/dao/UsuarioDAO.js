const db = require('../config/db');

const UsuarioDAO = {
  findById: (id, callback) => {
    db.query('SELECT * FROM usuario WHERE idUsuario = ?', [id], (err, results) => {
      callback(err, results[0]);
    });
  },
  findByUsername: (usuario, callback) => {
    // Búsqueda exacta: debe coincidir exactamente con mayúsculas, minúsculas y tildes
    db.query('SELECT * FROM usuario WHERE usuario = ? COLLATE utf8mb4_bin', [usuario], (err, results) => {
      callback(err, results[0]);
    });
  },
  
  findByUsernameIgnoreCase: (usuario, callback) => {
    // Búsqueda case-insensitive simple para encontrar el usuario
    console.log(`[DAO] Buscando usuario case-insensitive: "${usuario}"`);
    db.query('SELECT * FROM usuario WHERE UPPER(usuario) = UPPER(?)', [usuario], (err, results) => {
      if (err) {
        console.log(`[DAO] Error en consulta:`, err);
        callback(err, null);
        return;
      }
      console.log(`[DAO] Resultados encontrados:`, results.length);
      if (results.length > 0) {
        console.log(`[DAO] Usuario encontrado:`, results[0].usuario);
      }
      callback(err, results[0]);
    });
  },
  
  checkUserExists: (usuario, correo, callback) => {
    // Verificación exacta para nombre de usuario (case-sensitive) 
    // pero case-insensitive para email (estándar)
    const normalizedCorreo = correo.toLowerCase();
    
    db.query(`
      SELECT * FROM usuario 
      WHERE usuario = ? COLLATE utf8mb4_bin OR LOWER(correo) = ?
    `, [usuario, normalizedCorreo], (err, results) => {
      callback(err, results.length > 0);
    });
  },
  create: (data, callback) => {
    const { usuario, correo, contrasena, nombre, apellido, fechaNacimiento, fotoPerfil, rol = 'cliente' } = data;
    
    const query = `
      INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, fechaNacimiento, fotoPerfil, rol) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [usuario, correo, contrasena, nombre, apellido, fechaNacimiento, fotoPerfil, rol];
    
    console.log('[DAO] Creando usuario con datos:', { usuario, correo, nombre, apellido, fechaNacimiento, fotoPerfil, rol });
    
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('[DAO] Error en inserción:', err);
      } else {
        console.log('[DAO] Usuario creado con ID:', results.insertId);
      }
      callback(err, results);
    });
  },
  update: (id, data, callback) => {
    db.query('UPDATE usuario SET ? WHERE idUsuario = ?', [data, id], (err, results) => {
      callback(err, results);
    });
  },
  updateProfile: (id, data, callback) => {
    // Actualizar perfil incluyendo nombre, correo y foto de perfil
    const allowedFields = ['usuario', 'correo', 'fotoPerfil', 'nombre', 'apellido', 'fechaNacimiento'];
    const updateData = {};
    
    // Filtrar solo campos permitidos
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = data[key];
      }
    });
    
    db.query('UPDATE usuario SET ? WHERE idUsuario = ?', [updateData, id], (err, results) => {
      callback(err, results);
    });
  },
  delete: (id, callback) => {
    db.query('DELETE FROM usuario WHERE idUsuario = ?', [id], (err, results) => {
      callback(err, results);
    });
  },
};

module.exports = UsuarioDAO;

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
    db.query('INSERT INTO usuario SET ?', data, (err, results) => {
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

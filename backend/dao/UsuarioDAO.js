const db = require('../config/db');

const UsuarioDAO = {
  findById: (id, callback) => {
    db.query('SELECT * FROM usuario WHERE idUsuario = ?', [id], (err, results) => {
      callback(err, results[0]);
    });
  },
  findByUsername: (usuario, callback) => {
    db.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], (err, results) => {
      callback(err, results[0]);
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
  delete: (id, callback) => {
    db.query('DELETE FROM usuario WHERE idUsuario = ?', [id], (err, results) => {
      callback(err, results);
    });
  },
};

module.exports = UsuarioDAO;

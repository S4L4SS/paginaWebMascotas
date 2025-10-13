const db = require('../config/db');

const ProductoDAO = {
  findAll: (callback) => {
    db.query('SELECT * FROM producto', (err, results) => {
      callback(err, results);
    });
  },
  findById: (id, callback) => {
    db.query('SELECT * FROM producto WHERE idProducto = ?', [id], (err, results) => {
      callback(err, results[0]);
    });
  },
  create: (data, callback) => {
    db.query('INSERT INTO producto SET ?', data, (err, results) => {
      callback(err, results);
    });
  },
  update: (id, data, callback) => {
    db.query('UPDATE producto SET ? WHERE idProducto = ?', [data, id], (err, results) => {
      callback(err, results);
    });
  },
  delete: (id, callback) => {
    db.query('DELETE FROM producto WHERE idProducto = ?', [id], (err, results) => {
      callback(err, results);
    });
  },
};

module.exports = ProductoDAO;

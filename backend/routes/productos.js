const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Listar productos
router.get('/', (req, res) => {
  connection.query('SELECT * FROM producto', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    res.json(results);
  });
});

// Crear producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  connection.query(
    'INSERT INTO producto (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
    [nombre, descripcion, precio, stock],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear producto' });
      res.json({ id: result.insertId });
    }
  );
});

// Actualizar producto
router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  const { id } = req.params;
  connection.query(
    'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE idProducto = ?',
    [nombre, descripcion, precio, stock, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar producto' });
      res.json({ mensaje: 'Producto actualizado' });
    }
  );
});

// Eliminar producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  connection.query(
    'DELETE FROM producto WHERE idProducto = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al eliminar producto' });
      res.json({ mensaje: 'Producto eliminado' });
    }
  );
});

module.exports = router;
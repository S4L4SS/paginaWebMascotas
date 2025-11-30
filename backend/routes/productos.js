const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Usar la carpeta compartida con JSF para que ambas arquitecturas accedan a las mismas imágenes
const sharedUploadsRoot = path.join(__dirname, '../../petshop-admin-jsf/src/main/webapp/uploads');
const productosDir = path.join(sharedUploadsRoot, 'productos');

// Asegurar que el directorio de destino exista
if (!fs.existsSync(productosDir)) {
  fs.mkdirSync(productosDir, { recursive: true });
}

// Configuración de multer para guardar imágenes en la carpeta compartida
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Verifica en cada request por si el contenedor se limpió
    try {
      if (!fs.existsSync(productosDir)) {
        fs.mkdirSync(productosDir, { recursive: true });
      }
      cb(null, productosDir);
    } catch (e) {
      cb(e);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF, WEBP)'));
  }
});

// Listar productos
router.get('/', (req, res) => {
  connection.query('SELECT * FROM producto', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    res.json(results);
  });
});

// Crear producto con imagen
router.post('/', upload.single('imagen'), (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  let imagen = null;
  if (req.file) {
    imagen = 'uploads/productos/' + req.file.filename;
  }
  connection.query(
    'INSERT INTO producto (nombre, descripcion, precio, stock, imagen) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, precio, stock, imagen],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear producto' });
      res.json({ id: result.insertId });
    }
  );
});

// Actualizar producto con posible nueva imagen
router.put('/:id', upload.single('imagen'), (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  const { id } = req.params;
  let fields = [nombre, descripcion, precio, stock];
  let sql = 'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?';
  
  if (req.file) {
    sql += ', imagen = ?';
    fields.push('uploads/productos/' + req.file.filename);
  }
  
  sql += ' WHERE idProducto = ?';
  fields.push(id);
  
  connection.query(sql, fields, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar producto' });
    res.json({ mensaje: 'Producto actualizado' });
  });
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
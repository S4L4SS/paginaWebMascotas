const ProductoDAO = require('../dao/ProductoDAO');

const ProductoController = {
  getAll: (req, res) => {
    ProductoDAO.findAll((err, productos) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      res.json(productos);
    });
  },
  create: (req, res) => {
    ProductoDAO.create(req.body, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear producto' });
      res.json({ mensaje: 'Producto creado', id: result.insertId });
    });
  },
};

module.exports = ProductoController;

const express = require('express');
const router = express.Router();
// Controlador de administración
// ...implementación CRUD admin
router.get('/', (req, res) => {
  res.json({ mensaje: 'Panel de administración' });
});
module.exports = router;

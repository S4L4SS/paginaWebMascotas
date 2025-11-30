const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');

router.get('/', ProductoController.getAll);
router.post('/', ProductoController.create);
module.exports = router;

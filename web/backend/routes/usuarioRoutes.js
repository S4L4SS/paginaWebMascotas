const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/UsuarioController');

router.post('/login', UsuarioController.login);
router.post('/register', UsuarioController.register);
module.exports = router;

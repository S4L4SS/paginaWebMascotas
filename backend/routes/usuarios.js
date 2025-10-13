const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Login
router.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  connection.query(
    'SELECT * FROM usuario WHERE usuario = ? AND contrasena = ?',
    [usuario, contrasena],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error en el servidor' });
      if (results.length === 0) return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      const user = results[0];
      res.json({
        mensaje: 'Login exitoso',
        user: {
          idUsuario: user.idUsuario,
          usuario: user.usuario,
          correo: user.correo,
          rol: user.rol
        }
      });
    }
  );
});

// Register
router.post('/register', (req, res) => {
  const { usuario, correo, contrasena } = req.body;
  
  // Validar que todos los campos están presentes
  if (!usuario || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  
  // Verificar si el usuario ya existe
  connection.query('SELECT * FROM usuario WHERE usuario = ? OR correo = ?', [usuario, correo], (err, existing) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (existing.length > 0) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }
    
    // Insertar nuevo usuario con rol por defecto 'cliente'
    connection.query(
      'INSERT INTO usuario (usuario, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [usuario, correo, contrasena, 'cliente'],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
        res.json({ 
          mensaje: 'Registro exitoso', 
          user: {
            idUsuario: result.insertId,
            usuario: usuario,
            correo: correo,
            rol: 'cliente'
          }
        });
      }
    );
  });
});

// Listar usuarios
router.get('/', (req, res) => {
  connection.query('SELECT idUsuario, usuario, correo, rol FROM usuario', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

// Cambiar rol
router.put('/:id/rol', (req, res) => {
  const { rol } = req.body;
  const { id } = req.params;
  connection.query(
    'UPDATE usuario SET rol = ? WHERE idUsuario = ?',
    [rol, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar rol' });
      res.json({ mensaje: 'Rol actualizado' });
    }
  );
});

module.exports = router;
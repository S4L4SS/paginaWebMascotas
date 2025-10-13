const UsuarioDAO = require('../dao/UsuarioDAO');

const UsuarioController = {
  login: (req, res) => {
    const { usuario, contrasena } = req.body;
    UsuarioDAO.findByUsername(usuario, (err, user) => {
      if (err) return res.status(500).json({ error: 'Error en la base de datos' });
      if (!user || user.contrasena !== contrasena) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
      // Solo enviar los campos necesarios del usuario
      const userData = {
        idUsuario: user.idUsuario,
        usuario: user.usuario,
        correo: user.correo,
        rol: user.rol || 'cliente'
      };
      res.json({ mensaje: 'Login exitoso', user: userData });
    });
  },
  register: (req, res) => {
    const { usuario, correo, contrasena } = req.body;
    UsuarioDAO.create({ usuario, correo, contrasena }, (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
      res.json({ mensaje: 'Registro exitoso', id: result.insertId });
    });
  },
};

module.exports = UsuarioController;

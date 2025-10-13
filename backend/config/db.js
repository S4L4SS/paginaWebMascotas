const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Contraseña vacía para XAMPP
  database: 'mascotasdb',
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;

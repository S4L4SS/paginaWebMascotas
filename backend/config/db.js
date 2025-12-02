const mysql = require('mysql2/promise');
const mysqlCallback = require('mysql2');
require('dotenv').config();

// Configuración de la base de datos usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'mascotasdb',
  port: process.env.DB_PORT || 3306
};

// Conexión tradicional con callbacks (para productos y usuarios existentes)
const connection = mysqlCallback.createConnection(dbConfig);

// Pool para operaciones con promesas (para reportes)
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a MySQL:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Función para probar la conexión del pool
async function testPoolConnection() {
  try {
    const poolConnection = await pool.getConnection();
    console.log('Pool de conexiones MySQL configurado correctamente');
    poolConnection.release();
  } catch (error) {
    console.error('Error en pool de conexiones MySQL:', error);
  }
}

// Probar la conexión al inicializar
testPoolConnection();

// Exportar la conexión tradicional por defecto (para compatibilidad)
module.exports = connection;
// Exportar el pool para las nuevas funcionalidades
module.exports.pool = pool;
module.exports.getConnection = () => pool.getConnection();

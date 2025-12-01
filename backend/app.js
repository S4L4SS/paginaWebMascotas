require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const productosRouter = require('./routes/productos');
const usuariosRouter = require('./routes/usuarios');
const reportesRouter = require('./routes/reportesRoutes');
const comprasRouter = require('./routes/comprasRoutes');
const cloudinaryRouter = require('./routes/cloudinaryRoutes');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'],
  credentials: true
}));
app.use(bodyParser.json());

// Carpeta compartida de uploads (usada por ambos JSF y React)
const sharedUploadsPath = path.join(__dirname, '../petshop-admin-jsf/src/main/webapp/uploads');

// Servir archivos estáticos desde la carpeta compartida
app.use('/uploads', express.static(sharedUploadsPath));

// También servir desde la carpeta local del backend (para compatibilidad)
app.use('/uploads-local', express.static(path.join(__dirname, 'uploads')));

// Servir archivo de prueba
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../test-registro.html'));
});

// Conectar rutas
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/reportes', reportesRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/cloudinary', cloudinaryRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

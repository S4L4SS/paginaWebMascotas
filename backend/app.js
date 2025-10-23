const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productosRouter = require('./routes/productos');
const usuariosRouter = require('./routes/usuarios');
const reportesRouter = require('./routes/reportesRoutes');
const comprasRouter = require('./routes/comprasRoutes');

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(bodyParser.json());

// Conectar rutas
app.use('/api/productos', productosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/reportes', reportesRouter);
app.use('/api/compras', comprasRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});

const express = require('express');
const router = express.Router();
const ReportesController = require('../controllers/ReportesController');

// Ruta para obtener resumen general
router.get('/resumen', ReportesController.getResumenGeneral);

// Ruta para obtener estadísticas de ventas
router.get('/ventas', ReportesController.getEstadisticasVentas);

// Ruta para obtener productos más vendidos
router.get('/productos-top', ReportesController.getProductosMasVendidos);

// Ruta para obtener datos para gráficas
router.get('/graficas', ReportesController.getDatosGraficas);

// Ruta para generar y descargar reporte PDF
router.get('/pdf', ReportesController.generarReportePDF);

// Ruta para registrar métricas
router.post('/metrica', ReportesController.registrarMetrica);

module.exports = router;
const MetricasDAO = require('../dao/MetricasDAO');
const PDFDocument = require('pdfkit');

class ReportesController {
  // Obtener resumen general
  static async getResumenGeneral(req, res) {
    try {
      console.log('Intentando obtener resumen general...');
      const resumen = await MetricasDAO.getResumenGeneral();
      console.log('Resumen obtenido:', resumen);
      res.json(resumen);
    } catch (error) {
      console.error('Error al obtener resumen general:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Obtener estadísticas de ventas
  static async getEstadisticasVentas(req, res) {
    try {
      const { periodo = 'mes' } = req.query;
      console.log('Obteniendo estadísticas de ventas para período:', periodo);
      const ventas = await MetricasDAO.getVentasPorPeriodo(periodo);
      console.log('Ventas obtenidas:', ventas);
      res.json(ventas);
    } catch (error) {
      console.error('Error al obtener estadísticas de ventas:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Obtener productos más vendidos
  static async getProductosMasVendidos(req, res) {
    try {
      const { limite = 10 } = req.query;
      console.log('Obteniendo productos más vendidos, límite:', limite);
      const productos = await MetricasDAO.getProductosMasVendidos(parseInt(limite));
      console.log('Productos obtenidos:', productos);
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener productos más vendidos:', error);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
  }

  // Obtener datos para gráficas
  static async getDatosGraficas(req, res) {
    try {
      const { tipo = 'ventas', periodo = 'mes' } = req.query;
      const datos = await MetricasDAO.getDatosGraficas(tipo, periodo);
      res.json(datos);
    } catch (error) {
      console.error('Error al obtener datos para gráficas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Generar reporte PDF
  static async generarReportePDF(req, res) {
    try {
      const { periodo = 'mes', tipo = 'completo' } = req.query;
      
      // Obtener datos para el reporte
      const resumen = await MetricasDAO.getResumenGeneral();
      const ventas = await MetricasDAO.getVentasPorPeriodo(periodo);
      const productosTop = await MetricasDAO.getProductosMasVendidos(5);

      // Crear el documento PDF
      const doc = new PDFDocument();
      
      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-${periodo}-${Date.now()}.pdf`);
      
      // Pipe del documento al response
      doc.pipe(res);

      // Título del reporte
      doc.fontSize(20).text('Reporte de Estadísticas - Tienda de Mascotas', 50, 50);
      doc.fontSize(12).text(`Período: ${periodo.toUpperCase()}`, 50, 80);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 50, 95);
      
      // Línea separadora
      doc.moveTo(50, 110).lineTo(550, 110).stroke();

      let currentY = 130;

      // Resumen general
      doc.fontSize(16).text('Resumen General', 50, currentY);
      currentY += 30;
      
      doc.fontSize(12);
      if (periodo === 'dia') {
        doc.text(`Ventas de hoy: ${resumen.ventasHoy.cantidad} ventas - S/ ${resumen.ventasHoy.total}`, 70, currentY);
      } else if (periodo === 'semana') {
        doc.text(`Ventas esta semana: ${resumen.ventasSemana.cantidad} ventas - S/ ${resumen.ventasSemana.total}`, 70, currentY);
      } else {
        doc.text(`Ventas este mes: ${resumen.ventasMes.cantidad} ventas - S/ ${resumen.ventasMes.total}`, 70, currentY);
      }
      currentY += 20;
      
      doc.text(`Total de productos: ${resumen.totalProductos.cantidad}`, 70, currentY);
      currentY += 20;
      doc.text(`Total de clientes: ${resumen.totalUsuarios.cantidad}`, 70, currentY);
      currentY += 40;

      // Productos más vendidos
      doc.fontSize(16).text('Top 5 Productos Más Vendidos', 50, currentY);
      currentY += 30;
      
      doc.fontSize(12);
      productosTop.forEach((producto, index) => {
        doc.text(`${index + 1}. ${producto.nombre}`, 70, currentY);
        doc.text(`   Ventas: ${producto.cantidadVentas} | Total: S/ ${producto.totalVentas}`, 90, currentY + 15);
        currentY += 40;
      });

      // Si hay datos de ventas por período, crear una tabla simple
      if (ventas.length > 0) {
        currentY += 20;
        doc.fontSize(16).text('Detalle de Ventas por Período', 50, currentY);
        currentY += 30;
        
        doc.fontSize(10);
        doc.text('Fecha/Hora', 70, currentY);
        doc.text('Cantidad', 200, currentY);
        doc.text('Total', 300, currentY);
        currentY += 20;
        
        // Línea separadora
        doc.moveTo(70, currentY).lineTo(400, currentY).stroke();
        currentY += 10;
        
        ventas.slice(0, 15).forEach(venta => { // Mostrar solo los primeros 15 para no saturar
          doc.text(venta.fecha.toString(), 70, currentY);
          doc.text(venta.cantidadVentas.toString(), 200, currentY);
          doc.text(`S/ ${venta.totalVentas}`, 300, currentY);
          currentY += 15;
        });
      }

      // Finalizar el documento
      doc.end();
      
    } catch (error) {
      console.error('Error al generar reporte PDF:', error);
      res.status(500).json({ error: 'Error al generar el reporte PDF' });
    }
  }

  // Registrar una métrica (útil para rastrear acciones)
  static async registrarMetrica(req, res) {
    try {
      const { tipo, entidad, entidadId, valor, metadatos } = req.body;
      const id = await MetricasDAO.registrarMetrica(tipo, entidad, entidadId, valor, metadatos);
      res.json({ id, mensaje: 'Métrica registrada exitosamente' });
    } catch (error) {
      console.error('Error al registrar métrica:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = ReportesController;
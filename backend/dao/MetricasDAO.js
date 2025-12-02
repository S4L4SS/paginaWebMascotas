const db = require('../config/db');

class MetricasDAO {
  // Registrar una nueva métrica
  static async registrarMetrica(tipo, entidad = null, entidadId = null, valor = 0, metadatos = null) {
    const connection = await db.getConnection();
    try {
      const query = `
        INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await connection.execute(query, [
        tipo, 
        entidad, 
        entidadId, 
        valor, 
        metadatos ? JSON.stringify(metadatos) : null
      ]);
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  // Obtener estadísticas de ventas por período
  static async getVentasPorPeriodo(periodo = 'mes') {
    const connection = await db.getConnection();
    try {
      let fechaCondicion = '';
      let formatoFecha = '';
      
      switch (periodo) {
        case 'dia':
          fechaCondicion = 'DATE(fechaCreacion) >= CURDATE()';
          formatoFecha = 'DATE_FORMAT(fechaCreacion, "%H:00")';
          break;
        case 'semana':
          fechaCondicion = 'fechaCreacion >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
          formatoFecha = 'DATE_FORMAT(fechaCreacion, "%Y-%m-%d")';
          break;
        case 'mes':
        default:
          fechaCondicion = 'fechaCreacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
          formatoFecha = 'DATE_FORMAT(fechaCreacion, "%Y-%m-%d")';
          break;
      }

      const query = `
        SELECT 
          ${formatoFecha} as fecha,
          COUNT(*) as cantidadVentas,
          SUM(valor) as totalVentas
        FROM metricas 
        WHERE tipo = 'compra' AND ${fechaCondicion}
        GROUP BY ${formatoFecha}
        ORDER BY fecha
      `;
      
      const [rows] = await connection.execute(query);
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener productos más vendidos
  static async getProductosMasVendidos(limite = 10) {
    const connection = await db.getConnection();
    try {
      // Asegurar que limite sea un número entero
      const limiteNum = parseInt(limite) || 10;
      
      const query = `
        SELECT 
          p.nombre,
          p.idProducto,
          COUNT(m.idMetrica) as cantidadVentas,
          SUM(m.valor) as totalVentas
        FROM metricas m
        JOIN producto p ON m.entidadId = p.idProducto
        WHERE m.tipo = 'compra' AND m.entidad = 'producto'
        GROUP BY p.idProducto, p.nombre
        ORDER BY cantidadVentas DESC
        LIMIT ${limiteNum}
      `;
      
      const [rows] = await connection.execute(query);
      return rows;
    } finally {
      connection.release();
    }
  }

  // Obtener resumen general de estadísticas
  static async getResumenGeneral() {
    const connection = await db.getConnection();
    try {
      const queries = {
        ventasHoy: `
          SELECT COUNT(*) as cantidad, COALESCE(SUM(valor), 0) as total 
          FROM metricas 
          WHERE tipo = 'compra' AND DATE(fechaCreacion) = CURDATE()
        `,
        ventasSemana: `
          SELECT COUNT(*) as cantidad, COALESCE(SUM(valor), 0) as total 
          FROM metricas 
          WHERE tipo = 'compra' AND fechaCreacion >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `,
        ventasMes: `
          SELECT COUNT(*) as cantidad, COALESCE(SUM(valor), 0) as total 
          FROM metricas 
          WHERE tipo = 'compra' AND fechaCreacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `,
        usuariosRegistradosHoy: `
          SELECT COUNT(*) as cantidad 
          FROM metricas 
          WHERE tipo = 'registro_usuario' AND DATE(fechaCreacion) = CURDATE()
        `,
        totalProductos: `
          SELECT COUNT(*) as cantidad 
          FROM producto
        `,
        totalUsuarios: `
          SELECT COUNT(*) as cantidad 
          FROM usuario WHERE rol = 'cliente'
        `
      };

      const resultados = {};
      
      for (const [key, query] of Object.entries(queries)) {
        const [rows] = await connection.execute(query);
        resultados[key] = rows[0];
      }
      
      return resultados;
    } finally {
      connection.release();
    }
  }

  // Obtener datos para gráficas
  static async getDatosGraficas(tipo, periodo = 'mes') {
    const connection = await db.getConnection();
    try {
      let fechaCondicion = '';
      let formatoFecha = '';
      let groupBy = '';
      
      switch (periodo) {
        case 'dia':
          fechaCondicion = 'DATE(fechaCreacion) = CURDATE()';
          formatoFecha = 'HOUR(fechaCreacion)';
          groupBy = 'HOUR(fechaCreacion)';
          break;
        case 'semana':
          fechaCondicion = 'fechaCreacion >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
          formatoFecha = 'DATE(fechaCreacion)';
          groupBy = 'DATE(fechaCreacion)';
          break;
        case 'mes':
        default:
          fechaCondicion = 'fechaCreacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
          formatoFecha = 'DATE(fechaCreacion)';
          groupBy = 'DATE(fechaCreacion)';
          break;
      }

      let query = '';
      
      if (tipo === 'ventas') {
        query = `
          SELECT 
            ${formatoFecha} as etiqueta,
            COUNT(*) as valor,
            SUM(valor) as monto
          FROM metricas 
          WHERE tipo = 'compra' AND ${fechaCondicion}
          GROUP BY ${groupBy}
          ORDER BY etiqueta
        `;
      } else if (tipo === 'registros') {
        query = `
          SELECT 
            ${formatoFecha} as etiqueta,
            COUNT(*) as valor
          FROM metricas 
          WHERE tipo = 'registro_usuario' AND ${fechaCondicion}
          GROUP BY ${groupBy}
          ORDER BY etiqueta
        `;
      }
      
      const [rows] = await connection.execute(query);
      return rows;
    } finally {
      connection.release();
    }
  }
}

module.exports = MetricasDAO;
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const MetricasDAO = require('../dao/MetricasDAO');

// Procesar una compra completa
router.post('/procesar', async (req, res) => {
  const connection = await db.pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { idUsuario, items, total, metodoPago } = req.body;
    
    if (!idUsuario || !items || items.length === 0) {
      return res.status(400).json({ error: 'Datos de compra incompletos' });
    }

    // Verificar stock disponible para todos los productos
    for (const item of items) {
      const [stockResult] = await connection.execute(
        'SELECT stock FROM producto WHERE idProducto = ?',
        [item.idProducto]
      );
      
      if (stockResult.length === 0) {
        throw new Error(`Producto con ID ${item.idProducto} no encontrado`);
      }
      
      if (stockResult[0].stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${item.nombre}. Stock disponible: ${stockResult[0].stock}`);
      }
    }

    const comprasRealizadas = [];
    
    // Procesar cada item del carrito
    for (const item of items) {
      // 1. Insertar en tabla compras
      const [compraResult] = await connection.execute(
        'INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES (?, ?, ?, ?, ?, NOW())',
        [idUsuario, item.idProducto, item.cantidad, item.precio, item.precio * item.cantidad]
      );
      
      // 2. Actualizar stock del producto
      await connection.execute(
        'UPDATE producto SET stock = stock - ? WHERE idProducto = ?',
        [item.cantidad, item.idProducto]
      );
      
      // 3. Registrar métrica de compra
      await connection.execute(`
        INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) 
        VALUES (?, ?, ?, ?, ?, NOW())
      `, [
        'compra',
        'producto',
        item.idProducto,
        item.precio * item.cantidad,
        JSON.stringify({
          producto: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
          metodoPago: metodoPago
        })
      ]);
      
      comprasRealizadas.push({
        idCompra: compraResult.insertId,
        producto: item.nombre,
        cantidad: item.cantidad,
        total: item.precio * item.cantidad
      });
    }
    
    // Registrar métrica general de transacción
    await connection.execute(`
      INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [
      'transaccion',
      'usuario',
      idUsuario,
      total,
      JSON.stringify({
        cantidadProductos: items.length,
        totalItems: items.reduce((sum, item) => sum + item.cantidad, 0),
        metodoPago: metodoPago,
        compras: comprasRealizadas
      })
    ]);
    
    await connection.commit();
    
    res.json({
      success: true,
      mensaje: 'Compra procesada exitosamente',
      compras: comprasRealizadas,
      total: total
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('Error al procesar compra:', error);
    res.status(500).json({ 
      error: 'Error al procesar la compra', 
      details: error.message 
    });
  } finally {
    connection.release();
  }
});

// Obtener historial de compras de un usuario
router.get('/historial/:idUsuario', async (req, res) => {
  try {
    const { idUsuario } = req.params;
    
    const connection = await db.pool.getConnection();
    
    const [compras] = await connection.execute(`
      SELECT 
        c.idCompra,
        c.cantidad,
        c.precio,
        c.total,
        c.fechaCompra,
        p.nombre as nombreProducto,
        p.descripcion
      FROM compras c
      JOIN producto p ON c.idProducto = p.idProducto
      WHERE c.idUsuario = ?
      ORDER BY c.fechaCompra DESC
    `, [idUsuario]);
    
    connection.release();
    
    res.json(compras);
    
  } catch (error) {
    console.error('Error al obtener historial de compras:', error);
    res.status(500).json({ error: 'Error al obtener historial de compras' });
  }
});

module.exports = router;
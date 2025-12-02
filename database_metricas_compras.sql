-- Script para agregar datos de compras y métricas a la base de datos existente
USE mascotasdb;

-- =====================================================
-- INSERTAR DATOS DE COMPRAS (HISTORIAL DE VENTAS)
-- =====================================================

-- Limpiar datos existentes (opcional)
DELETE FROM compras;
DELETE FROM metricas;

-- Compras de septiembre 2024
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(2, 6, 1, 65.00, 65.00, '2024-09-27 15:30:00');

-- Compras de octubre 2024
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
-- Octubre temprano
(3, 2, 1, 45.00, 45.00, '2024-10-02 10:15:00'),
(4, 5, 1, 25.99, 25.99, '2024-10-04 14:45:00'),
(4, 8, 1, 12.50, 12.50, '2024-10-04 14:45:00'),
(2, 5, 1, 25.99, 25.99, '2024-10-07 16:20:00'),

-- Octubre medio
(5, 6, 1, 65.00, 65.00, '2024-10-16 11:30:00'),
(3, 3, 1, 8.99, 8.99, '2024-10-17 13:15:00'),
(4, 2, 1, 45.00, 45.00, '2024-10-18 09:45:00'),
(2, 8, 1, 12.50, 12.50, '2024-10-19 15:20:00'),

-- Octubre final
(5, 1, 2, 12.99, 25.98, '2024-10-21 14:30:00'),
(5, 4, 2, 15.00, 30.00, '2024-10-21 14:30:00'),
(3, 1, 1, 12.99, 12.99, '2024-10-21 16:45:00'),
(4, 7, 1, 18.50, 18.50, '2024-10-21 17:10:00'),

-- Noviembre 2024
(2, 1, 3, 12.99, 38.97, '2024-11-05 15:00:00'),
(3, 3, 1, 8.99, 8.99, '2024-11-08 17:30:00'),
(4, 4, 1, 15.00, 15.00, '2024-11-10 17:30:00'),
(5, 6, 1, 65.00, 65.00, '2024-11-15 19:15:00'),
(2, 7, 2, 18.50, 37.00, '2024-11-20 19:15:00'),
(3, 2, 1, 45.00, 45.00, '2024-11-22 10:30:00'),
(4, 9, 1, 55.00, 55.00, '2024-11-25 14:20:00'),
(5, 10, 1, 22.00, 22.00, '2024-11-28 16:45:00');

-- Diciembre 2024 (mes actual)
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(2, 1, 2, 12.99, 25.98, '2024-12-01 10:15:00'),
(3, 5, 1, 25.99, 25.99, '2024-12-01 14:30:00'),
(4, 8, 1, 12.50, 12.50, '2024-12-01 16:45:00');

-- =====================================================
-- INSERTAR DATOS DE MÉTRICAS
-- =====================================================

-- Métricas de compras - Septiembre
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 6, 65.00, '{"usuario_id": 2, "cantidad": 1}', '2024-09-27 15:30:00');

-- Métricas de compras - Octubre
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 2, 45.00, '{"usuario_id": 3, "cantidad": 1}', '2024-10-02 10:15:00'),
('compra', 'producto', 5, 25.99, '{"usuario_id": 4, "cantidad": 1}', '2024-10-04 14:45:00'),
('compra', 'producto', 8, 12.50, '{"usuario_id": 4, "cantidad": 1}', '2024-10-04 14:45:00'),
('compra', 'producto', 5, 25.99, '{"usuario_id": 2, "cantidad": 1}', '2024-10-07 16:20:00'),
('compra', 'producto', 6, 65.00, '{"usuario_id": 5, "cantidad": 1}', '2024-10-16 11:30:00'),
('compra', 'producto', 3, 8.99, '{"usuario_id": 3, "cantidad": 1}', '2024-10-17 13:15:00'),
('compra', 'producto', 2, 45.00, '{"usuario_id": 4, "cantidad": 1}', '2024-10-18 09:45:00'),
('compra', 'producto', 8, 12.50, '{"usuario_id": 2, "cantidad": 1}', '2024-10-19 15:20:00'),
('compra', 'producto', 1, 25.98, '{"usuario_id": 5, "cantidad": 2}', '2024-10-21 14:30:00'),
('compra', 'producto', 4, 30.00, '{"usuario_id": 5, "cantidad": 2}', '2024-10-21 14:30:00'),
('compra', 'producto', 1, 12.99, '{"usuario_id": 3, "cantidad": 1}', '2024-10-21 16:45:00'),
('compra', 'producto', 7, 18.50, '{"usuario_id": 4, "cantidad": 1}', '2024-10-21 17:10:00');

-- Métricas de compras - Noviembre
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 1, 38.97, '{"usuario_id": 2, "cantidad": 3}', '2024-11-05 15:00:00'),
('compra', 'producto', 3, 8.99, '{"usuario_id": 3, "cantidad": 1}', '2024-11-08 17:30:00'),
('compra', 'producto', 4, 15.00, '{"usuario_id": 4, "cantidad": 1}', '2024-11-10 17:30:00'),
('compra', 'producto', 6, 65.00, '{"usuario_id": 5, "cantidad": 1}', '2024-11-15 19:15:00'),
('compra', 'producto', 7, 37.00, '{"usuario_id": 2, "cantidad": 2}', '2024-11-20 19:15:00'),
('compra', 'producto', 2, 45.00, '{"usuario_id": 3, "cantidad": 1}', '2024-11-22 10:30:00'),
('compra', 'producto', 9, 55.00, '{"usuario_id": 4, "cantidad": 1}', '2024-11-25 14:20:00'),
('compra', 'producto', 10, 22.00, '{"usuario_id": 5, "cantidad": 1}', '2024-11-28 16:45:00');

-- Métricas de compras - Diciembre
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 1, 25.98, '{"usuario_id": 2, "cantidad": 2}', '2024-12-01 10:15:00'),
('compra', 'producto', 5, 25.99, '{"usuario_id": 3, "cantidad": 1}', '2024-12-01 14:30:00'),
('compra', 'producto', 8, 12.50, '{"usuario_id": 4, "cantidad": 1}', '2024-12-01 16:45:00');

-- Métricas de visitas a productos (últimos 30 días)
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('visita_producto', 'producto', 1, 0, '{"usuario_id": 2, "tiempo_permanencia": 45}', '2024-11-15 14:30:00'),
('visita_producto', 'producto', 1, 0, '{"usuario_id": 3, "tiempo_permanencia": 32}', '2024-11-18 14:45:00'),
('visita_producto', 'producto', 2, 0, '{"usuario_id": 4, "tiempo_permanencia": 67}', '2024-11-20 15:15:00'),
('visita_producto', 'producto', 3, 0, '{"usuario_id": 3, "tiempo_permanencia": 28}', '2024-11-22 16:20:00'),
('visita_producto', 'producto', 4, 0, '{"usuario_id": 5, "tiempo_permanencia": 51}', '2024-11-25 17:10:00'),
('visita_producto', 'producto', 6, 0, '{"usuario_id": 2, "tiempo_permanencia": 89}', '2024-11-28 18:30:00'),
('visita_producto', 'producto', 1, 0, '{"usuario_id": 4, "tiempo_permanencia": 38}', '2024-12-01 10:00:00'),
('visita_producto', 'producto', 5, 0, '{"usuario_id": 3, "tiempo_permanencia": 55}', '2024-12-01 14:15:00');

-- =====================================================
-- VERIFICACIONES
-- =====================================================

-- Verificar conteo de registros
SELECT 'Compras registradas:' as info, COUNT(*) as total FROM compras;
SELECT 'Métricas registradas:' as info, COUNT(*) as total FROM metricas;

-- Verificar ventas por mes
SELECT 
    DATE_FORMAT(fechaCompra, '%Y-%m') as mes,
    COUNT(*) as num_compras,
    SUM(total) as total_ventas
FROM compras
GROUP BY DATE_FORMAT(fechaCompra, '%Y-%m')
ORDER BY mes DESC;

COMMIT;

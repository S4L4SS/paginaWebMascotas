-- Actualización de base de datos para sistema de compras
-- Añade la tabla compras si no existe

USE `tienda_mascotas`;

-- Verificar y crear tabla compras
CREATE TABLE IF NOT EXISTS `compras` (
  `idCompra` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `idProducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `fechaCompra` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCompra`),
  KEY `fk_compras_usuario` (`idUsuario`),
  KEY `fk_compras_producto` (`idProducto`),
  CONSTRAINT `fk_compras_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  CONSTRAINT `fk_compras_producto` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Verificar que las tablas requeridas tienen las columnas necesarias
-- Agregar campo stock si no existe en tabla producto
CALL SafeAddColumn('producto', 'stock', 'int DEFAULT 100');

-- Insertar datos de ejemplo en compras (si la tabla está vacía)
INSERT IGNORE INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(1, 1, 2, 29.90, 59.80, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(1, 3, 1, 79.90, 79.90, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(2, 2, 3, 45.00, 135.00, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(2, 4, 1, 120.00, 120.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 5, 2, 89.90, 179.80, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 1, 1, 29.90, 29.90, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Actualizar métricas para reflejar las compras de ejemplo
INSERT IGNORE INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 1, 59.80, '{"producto": "Alimento Premium", "cantidad": 2, "precio": 29.90}', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('compra', 'producto', 3, 79.90, '{"producto": "Juguete Interactivo", "cantidad": 1, "precio": 79.90}', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('compra', 'producto', 2, 135.00, '{"producto": "Cama Confort", "cantidad": 3, "precio": 45.00}', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('compra', 'producto', 4, 120.00, '{"producto": "Kit Aseo", "cantidad": 1, "precio": 120.00}', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('compra', 'producto', 5, 179.80, '{"producto": "Collar Inteligente", "cantidad": 2, "precio": 89.90}', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('compra', 'producto', 1, 29.90, '{"producto": "Alimento Premium", "cantidad": 1, "precio": 29.90}', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Métricas de transacciones generales
INSERT IGNORE INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('transaccion', 'usuario', 1, 139.70, '{"cantidadProductos": 2, "totalItems": 3}', DATE_SUB(NOW(), INTERVAL 12 DAY)),
('transaccion', 'usuario', 2, 255.00, '{"cantidadProductos": 2, "totalItems": 4}', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('transaccion', 'usuario', 3, 209.70, '{"cantidadProductos": 2, "totalItems": 3}', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Verificar instalación
SELECT 'Tabla compras creada correctamente' as resultado;
SELECT COUNT(*) as registros_compras FROM compras;
SELECT COUNT(*) as metricas_compras FROM metricas WHERE tipo = 'compra';
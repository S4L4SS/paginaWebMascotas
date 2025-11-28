-- Script para ejecutar la actualización de compras
-- Este archivo configura la tabla compras y datos de ejemplo

USE `tienda_mascotas`;

-- Crear tabla compras si no existe
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

-- Insertar datos de ejemplo en compras (solo si no existen)
INSERT IGNORE INTO compras (idCompra, idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(1, 1, 1, 2, 29.90, 59.80, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 1, 3, 1, 79.90, 79.90, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(3, 2, 2, 3, 45.00, 135.00, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(4, 2, 4, 1, 120.00, 120.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(5, 3, 5, 2, 89.90, 179.80, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(6, 3, 1, 1, 29.90, 29.90, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Verificar creación
SELECT 'Tabla compras configurada correctamente' as resultado;
SELECT COUNT(*) as total_compras FROM compras;
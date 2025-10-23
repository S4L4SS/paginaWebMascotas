-- Script para insertar datos de prueba en la base de datos
-- Ejecutar después de database_complete.sql o database_updates.sql

USE mascotasdb;

-- Insertar más productos de ejemplo
INSERT IGNORE INTO producto (idProducto, nombre, descripcion, precio, stock, categoria) VALUES
(3, 'Juguete Pelota para Perros', 'Pelota resistente de goma para perros grandes', 8.99, 30, 'Juguetes'),
(4, 'Collar Ajustable para Gatos', 'Collar suave y ajustable con cascabel', 12.50, 25, 'Accesorios'),
(5, 'Shampoo para Mascotas', 'Shampoo hipoalergénico para todo tipo de mascotas', 18.75, 40, 'Higiene'),
(6, 'Casa para Gatos', 'Casa cómoda y resistente para gatos de interior', 45.00, 15, 'Refugio'),
(7, 'Snacks para Perros', 'Snacks naturales sabor pollo para entrenamiento', 6.25, 60, 'Alimento');

-- Insertar datos de compras distribuidas en el tiempo
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
-- Compras de hoy
(2, 1, 1, 25.99, 25.99, NOW()),
(2, 3, 2, 8.99, 17.98, NOW()),
(2, 4, 1, 12.50, 12.50, DATE_SUB(NOW(), INTERVAL 2 HOUR)),

-- Compras de ayer
(2, 5, 1, 18.75, 18.75, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 1, 2, 25.99, 51.98, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 7, 3, 6.25, 18.75, DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Compras de esta semana
(2, 4, 1, 12.50, 12.50, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 6, 1, 45.00, 45.00, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 3, 1, 8.99, 8.99, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 7, 4, 6.25, 25.00, DATE_SUB(NOW(), INTERVAL 6 DAY)),

-- Compras del mes pasado
(2, 1, 1, 25.99, 25.99, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 5, 2, 18.75, 37.50, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(2, 6, 1, 45.00, 45.00, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(2, 4, 2, 12.50, 25.00, DATE_SUB(NOW(), INTERVAL 25 DAY));

-- Insertar métricas correspondientes a las compras
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
-- Métricas de hoy
('compra', 'producto', 1, 25.99, '{"producto": "Alimento Premium para Perros", "cantidad": 1, "usuario": "cliente1"}', NOW()),
('compra', 'producto', 3, 17.98, '{"producto": "Juguete Pelota para Perros", "cantidad": 2, "usuario": "cliente1"}', NOW()),
('compra', 'producto', 4, 12.50, '{"producto": "Collar Ajustable para Gatos", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 2 HOUR)),

-- Métricas de ayer
('compra', 'producto', 5, 18.75, '{"producto": "Shampoo para Mascotas", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('compra', 'producto', 1, 51.98, '{"producto": "Alimento Premium para Perros", "cantidad": 2, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('compra', 'producto', 7, 18.75, '{"producto": "Snacks para Perros", "cantidad": 3, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Métricas de esta semana
('compra', 'producto', 4, 12.50, '{"producto": "Collar Ajustable para Gatos", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('compra', 'producto', 6, 45.00, '{"producto": "Casa para Gatos", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('compra', 'producto', 3, 8.99, '{"producto": "Juguete Pelota para Perros", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('compra', 'producto', 7, 25.00, '{"producto": "Snacks para Perros", "cantidad": 4, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 6 DAY)),

-- Métricas del mes
('compra', 'producto', 1, 25.99, '{"producto": "Alimento Premium para Perros", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('compra', 'producto', 5, 37.50, '{"producto": "Shampoo para Mascotas", "cantidad": 2, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 18 DAY)),
('compra', 'producto', 6, 45.00, '{"producto": "Casa para Gatos", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('compra', 'producto', 4, 25.00, '{"producto": "Collar Ajustable para Gatos", "cantidad": 2, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 25 DAY));

-- Insertar métricas de registro de usuarios
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('registro_usuario', 'usuario', 2, 0, '{"nombre": "Juan Pérez", "email": "cliente@ejemplo.com"}', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('registro_usuario', 'usuario', 1, 0, '{"nombre": "Admin", "email": "admin@mascotas.com"}', DATE_SUB(NOW(), INTERVAL 30 DAY));

-- Verificar que los datos se insertaron correctamente
SELECT 'Métricas insertadas:' as Resultado, COUNT(*) as Cantidad FROM metricas
UNION ALL
SELECT 'Compras insertadas:', COUNT(*) FROM compras
UNION ALL
SELECT 'Productos disponibles:', COUNT(*) FROM producto
UNION ALL
SELECT 'Usuarios registrados:', COUNT(*) FROM usuario;
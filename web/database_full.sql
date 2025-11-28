-- Script completo para crear la base de datos de la tienda de mascotas
-- Incluye todas las tablas: usuarios, productos, métricas y compras
-- Con datos hipotéticos para testing completo

CREATE DATABASE IF NOT EXISTS mascotasdb;
USE mascotasdb;

-- Eliminar tablas existentes si existen (para empezar limpio)
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS metricas;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS usuario;

-- =====================================================
-- CREAR TABLAS
-- =====================================================

-- Crear tabla usuario con todas las columnas necesarias
CREATE TABLE usuario (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  nombre VARCHAR(50) DEFAULT NULL,
  apellido VARCHAR(50) DEFAULT NULL,
  fechaNacimiento DATE DEFAULT NULL,
  rol VARCHAR(20) DEFAULT 'cliente',
  fotoPerfil VARCHAR(255) DEFAULT 'default-avatar.svg',
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla producto con columna categoria incluida
CREATE TABLE producto (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(50) DEFAULT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de métricas para rastrear acciones del sistema
CREATE TABLE metricas (
  idMetrica INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL, -- 'compra', 'registro_usuario', 'visita_producto', etc.
  entidad VARCHAR(50) DEFAULT NULL, -- 'producto', 'usuario', etc.
  entidadId INT DEFAULT NULL, -- ID del producto/usuario relacionado
  valor DECIMAL(10,2) DEFAULT 0, -- Monto de la compra, cantidad, etc.
  metadatos JSON DEFAULT NULL, -- Información adicional en formato JSON
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tipo_fecha (tipo, fechaCreacion),
  INDEX idx_entidad_fecha (entidad, entidadId, fechaCreacion)
);

-- Crear tabla de compras para rastrear las transacciones
CREATE TABLE compras (
  idCompra INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  fechaCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES producto(idProducto) ON DELETE CASCADE,
  INDEX idx_fecha_compra (fechaCompra),
  INDEX idx_producto_fecha (idProducto, fechaCompra)
);

-- =====================================================
-- INSERTAR DATOS DE USUARIOS
-- =====================================================

-- Usuario administrador
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, rol, fotoPerfil, fechaCreacion)
VALUES ('admin1', 'admin@mascotas.com', 'admin1', 'Administrador', 'Sistema', 'admin', 'default-avatar.png', '2024-01-01 10:00:00');

-- Usuarios clientes con datos completos
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, fechaNacimiento, rol, fotoPerfil, fechaCreacion) VALUES
('cliente1', 'juan.perez@email.com', 'cliente123', 'Juan', 'Pérez', '1990-03-15', 'cliente', 'default-avatar.svg', '2024-01-15 14:30:00'),
('maria_garcia', 'maria.garcia@email.com', 'maria2024', 'María', 'García', '1985-07-22', 'cliente', 'default-avatar.svg', '2024-02-01 09:15:00'),
('carlos_rodriguez', 'carlos.rod@email.com', 'carlos456', 'Carlos', 'Rodríguez', '1992-11-08', 'cliente', 'default-avatar.svg', '2024-02-10 16:45:00'),
('ana_lopez', 'ana.lopez@email.com', 'ana789', 'Ana', 'López', '1988-05-03', 'cliente', 'default-avatar.svg', '2024-02-20 11:20:00'),
('pedro_martinez', 'pedro.mart@email.com', 'pedro2024', 'Pedro', 'Martínez', '1995-09-12', 'cliente', 'default-avatar.svg', '2024-03-05 13:10:00');

-- =====================================================
-- INSERTAR DATOS DE PRODUCTOS
-- =====================================================

INSERT INTO producto (nombre, descripcion, precio, stock, categoria, imagen, fechaCreacion) VALUES
('Churu', 'Snacks cremosos para gatos, sabor pollo. Irresistibles para tu felino.', 12.99, 50, 'Alimento', 'churu.jpg', '2024-01-10 08:00:00'),
('Alimento Premium Perros', 'Alimento balanceado de alta calidad para perros adultos, rico en proteínas.', 45.00, 30, 'Alimento', 'alimento-perros.jpg', '2024-01-10 08:15:00'),
('Pescado Enlatado', 'Comida húmeda para gatos, sabor salmón y atún, rico en omega 3.', 8.99, 75, 'Alimento', 'pescado-enlatado.jpg', '2024-01-10 08:30:00'),
('Collar Ajustable para Gatos', 'Collar cómodo y ajustable con cascabel, disponible en varios colores.', 15.00, 40, 'Accesorios', 'collar-gatos.jpg', '2024-01-12 10:00:00'),
('Collar antipulgas', 'Collar repelente de pulgas y garrapatas, protección por 8 meses.', 25.99, 25, 'Accesorios', 'collar-antipulgas.jpg', '2024-01-12 10:15:00'),
('Casa para Gatos', 'Casa acogedora para gatos, perfecta para descansar y jugar.', 65.00, 15, 'Accesorios', 'casa-gatos.jpg', '2024-01-12 10:30:00'),
('Snacks para Perros', 'Galletas naturales para perros, sabor carne y vegetales.', 18.50, 60, 'Alimento', 'snacks-perros.jpg', '2024-01-12 10:45:00'),
('Juguete Ratón', 'Ratón de juguete con hierba gatera, estimula el instinto de caza.', 12.50, 35, 'Juguetes', 'raton-juguete.jpg', '2024-01-15 11:00:00'),
('Cama para Perros', 'Cama ortopédica para perros medianos y grandes, muy cómoda.', 55.00, 20, 'Accesorios', 'cama-perros.jpg', '2024-01-15 11:15:00'),
('Champú para Mascotas', 'Champú suave para perros y gatos, con aroma a lavanda.', 22.00, 30, 'Higiene', 'champu-mascotas.jpg', '2024-01-15 11:30:00');

-- =====================================================
-- INSERTAR DATOS DE COMPRAS (HISTORIAL DE VENTAS)
-- =====================================================

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

-- Octubre final (múltiples compras)
(5, 1, 2, 12.99, 25.98, '2024-10-21 14:30:00'),
(5, 4, 2, 15.00, 30.00, '2024-10-21 14:30:00'),
(3, 1, 1, 12.99, 12.99, '2024-10-21 16:45:00'),
(4, 7, 1, 18.50, 18.50, '2024-10-21 17:10:00'),

-- Compras de hoy (22 octubre 2024) - datos recientes
(2, 1, 3, 12.99, 38.97, '2024-10-22 15:00:00'),
(3, 3, 1, 8.99, 8.99, '2024-10-22 17:30:00'),
(4, 4, 1, 15.00, 15.00, '2024-10-22 17:30:00'),
(5, 6, 1, 65.00, 65.00, '2024-10-22 19:15:00'),
(2, 7, 2, 18.50, 37.00, '2024-10-22 19:15:00');

-- =====================================================
-- INSERTAR DATOS DE MÉTRICAS
-- =====================================================

-- Métricas de registro de usuarios
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('registro_usuario', 'usuario', 1, 0, '{"rol": "admin", "metodo": "manual"}', '2024-01-01 10:00:00'),
('registro_usuario', 'usuario', 2, 0, '{"rol": "cliente", "metodo": "web"}', '2024-01-15 14:30:00'),
('registro_usuario', 'usuario', 3, 0, '{"rol": "cliente", "metodo": "web"}', '2024-02-01 09:15:00'),
('registro_usuario', 'usuario', 4, 0, '{"rol": "cliente", "metodo": "web"}', '2024-02-10 16:45:00'),
('registro_usuario', 'usuario', 5, 0, '{"rol": "cliente", "metodo": "web"}', '2024-02-20 11:20:00'),
('registro_usuario', 'usuario', 6, 0, '{"rol": "cliente", "metodo": "web"}', '2024-03-05 13:10:00');

-- Métricas de compras (sincronizadas con la tabla compras)
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
-- Septiembre
('compra', 'producto', 6, 65.00, '{"usuario_id": 2, "cantidad": 1}', '2024-09-27 15:30:00'),

-- Octubre
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
('compra', 'producto', 7, 18.50, '{"usuario_id": 4, "cantidad": 1}', '2024-10-21 17:10:00'),
('compra', 'producto', 1, 38.97, '{"usuario_id": 2, "cantidad": 3}', '2024-10-22 15:00:00'),
('compra', 'producto', 3, 8.99, '{"usuario_id": 3, "cantidad": 1}', '2024-10-22 17:30:00'),
('compra', 'producto', 4, 15.00, '{"usuario_id": 4, "cantidad": 1}', '2024-10-22 17:30:00'),
('compra', 'producto', 6, 65.00, '{"usuario_id": 5, "cantidad": 1}', '2024-10-22 19:15:00'),
('compra', 'producto', 7, 37.00, '{"usuario_id": 2, "cantidad": 2}', '2024-10-22 19:15:00');

-- Métricas de visitas a productos (simuladas)
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('visita_producto', 'producto', 1, 0, '{"usuario_id": 2, "tiempo_permanencia": 45}', '2024-10-22 14:30:00'),
('visita_producto', 'producto', 1, 0, '{"usuario_id": 3, "tiempo_permanencia": 32}', '2024-10-22 14:45:00'),
('visita_producto', 'producto', 2, 0, '{"usuario_id": 4, "tiempo_permanencia": 67}', '2024-10-22 15:15:00'),
('visita_producto', 'producto', 3, 0, '{"usuario_id": 3, "tiempo_permanencia": 28}', '2024-10-22 16:20:00'),
('visita_producto', 'producto', 4, 0, '{"usuario_id": 5, "tiempo_permanencia": 51}', '2024-10-22 17:10:00'),
('visita_producto', 'producto', 6, 0, '{"usuario_id": 2, "tiempo_permanencia": 89}', '2024-10-22 18:30:00');

-- =====================================================
-- VERIFICACIONES Y CONSULTAS DE PRUEBA
-- =====================================================

-- Verificar la creación de tablas
SHOW TABLES;

-- Contar registros en cada tabla
SELECT 'usuarios' as tabla, COUNT(*) as total FROM usuario
UNION ALL
SELECT 'productos', COUNT(*) FROM producto  
UNION ALL
SELECT 'compras', COUNT(*) FROM compras
UNION ALL
SELECT 'metricas', COUNT(*) FROM metricas;

-- Mostrar estructura de las tablas principales
-- DESCRIBE usuario;
-- DESCRIBE producto;
-- DESCRIBE metricas;
-- DESCRIBE compras;

-- Consultas de prueba para verificar datos
-- SELECT 'Usuarios registrados:' as info;
-- SELECT usuario, nombre, apellido, rol, fechaCreacion FROM usuario ORDER BY fechaCreacion;

-- SELECT 'Productos disponibles:' as info;
-- SELECT nombre, precio, stock, categoria FROM producto WHERE stock > 0 ORDER BY categoria, nombre;

-- SELECT 'Últimas compras:' as info;
-- SELECT c.fechaCompra, u.nombre, u.apellido, p.nombre as producto, c.cantidad, c.total 
-- FROM compras c 
-- JOIN usuario u ON c.idUsuario = u.idUsuario 
-- JOIN producto p ON c.idProducto = p.idProducto 
-- ORDER BY c.fechaCompra DESC LIMIT 10;

-- SELECT 'Métricas de ventas del mes:' as info;
-- SELECT DATE(fechaCreacion) as fecha, COUNT(*) as ventas, SUM(valor) as total_vendido
-- FROM metricas 
-- WHERE tipo = 'compra' 
-- AND fechaCreacion >= '2024-10-01'
-- GROUP BY DATE(fechaCreacion)
-- ORDER BY fecha DESC;

COMMIT;
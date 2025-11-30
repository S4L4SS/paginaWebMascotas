-- =========================================================================
-- SCRIPT COMPLETO PARA BASE DE DATOS MASCOTASDB
-- Sistema de tienda de mascotas - Versión Unificada
-- Incluye: Estructura de tablas + Datos de muestra + Usuarios de prueba
-- =========================================================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mascotasdb;
USE mascotasdb;

-- =========================================================================
-- ELIMINAR TABLAS EXISTENTES (en orden correcto por dependencias)
-- =========================================================================
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS metricas;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS usuario;

-- =========================================================================
-- CREAR TABLA: usuario
-- =========================================================================
CREATE TABLE usuario (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  nombre VARCHAR(50) DEFAULT NULL,
  apellido VARCHAR(50) DEFAULT NULL,
  fechaNacimiento DATE DEFAULT NULL,
  rol VARCHAR(20) DEFAULT 'cliente',
  fotoPerfil VARCHAR(255) DEFAULT 'default-avatar.svg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- CREAR TABLA: producto
-- =========================================================================
CREATE TABLE producto (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  categoria VARCHAR(50) DEFAULT NULL,
  imagen VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- CREAR TABLA: metricas
-- Tabla para rastrear acciones del sistema y reportes
-- =========================================================================
CREATE TABLE metricas (
  idMetrica INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  entidad VARCHAR(50) DEFAULT NULL,
  entidadId INT DEFAULT NULL,
  valor DECIMAL(10,2) DEFAULT 0,
  metadatos JSON DEFAULT NULL,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tipo_fecha (tipo, fechaCreacion),
  INDEX idx_entidad_fecha (entidad, entidadId, fechaCreacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- CREAR TABLA: compras
-- Tabla para rastrear transacciones de compra
-- =========================================================================
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
  INDEX idx_usuario (idUsuario),
  INDEX idx_producto_fecha (idProducto, fechaCompra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- INSERTAR DATOS: Usuarios de prueba
-- =========================================================================

-- Usuarios Administradores
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, fechaNacimiento, rol, fotoPerfil) VALUES
('admin1', 'admin@mascotas.com', 'admin123', 'Administrador', 'Sistema', '1990-01-01', 'admin', '/api/usuarios/profile-pictures/user_1761170810308.png'),
('admin2', 'admin2@mascotas.com', 'admin123', 'Admin', 'Intal', NULL, 'admin', 'default-avatar.png'),
('sofia', 'sofia@verdura.com', 'pastelote777', 'Mariana', 'Sofia', '2004-04-26', 'admin', '/api/usuarios/profile-pictures/user_1760658771843.png');

-- Usuarios Clientes
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, fechaNacimiento, rol, fotoPerfil) VALUES
('cliente1', 'cliente@ejemplo.com', 'cliente123', 'Juan', 'Pérez', '1990-01-15', 'cliente', 'default-avatar.png'),
('miguel', 'miguelo108@hotmail.com', 'miguel123', NULL, NULL, '0000-00-00', 'cliente', '/api/usuarios/profile-pictures/user_1761178725597.png'),
('juan', 'juan@ymal.com', 'juan123', NULL, NULL, NULL, 'cliente', 'default-avatar.png'),
('rodrigo', 'rodrigo@hotmail.com', 'rodrigo123', NULL, NULL, NULL, 'cliente', 'default-avatar.png');

-- =========================================================================
-- INSERTAR DATOS: Productos de muestra
-- =========================================================================
INSERT INTO producto (nombre, descripcion, precio, stock, categoria, imagen) VALUES
-- Alimentos
('Alimento Premium para Perros', 'Alimento balanceado de alta calidad para perros adultos, con proteínas y vitaminas', 25.99, 50, 'Alimento', NULL),
('Alimento para Gatos Adultos', 'Comida completa y balanceada para gatos adultos', 22.50, 45, 'Alimento', NULL),
('Snacks para Perros', 'Snacks naturales sabor pollo para entrenamiento', 6.25, 60, 'Alimento', NULL),

-- Juguetes
('Juguete para Gatos', 'Ratón de juguete con hierba gatera', 15.50, 35, 'Juguetes', NULL),
('Juguete Pelota para Perros', 'Pelota resistente de goma para perros grandes', 8.99, 30, 'Juguetes', NULL),
('Juguete Interactivo', 'Dispensador de comida para mantener activa a tu mascota', 28.75, 20, 'Juguetes', NULL),

-- Accesorios
('Collar Ajustable para Gatos', 'Collar suave y ajustable con cascabel', 12.50, 25, 'Accesorios', NULL),
('Correa Retráctil para Perros', 'Correa extensible hasta 5 metros', 19.99, 30, 'Accesorios', NULL),
('Plato Doble Antideslizante', 'Comedero doble de acero inoxidable', 16.50, 40, 'Accesorios', NULL),

-- Higiene
('Shampoo para Mascotas', 'Shampoo hipoalergénico para todo tipo de mascotas', 18.75, 40, 'Higiene', NULL),
('Cepillo Dental para Perros', 'Kit de limpieza dental con pasta y cepillo', 14.25, 35, 'Higiene', NULL),
('Toallas Húmedas para Mascotas', 'Paquete de 100 toallas húmedas con aloe vera', 9.99, 50, 'Higiene', NULL),

-- Refugio
('Casa para Gatos', 'Casa cómoda y resistente para gatos de interior', 45.00, 15, 'Refugio', NULL),
('Cama Ortopédica para Perros', 'Cama con espuma de memoria para perros grandes', 65.00, 12, 'Refugio', NULL),
('Transportadora Mediana', 'Transportadora resistente con ventilación', 38.50, 18, 'Refugio', NULL);

-- =========================================================================
-- INSERTAR DATOS: Compras de muestra (distribuidas en el tiempo)
-- =========================================================================

-- Compras de HOY
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(4, 1, 1, 25.99, 25.99, NOW()),
(4, 5, 2, 8.99, 17.98, NOW()),
(4, 7, 1, 12.50, 12.50, DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- Compras de AYER
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(4, 10, 1, 18.75, 18.75, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 1, 2, 25.99, 51.98, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 3, 3, 6.25, 18.75, DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Compras de ESTA SEMANA
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(4, 7, 1, 12.50, 12.50, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 13, 1, 45.00, 45.00, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(5, 5, 1, 8.99, 8.99, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(4, 3, 4, 6.25, 25.00, DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Compras del MES PASADO
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(4, 1, 1, 25.99, 25.99, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(5, 10, 2, 18.75, 37.50, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(5, 13, 1, 45.00, 45.00, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(4, 7, 2, 12.50, 25.00, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(6, 2, 1, 22.50, 22.50, DATE_SUB(NOW(), INTERVAL 28 DAY));

-- Compras de hace 2 MESES
INSERT INTO compras (idUsuario, idProducto, cantidad, precio, total, fechaCompra) VALUES
(4, 6, 1, 28.75, 28.75, DATE_SUB(NOW(), INTERVAL 45 DAY)),
(5, 14, 1, 65.00, 65.00, DATE_SUB(NOW(), INTERVAL 50 DAY)),
(6, 8, 1, 19.99, 19.99, DATE_SUB(NOW(), INTERVAL 55 DAY));

-- =========================================================================
-- INSERTAR DATOS: Métricas correspondientes a las compras
-- =========================================================================

-- Métricas de compras de HOY
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 1, 25.99, '{"producto": "Alimento Premium para Perros", "cantidad": 1, "usuario": "cliente1"}', NOW()),
('compra', 'producto', 5, 17.98, '{"producto": "Juguete Pelota para Perros", "cantidad": 2, "usuario": "cliente1"}', NOW()),
('compra', 'producto', 7, 12.50, '{"producto": "Collar Ajustable para Gatos", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- Métricas de compras de AYER
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 10, 18.75, '{"producto": "Shampoo para Mascotas", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('compra', 'producto', 1, 51.98, '{"producto": "Alimento Premium para Perros", "cantidad": 2, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('compra', 'producto', 3, 18.75, '{"producto": "Snacks para Perros", "cantidad": 3, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Métricas de compras de ESTA SEMANA
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 7, 12.50, '{"producto": "Collar Ajustable para Gatos", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('compra', 'producto', 13, 45.00, '{"producto": "Casa para Gatos", "cantidad": 1, "usuario": "miguel"}', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('compra', 'producto', 5, 8.99, '{"producto": "Juguete Pelota para Perros", "cantidad": 1, "usuario": "miguel"}', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('compra', 'producto', 3, 25.00, '{"producto": "Snacks para Perros", "cantidad": 4, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 6 DAY));

-- Métricas de compras del MES
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('compra', 'producto', 1, 25.99, '{"producto": "Alimento Premium para Perros", "cantidad": 1, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 15 DAY)),
('compra', 'producto', 10, 37.50, '{"producto": "Shampoo para Mascotas", "cantidad": 2, "usuario": "miguel"}', DATE_SUB(NOW(), INTERVAL 18 DAY)),
('compra', 'producto', 13, 45.00, '{"producto": "Casa para Gatos", "cantidad": 1, "usuario": "miguel"}', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('compra', 'producto', 7, 25.00, '{"producto": "Collar Ajustable para Gatos", "cantidad": 2, "usuario": "cliente1"}', DATE_SUB(NOW(), INTERVAL 25 DAY));

-- Métricas de registro de usuarios
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('registro_usuario', 'usuario', 4, 0, '{"nombre": "Juan Pérez", "email": "cliente@ejemplo.com", "rol": "cliente"}', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('registro_usuario', 'usuario', 5, 0, '{"nombre": "Miguel", "email": "miguelo108@hotmail.com", "rol": "cliente"}', DATE_SUB(NOW(), INTERVAL 8 DAY)),
('registro_usuario', 'usuario', 1, 0, '{"nombre": "Administrador Sistema", "email": "admin@mascotas.com", "rol": "admin"}', DATE_SUB(NOW(), INTERVAL 30 DAY));

-- Métricas de visitas a productos
INSERT INTO metricas (tipo, entidad, entidadId, valor, metadatos, fechaCreacion) VALUES
('visita_producto', 'producto', 1, 0, '{"producto": "Alimento Premium para Perros"}', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('visita_producto', 'producto', 5, 0, '{"producto": "Juguete Pelota para Perros"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('visita_producto', 'producto', 13, 0, '{"producto": "Casa para Gatos"}', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- =========================================================================
-- VERIFICACIÓN DE INSTALACIÓN
-- =========================================================================
SELECT '✅ Base de datos creada exitosamente' as Estado;
SELECT 'mascotasdb' as BaseDatos;
SELECT '' as '';
SELECT '📊 RESUMEN DE DATOS INSERTADOS' as Resumen;
SELECT '================================' as '';

SELECT CONCAT('👥 Usuarios: ', COUNT(*)) as Resultado FROM usuario
UNION ALL
SELECT CONCAT('   - Administradores: ', COUNT(*)) FROM usuario WHERE rol = 'admin'
UNION ALL
SELECT CONCAT('   - Clientes: ', COUNT(*)) FROM usuario WHERE rol = 'cliente'
UNION ALL
SELECT ''
UNION ALL
SELECT CONCAT('📦 Productos: ', COUNT(*)) FROM producto
UNION ALL
SELECT CONCAT('   - En stock: ', COUNT(*)) FROM producto WHERE stock > 0
UNION ALL
SELECT CONCAT('   - Stock total: ', SUM(stock)) FROM producto
UNION ALL
SELECT ''
UNION ALL
SELECT CONCAT('🛒 Compras registradas: ', COUNT(*)) FROM compras
UNION ALL
SELECT CONCAT('   - Total vendido: $', FORMAT(SUM(total), 2)) FROM compras
UNION ALL
SELECT ''
UNION ALL
SELECT CONCAT('📈 Métricas registradas: ', COUNT(*)) FROM metricas
UNION ALL
SELECT CONCAT('   - Métricas de compras: ', COUNT(*)) FROM metricas WHERE tipo = 'compra'
UNION ALL
SELECT CONCAT('   - Registros de usuarios: ', COUNT(*)) FROM metricas WHERE tipo = 'registro_usuario';

-- =========================================================================
-- CREDENCIALES DE ACCESO
-- =========================================================================
SELECT '' as '';
SELECT '🔐 CREDENCIALES DE ACCESO AL SISTEMA' as Info;
SELECT '=====================================' as '';
SELECT 'ADMINISTRADORES:' as Tipo, '' as Usuario, '' as Contraseña
UNION ALL
SELECT '- Admin 1', 'admin1', 'admin123'
UNION ALL
SELECT '- Admin 2', 'admin2', 'admin123'
UNION ALL
SELECT '- Sofia', 'sofia', 'pastelote777'
UNION ALL
SELECT '', '', ''
UNION ALL
SELECT 'CLIENTES:', '', ''
UNION ALL
SELECT '- Cliente 1', 'cliente1', 'cliente123'
UNION ALL
SELECT '- Miguel', 'miguel', 'miguel123'
UNION ALL
SELECT '- Juan', 'juan', 'juan123'
UNION ALL
SELECT '- Rodrigo', 'rodrigo', 'rodrigo123';

SELECT '' as '';
SELECT '✅ ¡Instalación completada!' as '';
SELECT '🚀 La base de datos está lista para usar' as '';

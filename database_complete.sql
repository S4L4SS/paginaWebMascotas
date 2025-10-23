-- Script completo para crear la base de datos de la tienda de mascotas
-- Incluye todas las tablas: usuarios, productos, métricas y compras

CREATE DATABASE IF NOT EXISTS mascotasdb;
USE mascotasdb;

-- Eliminar tablas existentes si existen (para empezar limpio)
DROP TABLE IF EXISTS compras;
DROP TABLE IF EXISTS metricas;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS usuario;

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
  fotoPerfil VARCHAR(255) DEFAULT 'default-avatar.png',
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

-- Insertar usuario administrador por defecto
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, rol, fotoPerfil)
VALUES ('admin1', 'admin@mascotas.com', 'admin123', 'Administrador', 'Sistema', 'admin', 'default-avatar.png');

-- Insertar usuario cliente de ejemplo
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, fechaNacimiento, rol)
VALUES ('cliente1', 'cliente@ejemplo.com', 'cliente123', 'Juan', 'Pérez', '1990-01-15', 'cliente');

-- Insertar algunos productos de ejemplo
INSERT INTO producto (nombre, descripcion, precio, stock, categoria) VALUES
('Alimento Premium para Perros', 'Alimento balanceado de alta calidad para perros adultos', 25.99, 50, 'Alimento'),
('Juguete para Gatos', 'Ratón de juguete con hierba gatera', 15.50, 35, 'Juguetes');

-- Verificar la creación de tablas
SHOW TABLES;

-- Mostrar estructura de las tablas principales
DESCRIBE usuario;
DESCRIBE producto;
DESCRIBE metricas;
DESCRIBE compras;
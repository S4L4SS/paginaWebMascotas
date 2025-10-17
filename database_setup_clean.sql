-- Script SQL limpio para la base de datos de mascotas
-- Basado en la estructura actual del proyecto

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS mascotasdb;
USE mascotasdb;

-- Eliminar tablas existentes si existen (para empezar limpio)
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

-- Crear tabla producto
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

-- Insertar usuario administrador por defecto
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, rol, fotoPerfil)
VALUES ('admin1', 'admin@mascotas.com', 'admin123', 'Administrador', 'Sistema', 'admin', 'default-avatar.png');

-- Insertar usuario cliente de ejemplo
INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, fechaNacimiento, rol)
VALUES ('cliente1', 'cliente@ejemplo.com', 'cliente123', 'Juan', 'Pérez', '1990-01-15', 'cliente');

-- Insertar algunos productos de ejemplo
INSERT INTO producto (nombre, descripcion, precio, stock, categoria) VALUES
('Alimento Premium para Perros', 'Alimento balanceado de alta calidad para perros adultos', 25.99, 50, 'Alimento'),
('Collar Antipulgas', 'Collar efectivo contra pulgas y garrapatas', 15.50, 30, 'Accesorios'),
('Juguete Kong Clásico', 'Juguete resistente para perros de todas las edades', 12.75, 25, 'Juguetes'),
('Cama Ortopédica', 'Cama cómoda y ortopédica para mascotas mayores', 89.99, 15, 'Camas'),
('Shampoo Hipoalergénico', 'Shampoo especial para pieles sensibles', 18.25, 40, 'Higiene');

-- Verificar las tablas creadas
DESCRIBE usuario;
DESCRIBE producto;

-- Mostrar datos insertados
SELECT * FROM usuario;
SELECT * FROM producto;

-- Consultas útiles para verificar el funcionamiento
SELECT usuario, correo, rol, fechaCreacion FROM usuario;
SELECT nombre, precio, stock, categoria FROM producto WHERE stock > 0;
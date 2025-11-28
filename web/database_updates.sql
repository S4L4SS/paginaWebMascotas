-- Script para actualizar base de datos existente con sistema de reportes
-- Ejecutar este script si ya tienes la base de datos básica y quieres añadir reportes

USE mascotasdb;

-- Añadir columna fotoPerfil a la tabla usuario si no existe
ALTER TABLE usuario 
ADD COLUMN IF NOT EXISTS fotoPerfil VARCHAR(255) DEFAULT 'default-avatar.png';

-- Añadir más columnas a usuario si no existen
ALTER TABLE usuario 
ADD COLUMN IF NOT EXISTS nombre VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS apellido VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fechaNacimiento DATE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Añadir la columna categoria a la tabla producto si no existe
ALTER TABLE producto 
ADD COLUMN IF NOT EXISTS categoria VARCHAR(50) DEFAULT NULL AFTER stock;

-- Añadir más columnas a producto si no existen
ALTER TABLE producto 
ADD COLUMN IF NOT EXISTS imagen VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Cambiar tipo de precio de DOUBLE a DECIMAL para mayor precisión
ALTER TABLE producto 
MODIFY COLUMN precio DECIMAL(10,2) NOT NULL;

-- Actualizar productos existentes con categorías por defecto
UPDATE producto SET categoria = 'Alimento' WHERE categoria IS NULL AND (nombre LIKE '%Alimento%' OR nombre LIKE '%Premium%');
UPDATE producto SET categoria = 'Juguetes' WHERE categoria IS NULL AND nombre LIKE '%Juguete%';

-- Actualizar usuarios existentes con foto por defecto
UPDATE usuario SET fotoPerfil = 'default-avatar.png' WHERE fotoPerfil IS NULL;

-- Crear tabla de métricas para rastrear acciones del sistema
CREATE TABLE IF NOT EXISTS metricas (
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
CREATE TABLE IF NOT EXISTS compras (
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

-- Verificar la estructura actualizada de las tablas
DESCRIBE usuario;
DESCRIBE producto;
DESCRIBE metricas;
DESCRIBE compras;

-- Mostrar resumen de tablas actualizadas
SELECT 'Actualización completada' as Estado, 'Base de datos actualizada con sistema de reportes' as Mensaje;
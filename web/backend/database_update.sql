-- Script para actualizar la tabla usuarios con los campos faltantes

USE mascotasdb;

-- Agregar los campos faltantes a la tabla usuarios
ALTER TABLE usuarios 
ADD COLUMN nombre VARCHAR(100) NULL AFTER password,
ADD COLUMN apellido VARCHAR(100) NULL AFTER nombre,
ADD COLUMN fechaNacimiento DATE NULL AFTER apellido,
ADD COLUMN fotoPerfil VARCHAR(255) NULL AFTER fechaNacimiento;

-- Verificar la estructura actualizada
DESCRIBE usuarios;

-- Opcional: Actualizar registros existentes con valores por defecto
UPDATE usuarios 
SET 
    nombre = SUBSTRING_INDEX(usuario, '@', 1),  -- Usar el usuario como nombre temporal
    apellido = 'Sin especificar',
    fechaNacimiento = '2000-01-01'
WHERE nombre IS NULL;

-- Mostrar algunos registros para verificar
SELECT id, usuario, email, nombre, apellido, fechaNacimiento, fotoPerfil FROM usuarios LIMIT 5;
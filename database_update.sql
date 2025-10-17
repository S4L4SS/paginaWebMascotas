-- Script SQL para actualizar la base de datos con soporte para fotos de perfil
-- Ejecutar este script en phpMyAdmin o MySQL Workbench

-- 1. Agregar columnas nuevas a la tabla usuario
ALTER TABLE usuario ADD COLUMN fotoPerfil VARCHAR(255) DEFAULT NULL;
ALTER TABLE usuario ADD COLUMN nombre VARCHAR(100) DEFAULT NULL;
ALTER TABLE usuario ADD COLUMN apellido VARCHAR(100) DEFAULT NULL;
ALTER TABLE usuario ADD COLUMN fechaNacimiento DATE DEFAULT NULL;

-- 2. Verificar la estructura actualizada
DESCRIBE usuario;

-- 3. Datos de ejemplo (opcional)
-- Actualizar usuarios existentes con datos de ejemplo
UPDATE usuario SET 
    nombre = 'Administrador',
    apellido = 'Principal',
    fotoPerfil = NULL
WHERE usuario = 'admin1';

UPDATE usuario SET 
    nombre = 'Miguel',
    apellido = 'García',
    fotoPerfil = NULL
WHERE usuario = 'miguel';

-- 4. Verificar los cambios
SELECT idUsuario, usuario, nombre, apellido, correo, rol, fotoPerfil FROM usuario;
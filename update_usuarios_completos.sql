-- Script para actualizar usuarios existentes con campos completos
USE tienda_mascotas;

-- Verificar la estructura de la tabla usuario
DESCRIBE usuario;

-- Actualizar usuarios existentes que no tienen datos completos
UPDATE usuario 
SET 
    nombre = CASE 
        WHEN usuario = 'admin1' THEN 'Administrador'
        WHEN usuario = 'rodrigo' THEN 'Rodrigo'
        WHEN usuario = 'maria' THEN 'María'
        ELSE 'Usuario'
    END,
    apellido = CASE 
        WHEN usuario = 'admin1' THEN 'Sistema'
        WHEN usuario = 'rodrigo' THEN 'García'
        WHEN usuario = 'maria' THEN 'López'
        ELSE 'Sistema'
    END,
    fechaNacimiento = CASE 
        WHEN usuario = 'admin1' THEN '1980-01-01'
        WHEN usuario = 'rodrigo' THEN '1995-03-15'
        WHEN usuario = 'maria' THEN '1992-07-22'
        ELSE '1990-01-01'
    END,
    fotoPerfil = 'default-avatar.png'
WHERE nombre IS NULL OR apellido IS NULL OR fechaNacimiento IS NULL OR fotoPerfil IS NULL;

-- Verificar los cambios
SELECT idUsuario, usuario, correo, nombre, apellido, fechaNacimiento, fotoPerfil, rol 
FROM usuario;
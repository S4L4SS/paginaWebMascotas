-- Script para arreglar las rutas de imágenes de productos antiguos
-- Ejecutar en MySQL Workbench o consola MySQL

USE mascotasdb;

-- Ver estado actual
SELECT idProducto, nombre, imagen,
       CASE 
           WHEN imagen LIKE 'uploads/productos/%' THEN '✅ CORRECTA'
           WHEN imagen IS NULL OR imagen = '' THEN '⚠️ SIN IMAGEN'
           ELSE '❌ RUTA INVÁLIDA'
       END as estado
FROM producto 
ORDER BY idProducto;

-- Actualizar productos con rutas inválidas a imagen por defecto
UPDATE producto 
SET imagen = 'uploads/productos/default.png'
WHERE imagen NOT LIKE 'uploads/productos/%' 
  OR imagen IS NULL 
  OR imagen = '';

-- Verificar después de actualizar
SELECT idProducto, nombre, imagen 
FROM producto 
ORDER BY idProducto;

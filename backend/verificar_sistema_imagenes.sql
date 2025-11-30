-- Script de Verificación del Sistema de Imágenes
-- Ejecutar este script para verificar que todo está configurado correctamente

-- 1. Verificar que la columna imagen existe
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'mascotasdb'
  AND TABLE_NAME = 'producto'
  AND COLUMN_NAME = 'imagen';

-- Resultado esperado:
-- COLUMN_NAME: imagen
-- DATA_TYPE: varchar
-- IS_NULLABLE: YES
-- COLUMN_DEFAULT: NULL

-- 2. Ver productos con y sin imágenes
SELECT 
    idProducto,
    nombre,
    CASE 
        WHEN imagen IS NULL THEN '❌ Sin imagen'
        WHEN imagen LIKE 'uploads/productos/%' THEN '✅ Con imagen'
        ELSE '⚠️ Ruta incorrecta'
    END AS estado_imagen,
    imagen
FROM producto
ORDER BY idProducto;

-- 3. Contar productos por estado de imagen
SELECT 
    CASE 
        WHEN imagen IS NULL THEN 'Sin imagen'
        WHEN imagen LIKE 'uploads/productos/%' THEN 'Con imagen'
        ELSE 'Ruta incorrecta'
    END AS estado,
    COUNT(*) AS cantidad
FROM producto
GROUP BY estado;

-- 4. Si necesitas agregar la columna (solo si no existe):
-- ALTER TABLE producto ADD COLUMN imagen VARCHAR(500) DEFAULT NULL;

-- 5. Productos de ejemplo con imágenes (opcional - solo si la BD está vacía)
/*
UPDATE producto SET imagen = 'uploads/productos/collar-perros.jpg' WHERE idProducto = 1;
UPDATE producto SET imagen = 'uploads/productos/alimento-perros.jpg' WHERE idProducto = 2;
UPDATE producto SET imagen = 'uploads/productos/juguete-gatos.jpg' WHERE idProducto = 3;
*/

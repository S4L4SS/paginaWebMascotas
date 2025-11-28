-- Script de prueba para verificar el problema del stock
-- Ejecutar esto en MySQL Workbench o CLI

USE mascotasdb;

-- Ver el estado actual de todos los productos
SELECT idProducto, nombre, stock FROM producto ORDER BY idProducto;

-- Ver específicamente el producto con ID 2 (Gorro)
SELECT * FROM producto WHERE idProducto = 2;

-- Probar UPDATE manualmente
UPDATE producto SET stock = 55 WHERE idProducto = 2;

-- Verificar el cambio
SELECT idProducto, nombre, stock FROM producto WHERE idProducto = 2;

-- Rollback si estás en transacción
-- ROLLBACK;

-- O hacer commit si quieres guardar
-- COMMIT;

-- Ver todos los productos después del update
SELECT idProducto, nombre, stock FROM producto ORDER BY idProducto;

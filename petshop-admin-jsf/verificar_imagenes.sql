-- Ver las rutas actuales de las imágenes
SELECT idProducto, nombre, imagen 
FROM producto 
WHERE idProducto IN (1,2,3,6,12,13,14) 
ORDER BY idProducto;

-- Si las rutas están incorrectas (por ejemplo: uploads/productos/176...), 
-- no es necesario cambiarlas. El problema es que las rutas antiguas apuntan a archivos que NO existen.

-- Para los productos 1, 2, 3, 6 que tienen rutas viejas, podemos actualizarlas a imagen por defecto
-- o mejor aún, copiar las imágenes al directorio correcto

-- Primero veamos qué rutas tienen:
SELECT idProducto, nombre, 
       CASE 
           WHEN imagen LIKE 'uploads/productos/%' THEN 'RUTA CORRECTA'
           ELSE CONCAT('RUTA ANTIGUA: ', imagen)
       END as estado_imagen
FROM producto 
ORDER BY idProducto;

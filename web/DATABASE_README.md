# Guía de Configuración de Base de Datos - Tienda de Mascotas

Este proyecto incluye tres archivos SQL organizados para diferentes escenarios de configuración.

## 📂 **Archivos Disponibles**

### 1. `database_complete.sql` 
**Configuración completa desde cero**
- Crea la base de datos completa con todas las tablas
- Incluye estructura optimizada con todas las columnas necesarias
- Perfecto para instalaciones nuevas

**Úsalo cuando:**
- Empezar un proyecto desde cero
- Quieres una base de datos limpia y completa
- Es tu primera instalación

### 2. `database_updates.sql`
**Actualización de base de datos existente**
- Añade nuevas columnas a tablas existentes
- Crea tablas de métricas y compras
- Respeta datos existentes

**Úsalo cuando:**
- Ya tienes la base de datos básica (usuario y producto)
- Quieres añadir el sistema de reportes
- No quieres perder datos existentes

### 3. `database_sample_data.sql`
**Datos de prueba y ejemplos**
- Inserta productos, usuarios, compras y métricas de ejemplo
- Datos distribuidos en diferentes fechas para demostrar reportes
- Perfecto para testing y demostraciones

**Úsalo cuando:**
- Quieres ver el sistema funcionando inmediatamente
- Necesitas datos para probar reportes
- Quieres hacer demostraciones

## 🚀 **Instrucciones de Instalación**

### **Opción A: Instalación Completa Nueva**
```sql
-- 1. Ejecutar configuración completa
source /ruta/database_complete.sql;

-- 2. Añadir datos de prueba (opcional)
source /ruta/database_sample_data.sql;
```

### **Opción B: Actualizar Base de Datos Existente**
```sql
-- 1. Actualizar estructura existente
source /ruta/database_updates.sql;

-- 2. Añadir datos de prueba (opcional)
source /ruta/database_sample_data.sql;
```

## 📊 **Tablas Incluidas**

| Tabla | Descripción | Campos Principales |
|-------|-------------|-------------------|
| `usuario` | Información de usuarios y admins | id, usuario, correo, rol, fotoPerfil |
| `producto` | Catálogo de productos | id, nombre, precio, stock, categoria |
| `metricas` | Estadísticas del sistema | tipo, entidad, valor, fechaCreacion |
| `compras` | Registro de transacciones | usuario, producto, cantidad, total |

## 🔧 **Verificación Post-Instalación**

Después de ejecutar los scripts, verifica que todo esté correcto:

```sql
-- Verificar tablas creadas
SHOW TABLES;

-- Verificar datos de ejemplo
SELECT COUNT(*) as productos FROM producto;
SELECT COUNT(*) as usuarios FROM usuario;
SELECT COUNT(*) as metricas FROM metricas;
SELECT COUNT(*) as compras FROM compras;
```

## 📈 **Funcionalidades del Sistema de Reportes**

Con estos datos podrás usar:
- ✅ Métricas de ventas por día/semana/mes
- ✅ Productos más vendidos
- ✅ Estadísticas de usuarios
- ✅ Generación de reportes PDF
- ✅ Gráficas interactivas

## 🆘 **Solución de Problemas**

**Error de columna no existe:**
- Ejecuta `database_updates.sql` para añadir columnas faltantes

**Datos duplicados:**
- Los scripts usan `INSERT IGNORE` para evitar duplicados

**Tablas no encontradas:**
- Ejecuta `database_complete.sql` para crear estructura completa

## 🎯 **Próximos Pasos**

1. Ejecuta los scripts SQL apropiados
2. Reinicia el servidor backend: `node app.js`
3. Refresca la página del admin
4. Ve a la pestaña "Reportes" para ver las estadísticas

¡Tu sistema de reportes estará listo para usar! 🎉
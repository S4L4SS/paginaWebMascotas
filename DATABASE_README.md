# 🐾 Base de Datos MascotasDB - Guía de Instalación

## 📋 Descripción

Este es el **archivo SQL único y completo** para instalar toda la base de datos del sistema de tienda de mascotas. Incluye:

- ✅ Estructura completa de tablas
- ✅ Usuarios de prueba (administradores y clientes)
- ✅ Productos de muestra
- ✅ Compras históricas
- ✅ Métricas del sistema

## 🚀 Instalación Rápida

### Opción 1: Desde MySQL Workbench
1. Abre MySQL Workbench
2. Conecta a tu servidor MySQL
3. File → Open SQL Script → Selecciona `mascotasdb_completo.sql`
4. Click en el ícono ⚡ (Execute) o presiona `Ctrl+Shift+Enter`
5. ¡Listo! La base de datos está creada

### Opción 2: Desde la línea de comandos
```bash
mysql -u root -p < mascotasdb_completo.sql
```
Ingresa tu contraseña de MySQL cuando te la pida.

### Opción 3: Comando directo
```bash
mysql -u root -p -e "source C:/paginaWebMascotas/mascotasdb_completo.sql"
```

## 📊 Estructura de la Base de Datos

### Tablas creadas:
1. **usuario** - Usuarios del sistema (admins y clientes)
2. **producto** - Catálogo de productos
3. **metricas** - Métricas y reportes del sistema
4. **compras** - Historial de transacciones

### Relaciones:
- `compras.idUsuario` → `usuario.idUsuario`
- `compras.idProducto` → `producto.idProducto`

## 🔐 Credenciales de Acceso

### Administradores:
| Usuario | Contraseña | Nombre |
|---------|-----------|---------|
| `admin1` | `admin123` | Administrador Sistema |
| `admin2` | `admin123` | Admin Intal |
| `sofia` | `pastelote777` | Mariana Sofia |

### Clientes:
| Usuario | Contraseña |
|---------|-----------|
| `cliente1` | `cliente123` |
| `miguel` | `miguel123` |
| `juan` | `juan123` |
| `rodrigo` | `rodrigo123` |

## 📦 Datos Incluidos

- **7 usuarios** (3 admins + 4 clientes)
- **15 productos** en 5 categorías:
  - Alimento
  - Juguetes
  - Accesorios
  - Higiene
  - Refugio
- **19 compras** distribuidas en el tiempo (hoy, ayer, semana, mes)
- **Métricas** correspondientes a todas las compras

## 🔄 Reinstalación

Si necesitas reinstalar la base de datos desde cero:

1. El script **elimina automáticamente** las tablas existentes
2. Crea las tablas nuevas
3. Inserta todos los datos

**Advertencia:** ⚠️ Esto eliminará TODOS los datos existentes en las tablas.

## 🧪 Verificación

Después de ejecutar el script, verás un resumen como este:

```
✅ Base de datos creada exitosamente
📊 RESUMEN DE DATOS INSERTADOS
================================
👥 Usuarios: 7
   - Administradores: 3
   - Clientes: 4

📦 Productos: 15
   - En stock: 15
   - Stock total: 548

🛒 Compras registradas: 19
   - Total vendido: $XXX.XX

📈 Métricas registradas: XX
```

## 🎯 Para qué sirve este archivo

Este SQL unificado es perfecto para:

- ✅ **Instalar el sistema en un nuevo dispositivo**
- ✅ **Resetear la base de datos a estado limpio**
- ✅ **Compartir el proyecto con otros desarrolladores**
- ✅ **Hacer pruebas con datos consistentes**
- ✅ **Demostración del sistema**

## 🔧 Configuración del Sistema

### Para la aplicación Next.js (Node.js + Express):
Asegúrate de tener en `backend/config/db.js`:
```javascript
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'tu_password',
  database: 'mascotasdb'
});
```

### Para la aplicación JSF (Java):
Asegúrate de tener en `src/main/java/com/petshop/config/DBConnection.java`:
```java
String url = "jdbc:mysql://localhost:3306/mascotasdb";
String user = "root";
String password = "tu_password";
```

## 📝 Notas Importantes

- La base de datos se llama `mascotasdb`
- Charset: `utf8mb4_unicode_ci`
- Motor: `InnoDB`
- Todas las tablas tienen claves primarias auto-incrementales
- Las relaciones tienen `ON DELETE CASCADE` para mantener integridad

## 🆘 Solución de Problemas

### Error: "Database already exists"
- El script incluye `CREATE DATABASE IF NOT EXISTS`, no hay problema

### Error: "Access denied"
- Verifica que tu usuario MySQL tenga permisos de CREATE DATABASE

### Error en fechas
- Todas las fechas usan funciones como `NOW()` y `DATE_SUB()`, se ajustan automáticamente

## 📞 Soporte

Si encuentras algún problema con la instalación:
1. Verifica que MySQL esté corriendo
2. Verifica tus credenciales de acceso
3. Revisa que no haya otros procesos usando la base de datos

---

**Versión:** 1.0.0  
**Fecha:** 29 de noviembre de 2025  
**Compatible con:** MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+

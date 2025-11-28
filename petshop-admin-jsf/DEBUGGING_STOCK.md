# 🔍 DEBUGGING: Problema de Stock AJAX

## 📋 Problemas Actuales

1. ✅ **Botón Editar funciona** - Redirige correctamente a `/admin/productos/editar.xhtml`
2. ❌ **Stock AJAX no persiste** - Cambia de 100 a 55 en UI pero no en MySQL
3. ❌ **404 en POST al actualizar** - Posible problema de ruta del servlet

---

## 🛠️ Correcciones Aplicadas

### 1. **URL del AJAX corregida** (`lista.xhtml`)

**ANTES:**
```javascript
url: window.location.pathname.replace('/productos/lista.xhtml', '') + '/ProductoServlet',
```

**DESPUÉS:**
```javascript
var baseUrl = window.location.protocol + '//' + window.location.host + '/admin/ProductoServlet';
// Resultado: http://localhost:8080/admin/ProductoServlet
```

### 2. **Commit explícito en DAO** (`ProductoDAO.java`)

```java
public boolean update(Producto producto) throws SQLException {
    // ... ejecutar UPDATE ...
    
    // CRÍTICO: Asegurar commit
    if (!connection.getAutoCommit()) {
        connection.commit();
    }
    
    return affectedRows > 0;
}
```

### 3. **Logging detallado agregado**

- ✅ `ProductoServlet.java` - Log de peticiones recibidas
- ✅ `ProductoFacade.java` - Log de operaciones de negocio
- ✅ `ProductoDAO.java` - Log de queries SQL ejecutadas

---

## 🧪 Pasos para Debugging

### PASO 1: Recompilar el Proyecto

```powershell
cd C:\paginaWebMascotas\petshop-admin-jsf
C:\Users\migue\maven\apache-maven-3.9.11\bin\mvn.cmd clean package
```

### PASO 2: Detener Tomcat Actual

- Presiona `Ctrl + C` en la terminal donde corre Tomcat
- Espera a que se detenga completamente

### PASO 3: Reiniciar Tomcat

```powershell
C:\Users\migue\maven\apache-maven-3.9.11\bin\mvn.cmd tomcat7:run
```

### PASO 4: Verificar Logs al Iniciar

Deberías ver:
```
✅ Conexión establecida con MySQL (AutoCommit: ON)
✅ ProductoServlet inicializado - Ruta: /ProductoServlet
📍 Context Path: /admin
```

### PASO 5: Probar AJAX de Stock

1. Ir a: `http://localhost:8080/admin/productos/lista.xhtml`
2. Cambiar el stock del producto "Gorro" de 100 a 55
3. Click en botón 🔄 (Actualizar)
4. **Observar la consola de VS Code/Terminal**

**Logs esperados:**
```
📝 Recibida petición updateStock - ID: 2, Stock: 55
🔄 Actualizando stock - Producto ID: 2 -> Nuevo stock: 55
🔄 ProductoFacade.actualizarStock() - ID: 2, Nuevo stock: 55
📝 Ejecutando UPDATE en BD - ID: 2, Nombre: Gorro, Stock: 55
✅ UPDATE exitoso - Filas afectadas: 1
✅ Stock actualizado en Facade
✅ Stock actualizado exitosamente - Producto: Gorro
```

### PASO 6: Verificar en MySQL

```sql
USE mascotasdb;
SELECT idProducto, nombre, stock FROM producto WHERE idProducto = 2;
```

**Resultado esperado:**
```
+-------------+-------+-------+
| idProducto  | nombre| stock |
+-------------+-------+-------+
|      2      | Gorro |  55   |
+-------------+-------+-------+
```

### PASO 7: Verificar Network en Browser

Abrir DevTools (F12) → Network → Hacer el cambio de stock

**Debe aparecer:**
- ✅ Request URL: `http://localhost:8080/admin/ProductoServlet`
- ✅ Status: `200 OK`
- ✅ Response Type: `application/json`
- ✅ Response Body:
```json
{
  "success": true,
  "message": "Stock actualizado exitosamente",
  "data": {
    "idProducto": 2,
    "nombre": "Gorro",
    "stock": 55,
    ...
  }
}
```

---

## ❌ Si SIGUE Fallando

### Verificación 1: AutoCommit en MySQL

Conectar a MySQL:
```sql
SHOW VARIABLES LIKE 'autocommit';
```

Debe mostrar: `ON`

Si está `OFF`, ejecutar:
```sql
SET autocommit = 1;
```

### Verificación 2: Permisos del Usuario

```sql
SHOW GRANTS FOR 'root'@'localhost';
```

Debe tener: `ALL PRIVILEGES`

### Verificación 3: Conexión desde Java

Agregar al `DBConnection.java` (temporalmente):
```java
private DBConnection() {
    try {
        Class.forName("com.mysql.cj.jdbc.Driver");
        this.connection = DriverManager.getConnection(URL, USER, PASSWORD);
        this.connection.setAutoCommit(true);
        
        // TEST: Verificar autocommit
        System.out.println("AutoCommit status: " + connection.getAutoCommit());
        
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

### Verificación 4: Test Manual del Servlet

Usar Postman o curl:

```bash
curl -X POST "http://localhost:8080/admin/ProductoServlet" \
  -d "action=updateStock&id=2&stock=55"
```

Debería retornar JSON con `success: true`

---

## 🔥 Debugging Avanzado

### Activar Logging de JDBC

Agregar a `DBConnection.java`:
```java
private static final String URL = 
  "jdbc:mysql://localhost:3306/mascotasdb?" +
  "useSSL=false&serverTimezone=UTC&" +
  "logger=com.mysql.cj.log.StandardLogger&" +
  "profileSQL=true&" +
  "logSlowQueries=true";
```

### Ver Queries en Consola

Esto mostrará TODAS las queries ejecutadas en tiempo real.

---

## 📊 Checklist de Verificación

- [ ] Proyecto recompilado con `mvn clean package`
- [ ] Tomcat reiniciado completamente
- [ ] URL del AJAX es correcta: `/admin/ProductoServlet`
- [ ] Logs muestran "Recibida petición updateStock"
- [ ] Logs muestran "UPDATE exitoso - Filas afectadas: 1"
- [ ] AutoCommit está en ON
- [ ] Network muestra status 200
- [ ] Response JSON tiene `success: true`
- [ ] MySQL muestra el nuevo valor de stock

---

## 🎯 Siguiente Acción

**Si después de seguir TODOS estos pasos sigue fallando:**

1. Captura de pantalla de:
   - Terminal/Consola con los logs
   - Network tab en DevTools
   - Resultado del SELECT en MySQL
   - Código del error si aparece

2. Verificar si hay:
   - Múltiples instancias de Tomcat corriendo
   - Caché del navegador interfiriendo
   - Firewall/Antivirus bloqueando

---

## 📝 Notas Importantes

- **Context Path:** El proyecto corre en `/admin`, NO en `/petshop-admin`
- **Puerto:** 8080 (configurado en pom.xml)
- **Base de datos:** `mascotasdb` en localhost:3306
- **Usuario MySQL:** root (sin contraseña)

---

## ✅ Test de Éxito

Cuando funcione correctamente verás:

1. ✅ Cambias stock en la UI
2. ✅ Click en 🔄
3. ✅ Alert: "✓ Stock actualizado correctamente: Gorro - Nuevo stock: 55"
4. ✅ Página se recarga
5. ✅ Input muestra 55
6. ✅ MySQL muestra 55
7. ✅ Consola sin errores

---

¡Sigue estos pasos en orden y reporta en qué paso falla! 🚀

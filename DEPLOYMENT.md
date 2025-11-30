# 🚀 Guía Rápida de Despliegue

Esta guía te ayudará a levantar ambos sistemas (Next.js y JSF) de forma rápida.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js 16+** - [Descargar](https://nodejs.org/)
- ✅ **Java JDK 11+** - [Descargar](https://adoptium.net/)
- ✅ **Apache Maven 3.6+** - [Descargar](https://maven.apache.org/download.cgi)
- ✅ **MySQL 8.0+** - [Descargar](https://dev.mysql.com/downloads/)
- ✅ **Git** - [Descargar](https://git-scm.com/)

## 🗄️ Paso 1: Configurar Base de Datos

```bash
# 1. Abre MySQL
mysql -u root -p

# 2. Crea la base de datos
CREATE DATABASE petshop_db;
USE petshop_db;

# 3. Importa el esquema y datos
SOURCE C:/ruta/a/paginaWebMascotas/web/database_full.sql;

# 4. Verifica que se crearon las tablas
SHOW TABLES;

# 5. Sal de MySQL
EXIT;
```

## 🔧 Paso 2: Configurar Credenciales

### Para Backend Node.js

Edita: `web/backend/config/db.js`

```javascript
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',              // <-- Tu usuario MySQL
  password: 'tu_password',   // <-- Tu contraseña MySQL
  database: 'petshop_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### Para Admin JSF

Edita: `petshop-admin-jsf/src/main/java/com/petshop/config/DBConnection.java`

```java
private static final String URL = "jdbc:mysql://localhost:3306/petshop_db";
private static final String USER = "root";         // <-- Tu usuario MySQL
private static final String PASSWORD = "tu_password"; // <-- Tu contraseña MySQL
```

## 🎯 Opción A: Ejecutar Sistema Next.js

### Terminal 1: Backend Node.js

```bash
# Navega al backend
cd web/backend

# Instala dependencias (solo primera vez)
npm install

# Inicia el servidor
node app.js
```

✅ **Backend corriendo en:** `http://localhost:4000`

### Terminal 2: Frontend Next.js

```bash
# Navega al frontend
cd web

# Instala dependencias (solo primera vez)
npm install

# Modo desarrollo (con hot reload)
npm run dev

# O modo producción
npm run build
npm start
```

✅ **Frontend corriendo en:** `http://localhost:3000`
✅ **Admin moderno en:** `http://localhost:3000/admin`

---

## 🎯 Opción B: Ejecutar Admin JSF

### Terminal 1: Backend Node.js (para imágenes)

```bash
# Navega al backend
cd web/backend

# Instala dependencias (solo primera vez)
npm install

# Inicia el servidor
node app.js
```

✅ **Backend corriendo en:** `http://localhost:4000`

### Terminal 2: Admin JSF

```bash
# Navega al proyecto JSF
cd petshop-admin-jsf

# ==========================================
# SI TIENES MAVEN EN PATH:
# ==========================================
mvn tomcat7:run

# ==========================================
# SI NO TIENES MAVEN EN PATH:
# ==========================================
# Windows (ajusta la ruta a tu instalación de Maven):
C:\ruta\a\maven\bin\mvn.cmd tomcat7:run

# Ejemplo real:
C:\Users\migue\maven\apache-maven-3.9.11\bin\mvn.cmd tomcat7:run

# Linux/Mac:
/ruta/a/maven/bin/mvn tomcat7:run
```

✅ **Admin JSF corriendo en:** `http://localhost:8080/admin`

---

## 🔍 Verificar que Todo Funciona

### Verificar Backend Node.js

```bash
# Abrir en navegador o usar curl
curl http://localhost:4000/api/productos
```

Deberías ver un JSON con la lista de productos.

### Verificar Frontend Next.js

Abre en navegador: `http://localhost:3000`

Deberías ver el catálogo de productos.

### Verificar Admin JSF

Abre en navegador: `http://localhost:8080/admin/productos/lista.xhtml`

Deberías ver la tabla de productos con BootFaces.

---

## 🛠️ Comandos Útiles

### Maven (Admin JSF)

```bash
# Compilar proyecto
mvn clean compile

# Empaquetar como WAR
mvn clean package
# El archivo WAR estará en: target/petshop-admin.war

# Limpiar y ejecutar
mvn clean compile tomcat7:run

# Saltar tests (si hay problemas)
mvn clean package -DskipTests
```

### Node.js

```bash
# Ver logs del backend
cd web/backend
node app.js

# Desarrollo con recarga automática (si tienes nodemon)
npm install -g nodemon
nodemon app.js

# Frontend Next.js con logs detallados
npm run dev -- --verbose
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Cannot connect to database"

**Solución:**
1. Verifica que MySQL esté corriendo: `mysql -u root -p`
2. Revisa usuario y contraseña en archivos de configuración
3. Confirma que la base de datos `petshop_db` existe

### ❌ Error: "Port 4000 already in use"

**Solución en Windows:**
```bash
# Buscar proceso
netstat -ano | findstr :4000

# Matar proceso (reemplaza PID)
taskkill /PID <PID> /F
```

**Solución en Linux/Mac:**
```bash
lsof -ti:4000 | xargs kill -9
```

### ❌ Error: "Port 8080 already in use"

**Solución:**

Edita `petshop-admin-jsf/pom.xml` y cambia el puerto:

```xml
<plugin>
    <groupId>org.apache.tomcat.maven</groupId>
    <artifactId>tomcat7-maven-plugin</artifactId>
    <version>2.2</version>
    <configuration>
        <port>8081</port>  <!-- Cambia a otro puerto -->
    </configuration>
</plugin>
```

### ❌ Error: "mvn command not found"

**Solución:**

1. **Descargar Maven:** https://maven.apache.org/download.cgi
2. **Extraer** a una carpeta (ej: `C:\maven`)
3. **Usar ruta completa:**
   ```bash
   C:\maven\bin\mvn.cmd tomcat7:run
   ```
4. **O agregar a PATH** (recomendado):
   - Windows: Panel de Control → Sistema → Variables de entorno
   - Agregar `C:\maven\bin` a la variable PATH

### ❌ Advertencias de "module-info.class"

Estas advertencias son **normales** y no afectan la funcionalidad. Son causadas por compatibilidad entre Tomcat 7 y módulos Java 9+.

**Puedes ignorarlas.**

### ❌ Imágenes no se cargan en JSF

**Solución:**
1. Verifica que el backend Node.js esté corriendo en puerto 4000
2. Confirma que existan imágenes en `web/backend/uploads/productos/`
3. Revisa los logs de Tomcat para ver mensajes del `ImageServlet`

### ❌ Error: "No suitable driver found for jdbc:mysql"

**Solución:**

El driver MySQL ya está en `pom.xml`. Si persiste:

```bash
cd petshop-admin-jsf
mvn clean install
```

---

## 📊 Puertos Utilizados

| Servicio | Puerto | URL |
|----------|--------|-----|
| Backend Node.js | 4000 | http://localhost:4000 |
| Frontend Next.js | 3000 | http://localhost:3000 |
| Admin JSF | 8080 | http://localhost:8080/admin |
| MySQL | 3306 | localhost:3306 |

---

## 🔐 Credenciales de Prueba

### Usuario Administrador

```
Usuario: admin
Contraseña: admin123
```

### Usuario Cliente

```
Usuario: juan_perez
Contraseña: juan123
```

---

## 📝 Checklist de Verificación

Antes de reportar un problema, verifica:

- [ ] MySQL está corriendo
- [ ] Base de datos `petshop_db` existe y tiene datos
- [ ] Credenciales de BD son correctas en archivos de configuración
- [ ] Backend Node.js está corriendo en puerto 4000
- [ ] No hay conflictos de puertos
- [ ] Java JDK 11+ está instalado (`java -version`)
- [ ] Maven está instalado (`mvn -version`) o usas ruta completa
- [ ] Node.js está instalado (`node --version`)
- [ ] npm está instalado (`npm --version`)

---

## 🎓 Recursos Adicionales

- **README Principal:** [README.md](README.md)
- **README Admin JSF:** [petshop-admin-jsf/README.md](petshop-admin-jsf/README.md)
- **Documentación JSF:** https://javaee.github.io/javaserverfaces-spec/
- **Documentación Next.js:** https://nextjs.org/docs
- **Documentación Maven:** https://maven.apache.org/guides/

---

## 💡 Tips Útiles

### Desarrollo Simultáneo

Si quieres trabajar en ambos sistemas a la vez:

```bash
# Terminal 1: Backend (compartido)
cd web/backend && node app.js

# Terminal 2: Frontend Next.js
cd web && npm run dev

# Terminal 3: Admin JSF
cd petshop-admin-jsf && mvn tomcat7:run
```

### Hot Reload en JSF

Para ver cambios sin reiniciar Tomcat:
- Los cambios en `.xhtml` se reflejan automáticamente
- Los cambios en Java requieren `mvn compile` en otra terminal

### Datos de Prueba

Si necesitas resetear la base de datos:

```bash
mysql -u root -p
DROP DATABASE petshop_db;
CREATE DATABASE petshop_db;
USE petshop_db;
SOURCE web/database_full.sql;
```

---

**¿Todo funcionando? ¡Genial! Ahora puedes empezar a desarrollar 🚀**

¿Problemas? Revisa la sección de solución de problemas o abre un issue en GitHub.

# 🚀 Guía de Instalación para Principiantes - PetShop Admin JSF

Esta guía te ayudará a configurar el proyecto desde cero, incluso si nunca has trabajado con Java, Maven o JSF.

## 📋 Tabla de Contenidos
1. [Verificar Instalaciones Existentes](#1-verificar-instalaciones-existentes)
2. [Instalar Java JDK](#2-instalar-java-jdk)
3. [Instalar Apache Maven](#3-instalar-apache-maven)
4. [Instalar MySQL](#4-instalar-mysql)
5. [Instalar Node.js](#5-instalar-nodejs)
6. [Configurar el Proyecto](#6-configurar-el-proyecto)
7. [Ejecutar el Proyecto](#7-ejecutar-el-proyecto)
8. [Solución de Problemas](#8-solución-de-problemas)

---

## 1. 🔍 Verificar Instalaciones Existentes

Antes de instalar algo, verifica qué tienes ya instalado. Abre **PowerShell** o **CMD** y ejecuta estos comandos:

### Verificar Java
```powershell
java -version
javac -version
```
**Resultado esperado**: Debe mostrar versión 11 o superior (ejemplo: `java version "11.0.x"` o `"17.0.x"`)

### Verificar Maven
```powershell
mvn -version
```
**Resultado esperado**: Debe mostrar Apache Maven 3.6+ (ejemplo: `Apache Maven 3.9.11`)

### Verificar MySQL
```powershell
mysql --version
```
**Resultado esperado**: Debe mostrar MySQL 8.0+ (ejemplo: `mysql Ver 8.0.x`)

### Verificar Node.js
```powershell
node -v
npm -v
```
**Resultado esperado**: Node.js 16+ y npm 8+

---

## 2. ☕ Instalar Java JDK

### Opción A: Descargar desde Oracle o Adoptium (Recomendado)

1. **Descargar JDK 11 o 17**:
   - Oracle JDK: https://www.oracle.com/java/technologies/downloads/
   - Eclipse Adoptium (Open Source): https://adoptium.net/

2. **Instalar el JDK**:
   - Ejecuta el instalador descargado
   - Sigue el asistente de instalación
   - **Importante**: Anota la ruta de instalación (ejemplo: `C:\Program Files\Java\jdk-11`)

3. **Configurar Variables de Entorno**:

   **Windows:**
   ```powershell
   # Abrir PowerShell como Administrador y ejecutar:
   
   # Establecer JAVA_HOME (ajusta la ruta según tu instalación)
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11", "Machine")
   
   # Agregar Java al PATH
   $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
   [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;%JAVA_HOME%\bin", "Machine")
   ```

4. **Verificar instalación**:
   ```powershell
   # Cierra y vuelve a abrir PowerShell, luego ejecuta:
   java -version
   javac -version
   echo $env:JAVA_HOME
   ```

---

## 3. 📦 Instalar Apache Maven

### Método Manual (Windows)

1. **Descargar Maven**:
   - Ir a: https://maven.apache.org/download.cgi
   - Descargar el archivo `.zip` (ejemplo: `apache-maven-3.9.11-bin.zip`)

2. **Extraer Maven**:
   - Extrae el archivo en una ubicación como `C:\Program Files\Maven\apache-maven-3.9.11`
   - O en tu carpeta de usuario: `C:\Users\TuUsuario\maven\apache-maven-3.9.11`

3. **Configurar Variables de Entorno**:
   
   **PowerShell como Administrador:**
   ```powershell
   # Establecer M2_HOME
   [System.Environment]::SetEnvironmentVariable("M2_HOME", "C:\Program Files\Maven\apache-maven-3.9.11", "Machine")
   
   # Establecer MAVEN_HOME
   [System.Environment]::SetEnvironmentVariable("MAVEN_HOME", "C:\Program Files\Maven\apache-maven-3.9.11", "Machine")
   
   # Agregar Maven al PATH
   $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
   [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;%MAVEN_HOME%\bin", "Machine")
   ```

4. **Verificar instalación**:
   ```powershell
   # Cierra y vuelve a abrir PowerShell
   mvn -version
   ```

### Método Alternativo: Chocolatey (Windows)

Si tienes Chocolatey instalado:
```powershell
choco install maven
```

---

## 4. 🗄️ Instalar MySQL

### Windows

1. **Descargar MySQL Installer**:
   - Ir a: https://dev.mysql.com/downloads/installer/
   - Descargar `mysql-installer-community-8.0.x.msi`

2. **Ejecutar el Instalador**:
   - Selecciona "Developer Default" o "Server only"
   - Configura la contraseña root (anótala, la necesitarás)
   - Puerto por defecto: 3306

3. **Verificar instalación**:
   ```powershell
   mysql --version
   ```

4. **Agregar MySQL al PATH** (si no se agregó automáticamente):
   ```powershell
   # PowerShell como Administrador
   $currentPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
   [System.Environment]::SetEnvironmentVariable("Path", "$currentPath;C:\Program Files\MySQL\MySQL Server 8.0\bin", "Machine")
   ```

---

## 5. 🟢 Instalar Node.js

1. **Descargar Node.js**:
   - Ir a: https://nodejs.org/
   - Descargar la versión LTS (Long Term Support)

2. **Ejecutar el instalador**:
   - Sigue el asistente de instalación
   - Asegúrate de marcar la opción "Add to PATH"

3. **Verificar instalación**:
   ```powershell
   node -v
   npm -v
   ```

---

## 6. ⚙️ Configurar el Proyecto

### Paso 1: Clonar o Descargar el Proyecto

Si tienes Git:
```powershell
cd C:\
git clone https://github.com/S4L4SS/paginaWebMascotas.git
cd paginaWebMascotas\petshop-admin-jsf
```

Si descargaste el ZIP:
```powershell
# Extrae el proyecto en C:\paginaWebMascotas
cd C:\paginaWebMascotas\petshop-admin-jsf
```

### Paso 2: Configurar la Base de Datos

1. **Iniciar sesión en MySQL**:
   ```powershell
   mysql -u root -p
   # Ingresa tu contraseña de root
   ```

2. **Crear la base de datos**:
   ```sql
   CREATE DATABASE IF NOT EXISTS petshop_db;
   USE petshop_db;
   
   -- Importar el esquema (ejecuta desde la terminal MySQL)
   SOURCE C:/paginaWebMascotas/database_full.sql;
   
   -- O alternativamente desde PowerShell:
   exit
   ```
   
   ```powershell
   mysql -u root -p petshop_db < C:\paginaWebMascotas\database_full.sql
   ```

### Paso 3: Configurar la Conexión a la Base de Datos

1. **Editar el archivo de configuración**:
   - Abre `src\main\java\com\petshop\config\DBConnection.java`
   - Actualiza las credenciales:

   ```java
   private static final String URL = "jdbc:mysql://localhost:3306/petshop_db";
   private static final String USER = "root";  // Tu usuario de MySQL
   private static final String PASSWORD = "tu_contraseña";  // Tu contraseña de MySQL
   ```

### Paso 4: Instalar Dependencias de Maven

```powershell
# Desde la carpeta petshop-admin-jsf
mvn clean install
```

Este comando:
- Descarga todas las dependencias (JSF, PrimeFaces, BootFaces, MySQL Connector, etc.)
- Compila el proyecto
- Genera el archivo WAR

**Nota**: La primera vez puede tardar varios minutos mientras descarga dependencias.

### Paso 5: Configurar el Backend de Node.js (para imágenes)

```powershell
# Ir a la carpeta backend
cd ..\backend

# Instalar dependencias
npm install

# Volver a la carpeta JSF
cd ..\petshop-admin-jsf
```

---

## 7. 🚀 Ejecutar el Proyecto

### Opción 1: Usando Maven (Recomendado para desarrollo)

```powershell
# Desde la carpeta petshop-admin-jsf
mvn clean tomcat7:run
```

**Resultado esperado**:
```
[INFO] Running war on http://localhost:8080/petshop-admin-jsf
```

### Opción 2: Usando la ruta completa de Maven (si mvn no está en el PATH)

```powershell
C:\Users\TuUsuario\maven\apache-maven-3.9.11\bin\mvn.cmd tomcat7:run
```

### Paso Adicional: Ejecutar el Backend de Node.js

En **otra terminal** PowerShell:
```powershell
cd C:\paginaWebMascotas\backend
node app.js
```

**Resultado esperado**:
```
Servidor corriendo en http://localhost:3000
```

### Acceder a la Aplicación

Abre tu navegador y ve a:
- **Aplicación JSF**: http://localhost:8080/petshop-admin-jsf
- **Backend API**: http://localhost:3000

---

## 8. 🔧 Solución de Problemas

### Problema: "mvn no se reconoce como comando"

**Solución**: Maven no está en el PATH

```powershell
# Verificar la ruta de Maven
dir "C:\Program Files\Maven\apache-maven-3.9.11\bin\mvn.cmd"

# Si existe, usar la ruta completa:
C:\Program Files\Maven\apache-maven-3.9.11\bin\mvn.cmd clean tomcat7:run

# O agregar al PATH para la sesión actual:
$env:Path += ";C:\Program Files\Maven\apache-maven-3.9.11\bin"
```

### Problema: "JAVA_HOME no está configurado"

**Solución**:
```powershell
# Verificar JAVA_HOME
echo $env:JAVA_HOME

# Si está vacío, configurarlo temporalmente:
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11"
$env:Path += ";$env:JAVA_HOME\bin"

# Para configurarlo permanentemente, ejecuta como Administrador:
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-11", "Machine")
```

### Problema: "Could not resolve dependencies"

**Solución**: Problemas de red o repositorio Maven

```powershell
# Limpiar caché de Maven y volver a intentar
mvn clean
mvn dependency:purge-local-repository
mvn clean install
```

### Problema: "Port 8080 already in use"

**Solución**: Cambiar el puerto o detener el proceso que lo usa

```powershell
# Ver qué proceso usa el puerto 8080
netstat -ano | findstr :8080

# Detener el proceso (reemplaza PID con el número mostrado)
taskkill /PID [número_pid] /F

# O cambiar el puerto en pom.xml (buscar <port>8080</port> y cambiarlo)
```

### Problema: "Access denied for user 'root'@'localhost'"

**Solución**: Credenciales incorrectas en DBConnection.java

1. Verifica tus credenciales de MySQL
2. Actualiza `DBConnection.java` con las correctas
3. Recompila: `mvn clean install`

### Problema: "Table doesn't exist"

**Solución**: Base de datos no importada correctamente

```powershell
# Volver a importar la base de datos
mysql -u root -p petshop_db < C:\paginaWebMascotas\database_full.sql
```

---

## 📝 Comandos de Referencia Rápida

### Comandos Esenciales

```powershell
# Verificar todo está instalado
java -version
mvn -version
mysql --version
node -v

# Compilar el proyecto
mvn clean install

# Ejecutar el servidor Tomcat embebido
mvn tomcat7:run

# Ejecutar el backend de Node.js (en otra terminal)
cd backend
node app.js

# Limpiar compilación anterior
mvn clean

# Compilar sin ejecutar tests
mvn clean install -DskipTests

# Ver dependencias del proyecto
mvn dependency:tree
```

---

## 🎯 Checklist de Verificación

Antes de ejecutar el proyecto, asegúrate de:

- [ ] Java JDK 11+ instalado y `java -version` funciona
- [ ] Maven 3.6+ instalado y `mvn -version` funciona
- [ ] MySQL 8.0+ instalado y corriendo
- [ ] Base de datos `petshop_db` creada e importada
- [ ] Node.js 16+ instalado
- [ ] Credenciales de BD actualizadas en `DBConnection.java`
- [ ] Dependencias de Maven descargadas (`mvn clean install` exitoso)
- [ ] Dependencias de Node.js instaladas (`npm install` en `/backend`)
- [ ] Puerto 8080 libre (o configurado otro puerto)
- [ ] Puerto 3000 libre para el backend

---

## 📚 Recursos Adicionales

- **Maven**: https://maven.apache.org/guides/getting-started/
- **JSF Tutorial**: https://www.javatpoint.com/jsf-tutorial
- **PrimeFaces Showcase**: https://www.primefaces.org/showcase/
- **MySQL Documentation**: https://dev.mysql.com/doc/

---

## 💡 Consejos

1. **Primera vez con Maven**: La primera compilación tardará más porque descarga todas las dependencias
2. **Variables de entorno**: Debes reiniciar PowerShell después de configurar variables de entorno
3. **Contraseñas**: Anota todas las contraseñas que configures (MySQL, etc.)
4. **Puerto ocupado**: Si el puerto 8080 está ocupado, edita `pom.xml` línea con `<port>8080</port>`
5. **Logs**: Si algo falla, lee los mensajes de error en la terminal, suelen ser descriptivos

---

¿Tienes problemas? Revisa la sección de [Solución de Problemas](#8-solución-de-problemas) o crea un issue en el repositorio.

**¡Feliz desarrollo! 🐾**

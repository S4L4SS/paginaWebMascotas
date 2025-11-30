# Sistema de Autenticación - PetShop Admin JSF

## 🎯 Problemas Solucionados

### 1. Problema: localhost:8080 no mostraba nada
**Solución:** 
- Configurado `web.xml` para que `login.xhtml` sea la página de bienvenida por defecto
- Cambiado el `contextPath` de `/admin` a `/` en el `pom.xml` (plugins Tomcat y Jetty)
- Ahora al entrar a `http://localhost:8080` se muestra directamente la pantalla de login

### 2. Problema: No funcionaba la validación del login
**Solución:**
- Creado el modelo `Usuario.java` con todos los campos de la base de datos
- Creado `UsuarioDAO.java` con métodos de autenticación contra la base de datos MySQL
- Creado `LoginBean.java` como Managed Bean con validación completa
- El login ahora:
  - ✅ Valida que los campos no estén vacíos
  - ✅ Consulta la base de datos para verificar credenciales
  - ✅ Verifica que el usuario tenga rol "admin"
  - ✅ Muestra mensaje de error si no es admin: "No cuenta con acceso de administrador"
  - ✅ Redirige al dashboard solo si es admin

## 📁 Archivos Creados

### 1. Modelo de Datos
**`src/main/java/com/petshop/model/Usuario.java`**
- Clase entidad que representa un usuario del sistema
- Campos: idUsuario, usuario, correo, contrasena, nombre, apellido, fechaNacimiento, rol, fotoPerfil
- Método `isAdmin()` para verificar si el usuario es administrador
- Método `getNombreCompleto()` para obtener el nombre completo

### 2. Capa de Acceso a Datos
**`src/main/java/com/petshop/dao/UsuarioDAO.java`**
- Implementa el patrón DAO para gestionar usuarios
- Métodos principales:
  - `autenticar(username, password)` - Verifica credenciales
  - `findById(id)` - Buscar usuario por ID
  - `findByUsername(username)` - Buscar por nombre de usuario
  - `findAll()` - Obtener todos los usuarios
  - `isAdmin(userId)` - Verificar si es administrador
  - `create(usuario)` - Crear nuevo usuario
  - `update(usuario)` - Actualizar usuario
  - `delete(id)` - Eliminar usuario

### 3. Lógica de Negocio
**`src/main/java/com/petshop/beans/LoginBean.java`**
- Managed Bean con scope de sesión (`@SessionScoped`)
- Gestiona toda la lógica de autenticación
- Métodos principales:
  - `login()` - Procesa el inicio de sesión
  - `logout()` - Cierra la sesión
  - `isLoggedIn()` - Verifica si hay usuario autenticado
  - `isAdmin()` - Verifica si el usuario es admin
  - `getNombreUsuario()` - Obtiene el nombre del usuario actual
- Validaciones:
  - Campos vacíos
  - Credenciales incorrectas
  - Rol de administrador

### 4. Filtro de Seguridad
**`src/main/java/com/petshop/filter/AuthFilter.java`**
- Filtro que protege las páginas de administración
- Aplica a: `/dashboard.xhtml` y `/admin/*`
- Funcionalidad:
  - Verifica si el usuario está autenticado
  - Verifica si tiene rol de admin
  - Redirige al login si no cumple los requisitos
  - Muestra parámetro de error si no es admin

### 5. Interfaz de Usuario
**`src/main/webapp/login.xhtml`**
- Formulario de login con diseño moderno
- Vinculado con `LoginBean`
- Características:
  - Validación de campos requeridos
  - Mensajes de error/éxito con `<b:messages/>`
  - Diseño responsive con gradiente
  - Muestra credenciales de prueba
  - Botón de inicio de sesión funcional

**`src/main/webapp/WEB-INF/templates/layout.xhtml`**
- Actualizado el menú de usuario
- Muestra el nombre del usuario logueado
- Botón de cerrar sesión funcional

## 🔐 Credenciales de Prueba

```
Usuario:     admin1
Contraseña:  admin123
```

Este usuario está en la base de datos con rol 'admin'.

## 🚀 Cómo Usar

1. **Iniciar el servidor:**
   ```bash
   cd petshop-admin-jsf
   mvn jetty:run
   ```

2. **Acceder al sistema:**
   - Abrir navegador en: `http://localhost:8080`
   - Se mostrará automáticamente la pantalla de login

3. **Iniciar sesión:**
   - Ingresar usuario y contraseña
   - Si las credenciales son correctas y el usuario es admin → acceso al dashboard
   - Si las credenciales son incorrectas → mensaje de error
   - Si el usuario no es admin → mensaje: "No cuenta con acceso de administrador"

4. **Cerrar sesión:**
   - Click en el menú del usuario (esquina superior derecha)
   - Click en "Cerrar Sesión"

## 🗄️ Estructura de la Base de Datos

El sistema usa la tabla `usuario` con la siguiente estructura:

```sql
CREATE TABLE usuario (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(100) NOT NULL,
  nombre VARCHAR(50) DEFAULT NULL,
  apellido VARCHAR(50) DEFAULT NULL,
  fechaNacimiento DATE DEFAULT NULL,
  rol VARCHAR(20) DEFAULT 'cliente',  -- 'admin' o 'cliente'
  fotoPerfil VARCHAR(255) DEFAULT 'default-avatar.svg',
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔄 Flujo de Autenticación

1. Usuario accede a `http://localhost:8080`
2. `web.xml` redirige automáticamente a `login.xhtml`
3. Usuario ingresa credenciales
4. `LoginBean.login()` se ejecuta:
   - Valida campos vacíos
   - Consulta `UsuarioDAO.autenticar(username, password)`
   - Verifica que `rol = 'admin'`
5. Si es válido:
   - Guarda usuario en sesión
   - Redirige a `/dashboard.xhtml`
6. Si no es admin:
   - Muestra mensaje de error
   - Permanece en login
7. `AuthFilter` protege todas las páginas `/dashboard.xhtml` y `/admin/*`:
   - Si no hay sesión → redirige a login
   - Si no es admin → redirige a login con error

## ✅ Verificaciones de Seguridad

- ✅ Validación de campos vacíos en el formulario
- ✅ Autenticación contra base de datos real
- ✅ Verificación de rol de administrador
- ✅ Filtro de seguridad en páginas protegidas
- ✅ Manejo de sesiones con JSF
- ✅ Mensajes de error descriptivos
- ✅ Cierre de sesión funcional

## 📝 Notas Técnicas

- **Framework:** JSF 2.2 con BootFaces
- **Patrón:** MVC + DAO
- **Scope:** SessionScoped para mantener la sesión del usuario
- **Servidor:** Jetty (puerto 8080)
- **Base de datos:** MySQL (mascotasdb)
- **Filtro:** `@WebFilter` con anotación para proteger rutas

---

**Estado:** ✅ Totalmente funcional
**Fecha:** 29 de noviembre de 2025
**Versión:** 1.0.0

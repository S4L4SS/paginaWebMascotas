# 🐾 PetShop Admin JSF

Sistema de administración alternativo construido con **JavaServer Faces (JSF)**, **BootFaces**, y arquitectura **Java EE** completa.

## 📋 Características Implementadas

### ✅ Tecnologías y Patrones

| Característica | Implementación | Descripción |
|---------------|----------------|-------------|
| **Facelets (.xhtml)** | ✔ | Todas las vistas usan Facelets como motor de plantillas JSF |
| **BootFaces** | ✔ | Componentes UI modernos y responsivos con BootFaces 1.4.2 |
| **Pages Navigation** | ✔ | Navegación entre páginas XHTML con faces-config.xml |
| **Ajax – jQuery** | ✔ | Actualización asíncrona de productos con AJAX |
| **RESTful API Java** | ✔ | JAX-RS con Jersey para endpoints REST (`/api/productos`) |
| **Managed Beans** | ✔ | Beans JSF para gestión de productos y navegación |
| **MVC/DAO/DTO/Facade** | ✔ | Arquitectura Java EE completa con separación de capas |
| **JSF DataTables** | ✔ | Tablas con PrimeFaces para listado de productos |
| **Backend Frameworks** | ✔ | Maven, Tomcat 7, MySQL Connector, Jersey, Gson |

## 🏗️ Arquitectura del Proyecto

```
petshop-admin-jsf/
├── src/main/java/com/petshop/
│   ├── beans/              # Managed Beans JSF (@ManagedBean)
│   │   └── ProductoBean.java
│   ├── config/             # Configuración (DB, CORS, JAX-RS)
│   │   ├── DBConnection.java
│   │   ├── ApplicationConfig.java
│   │   └── CorsFilter.java
│   ├── dao/                # Data Access Objects
│   │   └── ProductoDAO.java
│   ├── dto/                # Data Transfer Objects
│   │   └── ProductoDTO.java
│   ├── model/              # Entidades del modelo
│   │   └── Producto.java
│   ├── facade/             # Capa de fachada (lógica de negocio)
│   │   └── ProductoFacade.java
│   ├── rest/               # RESTful Web Services (JAX-RS)
│   │   └── ProductoRest.java
│   └── servlets/           # Servlets tradicionales y utilidades
│       ├── ProductoServlet.java
│       └── ImageServlet.java
├── src/main/webapp/
│   ├── productos/          # Páginas de gestión de productos
│   │   ├── lista.xhtml
│   │   └── nuevo.xhtml
│   ├── resources/          # Recursos estáticos (CSS, JS, imágenes)
│   │   └── images/
│   ├── WEB-INF/
│   │   ├── web.xml         # Descriptor de despliegue
│   │   ├── faces-config.xml # Configuración JSF
│   │   └── templates/      # Plantillas Facelets
│   │       └── layout.xhtml
│   ├── index.xhtml         # Página principal
│   ├── dashboard.xhtml     # Dashboard administrativo
│   └── login.xhtml         # Página de login
└── pom.xml                 # Dependencias Maven
```

## 🔧 Patrones de Diseño Implementados

### 1. **MVC (Model-View-Controller)**
- **Model**: Clases en `model/` y `dto/`
- **View**: Archivos `.xhtml` con Facelets
- **Controller**: Managed Beans en `beans/`

### 2. **DAO (Data Access Object)**
- Abstracción de acceso a datos en `ProductoDAO.java`
- Operaciones CRUD separadas de la lógica de negocio

### 3. **DTO (Data Transfer Object)**
- `ProductoDTO.java` para transferir datos entre capas
- Evita exponer entidades directamente

### 4. **Facade Pattern**
- `ProductoFacade.java` orquesta operaciones complejas
- Simplifica la interacción entre capas

## 🚀 Requisitos Previos

- **Java JDK 11+** (recomendado JDK 11 o 17)
- **Apache Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 16+** (para el backend de imágenes)

## 📦 Instalación y Configuración

### 1. Configurar Base de Datos

```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS petshop_db;

-- Importar esquema y datos
USE petshop_db;
SOURCE web/database_full.sql;
```

### 2. Configurar Conexión a BD

Edita `src/main/java/com/petshop/config/DBConnection.java`:

```java
private static final String URL = "jdbc:mysql://localhost:3306/petshop_db";
private static final String USER = "tu_usuario";
private static final String PASSWORD = "tu_contraseña";
```

### 3. Instalar Dependencias

```bash
cd petshop-admin-jsf
mvn clean install
```

## 🎯 Cómo Ejecutar

### Opción 1: Maven + Tomcat Embebido (Recomendado para desarrollo)

```bash
cd petshop-admin-jsf
mvn tomcat7:run
```

**Para usuarios que no tienen Maven en PATH:**

```bash
# Windows (ajusta la ruta según tu instalación de Maven)
C:\ruta\a\maven\bin\mvn.cmd tomcat7:run

# Linux/Mac
/ruta/a/maven/bin/mvn tomcat7:run
```

El servidor estará disponible en: **http://localhost:8080/admin**

### Opción 2: Empaquetar como WAR y desplegar en Tomcat

```bash
# Generar archivo WAR
mvn clean package

# El archivo WAR estará en: target/petshop-admin.war
# Cópialo a tu carpeta webapps de Tomcat
cp target/petshop-admin.war /ruta/a/tomcat/webapps/
```

### Opción 3: Desarrollo con Hot Reload

Para desarrollo activo con recarga automática:

```bash
mvn clean compile tomcat7:run
```

## 🖼️ Backend de Imágenes (Requerido)

El sistema JSF necesita el backend de Node.js corriendo para servir las imágenes de productos:

```bash
# En otra terminal
cd web/backend
npm install
node app.js
```

El backend debe estar en **http://localhost:4000**

## 📡 Endpoints REST Disponibles

### API RESTful (JAX-RS)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/{id}` | Obtener producto por ID |
| POST | `/api/productos` | Crear nuevo producto |
| PUT | `/api/productos/{id}` | Actualizar producto |
| DELETE | `/api/productos/{id}` | Eliminar producto |

### Servlet AJAX

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/ProductoServlet` | Listar productos (formato JSON) |
| POST | `/ProductoServlet` | Crear/actualizar producto |
| PUT | `/ProductoServlet` | Actualizar producto (vía POST con _method=PUT) |

### Servlet de Imágenes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/images/{nombre_imagen}` | Obtener imagen de producto (proxy al backend Node.js) |

## 🧪 Probar la Aplicación

### 1. Acceder al Panel Admin

```
http://localhost:8080/admin/
```

### 2. Gestión de Productos

```
http://localhost:8080/admin/productos/lista.xhtml
```

**Funcionalidades:**
- ✅ Listar productos con paginación
- ✅ Buscar productos por nombre
- ✅ Crear nuevo producto
- ✅ Editar producto existente (modal AJAX)
- ✅ Eliminar producto
- ✅ Actualizar stock (AJAX sin recargar página)
- ✅ Ver imágenes de productos

### 3. Probar API REST

```bash
# Listar productos
curl http://localhost:8080/admin/api/productos

# Obtener producto específico
curl http://localhost:8080/admin/api/productos/1

# Crear producto
curl -X POST http://localhost:8080/admin/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Nuevo",
    "descripcion": "Descripción del producto",
    "precio": 29.99,
    "stock": 50,
    "imagen": "producto.jpg"
  }'
```

## 📚 Componentes JSF Utilizados

### BootFaces Components

```xml
<!-- Botones -->
<b:commandButton value="Guardar" action="#{bean.guardar}" look="success"/>

<!-- Inputs -->
<b:inputText value="#{bean.nombre}" placeholder="Nombre del producto"/>

<!-- Grid System -->
<b:row>
    <b:column col-md="6">...</b:column>
</b:row>

<!-- Mensajes -->
<b:messages/>
```

### PrimeFaces DataTable

```xml
<p:dataTable id="productosTable" 
             var="producto" 
             value="#{productoBean.productos}"
             paginator="true" 
             rows="20">
    <p:column headerText="Nombre">
        <h:outputText value="#{producto.nombre}"/>
    </p:column>
</p:dataTable>
```

## 🔄 Navegación con Faces Config

La navegación entre páginas está definida en `WEB-INF/faces-config.xml`:

```xml
<navigation-rule>
    <from-view-id>/productos/lista.xhtml</from-view-id>
    <navigation-case>
        <from-outcome>nuevo</from-outcome>
        <to-view-id>/productos/nuevo.xhtml</to-view-id>
    </navigation-case>
</navigation-rule>
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Solución:**
1. Verifica que MySQL esté corriendo
2. Revisa las credenciales en `DBConnection.java`
3. Confirma que la base de datos `petshop_db` existe

### Error: "Port 8080 already in use"

**Solución:**
```bash
# Cambiar puerto en pom.xml
<configuration>
    <port>8081</port>
</configuration>
```

### Advertencias de "module-info.class"

Estas advertencias son normales y no afectan la funcionalidad. Son causadas por la compatibilidad entre Tomcat 7 y módulos Java 9+.

### Imágenes no se cargan

**Solución:**
1. Verifica que el backend Node.js esté corriendo en puerto 4000
2. Confirma que las imágenes existan en `web/backend/uploads/productos/`
3. Revisa los logs del `ImageServlet` en la consola de Tomcat

## 📝 Dependencias Principales (pom.xml)

```xml
<!-- JSF Implementation (Mojarra) -->
<dependency>
    <groupId>com.sun.faces</groupId>
    <artifactId>jsf-api</artifactId>
    <version>2.2.20</version>
</dependency>

<!-- BootFaces for UI Components -->
<dependency>
    <groupId>net.bootsfaces</groupId>
    <artifactId>bootsfaces</artifactId>
    <version>1.4.2</version>
</dependency>

<!-- PrimeFaces for DataTables -->
<dependency>
    <groupId>org.primefaces</groupId>
    <artifactId>primefaces</artifactId>
    <version>10.0.0</version>
</dependency>

<!-- JAX-RS (Jersey) for REST API -->
<dependency>
    <groupId>org.glassfish.jersey.containers</groupId>
    <artifactId>jersey-container-servlet</artifactId>
    <version>2.35</version>
</dependency>

<!-- MySQL Connector -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.0.33</version>
</dependency>

<!-- Gson for JSON -->
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.10.1</version>
</dependency>
```

## 🎨 Características del Frontend JSF

### 1. **Plantillas Facelets**
- Layout principal en `WEB-INF/templates/layout.xhtml`
- Reutilización de código con `ui:composition` y `ui:define`

### 2. **AJAX Integrado**
- Actualización parcial de componentes con `f:ajax`
- Actualización de stock sin recargar página
- Búsqueda en tiempo real

### 3. **Validación**
- Validación del lado del servidor con JSF validators
- Mensajes de error contextuales
- Feedback visual con BootFaces

### 4. **Responsivo**
- Grid system de BootFaces basado en Bootstrap
- Componentes adaptables a móviles

## 🔐 Seguridad (Pendiente)

Actualmente el sistema no tiene autenticación implementada. Para producción, se recomienda:

1. Implementar filtro de autenticación
2. Usar HTTPS
3. Validar todas las entradas del usuario
4. Implementar CSRF protection
5. Usar PreparedStatements (ya implementado en DAO)

## 📖 Recursos Adicionales

- [JSF 2.2 Documentation](https://javaee.github.io/javaee-spec/javadocs/javax/faces/package-summary.html)
- [BootFaces Documentation](https://www.bootsfaces.net/)
- [PrimeFaces Showcase](https://www.primefaces.org/showcase/)
- [JAX-RS Tutorial](https://jersey.github.io/)

## 👥 Contribuir

Este es un proyecto académico/de demostración. Para reportar problemas o sugerir mejoras, abre un issue en el repositorio.

## 📄 Licencia

MIT License - Proyecto Educativo

---

**Desarrollado con ❤️ usando JavaServer Faces, BootFaces y Java EE**

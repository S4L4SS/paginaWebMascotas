# 🐾 PetShop - Sistema de Gestión Completo

Sistema integral de gestión para tienda de mascotas con **dos implementaciones de panel administrativo**: una moderna con **Next.js + React** y otra empresarial con **JavaServer Faces (JSF)**.

## 📂 Estructura del Proyecto

```
paginaWebMascotas/
├── web/                          # Sistema principal Next.js + React
│   ├── backend/                  # API REST con Node.js + Express
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── dao/
│   │   ├── models/
│   │   ├── routes/
│   │   └── uploads/
│   ├── src/
│   │   ├── app/                  # Páginas Next.js
│   │   │   ├── admin/           # Panel admin moderno
│   │   │   ├── carrito/
│   │   │   ├── login/
│   │   │   ├── productos/
│   │   │   └── registro/
│   │   ├── components/           # Componentes React
│   │   └── contexts/             # Context API
│   ├── package.json
│   └── database_full.sql
│
└── petshop-admin-jsf/           # Panel admin alternativo con JSF
    ├── src/
    │   ├── main/
    │   │   ├── java/com/petshop/
    │   │   │   ├── beans/       # Managed Beans JSF
    │   │   │   ├── config/
    │   │   │   ├── dao/
    │   │   │   ├── dto/
    │   │   │   ├── facade/
    │   │   │   ├── model/
    │   │   │   ├── rest/        # API REST JAX-RS
    │   │   │   └── servlets/
    │   │   └── webapp/
    │   │       ├── productos/   # Vistas Facelets (.xhtml)
    │   │       ├── WEB-INF/
    │   │       │   ├── web.xml
    │   │       │   └── faces-config.xml
    │   │       └── resources/
    │   └── pom.xml
    └── README.md
```

## 🎯 Dos Implementaciones del Panel Admin

### 1️⃣ **Admin Moderno** (Next.js + React)
- 🚀 **Stack**: Next.js 14, React 18, Tailwind CSS
- 📍 **Ubicación**: `web/src/app/admin/`
- 🌐 **Puerto**: 3000
- ✨ **Características**:
  - SPA moderna y reactiva
  - Componentes reutilizables
  - Context API para estado global
  - API REST con Node.js/Express

### 2️⃣ **Admin Empresarial** (JSF + Java EE)
- 🏢 **Stack**: JSF 2.2, BootFaces, PrimeFaces, JAX-RS
- 📍 **Ubicación**: `petshop-admin-jsf/`
- 🌐 **Puerto**: 8080
- ✨ **Características**:
  - Arquitectura MVC/DAO/DTO/Facade
  - Facelets para vistas
  - RESTful API con JAX-RS
  - DataTables con PrimeFaces
  - AJAX con jQuery

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js 16+** y **npm**
- **Java JDK 11+**
- **Apache Maven 3.6+**
- **MySQL 8.0+**

### 1. Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p

CREATE DATABASE petshop_db;
USE petshop_db;
SOURCE web/database_full.sql;
```

### 2. Ejecutar Sistema Completo

#### Opción A: Admin Moderno (Next.js)

```bash
# Terminal 1: Backend Node.js
cd web/backend
npm install
node app.js
# Servidor en http://localhost:4000

# Terminal 2: Frontend Next.js
cd web
npm install
npm run dev
# Aplicación en http://localhost:3000
# Admin en http://localhost:3000/admin
```

#### Opción B: Admin JSF (Java EE)

```bash
# Terminal 1: Backend Node.js (para imágenes)
cd web/backend
npm install
node app.js
# Servidor en http://localhost:4000

# Terminal 2: Aplicación JSF
cd petshop-admin-jsf

# Con Maven en PATH:
mvn tomcat7:run

# Sin Maven en PATH (ajusta la ruta):
C:\ruta\a\maven\bin\mvn.cmd tomcat7:run

# Aplicación en http://localhost:8080/admin
```

## 📋 Comparación de Implementaciones

| Característica | Next.js Admin | JSF Admin |
|---------------|---------------|-----------|
| **Framework** | Next.js 14 + React 18 | JSF 2.2 + Java EE |
| **UI Library** | Tailwind CSS | BootFaces + PrimeFaces |
| **Backend** | Node.js + Express | Servlets + JAX-RS |
| **Estado** | Context API | Managed Beans |
| **Routing** | App Router (Next.js) | faces-config.xml |
| **API** | REST (Express) | REST (JAX-RS) + Servlets |
| **Tablas** | React Components | PrimeFaces DataTable |
| **AJAX** | Fetch API | jQuery + f:ajax |
| **Arquitectura** | Component-based | MVC/DAO/DTO/Facade |
| **Puerto** | 3000 | 8080 |
| **Despliegue** | Node.js / Vercel | Tomcat / Java EE Server |

## 🎨 Características Comunes

### ✅ Gestión de Productos
- Crear, editar, eliminar productos
- Búsqueda y filtrado
- Gestión de stock
- Subida de imágenes

### ✅ Gestión de Usuarios
- Registro de clientes
- Perfil de usuario
- Historial de compras

### ✅ Sistema de Carrito
- Agregar/eliminar productos
- Persistencia en localStorage
- Cálculo de totales

### ✅ Reportes
- Ventas por período
- Productos más vendidos
- Estadísticas de usuarios

## 🗄️ Base de Datos

### Tablas Principales

```sql
- usuario          # Usuarios del sistema (admin, clientes)
- producto         # Catálogo de productos
- compra           # Registros de compras
- detalle_compra   # Items de cada compra
```

### Datos de Prueba

El archivo `database_full.sql` incluye:
- 5 usuarios de ejemplo (1 admin, 4 clientes)
- 10 productos de ejemplo
- Historial de compras de muestra

**Usuario Admin:**
```
Usuario: admin
Contraseña: admin123
```

## 🛠️ Tecnologías Utilizadas

### Frontend Next.js
- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **Tailwind CSS** - Estilos
- **Context API** - Gestión de estado

### Frontend JSF
- **JSF 2.2** - Framework web Java
- **Facelets** - Motor de plantillas
- **BootFaces 1.4.2** - Componentes UI
- **PrimeFaces 10.0.0** - DataTables avanzados
- **jQuery** - AJAX tradicional

### Backend Node.js
- **Express.js** - Framework web
- **MySQL2** - Driver de base de datos
- **Multer** - Upload de archivos
- **CORS** - Cross-Origin Resource Sharing

### Backend Java
- **JAX-RS (Jersey 2.35)** - RESTful Web Services
- **Servlets 4.0** - HTTP request handling
- **MySQL Connector/J 8.0.33** - JDBC driver
- **Gson 2.10.1** - JSON processing
- **Maven** - Gestión de dependencias

## 📡 APIs Disponibles

### API Node.js (Puerto 4000)

```
GET    /api/productos              # Listar productos
GET    /api/productos/:id          # Obtener producto
POST   /api/productos              # Crear producto
PUT    /api/productos/:id          # Actualizar producto
DELETE /api/productos/:id          # Eliminar producto

GET    /api/usuarios               # Listar usuarios
POST   /api/usuarios/login         # Login
POST   /api/usuarios/registro      # Registro
PUT    /api/usuarios/:id           # Actualizar usuario

GET    /api/compras                # Listar compras
POST   /api/compras                # Crear compra

GET    /api/reportes/ventas        # Reporte de ventas
```

### API Java JSF (Puerto 8080)

```
GET    /admin/api/productos        # Listar productos
GET    /admin/api/productos/{id}   # Obtener producto
POST   /admin/api/productos        # Crear producto
PUT    /admin/api/productos/{id}   # Actualizar producto
DELETE /admin/api/productos/{id}   # Eliminar producto

GET    /admin/ProductoServlet      # Servlet AJAX (JSON)
POST   /admin/ProductoServlet      # AJAX Create/Update

GET    /admin/images/{imagen}      # Proxy de imágenes
```

## 📱 Rutas de la Aplicación

### Sistema Next.js

```
/                           # Página principal (catálogo)
/login                      # Inicio de sesión
/registro                   # Registro de usuarios
/productos                  # Catálogo de productos
/carrito                    # Carrito de compras
/perfil                     # Perfil de usuario
/admin                      # Panel administrativo
/admin/productos            # Gestión de productos
/admin/usuarios             # Gestión de usuarios
/admin/reportes             # Reportes y estadísticas
```

### Sistema JSF

```
/admin/                           # Dashboard principal
/admin/productos/lista.xhtml      # Listado de productos
/admin/productos/nuevo.xhtml      # Crear producto
/admin/dashboard.xhtml            # Panel de control
/admin/login.xhtml                # Login (pendiente)
```

## 🐛 Solución de Problemas

### Error de Conexión a MySQL

```bash
# Verifica que MySQL esté corriendo
mysql -u root -p

# Ajusta credenciales en:
# - web/backend/config/db.js (Node.js)
# - petshop-admin-jsf/src/main/java/com/petshop/config/DBConnection.java (Java)
```

### Puerto en Uso

```bash
# Windows - Matar proceso en puerto
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Maven No Encontrado

```bash
# Descargar Maven: https://maven.apache.org/download.cgi
# Agregar a PATH o usar ruta completa:
C:\ruta\a\maven\bin\mvn.cmd tomcat7:run
```

### Imágenes No Cargan en JSF

1. Verifica que el backend Node.js esté corriendo en puerto 4000
2. Las imágenes deben estar en `web/backend/uploads/productos/`
3. El `ImageServlet` actúa como proxy

## 📚 Documentación Detallada

- **Sistema Next.js**: Ver `web/README.md`
- **Panel JSF**: Ver `petshop-admin-jsf/README.md`
- **API Backend**: Ver `web/backend/README.md` (si existe)
- **Base de Datos**: Ver `web/DATABASE_README.md`

## 🎓 Propósito Académico

Este proyecto demuestra:

### Admin Next.js
- ✅ Arquitectura moderna de Single Page Application
- ✅ Hooks de React y Context API
- ✅ API REST con Express.js
- ✅ Routing dinámico con App Router
- ✅ Componentes reutilizables

### Admin JSF
- ✅ Arquitectura Java EE empresarial
- ✅ Patrón MVC con Managed Beans
- ✅ Capa de persistencia con DAO
- ✅ Servicios REST con JAX-RS
- ✅ Navegación declarativa con faces-config
- ✅ AJAX tradicional con jQuery
- ✅ DataTables con PrimeFaces

## 🤝 Contribuciones

Este es un proyecto educativo. Si encuentras bugs o tienes sugerencias:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Proyecto Educativo

---

## 🚀 Comandos Rápidos de Referencia

### Desarrollo Diario - Next.js

```bash
# Backend
cd web/backend && node app.js

# Frontend (nueva terminal)
cd web && npm run dev
```

### Desarrollo Diario - JSF

```bash
# Backend (para imágenes)
cd web/backend && node app.js

# JSF Admin (nueva terminal)
cd petshop-admin-jsf && mvn tomcat7:run
```

### Producción

```bash
# Next.js
cd web && npm run build && npm start

# JSF
cd petshop-admin-jsf && mvn clean package
# Desplegar target/petshop-admin.war en Tomcat
```

---

**Desarrollado con ❤️ como proyecto de demostración de arquitecturas web modernas y empresariales**

# 🐾 Página Web de Mascotas

Una aplicación web completa para la venta de productos para mascotas, construida con Next.js y Node.js.

## 🚀 Características

- **Frontend**: React/Next.js con Tailwind CSS
- **Backend**: Node.js con Express
- **Base de datos**: MySQL
- **Autenticación**: Sistema de login y registro
- **Panel de administración**: CRUD completo de productos
- **Gestión de usuarios**: Control de roles y permisos

## 🛠️ Tecnologías Utilizadas

### Frontend
- Next.js 15.5.4
- React
- Tailwind CSS
- HTML5/CSS3/JavaScript

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- Body-parser

### Arquitectura
- Patrón MVC (Modelo-Vista-Controlador)
- DAO (Data Access Object)
- DTO (Data Transfer Object)

## 📦 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL/XAMPP
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/S4L4SS/paginaWebMascotas.git
cd paginaWebMascotas
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
cd ..
```

### 4. Configurar la base de datos
1. Inicia XAMPP o tu servidor MySQL
2. Ejecuta el script `database_setup_clean.sql` en phpMyAdmin o MySQL Workbench
3. Configura las credenciales de base de datos en `backend/config/db.js`

### 5. Ejecutar la aplicación

#### Desarrollo (Frontend y Backend por separado)
```bash
# Terminal 1 - Frontend (puerto 3000)
npm run dev

# Terminal 2 - Backend (puerto 5000)
cd backend
npm start
```

#### Producción
```bash
npm run build
npm run start
```

## 🗃️ Estructura de la Base de Datos

### Tabla usuario
- `idUsuario` (INT, Primary Key, Auto Increment)
- `usuario` (VARCHAR(50), NOT NULL, UNIQUE)
- `correo` (VARCHAR(100), NOT NULL, UNIQUE)
- `contrasena` (VARCHAR(100), NOT NULL)
- `nombre` (VARCHAR(50))
- `apellido` (VARCHAR(50))
- `fechaNacimiento` (DATE)
- `rol` (VARCHAR(20), DEFAULT 'cliente')
- `fotoPerfil` (VARCHAR(255), DEFAULT 'default-avatar.png')

### Tabla producto
- `idProducto` (INT, Primary Key, Auto Increment)
- `nombre` (VARCHAR(100), NOT NULL)
- `descripcion` (TEXT)
- `precio` (DECIMAL(10,2), NOT NULL)
- `stock` (INT, DEFAULT 0)
- `categoria` (VARCHAR(50))
- `imagen` (VARCHAR(255))

## 👤 Usuarios por Defecto

### Administrador
- Usuario: `admin1`
- Email: `admin@mascotas.com`
- Contraseña: `admin123`
- Rol: `admin`

## 🌟 Funcionalidades Implementadas

- ✅ Registro y login de usuarios
- ✅ Sistema de roles (cliente/admin)
- ✅ CRUD completo de productos (solo admin)
- ✅ Gestión de perfiles de usuario
- ✅ Catálogo de productos
- ✅ Panel de administración
- ✅ Navegación inteligente según rol
- ✅ Subida de fotos de perfil

## 📁 Estructura del Proyecto

```
/
├── backend/               # Servidor Node.js
│   ├── controllers/       # Controladores MVC
│   ├── dao/              # Data Access Objects
│   ├── config/           # Configuración BD
│   ├── routes/           # Rutas API
│   └── uploads/          # Archivos subidos
├── src/
│   ├── app/              # Páginas Next.js
│   └── components/       # Componentes React
├── public/               # Archivos estáticos
└── database_setup_clean.sql # Script de BD
```

## 🔧 Configuración

### Variables de Entorno (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Base de Datos (backend/config/db.js)
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mascotasdb'
};
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

- **S4L4SS** - [GitHub Profile](https://github.com/S4L4SS)

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
cd ..
```

### 4. Configurar la base de datos
1. Iniciar XAMPP o MySQL
2. Crear una base de datos llamada `mascotasdb`
3. Ejecutar las consultas SQL necesarias para crear las tablas

### 5. Ejecutar la aplicación

#### Backend (puerto 4000)
```bash
cd backend
node app.js
```

#### Frontend (puerto 3000/3001)
```bash
npm run dev
```

## 🌐 Uso

1. Accede a `http://localhost:3000` (o el puerto que indique la consola)
2. Regístrate como nuevo usuario o inicia sesión
3. Los administradores pueden acceder al panel de administración para gestionar productos

## 👥 Funcionalidades por Rol

### Usuario Cliente
- Registro e inicio de sesión
- Visualización del catálogo de productos
- Navegación por la tienda

### Administrador
- Todas las funciones del cliente
- Panel de administración
- CRUD de productos (Crear, Leer, Actualizar, Eliminar)
- Gestión de usuarios y roles
- Control de stock, precios, descripciones e imágenes

## 📁 Estructura del Proyecto

```
├── backend/
│   ├── config/         # Configuración de base de datos
│   ├── controllers/    # Controladores MVC
│   ├── dao/           # Data Access Objects
│   ├── dto/           # Data Transfer Objects
│   ├── models/        # Modelos de datos
│   └── routes/        # Rutas de la API
├── src/
│   ├── app/           # Páginas de Next.js
│   └── components/    # Componentes React
└── public/            # Archivos estáticos
```

## 🔮 Próximas Funcionalidades

- [ ] Integración de pasarelas de pago (Stripe, PayPal, Culqi)
- [ ] Sistema de notificaciones
- [ ] Carrito de compras
- [ ] Opciones de pago (Yape, Plin, Tarjeta)
- [ ] API de mensajería
- [ ] Gestión de tallas de productos

## 👨‍💻 Autor

**S4L4SS** - [GitHub](https://github.com/S4L4SS)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

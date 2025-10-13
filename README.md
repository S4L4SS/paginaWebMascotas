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

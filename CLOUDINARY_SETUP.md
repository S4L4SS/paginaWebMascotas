# 📸 Configuración de Cloudinary para Mundo Mascotas

## ¿Qué es Cloudinary?

Cloudinary es un servicio en la nube que almacena y optimiza imágenes automáticamente. Todas las fotos de perfil y productos se subirán a Cloudinary en lugar de guardarlas localmente.

## ✅ Ventajas

- ✅ Las imágenes están siempre disponibles (no se pierden si reinicias el servidor)
- ✅ Optimización automática de imágenes (reduce tamaño sin perder calidad)
- ✅ CDN global (imágenes cargan rápido desde cualquier parte del mundo)
- ✅ **Plan gratuito:** 25GB de almacenamiento + 25,000 transformaciones/mes
- ✅ URLs permanentes que funcionan en localhost y producción

## 📝 Pasos para Configurar

### 1. Crear Cuenta en Cloudinary

1. Ve a: https://cloudinary.com/users/register_free
2. Regístrate con tu email
3. Verifica tu correo electrónico

### 2. Obtener Credenciales

1. Una vez dentro, ve al **Dashboard**: https://console.cloudinary.com/console
2. Copia estos 3 valores que aparecen en la parte superior:
   - **Cloud Name** (ejemplo: `dxxx123abc`)
   - **API Key** (ejemplo: `123456789012345`)
   - **API Secret** (ejemplo: `abcdefghijklmnopqrstuvwxyz`)

### 3. Configurar el Proyecto

1. Abre el archivo `backend/.env`
2. Reemplaza los valores de Cloudinary con los tuyos:

```env
CLOUDINARY_CLOUD_NAME=tu-cloud-name-aqui
CLOUDINARY_API_KEY=tu-api-key-aqui
CLOUDINARY_API_SECRET=tu-api-secret-aqui
```

**Ejemplo real:**
```env
CLOUDINARY_CLOUD_NAME=dxxx123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 4. Reiniciar el Backend

```bash
cd backend
node app.js
```

## ✨ ¡Listo! Ahora las Imágenes se Suben a Cloudinary

### 🔍 Cómo Verificar que Funciona

1. Registra un nuevo usuario con una foto de perfil
2. La foto se subirá a Cloudinary automáticamente
3. En la base de datos, verás una URL como:
   ```
   https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/mascotas/profile-pictures/user_1234567890.jpg
   ```
4. Ve a tu Dashboard de Cloudinary → **Media Library** → Verás la carpeta `mascotas/profile-pictures` con las fotos

## 📁 Estructura en Cloudinary

Las imágenes se organizan así:

```
mascotas/
├── profile-pictures/     ← Fotos de perfil de usuarios
│   ├── user_1234567890.jpg
│   ├── user_1234567891.png
│   └── ...
└── productos/            ← Imágenes de productos (próximamente)
    ├── producto_1234567890.jpg
    └── ...
```

## 🌐 Ventajas para Producción

Cuando subas el proyecto a un servidor (Railway, Render, Heroku, etc.):

- ✅ **No necesitas cambiar nada en el código**
- ✅ Las URLs de Cloudinary funcionan igual en localhost y producción
- ✅ No pierdes las imágenes cuando el servidor se reinicia
- ✅ Las imágenes cargan más rápido gracias al CDN global

## 🔒 Seguridad

- ⚠️ **NUNCA** subas el archivo `.env` a GitHub
- ✅ El archivo `.env` ya está en `.gitignore`
- ✅ Usa variables de entorno en el servidor de producción

## 📊 Límites del Plan Gratuito

- **Almacenamiento:** 25 GB
- **Transformaciones:** 25,000/mes
- **Ancho de banda:** 25 GB/mes

Para un proyecto como Mundo Mascotas, esto es **MÁS que suficiente** (puedes almacenar miles de imágenes).

## 🆘 Problemas Comunes

### Error: "Invalid API Key"
- Verifica que copiaste correctamente las credenciales
- Asegúrate de no tener espacios extra en el archivo `.env`
- Reinicia el servidor backend

### Las imágenes no se muestran
- Verifica que las URLs en la base de datos empiecen con `https://res.cloudinary.com/`
- Limpia caché del navegador (Ctrl + Shift + R)

### "Must supply cloud_name"
- Falta configurar `CLOUDINARY_CLOUD_NAME` en el `.env`

## 📚 Recursos

- **Dashboard de Cloudinary:** https://console.cloudinary.com/console
- **Documentación:** https://cloudinary.com/documentation
- **Soporte:** https://support.cloudinary.com/

---

**¡Todo listo!** 🎉 Ahora tu proyecto usa almacenamiento profesional en la nube.

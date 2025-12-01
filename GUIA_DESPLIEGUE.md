# 🚀 Guía de Despliegue - Mundo Mascotas

## 📝 Resumen

Este proyecto tiene **3 componentes principales**:
1. **Frontend React/Next.js** (para clientes)
2. **Backend Node.js/Express** (API REST)
3. **Admin Panel JSF** (panel de administración Java)

---

## 🌐 1. Desplegar Frontend React en Vercel

### Pasos:

1. **Conecta tu repositorio en Vercel:**
   - Ve a https://vercel.com/new
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio: `S4L4SS/paginaWebMascotas`
   - En "Project Name" usa: `mundo-mascotas` (solo minúsculas y guiones)

2. **Configuración del Proyecto:**
   - **Framework Preset**: Next.js (detectado automáticamente)
   - **Root Directory**: `.` (raíz del proyecto)
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `.next` (automático)

3. **Variables de Entorno:**
   - Ve a **Settings** → **Environment Variables**
   - Agrega:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://tu-backend-url.railway.app
     ```
   - **IMPORTANTE**: Cambia esto después de desplegar el backend

4. **Deploy:**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - Tu sitio estará en: `https://mundo-mascotas.vercel.app`

### 🔄 Re-desplegar después de cambios:

- **Automático**: Cada `git push` a `main` despliega automáticamente
- **Manual**: En Vercel Dashboard → Deployments → "Redeploy"

---

## 🔌 2. Desplegar Backend Node.js en Railway

### Pasos:

1. **Crear cuenta en Railway:**
   - Ve a https://railway.app
   - Conecta con GitHub

2. **Nuevo Proyecto:**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Busca: `S4L4SS/paginaWebMascotas`
   - Click en "Deploy Now"

3. **Configuración del Servicio:**
   - **Root Directory**: `/backend`
   - **Start Command**: `node app.js`
   - **Port**: 4000 (Railway lo detecta automáticamente)

4. **Variables de Entorno:**
   - En Settings → Variables, agrega:
   ```
   DB_HOST=tu-mysql-host.railway.app
   DB_USER=root
   DB_PASSWORD=tu-contraseña-mysql
   DB_DATABASE=mascotasdb
   DB_PORT=3306
   
   CLOUDINARY_CLOUD_NAME=dhaidbkmt
   CLOUDINARY_API_KEY=153294565964528
   CLOUDINARY_API_SECRET=cBeMxTF66TdnE1OSj5dQffcMNZI
   
   NODE_ENV=production
   ```

5. **Agregar Base de Datos MySQL:**
   - En tu proyecto Railway, click "New" → "Database" → "Add MySQL"
   - Railway creará una instancia MySQL automáticamente
   - Copia las credenciales (DB_HOST, DB_PASSWORD, etc.) a las variables de entorno

6. **Importar Base de Datos:**
   - Descarga el cliente MySQL Workbench
   - Conecta usando las credenciales de Railway
   - Importa el archivo: `database_full.sql` o `mascotasdb_completo.sql`

7. **URL del Backend:**
   - Railway te dará una URL como: `https://paginawebmascotas-production.up.railway.app`
   - Copia esta URL y actualiza `NEXT_PUBLIC_API_URL` en Vercel

---

## ☕ 3. Desplegar Admin Panel JSF

### Opción A: Railway (Recomendada)

1. **Crear Servicio Nuevo en tu Proyecto Railway:**
   - Click "New" → "GitHub Repo"
   - Selecciona el mismo repositorio
   - **Root Directory**: `/petshop-admin-jsf`

2. **Configurar Build:**
   - **Build Command**: `mvn clean package`
   - **Start Command**: Railway detecta el WAR automáticamente

3. **Variables de Entorno:**
   ```
   JAVA_VERSION=11
   MAVEN_VERSION=3.8.6
   
   DB_HOST=tu-mysql-host.railway.app
   DB_USER=root
   DB_PASSWORD=tu-contraseña-mysql
   DB_DATABASE=mascotasdb
   DB_PORT=3306
   ```

4. **URL del Admin:**
   - Railway te dará una URL como: `https://petshop-admin.railway.app`

### Opción B: Azure App Service

1. **Crear App Service:**
   - Ve a https://portal.azure.com
   - "Create a resource" → "Web App"
   - Runtime: Java 11, Tomcat 9.0

2. **Desplegar WAR:**
   - Compila localmente: `mvn clean package`
   - Sube el WAR desde: `target/petshop-admin-jsf.war`
   - Usa Azure CLI o FTP

---

## 🔒 4. Configurar CORS en el Backend

Después de desplegar, actualiza `backend/app.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mundo-mascotas.vercel.app',  // Tu frontend desplegado
    'https://petshop-admin.railway.app'   // Tu admin desplegado
  ],
  credentials: true
}));
```

Haz `git push` para aplicar los cambios.

---

## ✅ Checklist Final

- [ ] Frontend desplegado en Vercel
- [ ] Backend desplegado en Railway
- [ ] Base de datos MySQL creada y poblada
- [ ] Variables de entorno configuradas en todos los servicios
- [ ] CORS actualizado con las URLs de producción
- [ ] `NEXT_PUBLIC_API_URL` actualizado en Vercel
- [ ] Cloudinary configurado (ya está listo)
- [ ] Admin Panel JSF desplegado (opcional)

---

## 🔗 URLs Finales

- **Frontend (Clientes)**: https://mundo-mascotas.vercel.app
- **Backend API**: https://tu-backend.railway.app
- **Admin Panel**: https://tu-admin.railway.app
- **Cloudinary**: https://console.cloudinary.com/console/media_library

---

## 💰 Costos

- **Vercel**: Gratis (hasta 100GB ancho de banda/mes)
- **Railway**: $5/mes + uso (incluye $5 gratis/mes)
- **Cloudinary**: Gratis (hasta 25 créditos/mes, suficiente para 25GB transferencia)

---

## 🐛 Troubleshooting

### Error: "Failed to compile"
- Revisa los logs en Vercel
- Warnings de `<img>` son normales, no bloquean el despliegue

### Error: "Database connection failed"
- Verifica las variables de entorno en Railway
- Asegúrate de que el MySQL esté corriendo
- Verifica que la base de datos esté importada

### Error: "CORS policy blocked"
- Actualiza `backend/app.js` con las URLs de producción
- Haz `git push` para aplicar cambios
- Espera 1-2 minutos para que Railway redespliegu

e

### Imágenes no cargan
- Cloudinary ya está configurado ✅
- Las imágenes nuevas se suben automáticamente a Cloudinary
- Las imágenes viejas (localhost) no funcionarán en producción

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel/Railway Dashboard
2. Verifica las variables de entorno
3. Asegúrate de que la base de datos esté accesible

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en internet para que cualquiera pueda acceder desde cualquier dispositivo.

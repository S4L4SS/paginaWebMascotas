# Sistema de Reportes - Tienda de Mascotas

## Descripción General

El sistema de reportes proporciona al administrador una vista completa de las estadísticas y métricas de la tienda, incluyendo:
- Estadísticas de ventas por período (día, semana, mes)
- Productos más vendidos
- Métricas generales del negocio
- Generación de reportes en PDF

## Estructura de Base de Datos

### Tabla `metricas`
```sql
CREATE TABLE metricas (
  idMetrica INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,           -- 'compra', 'registro_usuario', 'visita_producto'
  entidad VARCHAR(50) DEFAULT NULL,    -- 'producto', 'usuario'
  entidadId INT DEFAULT NULL,          -- ID del producto/usuario relacionado
  valor DECIMAL(10,2) DEFAULT 0,       -- Monto de la compra, cantidad, etc.
  metadatos JSON DEFAULT NULL,         -- Información adicional
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `compras`
```sql
CREATE TABLE compras (
  idCompra INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  fechaCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Reportes Base URL: `/api/reportes`

#### `GET /resumen`
Obtiene un resumen general de las métricas del negocio.

**Respuesta:**
```json
{
  "ventasHoy": { "cantidad": 5, "total": 125.50 },
  "ventasSemana": { "cantidad": 23, "total": 890.75 },
  "ventasMes": { "cantidad": 87, "total": 3250.25 },
  "usuariosRegistradosHoy": { "cantidad": 2 },
  "totalProductos": { "cantidad": 15 },
  "totalUsuarios": { "cantidad": 45 }
}
```

#### `GET /ventas?periodo={dia|semana|mes}`
Obtiene estadísticas de ventas por período.

**Parámetros:**
- `periodo`: "dia", "semana", o "mes"

**Respuesta:**
```json
[
  {
    "fecha": "2024-10-22",
    "cantidadVentas": 8,
    "totalVentas": 245.75
  }
]
```

#### `GET /productos-top?limite={numero}`
Obtiene los productos más vendidos.

**Parámetros:**
- `limite`: número de productos a retornar (default: 10)

**Respuesta:**
```json
[
  {
    "nombre": "Alimento Premium para Perros",
    "idProducto": 1,
    "cantidadVentas": 15,
    "totalVentas": 389.85
  }
]
```

#### `GET /graficas?tipo={ventas|registros}&periodo={dia|semana|mes}`
Obtiene datos formateados para gráficas.

**Parámetros:**
- `tipo`: "ventas" o "registros"
- `periodo`: "dia", "semana", o "mes"

#### `GET /pdf?periodo={dia|semana|mes}`
Genera y descarga un reporte en PDF.

**Parámetros:**
- `periodo`: período del reporte

#### `POST /metrica`
Registra una nueva métrica en el sistema.

**Body:**
```json
{
  "tipo": "compra",
  "entidad": "producto",
  "entidadId": 1,
  "valor": 25.99,
  "metadatos": {
    "producto": "Alimento Premium",
    "cantidad": 1,
    "usuario": "cliente1"
  }
}
```

## Componentes Frontend

### `ReportesAdmin`
Componente principal que muestra:
- Tarjetas con métricas principales
- Gráficas de barras simples
- Tabla de productos más vendidos
- Selector de período
- Botón de descarga de PDF

### `MetricaCard`
Componente reutilizable para mostrar métricas individuales en formato de tarjeta.

### `GraficaSimple`
Componente que muestra gráficas de barras horizontales simples usando CSS.

## Tipos de Métricas

### `compra`
- **Propósito**: Registrar cada transacción de compra
- **Campos importantes**: valor (monto), entidadId (ID del producto)
- **Metadatos**: información del producto, cantidad, usuario

### `registro_usuario`
- **Propósito**: Registrar nuevos usuarios en el sistema
- **Campos importantes**: entidadId (ID del usuario)
- **Metadatos**: información básica del usuario

### `visita_producto`
- **Propósito**: Registrar visitas a páginas de productos
- **Campos importantes**: entidadId (ID del producto)
- **Metadatos**: duración de la visita, usuario

## Instalación y Configuración

### 1. Instalar dependencias del backend
```bash
cd backend
npm install pdfkit
```

### 2. Ejecutar scripts de base de datos
```sql
-- Ejecutar en orden:
source database_setup_clean.sql;
source database_reportes.sql;
source datos_prueba_reportes.sql;
```

### 3. Reiniciar el servidor backend
```bash
cd backend
npm run dev
```

## Uso del Sistema

### Para Administradores
1. Acceder al panel de administración
2. Hacer clic en la pestaña "Reportes"
3. Seleccionar el período deseado (día, semana, mes)
4. Visualizar las métricas y gráficas
5. Hacer clic en "Descargar PDF" para generar un reporte

### Para Desarrolladores
Para registrar nuevas métricas en el código:

```javascript
// Registrar una compra
await fetch('http://localhost:4000/api/reportes/metrica', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tipo: 'compra',
    entidad: 'producto',
    entidadId: productoId,
    valor: precio * cantidad,
    metadatos: {
      producto: nombreProducto,
      cantidad: cantidad,
      usuario: usuarioId
    }
  })
});
```

## Mejoras Futuras

1. **Gráficas más avanzadas**: Integrar Chart.js o similar
2. **Más tipos de métricas**: carritos abandonados, tiempo de sesión
3. **Filtros avanzados**: por categoría, rango de fechas personalizado
4. **Exportación**: Excel, CSV además de PDF
5. **Alertas**: notificaciones automáticas de métricas importantes
6. **Dashboard en tiempo real**: actualizaciones automáticas

## Troubleshooting

### Error: "Cannot find module 'pdfkit'"
```bash
cd backend
npm install pdfkit
```

### Error: "Table 'metricas' doesn't exist"
Ejecutar los scripts SQL en orden:
1. `database_setup_clean.sql`
2. `database_reportes.sql`
3. `datos_prueba_reportes.sql`

### PDF no se descarga
Verificar que:
- El backend esté ejecutándose en puerto 4000
- La ruta `/api/reportes/pdf` esté disponible
- El navegador permita descargas automáticas
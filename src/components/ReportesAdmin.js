"use client";
import React, { useState, useEffect } from 'react';

// Componente para mostrar métricas en tarjetas
function MetricaCard({ titulo, valor, icono, color = "bg-blue-500" }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{titulo}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{valor}</p>
        </div>
        <div className={`p-3 rounded-full ${color} text-white ml-4 flex-shrink-0`}>
          <span className="text-xl">{icono}</span>
        </div>
      </div>
    </div>
  );
}

// Componente para gráfica simple (barras ASCII para empezar)
function GraficaSimple({ datos, titulo }) {
  if (!datos || datos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{titulo}</h3>
        <p className="text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  const maxValor = Math.max(...datos.map(d => d.valor || d.cantidadVentas || 0));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{titulo}</h3>
      <div className="space-y-2">
        {datos.slice(0, 8).map((item, index) => {
          const valor = item.valor || item.cantidadVentas || 0;
          const porcentaje = maxValor > 0 ? (valor / maxValor) * 100 : 0;
          const etiqueta = item.etiqueta || item.fecha || item.nombre || `Item ${index + 1}`;
          
          return (
            <div key={index} className="flex items-center">
              <div className="w-20 text-xs text-gray-600 dark:text-gray-300 truncate mr-2">
                {etiqueta}
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-4 mr-2">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
              <div className="w-12 text-xs font-medium text-gray-700 dark:text-gray-300">
                {valor}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Componente principal de Reportes
function ReportesAdmin() {
  const [resumen, setResumen] = useState(null);
  const [ventasData, setVentasData] = useState([]);
  const [productosTop, setProductosTop] = useState([]);
  const [periodo, setPeriodo] = useState('mes');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos al montar el componente o cambiar el período
  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      // Cargar resumen general
      const resumenRes = await fetch('http://localhost:4000/api/reportes/resumen');
      if (resumenRes.ok) {
        const resumenData = await resumenRes.json();
        setResumen(resumenData);
      }

      // Cargar datos de ventas por período
      const ventasRes = await fetch(`http://localhost:4000/api/reportes/ventas?periodo=${periodo}`);
      if (ventasRes.ok) {
        const ventasData = await ventasRes.json();
        setVentasData(ventasData);
      }

      // Cargar productos más vendidos
      const productosRes = await fetch('http://localhost:4000/api/reportes/productos-top?limite=5');
      if (productosRes.ok) {
        const productosData = await productosRes.json();
        setProductosTop(productosData);
      }

    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos de reportes');
    } finally {
      setCargando(false);
    }
  };

  const descargarPDF = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/reportes/pdf?periodo=${periodo}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `reporte-${periodo}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Error al generar el PDF');
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al generar el reporte PDF');
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-300">Cargando reportes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes y Estadísticas</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Analiza el rendimiento de tu tienda</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
          <select 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="dia">Hoy</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mes</option>
          </select>
          <button 
            onClick={descargarPDF}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="flex items-center justify-center">
              <span className="material-symbols-outlined mr-2 text-sm">download</span>
              Descargar PDF
            </span>
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricaCard 
            titulo="Ventas Hoy" 
            valor={`${resumen.ventasHoy.cantidad} (S/ ${resumen.ventasHoy.total})`}
            icono="💰"
            color="bg-green-500"
          />
          <MetricaCard 
            titulo="Ventas Semana" 
            valor={`${resumen.ventasSemana.cantidad} (S/ ${resumen.ventasSemana.total})`}
            icono="📊"
            color="bg-blue-500"
          />
          <MetricaCard 
            titulo="Total Productos" 
            valor={resumen.totalProductos.cantidad}
            icono="📦"
            color="bg-purple-500"
          />
          <MetricaCard 
            titulo="Total Clientes" 
            valor={resumen.totalUsuarios.cantidad}
            icono="👥"
            color="bg-indigo-500"
          />
        </div>
      )}

      {/* Gráficas */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <GraficaSimple 
          datos={ventasData} 
          titulo={`Ventas por ${periodo === 'dia' ? 'Hora' : 'Día'}`}
        />
        <GraficaSimple 
          datos={productosTop} 
          titulo="Productos Más Vendidos"
        />
      </div>

      {/* Tabla de productos top */}
      {productosTop.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detalle de Productos Más Vendidos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cantidad Vendida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total Ventas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {productosTop.map((producto) => (
                  <tr key={producto.idProducto} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {producto.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {producto.cantidadVentas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      S/ {producto.totalVentas}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportesAdmin;
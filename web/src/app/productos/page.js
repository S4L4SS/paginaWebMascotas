"use client";
import { useState, useEffect } from 'react';
import { useCarrito } from '../../contexts/CarritoContext';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const { agregarProducto, obtenerCantidadProducto, estaEnCarrito } = useCarrito();
  
  // Estados para filtros avanzados
  const [ordenamiento, setOrdenamiento] = useState('alfabetico-asc');
  const [animalFiltro, setAnimalFiltro] = useState('todos');
  const [rangoPrecio, setRangoPrecio] = useState({ min: 0, max: 2500 });
  const [precioActual, setPrecioActual] = useState({ min: 0, max: 2500 });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/productos');
      const data = await res.json();
      setProductos(data);
      
      // Calcular rango de precios automáticamente
      if (data.length > 0) {
        const precios = data.map(p => parseFloat(p.precio || 0));
        const minPrecio = Math.min(...precios);
        const maxPrecio = Math.max(...precios);
        setRangoPrecio({ min: minPrecio, max: maxPrecio });
        setPrecioActual({ min: minPrecio, max: maxPrecio });
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para aplicar todos los filtros
  const aplicarFiltros = (productos) => {
    let productosFiltrados = [...productos];

    // Filtro por texto
    if (filtro) {
      productosFiltrados = productosFiltrados.filter(producto =>
        producto.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
        producto.descripcion?.toLowerCase().includes(filtro.toLowerCase())
      );
    }

    // Filtro por animal (preparado para cuando implementes la base de datos)
    if (animalFiltro !== 'todos') {
      // Por ahora usaremos palabras clave en nombre o descripción
      const keywords = {
        'perro': ['perro', 'canino', 'dog'],
        'gato': ['gato', 'felino', 'cat'],
        'ave': ['ave', 'pájaro', 'bird'],
        'otros': []
      };
      
      if (keywords[animalFiltro]) {
        productosFiltrados = productosFiltrados.filter(producto => {
          const texto = `${producto.nombre} ${producto.descripcion}`.toLowerCase();
          return keywords[animalFiltro].some(keyword => texto.includes(keyword));
        });
      }
    }

    // Filtro por rango de precio
    productosFiltrados = productosFiltrados.filter(producto => {
      const precio = parseFloat(producto.precio || 0);
      return precio >= precioActual.min && precio <= precioActual.max;
    });

    // Ordenamiento
    switch (ordenamiento) {
      case 'alfabetico-asc':
        productosFiltrados.sort((a, b) => a.nombre?.localeCompare(b.nombre) || 0);
        break;
      case 'alfabetico-desc':
        productosFiltrados.sort((a, b) => b.nombre?.localeCompare(a.nombre) || 0);
        break;
      case 'precio-asc':
        productosFiltrados.sort((a, b) => (parseFloat(a.precio) || 0) - (parseFloat(b.precio) || 0));
        break;
      case 'precio-desc':
        productosFiltrados.sort((a, b) => (parseFloat(b.precio) || 0) - (parseFloat(a.precio) || 0));
        break;
      default:
        break;
    }

    return productosFiltrados;
  };

  const productosFiltrados = aplicarFiltros(productos);

  // Función para agregar producto al carrito
  const manejarAgregarAlCarrito = (producto) => {
    const productoParaCarrito = {
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio || 0),
      imagen: producto.imagen || null,
      descripcion: producto.descripcion
    };
    
    agregarProducto(productoParaCarrito);
    
    // Mostrar notificación temporal
    const notificacion = document.createElement('div');
    notificacion.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
    notificacion.textContent = `${producto.nombre} agregado al carrito`;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
      notificacion.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notificacion)) {
          document.body.removeChild(notificacion);
        }
      }, 300);
    }, 2000);
  };

  const limpiarFiltros = () => {
    setFiltro('');
    setOrdenamiento('alfabetico-asc');
    setAnimalFiltro('todos');
    setPrecioActual(rangoPrecio);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Nuestros Productos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Encuentra todo lo que tu mascota necesita
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          {/* Barra de búsqueda */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 text-lg"
            />
          </div>

          {/* Filtros avanzados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ordenamiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ordenar por:
              </label>
              <select
                value={ordenamiento}
                onChange={(e) => setOrdenamiento(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="alfabetico-asc">Alfabético (A-Z)</option>
                <option value="alfabetico-desc">Alfabético (Z-A)</option>
                <option value="precio-asc">Precio (Menor a Mayor)</option>
                <option value="precio-desc">Precio (Mayor a Menor)</option>
              </select>
            </div>

            {/* Filtro por animal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de mascota:
              </label>
              <select
                value={animalFiltro}
                onChange={(e) => setAnimalFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="todos">Todas las mascotas</option>
                <option value="perro">🐕 Perros</option>
                <option value="gato">🐱 Gatos</option>
                <option value="ave">🐦 Aves</option>
                <option value="otros">🐹 Otros</option>
              </select>
            </div>

            {/* Botón limpiar filtros */}
            <div className="flex items-end">
              <button
                onClick={limpiarFiltros}
                className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>

          {/* Rango de precio */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rango de precio: S/.{precioActual.min} - S/.{precioActual.max}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Precio mínimo</label>
                <input
                  type="range"
                  min={rangoPrecio.min}
                  max={rangoPrecio.max}
                  value={precioActual.min}
                  onChange={(e) => setPrecioActual({...precioActual, min: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>S/.{rangoPrecio.min}</span>
                  <span>S/.{precioActual.min}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Precio máximo</label>
                <input
                  type="range"
                  min={rangoPrecio.min}
                  max={rangoPrecio.max}
                  value={precioActual.max}
                  onChange={(e) => setPrecioActual({...precioActual, max: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>S/.{precioActual.max}</span>
                  <span>S/.{rangoPrecio.max}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de filtros activos */}
          <div className="mt-4 flex flex-wrap gap-2">
            {filtro && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Búsqueda: "{filtro}"
              </span>
            )}
            {animalFiltro !== 'todos' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Mascota: {animalFiltro}
              </span>
            )}
            {(precioActual.min !== rangoPrecio.min || precioActual.max !== rangoPrecio.max) && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Precio: S/.{precioActual.min} - S/.{precioActual.max}
              </span>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {productosFiltrados.length === 0 
              ? 'No se encontraron productos'
              : `Mostrando ${productosFiltrados.length} de ${productos.length} productos`
            }
          </p>
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <span className="material-symbols-outlined text-6xl">pets</span>
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
              {filtro || animalFiltro !== 'todos' || precioActual.min !== rangoPrecio.min || precioActual.max !== rangoPrecio.max
                ? 'No se encontraron productos con los filtros aplicados'
                : 'No hay productos disponibles'
              }
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filtro || animalFiltro !== 'todos' || precioActual.min !== rangoPrecio.min || precioActual.max !== rangoPrecio.max
                ? 'Intenta ajustar los filtros para ver más resultados'
                : 'Los productos serán agregados por el administrador'
              }
            </p>
            {(filtro || animalFiltro !== 'todos' || precioActual.min !== rangoPrecio.min || precioActual.max !== rangoPrecio.max) && (
              <button
                onClick={limpiarFiltros}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <div key={producto.idProducto} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Imagen del producto */}
                <div className="aspect-w-1 aspect-h-1">
                  {producto.imagen ? (
                    (() => {
                      const src = typeof producto.imagen === 'string' && producto.imagen.startsWith('uploads/')
                        ? `http://localhost:4000/${producto.imagen}`
                        : (typeof producto.imagen === 'string' && (producto.imagen.startsWith('http://') || producto.imagen.startsWith('https://'))
                          ? producto.imagen
                          : `/${producto.imagen}`);
                      return (
                        <img
                          src={src}
                          alt={producto.nombre}
                          className="w-full h-48 object-cover"
                        />
                      );
                    })()
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-gray-400">pets</span>
                    </div>
                  )}
                </div>
                
                {/* Información del producto */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {producto.descripcion}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        S/.{producto.precio}
                      </span>
                      {producto.stock && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Stock: {producto.stock}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => manejarAgregarAlCarrito(producto)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                      {estaEnCarrito(producto.idProducto) 
                        ? `En carrito (${obtenerCantidadProducto(producto.idProducto)})` 
                        : 'Agregar'
                      }
                    </button>
                  </div>
                  
                  {producto.tallas && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tallas disponibles:</p>
                      <div className="flex gap-1 flex-wrap">
                        {producto.tallas.split(',').map((talla, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                            {talla.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
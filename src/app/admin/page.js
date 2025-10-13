"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";

// Componente principal del panel de administración
export default function AdminPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tab, setTab] = useState('productos');
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });
  const [usuario, setUsuario] = useState(null);

  // Verificar autenticación y cargar datos al inicializar
  useEffect(() => {
    // Verificar si el usuario es admin
    const userData = localStorage.getItem('usuario');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsuario(user);
        if (user.rol !== 'admin') {
          localStorage.removeItem('usuario'); // Limpiar datos inválidos
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        localStorage.removeItem('usuario'); // Limpiar datos corruptos
        router.push('/login');
        return;
      }
    } else {
      router.push('/login');
      return;
    }

    // Cargar productos
    fetch('http://localhost:4000/api/productos')
      .then(res => res.json())
      .then(setProductos)
      .catch(console.error);

    // Cargar usuarios
    fetch('http://localhost:4000/api/usuarios')
      .then(res => res.json())
      .then(setUsuarios)
      .catch(console.error);
  }, [router]);

  // Funciones para productos
  const handleChange = e => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:4000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    if (res.ok) {
      const prod = await res.json();
      setProductos([...productos, { ...nuevo, idProducto: prod.id }]);
      setNuevo({ nombre: '', descripcion: '', precio: '', stock: '' });
      setMostrarForm(false);
    }
  };

  const handleEdit = (producto) => {
    setEditando(producto.idProducto);
    setEditData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:4000/api/productos/${editando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    });
    if (res.ok) {
      setProductos(productos.map(p =>
        p.idProducto === editando ? { ...p, ...editData } : p
      ));
      setEditando(null);
      setEditData({ nombre: '', descripcion: '', precio: '', stock: '' });
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProductos(productos.filter(p => p.idProducto !== id));
      }
    }
  };

  // Funciones para usuarios
  const cambiarRol = async (id, rol) => {
    const res = await fetch(`http://localhost:4000/api/usuarios/${id}/rol`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol: rol === "admin" ? "cliente" : "admin" })
    });
    if (res.ok) {
      setUsuarios(usuarios.map(u => u.idUsuario === id ? { ...u, rol: rol === "admin" ? "cliente" : "admin" } : u));
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Mundo Mascotas" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center">
                  <span className="ml-3 text-xl font-bold text-orange-500">Mundo Mascotas</span>
                </div>
              </Link>
            </div>

            {/* Admin Profile Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">
                    admin_panel_settings
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {usuario?.usuario || 'Administrador'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Panel de Control
                  </p>
                </div>
                <button 
                  onClick={cerrarSesion}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Cerrar Sesión"
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setTab('productos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tab === 'productos'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center">
                <span className="material-symbols-outlined mr-2">inventory_2</span>
                Gestión de Productos
              </span>
            </button>
            <button
              onClick={() => setTab('usuarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tab === 'usuarios'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="flex items-center">
                <span className="material-symbols-outlined mr-2">group</span>
                Gestión de Usuarios
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {tab === 'productos' && (
          <div className="space-y-6">
            {/* Header con botón agregar */}
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Gestión de Productos
                </h1>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  Administra el catálogo completo de productos para mascotas
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => setMostrarForm(!mostrarForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  <span className="material-symbols-outlined mr-2">add</span>
                  {mostrarForm ? 'Cancelar' : 'Agregar Producto'}
                </button>
              </div>
            </div>

            {/* Formulario agregar producto */}
            {mostrarForm && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Nuevo Producto
                </h3>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nombre del Producto
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={nuevo.nombre}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Precio
                      </label>
                      <input
                        type="number"
                        name="precio"
                        value={nuevo.precio}
                        onChange={handleChange}
                        step="0.01"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={nuevo.descripcion}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={nuevo.stock}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setMostrarForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Guardar Producto
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tabla de productos */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Catálogo de Productos ({productos.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {productos.map((producto) => (
                      <tr key={producto.idProducto} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {producto.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                            {producto.descripcion}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ${parseFloat(producto.precio).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            producto.stock > 10 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : producto.stock > 0 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {producto.stock} unidades
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(producto)}
                              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                              title="Editar producto"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(producto.idProducto)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              title="Eliminar producto"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal editar producto */}
            {editando && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Editar Producto
                    </h3>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={editData.nombre}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Descripción
                        </label>
                        <textarea
                          name="descripcion"
                          value={editData.descripcion}
                          onChange={handleEditChange}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Precio
                        </label>
                        <input
                          type="number"
                          name="precio"
                          value={editData.precio}
                          onChange={handleEditChange}
                          step="0.01"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Stock
                        </label>
                        <input
                          type="number"
                          name="stock"
                          value={editData.stock}
                          onChange={handleEditChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setEditando(null)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          Actualizar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'usuarios' && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Gestión de Usuarios
              </h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                Administra los roles y permisos de los usuarios registrados
              </p>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Usuarios Registrados ({usuarios.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Correo Electrónico
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {usuarios.map((usuario) => (
                      <tr key={usuario.idUsuario} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">
                                person
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {usuario.usuario}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {usuario.correo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            usuario.rol === 'admin' 
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <button
                            onClick={() => cambiarRol(usuario.idUsuario, usuario.rol)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
                            title={`Cambiar a ${usuario.rol === 'admin' ? 'Cliente' : 'Administrador'}`}
                          >
                            <span className="material-symbols-outlined mr-1 text-sm">
                              {usuario.rol === 'admin' ? 'person_remove' : 'admin_panel_settings'}
                            </span>
                            {usuario.rol === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 Mundo Mascotas - Panel de Administración
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
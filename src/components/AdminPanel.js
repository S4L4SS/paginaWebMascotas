"use client";
import React, { useState, useEffect } from 'react';
import ReportesAdmin from './ReportesAdmin';

// Componente para la gestión de productos
function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });

  // Obtener productos al cargar
  React.useEffect(() => {
    fetch('http://localhost:4000/api/productos')
      .then(res => res.json())
      .then(setProductos);
  }, []);

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
    const res = await fetch(`http://localhost:4000/api/productos/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setProductos(productos.filter(p => p.idProducto !== id));
    }
  };

  return (
    <div>
      <p className="mb-4">Gestiona los productos del catálogo (CRUD).</p>
      <button className="btn-primary mb-4" onClick={() => setMostrarForm(!mostrarForm)}>
        {mostrarForm ? 'Cancelar' : 'Agregar nuevo producto'}
      </button>
      {mostrarForm && (
        <form className="mb-4" onSubmit={handleAdd}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={nuevo.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={nuevo.descripcion}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={nuevo.precio}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={nuevo.stock}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary w-full">Guardar</button>
        </form>
      )}
      <h3 className="font-bold mb-2 mt-6">Catálogo actual</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nombre</th>
            <th className="p-2">Descripción</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.idProducto} className="border-t">
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.descripcion}</td>
              <td className="p-2">${p.precio}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 flex gap-2">
                <button
                  className="btn-primary"
                  onClick={() => handleEdit(p)}
                  style={{ cursor: 'pointer' }}
                >
                  Editar
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(p.idProducto)}
                  style={{
                    backgroundColor: '#E53935',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    marginLeft: '8px'
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editando && (
        <form className="mt-6 p-4 border rounded bg-gray-50" onSubmit={handleUpdate}>
          <h4 className="font-bold mb-2">Editar producto</h4>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={editData.nombre}
            onChange={handleEditChange}
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={editData.descripcion}
            onChange={handleEditChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={editData.precio}
            onChange={handleEditChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="w-full mb-2 px-4 py-2 border rounded"
            value={editData.stock}
            onChange={handleEditChange}
            required
          />
          <button type="submit" className="btn-primary w-full">Actualizar</button>
          <button type="button" className="btn-secondary w-full mt-2" onClick={() => setEditando(null)}>Cancelar</button>
        </form>
      )}
    </div>
  );
}

// Componente para la gestión de usuarios y cambio de rol
function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/usuarios')
      .then(res => res.json())
      .then(setUsuarios);
  }, []);

  const cambiarRol = async (id, rol) => {
    await fetch(`http://localhost:4000/api/usuarios/${id}/rol`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rol: rol === "admin" ? "cliente" : "admin" })
    });
    setUsuarios(usuarios.map(u => u.idUsuario === id ? { ...u, rol: rol === "admin" ? "cliente" : "admin" } : u));
  };

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Usuario</th>
          <th className="p-2">Correo</th>
          <th className="p-2">Rol</th>
          <th className="p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map(u => (
          <tr key={u.idUsuario} className="border-t">
            <td className="p-2">{u.usuario}</td>
            <td className="p-2">{u.correo}</td>
            <td className="p-2">{u.rol}</td>
            <td className="p-2">
              <button className="btn-primary" onClick={() => cambiarRol(u.idUsuario, u.rol)}>
                Cambiar rol
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Panel principal con pestañas
function AdminPanel() {
  const [tab, setTab] = useState('productos');

  return (
    <section className="card max-w-4xl mx-auto mt-8 flex flex-col items-center">
      <h2 className="font-poppins text-xl font-bold text-primary mb-4 text-center">Panel de Administración</h2>
      <div className="flex mb-6 w-full justify-center">
        <button
          className={`flex-1 py-2 font-bold border-b-2 ${tab === 'productos' ? 'border-orange-400 text-orange-500' : 'border-gray-200 text-gray-500'}`}
          onClick={() => setTab('productos')}
        >Productos</button>
        <button
          className={`flex-1 py-2 font-bold border-b-2 ${tab === 'usuarios' ? 'border-orange-400 text-orange-500' : 'border-gray-200 text-gray-500'}`}
          onClick={() => setTab('usuarios')}
        >Usuarios</button>
        <button
          className={`flex-1 py-2 font-bold border-b-2 ${tab === 'reportes' ? 'border-orange-400 text-orange-500' : 'border-gray-200 text-gray-500'}`}
          onClick={() => setTab('reportes')}
        >Reportes</button>
      </div>
      <div className="w-full">
        {tab === 'productos' && (
          <ProductosAdmin />
        )}
        {tab === 'usuarios' && (
          <UsuariosAdmin />
        )}
        {tab === 'reportes' && (
          <ReportesAdmin />
        )}
      </div>
    </section>
  );
}

export default AdminPanel;
"use client";
import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/productos`)
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  return (
    <section className="flex flex-wrap justify-center gap-8 py-8">
      {productos.map((prod) => (
        <div key={prod.idProducto} className="card w-72">
          {prod.imagen ? (
            <img 
              src={`${API_URL}/${prod.imagen}`} 
              alt={prod.nombre} 
              className="w-full h-40 object-cover mb-4 rounded" 
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 mb-4 rounded flex items-center justify-center">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
          <h3 className="font-poppins text-lg font-bold text-primary mb-2">{prod.nombre}</h3>
          <p className="text-text mb-2">{prod.descripcion}</p>
          <p className="text-primary font-bold mb-2">S/ {prod.precio}</p>
          <p className="text-textSecondary mb-2">Stock: {prod.stock}</p>
          <button className="btn-primary w-full">Agregar al carrito</button>
        </div>
      ))}
    </section>
  );
};

export default Catalogo;

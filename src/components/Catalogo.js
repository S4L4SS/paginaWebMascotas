import React from 'react';

const productos = [
  {
    id: 1,
    nombre: 'Collar para perro',
    descripcion: 'Collar ajustable, resistente y cómodo.',
    precio: 25.99,
    stock: 10,
    imagen: '/public/file.svg',
    tallas: ['S', 'M', 'L'],
  },
  {
    id: 2,
    nombre: 'Juguete para gato',
    descripcion: 'Pelota interactiva para gatos.',
    precio: 15.5,
    stock: 20,
    imagen: '/public/globe.svg',
    tallas: ['Única'],
  },
];

const Catalogo = () => {
  return (
    <section className="flex flex-wrap justify-center gap-8 py-8">
      {productos.map((prod) => (
        <div key={prod.id} className="card w-72">
          <img src={prod.imagen} alt={prod.nombre} className="w-full h-40 object-contain mb-4" />
          <h3 className="font-poppins text-lg font-bold text-primary mb-2">{prod.nombre}</h3>
          <p className="text-text mb-2">{prod.descripcion}</p>
          <p className="text-primary font-bold mb-2">S/ {prod.precio}</p>
          <p className="text-textSecondary mb-2">Stock: {prod.stock}</p>
          <div className="mb-2">
            Tallas: {prod.tallas.join(', ')}
          </div>
          <button className="btn-primary w-full">Agregar al carrito</button>
        </div>
      ))}
    </section>
  );
};

export default Catalogo;

import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-poppins text-xl font-bold text-primary">MascotasShop</span>
      </div>
      <div className="flex gap-4">
        <a href="/" className="text-white hover:text-secondary">Inicio</a>
        <a href="/catalogo" className="text-white hover:text-secondary">Catálogo</a>
        <a href="/admin" className="text-white hover:text-secondary">Admin</a>
        <a href="/login" className="btn-primary">Ingresar</a>
      </div>
    </nav>
  );
};

export default Navbar;

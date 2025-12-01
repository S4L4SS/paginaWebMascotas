import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="font-poppins text-xl font-bold text-primary">MascotasShop</span>
      </div>
      <div className="flex gap-4">
        <Link href="/" className="text-white hover:text-secondary">Inicio</Link>
        <Link href="/catalogo" className="text-white hover:text-secondary">Catálogo</Link>
        <Link href="/admin" className="text-white hover:text-secondary">Admin</Link>
        <Link href="/login" className="btn-primary">Ingresar</Link>
      </div>
    </nav>
  );
};

export default Navbar;

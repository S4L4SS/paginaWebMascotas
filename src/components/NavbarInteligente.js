"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [usuario, setUsuario] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un usuario loggeado
    const usuarioGuardado = localStorage.getItem('usuario');
    const rolGuardado = localStorage.getItem('rol');
    
    if (usuarioGuardado && rolGuardado) {
      setUsuario({
        nombre: usuarioGuardado,
        rol: rolGuardado
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    setUsuario(null);
    setShowProfileMenu(false);
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-4 shadow-sm bg-white dark:bg-gray-900">
      {/* Logo */}
      <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
        <span className="material-symbols-outlined text-blue-500 text-3xl">pets</span>
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors">
            Mundo Mascotas🐶
          </h1>
        </Link>
      </div>

      {/* Botón hamburguesa (móvil) */}
      <button 
        className="md:hidden flex items-center justify-center p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span className="material-symbols-outlined text-3xl">menu</span>
      </button>

      {/* Navigation (Desktop) */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
          Inicio
        </Link>
        <Link href="/productos" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors">
          Productos
        </Link>
      </nav>

      {/* Botones del lado derecho */}
      <div className="hidden md:flex items-center gap-3">
        {/* Carrito */}
        <Link href="/carrito">
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="hidden sm:inline">Carrito</span>
          </button>
        </Link>

        {/* Usuario loggeado o botón de login */}
        {usuario ? (
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center rounded-full h-10 w-10 overflow-hidden cursor-pointer transition-transform hover:scale-105 border-2 border-blue-500"
            >
              <img 
                alt="Foto de perfil del usuario" 
                className="h-full w-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBii6We0KcWHNnBF_tMbqcFiUKAEv7HF5n4eiUdzcVp3F7CQ9O7fH4aP7MGRfjAx5cQFtrsGg6lrTpRvFZFWUqMyH7VVd5GGoDefDfmvUv_kTV8vVduPi06DW8hQPrUgYoe1sJDiYm66l_QORH_4BZuG223QMvo9sa-YTOR_R0sy8kvI1ps1JH4EObTOw6fhy-j_S5rLNEhx5T9DYJU6Bx2yjxy1j93i-LxyPOtCodcciMTGracDj-9SghwnTiHA8QXZsfjtBLqLU"
              />
            </button>
            
            {/* Menú del perfil */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{usuario.nombre}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{usuario.rol}</p>
                </div>
                <div className="py-2">
                  <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Editar Perfil
                  </Link>
                  {usuario.rol === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Panel Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              Iniciar Sesión
            </button>
          </Link>
        )}
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 md:hidden z-40">
          <nav className="flex flex-col p-4 space-y-2">
            <Link href="/" className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Inicio
            </Link>
            <Link href="/productos" className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Productos
            </Link>
            <Link href="/carrito" className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500">
              Carrito
            </Link>
            {usuario ? (
              <>
                <Link href="/perfil" className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500">
                  Perfil ({usuario.nombre})
                </Link>
                {usuario.rol === 'admin' && (
                  <Link href="/admin" className="py-2 text-gray-700 dark:text-gray-300 hover:text-blue-500">
                    Panel Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="py-2 text-left text-red-600 dark:text-red-400"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="py-2 text-blue-500 font-medium">
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
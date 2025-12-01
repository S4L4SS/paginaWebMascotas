"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCarrito } from '../contexts/CarritoContext';
import { API_URL } from '../config/api';

const Navbar = () => {
  const [usuario, setUsuario] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { cantidadTotal } = useCarrito();

  // Helper para obtener la URL correcta de la foto de perfil
  const obtenerUrlFotoPerfil = (fotoPerfil) => {
    if (!fotoPerfil || fotoPerfil === 'default-avatar.svg') {
      return null; // No hay foto, mostrar ícono por defecto
    }
    // Si ya es una URL completa (Cloudinary), devolverla tal cual
    if (fotoPerfil.startsWith('http://') || fotoPerfil.startsWith('https://')) {
      return fotoPerfil;
    }
    // Si es una ruta relativa (sistema antiguo), agregar el dominio
    return `${API_URL}${fotoPerfil}`;
  };

  useEffect(() => {
    // Verificar si hay un usuario loggeado
    const userData = localStorage.getItem('usuario');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUsuario({
          nombre: user.usuario,
          rol: user.rol,
          idUsuario: user.idUsuario,
          fotoPerfil: user.fotoPerfil || null
        });
        
        // Cargar datos actualizados del usuario desde la API
        if (user.idUsuario) {
          fetch(`${API_URL}/api/usuarios/${user.idUsuario}`)
            .then(res => res.json())
            .then(userData => {
              setUsuario({
                nombre: userData.usuario,
                rol: userData.rol,
                idUsuario: userData.idUsuario,
                fotoPerfil: userData.fotoPerfil || null
              });
              // Actualizar localStorage con los datos más recientes
              localStorage.setItem('usuario', JSON.stringify(userData));
            })
            .catch(error => console.error('Error al cargar datos del usuario:', error));
        }
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        localStorage.removeItem('usuario');
        setUsuario(null);
      }
    }
    
    // Escuchar evento de actualización de usuario
    const handleUserUpdate = (event) => {
      const updatedUser = event.detail;
      setUsuario({
        nombre: updatedUser.usuario,
        rol: updatedUser.rol,
        idUsuario: updatedUser.idUsuario,
        fotoPerfil: updatedUser.fotoPerfil || null
      });
    };
    
    window.addEventListener('userUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setShowProfileMenu(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  // Cerrar menús cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-container')) {
        setShowProfileMenu(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative navbar-container z-50">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-4 shadow-sm bg-white dark:bg-gray-900 relative z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
          <span className="material-symbols-outlined text-blue-500 text-3xl">pets</span>
          <Link href="/">
            <h1 className="text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors">
              Mundo Mascotas🐶
            </h1>
          </Link>
        </div>

        {/* Botón hamburguesa (solo en pantallas pequeñas) */}
        <button 
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors boton-hamburguesa"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          id="boton-menu-movil"
        >
          <span className="material-symbols-outlined text-3xl text-gray-700 dark:text-gray-300">
            {isMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors enlace-menu">
            Inicio
          </Link>
          <Link href="/productos" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors enlace-menu">
            Productos
          </Link>
        </nav>

        {/* Botones Desktop */}
        <div className="hidden md:flex items-center gap-4 botones-escritorio">
          <Link href="/carrito">
            <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors boton-carrito relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="texto-carrito">Carrito</span>
              {cantidadTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cantidadTotal}
                </span>
              )}
            </button>
          </Link>

          {usuario ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {obtenerUrlFotoPerfil(usuario.fotoPerfil) ? (
                    <img 
                      src={obtenerUrlFotoPerfil(usuario.fotoPerfil)}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-white text-sm">person</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{usuario.nombre}</span>
                <span className="material-symbols-outlined text-gray-500">expand_more</span>
              </button>

              {/* Dropdown del perfil */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-60">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mr-3 overflow-hidden">
                        {obtenerUrlFotoPerfil(usuario.fotoPerfil) ? (
                          <img 
                            src={obtenerUrlFotoPerfil(usuario.fotoPerfil)} 
                            alt="Foto de perfil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">person</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{usuario.nombre || usuario.usuario}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Rol: {usuario.rol}</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
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
              <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 text-sm font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors boton-sesion">
                <span className="iniciar-sesion">Iniciar Sesión</span>
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Menú móvil (se despliega hacia abajo como el index.html original) */}
      <div 
        className={`menu-movil md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg z-60 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
        id="mobile-menu"
      >
        <nav className="flex flex-col p-6 space-y-1 min-w-0 w-full">
          <Link 
            href="/" 
            className="flex items-center py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors enlace-menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="material-symbols-outlined mr-3">home</span>
            Inicio
          </Link>
          <Link 
            href="/productos" 
            className="flex items-center py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors enlace-menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="material-symbols-outlined mr-3">inventory_2</span>
            Productos
          </Link>
          <Link 
            href="/carrito" 
            className="flex items-center py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors relative"
            onClick={() => setIsMenuOpen(false)}
          >
            <button className="flex items-center w-full boton-carrito-movil">
              <span className="material-symbols-outlined mr-3">shopping_cart</span>
              Carrito
              {cantidadTotal > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cantidadTotal}
                </span>
              )}
            </button>
          </Link>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
            {usuario ? (
              <>
                <div className="flex items-center py-3 px-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    {obtenerUrlFotoPerfil(usuario.fotoPerfil) ? (
                      <img 
                        src={obtenerUrlFotoPerfil(usuario.fotoPerfil)} 
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-sm">person</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{usuario.nombre || usuario.usuario}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Rol: {usuario.rol}</p>
                  </div>
                </div>
                <Link 
                  href="/perfil" 
                  className="flex items-center py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="material-symbols-outlined mr-3">account_circle</span>
                  Editar Perfil
                </Link>
                {usuario.rol === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="flex items-center py-3 px-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="material-symbols-outlined mr-3">admin_panel_settings</span>
                    Panel Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full py-3 px-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                >
                  <span className="material-symbols-outlined mr-3">logout</span>
                  <span className="whitespace-nowrap">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center py-3 px-2 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors boton-sesion-movil"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="material-symbols-outlined mr-3">login</span>
                <span className="iniciar-sesion">Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
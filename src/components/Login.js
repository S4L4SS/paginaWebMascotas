"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({
    usuario: '',
    correo: '',
    contrasena: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:4000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data.user) {
        // Guardar toda la información del usuario como JSON
        localStorage.setItem('usuario', JSON.stringify(data.user));
        
        if (data.user.rol === 'admin') {
          window.location.replace('/admin');
        } else {
          window.location.replace('/');
        }
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();

      if (res.ok) {
        setError('');
        setShowRegister(false);
        setFormData({ usuario: registerData.usuario, contrasena: registerData.contrasena });
        // Opcional: auto-login después del registro
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Bienvenido a Mundo Mascotas
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Inicia sesión o crea una cuenta para empezar
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Botones de formulario */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setShowRegister(false)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                !showRegister
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                showRegister
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          {!showRegister ? (
            /* Formulario de Login */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  id="usuario"
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="contrasena"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Recordarme
                  </span>
                </label>
                <Link href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          ) : (
            /* Formulario de Registro */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label htmlFor="reg_usuario" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  id="reg_usuario"
                  value={registerData.usuario}
                  onChange={(e) => setRegisterData({ ...registerData, usuario: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  value={registerData.correo}
                  onChange={(e) => setRegisterData({ ...registerData, correo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="reg_contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="reg_contrasena"
                  value={registerData.contrasena}
                  onChange={(e) => setRegisterData({ ...registerData, contrasena: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

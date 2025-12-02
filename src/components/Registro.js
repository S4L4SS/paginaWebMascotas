
"use client";
import React, { useState } from 'react';
import { API_URL } from '../config/api';

const Registro = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    contrasena: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    fotoPerfil: null
  });
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Solo se permiten archivos de imagen (JPG, PNG, GIF)');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe superar los 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        fotoPerfil: file
      }));
      setError('');
    }
  };

  const validateForm = () => {
    const { usuario, correo, contrasena, nombre, apellido, fechaNacimiento } = formData;
    
    if (!usuario || !correo || !contrasena || !nombre || !apellido || !fechaNacimiento) {
      setError('Todos los campos marcados con * son obligatorios');
      return false;
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar fecha de nacimiento (debe ser mayor de edad)
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    if (edad < 18) {
      setError('Debes ser mayor de 18 años para registrarte');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setExito('');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Agregar todos los campos al FormData
      Object.keys(formData).forEach(key => {
        if (key === 'fotoPerfil' && formData[key]) {
          formDataToSend.append('fotoPerfil', formData[key]);
        } else if (key !== 'fotoPerfil') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const res = await fetch(`${API_URL}/api/usuarios/register`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();
      
      if (res.ok) {
        setExito('¡Registro exitoso! Ya puedes iniciar sesión');
        // Limpiar formulario
        setFormData({
          usuario: '',
          correo: '',
          contrasena: '',
          nombre: '',
          apellido: '',
          fechaNacimiento: '',
          fotoPerfil: null
        });
        setConfirmarContrasena('');
        
        if (onRegister) {
          onRegister(formData.usuario, formData.correo);
        }
      } else {
        setError(data.error || 'Error al registrar usuario');
        setExito('');
      }
    } catch (err) {
      console.error('Error de registro:', err);
      setError('Error de conexión al servidor');
      setExito('');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      {exito && (
        <div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded text-sm">
          {exito}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de Usuario *
          </label>
          <input
            type="text"
            name="usuario"
            placeholder="Ingresa tu nombre de usuario"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={formData.usuario}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Apellido *
            </label>
            <input
              type="text"
              name="apellido"
              placeholder="Tu apellido"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              value={formData.apellido}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Nacimiento *
          </label>
          <input
            type="date"
            name="fechaNacimiento"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            max={new Date(Date.now() - 567648000000).toISOString().split('T')[0]} // Máximo 18 años atrás
            required
          />
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correo Electrónico *
          </label>
          <input
            type="email"
            name="correo"
            placeholder="tu@email.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={formData.correo}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña *
          </label>
          <input
            type="password"
            name="contrasena"
            placeholder="Mínimo 6 caracteres"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={formData.contrasena}
            onChange={handleInputChange}
            minLength="6"
            required
          />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirmar Contraseña *
          </label>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            minLength="6"
            required
          />
        </div>

        {/* Foto de Perfil */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Foto de Perfil (Opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-100"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Formatos: JPG, PNG, GIF. Máximo 5MB
          </p>
        </div>

        {/* Botón de registro */}
        <button 
          type="submit" 
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {cargando ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Registrando...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>

        {/* Botón para volver al login con hover mejorado */}
        <div className="text-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => onRegister && onRegister(null, null)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 font-medium px-2 py-1 rounded-md hover:shadow-sm"
            >
              Inicia sesión
            </button>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Registro;

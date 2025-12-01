"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_URL } from '@/config/api';

const EditarPerfil = () => {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    usuario: '',
    correo: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: ''
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Verificar si hay usuario loggeado
    const userData = localStorage.getItem('usuario');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUsuario(user);
      setFormData({
        usuario: user.usuario || '',
        correo: user.correo || '',
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        fechaNacimiento: user.fechaNacimiento || ''
      });
      
      // Establecer imagen de perfil actual si existe
      if (user.fotoPerfil) {
        // Si es URL completa (Cloudinary), usarla directamente
        const imageUrl = (user.fotoPerfil.startsWith('http://') || user.fotoPerfil.startsWith('https://'))
          ? user.fotoPerfil
          : `${API_URL}${user.fotoPerfil}`;
        setPreviewImage(imageUrl);
      }
    } catch (error) {
      console.error('Error al parsear datos del usuario:', error);
      router.push('/login');
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      
      // Agregar datos del formulario
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Agregar imagen si existe
      if (fotoPerfil) {
        formDataToSend.append('fotoPerfil', fotoPerfil);
      }

      const response = await fetch(`${API_URL}/api/usuarios/${usuario.idUsuario}/perfil`, {
        method: 'PUT',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        // Actualizar localStorage con nuevos datos
        localStorage.setItem('usuario', JSON.stringify(result.user));
        setMessage('Perfil actualizado exitosamente');
        
        // Disparar evento personalizado para actualizar el navbar
        window.dispatchEvent(new CustomEvent('userUpdated', { 
          detail: result.user 
        }));
        
        // Opcional: redirigir después de un momento
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage(result.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Cargando...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Editar Perfil</h2>
              <Link 
                href="/"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="material-symbols-outlined">close</span>
              </Link>
            </div>
            
            {/* Foto de perfil */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div 
                  className="w-24 h-24 rounded-full bg-cover bg-center bg-gray-200 dark:bg-gray-600 flex items-center justify-center"
                  style={previewImage ? { backgroundImage: `url(${previewImage})` } : {}}
                >
                  {!previewImage && (
                    <span className="material-symbols-outlined text-4xl text-gray-400">person</span>
                  )}
                </div>
                <label 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  htmlFor="profile-picture-upload"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                </label>
                <input 
                  className="hidden" 
                  id="profile-picture-upload" 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Haz clic para cambiar tu foto
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="nombre">
                    Nombre
                  </label>
                  <input 
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="apellido">
                    Apellido
                  </label>
                  <input 
                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                    id="apellido"
                    name="apellido"
                    placeholder="Tu apellido"
                    type="text"
                    value={formData.apellido}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="usuario">
                  Usuario
                </label>
                <input 
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                  id="usuario"
                  name="usuario"
                  placeholder="Nombre de usuario"
                  type="text"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="correo">
                  Email
                </label>
                <input 
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                  id="correo"
                  name="correo"
                  placeholder="tu@email.com"
                  type="email"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="fechaNacimiento">
                  Fecha de Nacimiento
                </label>
                <input 
                  className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                />
              </div>

              {/* Mensaje de resultado */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('exitosamente') 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {message}
                </div>
              )}
            </form>
          </div>
          
          {/* Botones */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end items-center space-x-3 rounded-b-xl">
            <Link 
              href="/"
              className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-transparent hover:bg-blue-500/10 rounded-lg transition-colors"
            >
              Cancelar
            </Link>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              type="submit"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfil;
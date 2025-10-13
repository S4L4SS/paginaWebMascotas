"use client";
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:4000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
      });
      
      const data = await res.json();
      
      if (res.ok && data.user) {
        // Guarda el rol en localStorage
        localStorage.setItem('rol', data.user.rol);
        localStorage.setItem('usuario', data.user.usuario);
        localStorage.setItem('idUsuario', data.user.idUsuario);
        
        // Redirige automáticamente si es admin
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

  return (
    <form className="card max-w-md mx-auto mt-8 p-8" onSubmit={handleSubmit}>
      <h2 className="font-poppins text-xl font-bold text-primary mb-4">Iniciar Sesión</h2>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      <input
        type="text"
        placeholder="Usuario"
        className="w-full mb-3 px-4 py-2 border rounded text-gray-900"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full mb-3 px-4 py-2 border rounded text-gray-900"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
        required
      />
      <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
        {loading ? 'Ingresando...' : 'INGRESAR'}
      </button>
      <div className="mt-4">
        <a href="/registro" className="text-primary underline">¿No tienes cuenta? Regístrate</a>
      </div>
    </form>
  );
};

export default Login;


"use client";
import React, { useState } from 'react';

const Registro = ({ onRegister }) => {
  const [usuario, setUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario || !correo || !contrasena) {
      setError('Completa todos los campos');
      setExito('');
      return;
    }
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, correo, contrasena })
      });
      const data = await res.json();
      if (res.ok) {
        setExito('Registro exitoso, ahora puedes ingresar');
        if (onRegister) onRegister(usuario, correo);
      } else {
        setError(data.error || 'Error al registrar usuario');
        setExito('');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      setExito('');
    }
  };

  return (
    <form className="card max-w-sm mx-auto mt-8" onSubmit={handleSubmit}>
  <h2 className="font-poppins text-xl font-bold text-text mb-4">Registro de Usuario</h2>
      {error && <div className="text-error mb-2">{error}</div>}
      {exito && <div className="text-success mb-2">{exito}</div>}
      <input
        type="text"
        placeholder="Usuario"
        className="w-full mb-3 p-2 border rounded text-text"
        value={usuario}
        onChange={e => setUsuario(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        className="w-full mb-3 p-2 border rounded text-text"
        value={correo}
        onChange={e => setCorreo(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="w-full mb-3 p-2 border rounded text-text"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
      />
      <button type="submit" className="btn-primary w-full">Registrarse</button>
      <div className="mt-4 text-center">
        <a href="/login" className="text-textSecondary hover:text-hover">¿Ya tienes cuenta? Inicia sesión</a>
      </div>
    </form>
  );
};

export default Registro;

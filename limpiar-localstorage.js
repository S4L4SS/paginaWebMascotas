// Script para limpiar localStorage corrupto
// Ejecutar en la consola del navegador (F12 -> Console)

console.log('🧹 Limpiando localStorage...');

// Eliminar todas las claves relacionadas con usuario
localStorage.removeItem('usuario');
localStorage.removeItem('rol');
localStorage.removeItem('idUsuario');

console.log('✅ localStorage limpiado. Recarga la página.');

// Verificar que esté limpio
console.log('📊 Estado actual del localStorage:');
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
}
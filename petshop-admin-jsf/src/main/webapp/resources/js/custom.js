/**
 * Custom JavaScript para Mundo Mascotas🐶
 */

// Función para mostrar loading
function showLoading(message) {
    // Implementar si es necesario
    console.log('Loading:', message);
}

// Función para ocultar loading
function hideLoading() {
    console.log('Loading finished');
}

// Función helper para formatear precios
function formatPrice(price) {
    return 'S/. ' + parseFloat(price).toFixed(2);
}

// Inicialización cuando el documento está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mundo Mascotas🐶 - Custom JS loaded');
    
});

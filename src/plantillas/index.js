// Control del menú móvil
document.getElementById('boton-menu-movil').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});

// Control del carrusel de promociones
let currentSlide = 0;
const slider = document.getElementById('promo-slider');
const totalSlides = slider.children.length;

function moveSlide(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Cambio automático cada 5 segundos
setInterval(() => moveSlide(1), 5000);
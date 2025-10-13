document.addEventListener('DOMContentLoaded', () => {
  const hamburgerButton = document.getElementById('hamburger-button');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
});
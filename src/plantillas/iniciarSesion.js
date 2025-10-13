document.getElementById('boton-menu-movil').addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  const isOpen = !menu.classList.toggle('hidden');
  document.getElementById('boton-menu-movil').setAttribute('aria-expanded', isOpen);
});

document.getElementById('mostrar-inicio-sesion').addEventListener('click', () => {
  document.getElementById('formulario-inicio-sesion').classList.remove('hidden');
  document.getElementById('formulario-registro').classList.add('hidden');
  document.getElementById('mostrar-inicio-sesion').classList.add('boton-formulario-activo');
  document.getElementById('mostrar-registro').classList.remove('boton-formulario-activo');
});

document.getElementById('mostrar-registro').addEventListener('click', () => {
  document.getElementById('formulario-registro').classList.remove('hidden');
  document.getElementById('formulario-inicio-sesion').classList.add('hidden');
  document.getElementById('mostrar-registro').classList.add('boton-formulario-activo');
  document.getElementById('mostrar-inicio-sesion').classList.remove('boton-formulario-activo');
});

// Escuchar el envío del formulario de inicio de sesión
document.getElementById("formulario-inicio-sesion").addEventListener("submit", function(event) {
  event.preventDefault(); // Evita que se recargue la página

  const correo = document.getElementById("email-inicio").value;
  const clave = document.getElementById("contrasena-inicio").value;

  // Validar credenciales
  if (correo === "miguelo108@hotmail.com" && clave === "1234") {
    // Redirigir a página de usuario
    window.location.href = "indexLoggeado.html";
  } else if (correo === "admin123@gmail.com" && clave === "1234") {
    // Redirigir a página de administrador
    window.location.href = "ventanaAdmin.html";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

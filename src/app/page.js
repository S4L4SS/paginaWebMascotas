"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const promociones = [
    {
      id: 1,
      imagen: "https://www.petmarket.com.ar/wp-content/uploads/2025/03/250328-PM-Galicia-1.jpg",
      alt: "Promoción 1"
    },
    {
      id: 2,
      imagen: "https://assets.unlayer.com/projects/0/1756750837420-cc.jpg",
      alt: "Promoción 2"
    },
    {
      id: 3,
      imagen: "https://pharmivet.pe/modules/bonslick/views/img/97378ca23e698f2ae32a948b4f2b3c04a4eaa335_PharMiOferta%20Banner%20Hills-%20(1).webp",
      alt: "Promoción 3"
    }
  ];

  const productos = [
    {
      id: 1,
      titulo: "Alimento Premium para tu Mejor Amigo",
      descripcion: "Nutrición completa y balanceada para una vida sana y feliz.",
      imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjiEI7sYcdbkFkDEWCWsbrwzr0iwpYREGn6YGsFSZibpHqAcy39TD17Ak10kYXmkmIyM3Dc2CODwxCOn6GdsuEPAJrWzYODhPDpEI6I8pgtUlMG9fKMoCfRWh49KjkUdDUdIN4v8tZuz3S9J6dq-JzBH66IqEKCQnQwQyW07ArPH8za739zA8SiY-iRsCj29iw2SK3Th4lgQEl_pbYOwzBEDUulpDe-woCex2uWpA5PfE0VmkxOfNhPba_u5bjjeWRpxy1mJ38-LY"
    },
    {
      id: 2,
      titulo: "Juguetes Divertidos para Mantenerlos Activos",
      descripcion: "Horas de entretenimiento garantizado con nuestra selección de juguetes.",
      imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtLpxx0YMwGD-aUDG4ANAIBtZJYFSnErRE-a6PHgxoHDD2wuqFvOeE2dvIsRndFu46RttCCRvwSiY6o-4eM25izyhHYLGmq6Pptib0rfsoStA_VjBA9kNpq6-rmW2_GsZvH9w542C9IVvoaIGbV5LWJJfg7o4ctCxZrR607mB3ybMYSSBJOwG1e38PIyA01r2K3jREXseEm6UrpeT957MpD8hWmFuzOSXg5mqolJbd-XMcEHUo9nngkOFNkViDNmQbWYax7er4qNs"
    },
    {
      id: 3,
      titulo: "Camas Cómodas para un Descanso Reparador",
      descripcion: "El confort que tu mascota merece para recargar energías.",
      imagen: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYP2a_3WAX04gX75FGgZYHcVQO1TXNuDfEHccgoRePWQd3tI7mBcJKUsH_k5FdrHs4Jsv9Fcld4JdAac5nRU65cR4jOEzF0Q_R-S85QoumOdtml5PyBFOEHh4Xo_ulNFYpFb1Tg6Z-xOfmRiVxl_-mI-BfJMApHIsgTsqoS4lUhRcX-7vwua6Ngy7m12a57aVo6ZToJbkSXlWvtuIvavB8eq_AKlswNmxomIUUrWyljfpYIr-kZxAn1w"
    }
  ];

  const galeriaImagenes = [
    "https://plus.unsplash.com/premium_photo-1673710478948-fdf10d4bea0a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVycm8lMjB5JTIwZHVlJUMzJUIxb3xlbnwwfHwwfHx8MA%3D%3D",
    "https://cdn.aarp.net/content/dam/aarp/home-and-family/family-and-friends/2020/08/1140-karen-brescia-esp.jpg",
    "https://www.lavanguardia.com/files/og_thumbnail/uploads/2020/11/12/5fbb8ec7d18da.jpeg",
    "https://blog.auna.pe/hubfs/vinculo-entre-mascotas-y-duenos-salud.jpg",
    "https://www.ganador.com.gt/wp-content/uploads/2023/04/por_que_los_perros_se_parecen_a_sus_duenos.jpeg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promociones.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promociones.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promociones.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promociones.length) % promociones.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sección Principal */}
      <main className="pt-8">
        {/* Carrusel de Promociones */}
        <section className="mb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Productos y Ofertas de la Temporada
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Descubre lo mejor para tu compañero fiel
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {promociones.map((promo, index) => (
                    <div key={promo.id} className="w-full flex-shrink-0">
                      <img 
                        src={promo.imagen} 
                        alt={promo.alt}
                        className="w-full h-64 md:h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Botones de navegación */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                ❮
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              >
                ❯
              </button>
              
              {/* Indicadores */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {promociones.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Carrusel de Productos */}
        <section className="mb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map((producto) => (
                <div key={producto.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div 
                    className="w-full h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url("${producto.imagen}")` }}
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {producto.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {producto.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Galería de Mascotas Felices */}
        <section className="mb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Nuestra Galería de Mascotas Felices
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Mira a nuestros adorables clientes disfrutando de sus productos
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {galeriaImagenes.map((imagen, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={imagen}
                    alt={`Mascota feliz ${index + 1}`}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-blue-500 text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para hacer feliz a tu mascota?
            </h2>
            <p className="text-xl mb-8">
              Explora nuestro catálogo completo de productos de calidad
            </p>
            <Link href="/productos">
              <button className="bg-white text-blue-500 font-bold py-4 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors">
                Ver Todos los Productos
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Mundo Mascotas🐶</h3>
              <p className="text-gray-300">Tu tienda de confianza para el cuidado de mascotas.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-gray-300 mb-2">
                Email: <a href="mailto:contacto@mundomascotas.com" className="text-blue-400 hover:text-blue-300 transition-colors">contacto@mundomascotas.com</a>
              </p>
              <p className="text-gray-300">Teléfono: +123 456 7890</p>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="text-center mb-8">
            <div className="flex justify-center space-x-6">
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/tuPerfil" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>

              {/* Twitter/X */}
              <a 
                href="https://twitter.com/tuPerfil" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Twitter"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>

              {/* Instagram */}
              <a 
                href="https://www.instagram.com/tuPerfil" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.531 2.013 9.885 2 12.315 2zM12 8.118c-2.136 0-3.863 1.727-3.863 3.863s1.727 3.863 3.863 3.863 3.863-1.727 3.863-3.863S14.136 8.118 12 8.118zM12 14.148c-1.182 0-2.148-.966-2.148-2.148s.966-2.148 2.148-2.148 2.148.966 2.148 2.148-.966 2.148-2.148 2.148zm4.887-5.918a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-400">© 2024 Mundo Mascotas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

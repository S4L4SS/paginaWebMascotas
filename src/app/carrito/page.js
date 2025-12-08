'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCarrito } from '../../contexts/CarritoContext';

export default function Carrito() {
    const router = useRouter();
    const { 
        items: carrito, 
        cantidadTotal,
        subtotal,
        envio,
        total,
        actualizarCantidad,
        eliminarProducto,
        limpiarCarrito,
        procesarCompra
    } = useCarrito();
    
    const [metodoPago, setMetodoPago] = useState('tarjeta');
    const [datosTargeta, setDatosTargeta] = useState({
        numero: '',
        fechaVencimiento: '',
        cvv: '',
        titular: ''
    });
    const [cargandoCompra, setCargandoCompra] = useState(false);
    const [codigoGenerado, setCodigoGenerado] = useState(false);
    const [generandoCodigo, setGenerandoCodigo] = useState(false);
    const [mostrarQR, setMostrarQR] = useState(false);

    // Generar código QR para Yape o Plin
    const generarCodigoPago = () => {
        if (metodoPago !== 'yape' && metodoPago !== 'plin') {
            return;
        }

        setGenerandoCodigo(true);
        setCodigoGenerado(false);
        setMostrarQR(false);

        // Simular carga de 2 segundos
        setTimeout(() => {
            setGenerandoCodigo(false);
            setCodigoGenerado(true);
            setMostrarQR(true);
        }, 2000);
    };

    // Restablecer cuando cambia el método de pago
    const cambiarMetodoPago = (nuevoMetodo) => {
        setMetodoPago(nuevoMetodo);
        setCodigoGenerado(false);
        setGenerandoCodigo(false);
        setMostrarQR(false);
    };

    // Realizar compra
    const realizarCompra = async () => {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        // Validar para Yape o Plin que se haya generado el código
        if ((metodoPago === 'yape' || metodoPago === 'plin') && !codigoGenerado) {
            alert('No es posible procesar la compra. Por favor genera el código de pago primero.');
            return;
        }

        if (metodoPago === 'tarjeta') {
            if (!datosTargeta.numero || !datosTargeta.fechaVencimiento || !datosTargeta.cvv || !datosTargeta.titular) {
                alert('Por favor completa todos los datos de la tarjeta');
                return;
            }
        }

        setCargandoCompra(true);

        try {
            const resultado = await procesarCompra({ metodoPago });
            
            if (resultado.success) {
                alert(`¡Compra realizada exitosamente! 🎉\n\nTotal: S/${resultado.data.total.toFixed(2)}\nProductos: ${resultado.data.compras.length}`);
                router.push('/productos');
            } else {
                alert(`Error al procesar la compra: ${resultado.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error inesperado al procesar la compra. Intenta nuevamente.');
        } finally {
            setCargandoCompra(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark font-display">
            {/* Header */}
            <header className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold">Mundo Mascotas🐶</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botón regresar */}
                <div className="flex w-80 h-20 justify-between text-subtle-light dark:text-subtle-dark mb-6">
                    <button onClick={() => router.push('/productos')}>
                        <h4>← Regresar al catálogo</h4>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Lista de productos en el carrito */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold mb-6">Carrito de Compras</h2>
                        
                        {carrito.length === 0 ? (
                            <div className="bg-card-light dark:bg-card-dark rounded-lg p-8 text-center">
                                <p className="text-subtle-light dark:text-subtle-dark text-lg">
                                    Tu carrito está vacío
                                </p>
                                <button 
                                    onClick={() => router.push('/productos')}
                                    className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Ir a productos
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {carrito.map((item) => (
                                    <div key={item.idProducto} className="bg-card-light dark:bg-card-dark rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div 
                                                className="w-20 h-20 bg-cover bg-center rounded-lg bg-gray-300"
                                                style={{
                                                    backgroundImage: item.imagen 
                                                        ? `url(${item.imagen})` 
                                                        : 'url("https://via.placeholder.com/80x80?text=Producto")'
                                                }}
                                            ></div>
                                            <div>
                                                <h3 className="font-bold">{item.nombre}</h3>
                                                <p className="text-sm text-subtle-light dark:text-subtle-dark">
                                                    S/{item.precio.toFixed(2)}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button 
                                                        onClick={() => actualizarCantidad(item.idProducto, item.cantidad - 1)}
                                                        className="w-6 h-6 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-subtle-light dark:text-subtle-dark hover:bg-background-light dark:hover:bg-background-dark"
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.cantidad}</span>
                                                    <button 
                                                        onClick={() => actualizarCantidad(item.idProducto, item.cantidad + 1)}
                                                        className="w-6 h-6 rounded-full border border-border-light dark:border-border-dark flex items-center justify-center text-subtle-light dark:text-subtle-dark hover:bg-background-light dark:hover:bg-background-dark"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <p className="font-bold">S/{(item.precio * item.cantidad).toFixed(2)}</p>
                                            <button 
                                                onClick={() => eliminarProducto(item.idProducto)}
                                                className="text-subtle-light dark:text-subtle-dark hover:text-red-500"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Resumen del pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 space-y-6 sticky top-24">
                            <h3 className="text-xl font-bold">Resumen del Pedido</h3>
                            
                            {/* Totales */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-subtle-light dark:text-subtle-dark">
                                    <span>Subtotal</span>
                                    <span>S/{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-subtle-light dark:text-subtle-dark">
                                    <span>Envío</span>
                                    <span>S/{envio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t border-border-light dark:border-border-dark pt-2 mt-2">
                                    <span>Total</span>
                                    <span>S/{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Método de pago */}
                            <h3 className="text-xl font-bold pt-4">Método de Pago</h3>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 rounded-lg border p-3 cursor-pointer transition-colors ${
                                    metodoPago === 'tarjeta' 
                                        ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                                        : 'border-border-light dark:border-border-dark'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment-method" 
                                        value="tarjeta"
                                        checked={metodoPago === 'tarjeta'}
                                        onChange={(e) => cambiarMetodoPago(e.target.value)}
                                        className="form-radio h-5 w-5 text-primary focus:ring-primary/50"
                                    />
                                    <span className="font-medium">💳 Tarjeta</span>
                                </label>
                                <label className={`flex items-center gap-4 rounded-lg border p-3 cursor-pointer transition-colors ${
                                    metodoPago === 'yape' 
                                        ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                                        : 'border-border-light dark:border-border-dark'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment-method" 
                                        value="yape"
                                        checked={metodoPago === 'yape'}
                                        onChange={(e) => cambiarMetodoPago(e.target.value)}
                                        className="form-radio h-5 w-5 text-primary focus:ring-primary/50"
                                    />
                                    <span className="font-medium">📱 Yape</span>
                                </label>
                                <label className={`flex items-center gap-4 rounded-lg border p-3 cursor-pointer transition-colors ${
                                    metodoPago === 'plin' 
                                        ? 'border-primary bg-primary/10 dark:bg-primary/20' 
                                        : 'border-border-light dark:border-border-dark'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment-method" 
                                        value="plin"
                                        checked={metodoPago === 'plin'}
                                        onChange={(e) => cambiarMetodoPago(e.target.value)}
                                        className="form-radio h-5 w-5 text-primary focus:ring-primary/50"
                                    />
                                    <span className="font-medium">💰 Plin</span>
                                </label>
                            </div>

                            {/* Botón para generar código QR (Yape/Plin) */}
                            {(metodoPago === 'yape' || metodoPago === 'plin') && (
                                <div className="space-y-4">
                                    <button
                                        onClick={generarCodigoPago}
                                        disabled={generandoCodigo || codigoGenerado}
                                        className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold hover:from-purple-700 hover:to-purple-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {generandoCodigo ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Generando código...
                                            </>
                                        ) : codigoGenerado ? (
                                            <>
                                                <span className="material-symbols-outlined">check_circle</span>
                                                Código generado
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">qr_code_2</span>
                                                Generar código de pago
                                            </>
                                        )}
                                    </button>

                                    {/* Mostrar código QR */}
                                    {mostrarQR && (
                                        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-primary shadow-lg">
                                            <div className="text-center space-y-3">
                                                <p className="font-bold text-gray-800 dark:text-gray-200">
                                                    Escanea el código {metodoPago === 'yape' ? 'Yape' : 'Plin'}
                                                </p>
                                                <div className="flex justify-center">
                                                    <Image 
                                                        src={metodoPago === 'yape' ? '/Imagen1.png' : '/Imagen2.png'}
                                                        alt={`Código QR ${metodoPago}`}
                                                        width={192}
                                                        height={192}
                                                        className="w-48 h-48 rounded-lg"
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Total a pagar: <span className="font-bold text-primary">S/{total.toFixed(2)}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                                    Una vez realizado el pago, presiona &#34;Realizar Compra&#34;
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Formulario de tarjeta (solo si se selecciona tarjeta) */}
                            {metodoPago === 'tarjeta' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="card-number">
                                            Número de Tarjeta
                                        </label>
                                        <input 
                                            type="text" 
                                            id="card-number"
                                            value={datosTargeta.numero}
                                            onChange={(e) => setDatosTargeta({...datosTargeta, numero: e.target.value})}
                                            placeholder="**** **** **** ****"
                                            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="expiry-date">
                                                Fecha de Caducidad
                                            </label>
                                            <input 
                                                type="text" 
                                                id="expiry-date"
                                                value={datosTargeta.fechaVencimiento}
                                                onChange={(e) => setDatosTargeta({...datosTargeta, fechaVencimiento: e.target.value})}
                                                placeholder="MM/AA"
                                                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1" htmlFor="cvv">
                                                CVV
                                            </label>
                                            <input 
                                                type="text" 
                                                id="cvv"
                                                value={datosTargeta.cvv}
                                                onChange={(e) => setDatosTargeta({...datosTargeta, cvv: e.target.value})}
                                                placeholder="123"
                                                className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="card-holder">
                                            Nombre del Titular
                                        </label>
                                        <input 
                                            type="text" 
                                            id="card-holder"
                                            value={datosTargeta.titular}
                                            onChange={(e) => setDatosTargeta({...datosTargeta, titular: e.target.value})}
                                            placeholder="Nombre como aparece en la tarjeta"
                                            className="w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-2 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="space-y-3 pt-4">
                                <button 
                                    onClick={realizarCompra}
                                    disabled={carrito.length === 0 || cargandoCompra}
                                    className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {cargandoCompra ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        'Realizar Compra'
                                    )}
                                </button>
                                <button 
                                    onClick={limpiarCarrito}
                                    disabled={cargandoCompra}
                                    className="w-full h-12 rounded-lg bg-background-light dark:bg-card-dark border border-border-light dark:border-border-dark font-bold text-base hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Limpiar Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
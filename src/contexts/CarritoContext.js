'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { API_URL } from '../config/api';

// Tipos de acciones para el carrito
const CARRITO_ACTIONS = {
    CARGAR_CARRITO: 'CARGAR_CARRITO',
    AGREGAR_PRODUCTO: 'AGREGAR_PRODUCTO',
    ACTUALIZAR_CANTIDAD: 'ACTUALIZAR_CANTIDAD',
    ELIMINAR_PRODUCTO: 'ELIMINAR_PRODUCTO',
    LIMPIAR_CARRITO: 'LIMPIAR_CARRITO'
};

// Estado inicial del carrito
const estadoInicial = {
    items: [],
    cantidadTotal: 0,
    subtotal: 0,
    envio: 0,
    total: 0
};

// Reducer para manejar las acciones del carrito
const carritoReducer = (estado, accion) => {
    switch (accion.type) {
        case CARRITO_ACTIONS.CARGAR_CARRITO:
            return calcularTotales({ ...estado, items: accion.payload });

        case CARRITO_ACTIONS.AGREGAR_PRODUCTO:
            const productoExistente = estado.items.find(item => item.idProducto === accion.payload.idProducto);
            
            let nuevosItems;
            if (productoExistente) {
                // Si el producto ya existe, incrementar cantidad
                nuevosItems = estado.items.map(item =>
                    item.idProducto === accion.payload.idProducto
                        ? { ...item, cantidad: item.cantidad + (accion.payload.cantidad || 1) }
                        : item
                );
            } else {
                // Si es un producto nuevo, agregarlo
                nuevosItems = [...estado.items, { ...accion.payload, cantidad: accion.payload.cantidad || 1 }];
            }
            
            return calcularTotales({ ...estado, items: nuevosItems });

        case CARRITO_ACTIONS.ACTUALIZAR_CANTIDAD:
            const itemsActualizados = estado.items.map(item =>
                item.idProducto === accion.payload.idProducto
                    ? { ...item, cantidad: accion.payload.cantidad }
                    : item
            ).filter(item => item.cantidad > 0); // Eliminar items con cantidad 0
            
            return calcularTotales({ ...estado, items: itemsActualizados });

        case CARRITO_ACTIONS.ELIMINAR_PRODUCTO:
            const itemsFiltrados = estado.items.filter(item => item.idProducto !== accion.payload);
            return calcularTotales({ ...estado, items: itemsFiltrados });

        case CARRITO_ACTIONS.LIMPIAR_CARRITO:
            return { ...estadoInicial };

        default:
            return estado;
    }
};

// Función para calcular totales
const calcularTotales = (estado) => {
    const cantidadTotal = estado.items.reduce((total, item) => total + item.cantidad, 0);
    const subtotal = estado.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 ? 10.00 : 0; // Envío fijo de S/10.00 si hay productos
    const total = subtotal + envio;

    return {
        ...estado,
        cantidadTotal,
        subtotal,
        envio,
        total
    };
};

// Crear contexto
const CarritoContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCarrito = () => {
    const context = useContext(CarritoContext);
    if (!context) {
        throw new Error('useCarrito debe ser usado dentro de CarritoProvider');
    }
    return context;
};

// Proveedor del contexto del carrito
export const CarritoProvider = ({ children }) => {
    const [estado, dispatch] = useReducer(carritoReducer, estadoInicial);

    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const carritoGuardado = localStorage.getItem('carrito');
            if (carritoGuardado) {
                try {
                    const items = JSON.parse(carritoGuardado);
                    dispatch({ type: CARRITO_ACTIONS.CARGAR_CARRITO, payload: items });
                } catch (error) {
                    console.error('Error al cargar carrito desde localStorage:', error);
                    localStorage.removeItem('carrito');
                }
            }
        }
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('carrito', JSON.stringify(estado.items));
        }
    }, [estado.items]);

    // Funciones para manejar el carrito
    const agregarProducto = (producto) => {
        dispatch({ type: CARRITO_ACTIONS.AGREGAR_PRODUCTO, payload: producto });
    };

    const actualizarCantidad = (idProducto, cantidad) => {
        if (cantidad <= 0) {
            eliminarProducto(idProducto);
        } else {
            dispatch({ type: CARRITO_ACTIONS.ACTUALIZAR_CANTIDAD, payload: { idProducto, cantidad } });
        }
    };

    const eliminarProducto = (idProducto) => {
        dispatch({ type: CARRITO_ACTIONS.ELIMINAR_PRODUCTO, payload: idProducto });
    };

    const limpiarCarrito = () => {
        dispatch({ type: CARRITO_ACTIONS.LIMPIAR_CARRITO });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('carrito');
        }
    };

    // Función para procesar compra
    const procesarCompra = async (datosCompra) => {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            if (!usuario || !usuario.idUsuario) {
                throw new Error('Usuario no autenticado');
            }

            const compraData = {
                idUsuario: usuario.idUsuario,
                items: estado.items,
                total: estado.total,
                metodoPago: datosCompra.metodoPago || 'tarjeta'
            };

            const response = await fetch(`${API_URL}/api/compras/procesar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(compraData)
            });

            const resultado = await response.json();

            if (!response.ok) {
                throw new Error(resultado.details || resultado.error || 'Error al procesar compra');
            }

            // Si la compra fue exitosa, limpiar el carrito
            limpiarCarrito();
            
            return {
                success: true,
                data: resultado
            };

        } catch (error) {
            console.error('Error al procesar compra:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    const obtenerCantidadProducto = (idProducto) => {
        const item = estado.items.find(item => item.idProducto === idProducto);
        return item ? item.cantidad : 0;
    };

    const estaEnCarrito = (idProducto) => {
        return estado.items.some(item => item.idProducto === idProducto);
    };

    const valor = {
        // Estado
        items: estado.items,
        cantidadTotal: estado.cantidadTotal,
        subtotal: estado.subtotal,
        envio: estado.envio,
        total: estado.total,
        
        // Funciones
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        limpiarCarrito,
        procesarCompra,
        obtenerCantidadProducto,
        estaEnCarrito
    };

    return (
        <CarritoContext.Provider value={valor}>
            {children}
        </CarritoContext.Provider>
    );
};

export default CarritoContext;
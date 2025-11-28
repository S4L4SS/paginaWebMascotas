package com.petshop.facade;

import com.petshop.dao.ProductoDAO;
import com.petshop.dto.ProductoDTO;
import com.petshop.model.Producto;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Facade para operaciones de Producto
 * Patrón Facade - Proporciona una interfaz simplificada para operaciones complejas
 * Maneja la conversión entre Producto y ProductoDTO
 */
public class ProductoFacade {
    
    private ProductoDAO productoDAO;
    
    public ProductoFacade() {
        this.productoDAO = new ProductoDAO();
    }
    
    /**
     * Obtener todos los productos como DTOs
     */
    public List<ProductoDTO> obtenerTodosLosProductos() {
        try {
            List<Producto> productos = productoDAO.findAll();
            return productos.stream()
                    .map(ProductoDTO::new)
                    .collect(Collectors.toList());
        } catch (SQLException e) {
            System.err.println("Error al obtener productos: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Obtener producto por ID como DTO
     */
    public ProductoDTO obtenerProductoPorId(Integer id) {
        try {
            Producto producto = productoDAO.findById(id);
            return producto != null ? new ProductoDTO(producto) : null;
        } catch (SQLException e) {
            System.err.println("Error al obtener producto: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Buscar productos por nombre
     */
    public List<ProductoDTO> buscarProductosPorNombre(String nombre) {
        try {
            List<Producto> productos = productoDAO.findByNombre(nombre);
            return productos.stream()
                    .map(ProductoDTO::new)
                    .collect(Collectors.toList());
        } catch (SQLException e) {
            System.err.println("Error al buscar productos: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Crear nuevo producto desde DTO
     */
    public boolean crearProducto(ProductoDTO productoDTO) {
        try {
            Producto producto = productoDTO.toEntity();
            Integer id = productoDAO.create(producto);
            if (id != null && id > 0) {
                productoDTO.setIdProducto(id);
                return true;
            }
            return false;
        } catch (SQLException e) {
            System.err.println("Error al crear producto: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Actualizar producto desde DTO
     */
    public boolean actualizarProducto(ProductoDTO productoDTO) {
        try {
            Producto producto = productoDTO.toEntity();
            return productoDAO.update(producto);
        } catch (SQLException e) {
            System.err.println("Error al actualizar producto: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Eliminar producto por ID
     */
    public boolean eliminarProducto(Integer id) {
        try {
            return productoDAO.delete(id);
        } catch (SQLException e) {
            System.err.println("Error al eliminar producto: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Actualizar solo el stock de un producto
     */
    public boolean actualizarStock(Integer id, Integer nuevoStock) {
        try {
            System.out.println("🔄 ProductoFacade.actualizarStock() - ID: " + id + ", Nuevo stock: " + nuevoStock);
            boolean resultado = productoDAO.updateStock(id, nuevoStock);
            System.out.println(resultado ? "✅ Stock actualizado en Facade" : "❌ No se actualizó el stock en Facade");
            return resultado;
        } catch (SQLException e) {
            System.err.println("❌ Error al actualizar stock en Facade: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Obtener cantidad total de productos
     */
    public int contarProductos() {
        try {
            return productoDAO.count();
        } catch (SQLException e) {
            System.err.println("Error al contar productos: " + e.getMessage());
            return 0;
        }
    }
    
    /**
     * Obtener productos con stock bajo
     */
    public List<ProductoDTO> obtenerProductosStockBajo() {
        try {
            List<Producto> productos = productoDAO.findProductosStockBajo();
            return productos.stream()
                    .map(ProductoDTO::new)
                    .collect(Collectors.toList());
        } catch (SQLException e) {
            System.err.println("Error al obtener productos con stock bajo: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    /**
     * Validar datos del producto antes de guardar
     */
    public String validarProducto(ProductoDTO producto) {
        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
            return "El nombre del producto es obligatorio";
        }
        if (producto.getNombre().length() < 3) {
            return "El nombre debe tener al menos 3 caracteres";
        }
        if (producto.getPrecio() == null || producto.getPrecio() <= 0) {
            return "El precio debe ser mayor a 0";
        }
        if (producto.getStock() != null && producto.getStock() < 0) {
            return "El stock no puede ser negativo";
        }
        return null; // Sin errores
    }
}

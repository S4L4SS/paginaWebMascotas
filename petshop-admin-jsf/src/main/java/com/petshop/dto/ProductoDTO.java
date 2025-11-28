package com.petshop.dto;

import com.petshop.model.Producto;
import java.io.Serializable;

/**
 * Data Transfer Object para Producto
 * Patrón DTO para transferir datos entre capas sin exponer el modelo completo
 */
public class ProductoDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private Integer idProducto;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String imagen;
    private String estadoStock;
    
    // Constructor vacío
    public ProductoDTO() {
    }
    
    // Constructor desde entidad Producto
    public ProductoDTO(Producto producto) {
        if (producto != null) {
            this.idProducto = producto.getIdProducto();
            this.nombre = producto.getNombre();
            this.descripcion = producto.getDescripcion();
            this.precio = producto.getPrecio();
            this.stock = producto.getStock();
            this.imagen = producto.getImagen();
            this.estadoStock = producto.getEstadoStock();
        }
    }
    
    // Constructor completo
    public ProductoDTO(Integer idProducto, String nombre, String descripcion,
                      Double precio, Integer stock, String imagen) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
        this.estadoStock = calcularEstadoStock();
    }
    
    /**
     * Convierte DTO a entidad Producto
     */
    public Producto toEntity() {
        return new Producto(idProducto, nombre, descripcion, precio, stock, imagen);
    }
    
    /**
     * Calcula el estado del stock
     */
    private String calcularEstadoStock() {
        if (stock == null || stock == 0) return "Sin stock";
        if (stock < 10) return "Stock bajo";
        return "Disponible";
    }
    
    // Getters y Setters
    public Integer getIdProducto() {
        return idProducto;
    }
    
    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public Double getPrecio() {
        return precio;
    }
    
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
        this.estadoStock = calcularEstadoStock();
    }
    
    public String getImagen() {
        return imagen;
    }
    
    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
    
    public String getEstadoStock() {
        return estadoStock;
    }
    
    public void setEstadoStock(String estadoStock) {
        this.estadoStock = estadoStock;
    }
    
    @Override
    public String toString() {
        return "ProductoDTO{" +
                "idProducto=" + idProducto +
                ", nombre='" + nombre + '\'' +
                ", precio=" + precio +
                ", stock=" + stock +
                ", estadoStock='" + estadoStock + '\'' +
                '}';
    }
}

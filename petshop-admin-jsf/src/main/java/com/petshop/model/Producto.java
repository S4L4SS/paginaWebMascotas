package com.petshop.model;

import java.io.Serializable;
import javax.validation.constraints.*;

/**
 * Modelo de dominio: Producto
 * Representa la entidad Producto en la base de datos
 */
public class Producto implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private Integer idProducto;
    
    @NotNull(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;
    
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private Double precio;
    
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    private String imagen;
    
    // Constructores
    public Producto() {
    }
    
    public Producto(String nombre, String descripcion, Double precio, Integer stock) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
    }
    
    public Producto(Integer idProducto, String nombre, String descripcion, 
                   Double precio, Integer stock, String imagen) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
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
    }
    
    public String getImagen() {
        return imagen;
    }
    
    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
    
    // Métodos de utilidad
    public boolean tieneStock() {
        return stock != null && stock > 0;
    }
    
    public String getEstadoStock() {
        if (stock == null || stock == 0) return "Sin stock";
        if (stock < 10) return "Stock bajo";
        return "Disponible";
    }
    
    @Override
    public String toString() {
        return "Producto{" +
                "idProducto=" + idProducto +
                ", nombre='" + nombre + '\'' +
                ", precio=" + precio +
                ", stock=" + stock +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Producto)) return false;
        Producto producto = (Producto) o;
        return idProducto != null && idProducto.equals(producto.idProducto);
    }
    
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}

package com.petshop.dao;

import com.petshop.config.DBConnection;
import com.petshop.model.Producto;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object para Producto
 * Patrón DAO - Maneja todas las operaciones CRUD con la base de datos
 */
public class ProductoDAO {
    
    private Connection connection;
    
    public ProductoDAO() {
        this.connection = DBConnection.getInstance().getConnection();
    }
    
    /**
     * Obtener todos los productos
     */
    public List<Producto> findAll() throws SQLException {
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT * FROM producto ORDER BY nombre";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                productos.add(extractProductoFromResultSet(rs));
            }
        }
        return productos;
    }
    
    /**
     * Buscar producto por ID
     */
    public Producto findById(Integer id) throws SQLException {
        String sql = "SELECT * FROM producto WHERE idProducto = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return extractProductoFromResultSet(rs);
                }
            }
        }
        return null;
    }
    
    /**
     * Buscar productos por nombre (búsqueda parcial)
     */
    public List<Producto> findByNombre(String nombre) throws SQLException {
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT * FROM producto WHERE nombre LIKE ? ORDER BY nombre";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, "%" + nombre + "%");
            
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    productos.add(extractProductoFromResultSet(rs));
                }
            }
        }
        return productos;
    }
    
    /**
     * Crear nuevo producto
     */
    public Integer create(Producto producto) throws SQLException {
        String sql = "INSERT INTO producto (nombre, descripcion, precio, stock, imagen) " +
                    "VALUES (?, ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql, 
                Statement.RETURN_GENERATED_KEYS)) {
            
            setProductoParameters(pstmt, producto);
            
            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Error al crear producto, no se insertaron filas");
            }
            
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                } else {
                    throw new SQLException("Error al obtener ID del producto creado");
                }
            }
        }
    }
    
    /**
     * Actualizar producto existente
     */
    public boolean update(Producto producto) throws SQLException {
        String sql = "UPDATE producto SET nombre = ?, descripcion = ?, " +
                    "precio = ?, stock = ?, imagen = ? WHERE idProducto = ?";
        
        System.out.println("📝 Ejecutando UPDATE en BD - ID: " + producto.getIdProducto() + 
                          ", Nombre: " + producto.getNombre() + ", Stock: " + producto.getStock());
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            setProductoParameters(pstmt, producto);
            pstmt.setInt(6, producto.getIdProducto());
            
            int affectedRows = pstmt.executeUpdate();
            
            // Asegurar el commit si autocommit está desactivado
            if (!connection.getAutoCommit()) {
                connection.commit();
                System.out.println("✅ Commit ejecutado manualmente");
            }
            
            System.out.println("✅ UPDATE exitoso - Filas afectadas: " + affectedRows);
            return affectedRows > 0;
        } catch (SQLException e) {
            // Hacer rollback en caso de error
            if (!connection.getAutoCommit()) {
                connection.rollback();
                System.err.println("❌ Rollback ejecutado por error");
            }
            System.err.println("❌ Error en UPDATE: " + e.getMessage());
            throw e;
        }
    }
    
    /**
     * Eliminar producto por ID
     */
    public boolean delete(Integer id) throws SQLException {
        String sql = "DELETE FROM producto WHERE idProducto = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
        }
    }
    
    /**
     * Actualizar stock de un producto
     */
    public boolean updateStock(Integer id, Integer nuevoStock) throws SQLException {
        String sql = "UPDATE producto SET stock = ? WHERE idProducto = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, nuevoStock);
            pstmt.setInt(2, id);
            
            int affectedRows = pstmt.executeUpdate();
            
            // Asegurar el commit si autocommit está desactivado
            if (!connection.getAutoCommit()) {
                connection.commit();
            }
            
            System.out.println("✓ Stock actualizado en BD - ID: " + id + ", Nuevo stock: " + nuevoStock + ", Filas afectadas: " + affectedRows);
            return affectedRows > 0;
        } catch (SQLException e) {
            // Hacer rollback en caso de error
            if (!connection.getAutoCommit()) {
                connection.rollback();
            }
            System.err.println("✗ Error al actualizar stock: " + e.getMessage());
            throw e;
        }
    }
    
    /**
     * Contar total de productos
     */
    public int count() throws SQLException {
        String sql = "SELECT COUNT(*) FROM producto";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
        return 0;
    }
    
    /**
     * Obtener productos con stock bajo (menos de 10)
     */
    public List<Producto> findProductosStockBajo() throws SQLException {
        List<Producto> productos = new ArrayList<>();
        String sql = "SELECT * FROM producto WHERE stock < 10 ORDER BY stock ASC";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                productos.add(extractProductoFromResultSet(rs));
            }
        }
        return productos;
    }
    
    // Métodos auxiliares privados
    
    /**
     * Extrae un objeto Producto desde un ResultSet
     */
    private Producto extractProductoFromResultSet(ResultSet rs) throws SQLException {
        return new Producto(
            rs.getInt("idProducto"),
            rs.getString("nombre"),
            rs.getString("descripcion"),
            rs.getDouble("precio"),
            rs.getInt("stock"),
            rs.getString("imagen")
        );
    }
    
    /**
     * Establece los parámetros de un PreparedStatement desde un Producto
     */
    private void setProductoParameters(PreparedStatement pstmt, Producto producto) 
            throws SQLException {
        pstmt.setString(1, producto.getNombre());
        pstmt.setString(2, producto.getDescripcion());
        pstmt.setDouble(3, producto.getPrecio());
        pstmt.setInt(4, producto.getStock() != null ? producto.getStock() : 0);
        pstmt.setString(5, producto.getImagen());
    }
}

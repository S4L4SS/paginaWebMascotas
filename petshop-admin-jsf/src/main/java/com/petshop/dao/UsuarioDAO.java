package com.petshop.dao;

import com.petshop.config.DBConnection;
import com.petshop.model.Usuario;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object para Usuario
 * Maneja todas las operaciones CRUD con la base de datos de usuarios
 */
public class UsuarioDAO {
    
    private Connection connection;
    
    public UsuarioDAO() {
        this.connection = DBConnection.getInstance().getConnection();
    }
    
    /**
     * Autenticar usuario - verifica usuario y contraseña
     * @param username nombre de usuario
     * @param password contraseña
     * @return Usuario si las credenciales son correctas, null en caso contrario
     */
    public Usuario autenticar(String username, String password) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE usuario = ? AND contrasena = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, password);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return extractUsuarioFromResultSet(rs);
                }
            }
        }
        return null;
    }
    
    /**
     * Buscar usuario por ID
     */
    public Usuario findById(Integer id) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE idUsuario = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return extractUsuarioFromResultSet(rs);
                }
            }
        }
        return null;
    }
    
    /**
     * Buscar usuario por nombre de usuario
     */
    public Usuario findByUsername(String username) throws SQLException {
        String sql = "SELECT * FROM usuario WHERE usuario = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, username);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return extractUsuarioFromResultSet(rs);
                }
            }
        }
        return null;
    }
    
    /**
     * Obtener todos los usuarios
     */
    public List<Usuario> findAll() throws SQLException {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuario ORDER BY fechaCreacion DESC";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                usuarios.add(extractUsuarioFromResultSet(rs));
            }
        }
        return usuarios;
    }
    
    /**
     * Obtener todos los usuarios administradores
     */
    public List<Usuario> findAllAdmins() throws SQLException {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuario WHERE rol = 'admin' ORDER BY usuario";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                usuarios.add(extractUsuarioFromResultSet(rs));
            }
        }
        return usuarios;
    }
    
    /**
     * Crear nuevo usuario
     */
    public Usuario create(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuario (usuario, correo, contrasena, nombre, apellido, " +
                    "fechaNacimiento, rol, fotoPerfil) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, usuario.getUsuario());
            pstmt.setString(2, usuario.getCorreo());
            pstmt.setString(3, usuario.getContrasena());
            pstmt.setString(4, usuario.getNombre());
            pstmt.setString(5, usuario.getApellido());
            
            if (usuario.getFechaNacimiento() != null) {
                pstmt.setDate(6, Date.valueOf(usuario.getFechaNacimiento()));
            } else {
                pstmt.setNull(6, Types.DATE);
            }
            
            pstmt.setString(7, usuario.getRol() != null ? usuario.getRol() : "cliente");
            pstmt.setString(8, usuario.getFotoPerfil() != null ? usuario.getFotoPerfil() : "default-avatar.svg");
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        usuario.setIdUsuario(generatedKeys.getInt(1));
                        return usuario;
                    }
                }
            }
        }
        return null;
    }
    
    /**
     * Actualizar usuario existente
     */
    public boolean update(Usuario usuario) throws SQLException {
        String sql = "UPDATE usuario SET correo = ?, contrasena = ?, nombre = ?, apellido = ?, " +
                    "fechaNacimiento = ?, rol = ?, fotoPerfil = ? WHERE idUsuario = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, usuario.getCorreo());
            pstmt.setString(2, usuario.getContrasena());
            pstmt.setString(3, usuario.getNombre());
            pstmt.setString(4, usuario.getApellido());
            
            if (usuario.getFechaNacimiento() != null) {
                pstmt.setDate(5, Date.valueOf(usuario.getFechaNacimiento()));
            } else {
                pstmt.setNull(5, Types.DATE);
            }
            
            pstmt.setString(6, usuario.getRol());
            pstmt.setString(7, usuario.getFotoPerfil());
            pstmt.setInt(8, usuario.getIdUsuario());
            
            return pstmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Eliminar usuario
     */
    public boolean delete(Integer id) throws SQLException {
        String sql = "DELETE FROM usuario WHERE idUsuario = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            return pstmt.executeUpdate() > 0;
        }
    }
    
    /**
     * Verificar si un usuario es administrador
     */
    public boolean isAdmin(Integer userId) throws SQLException {
        String sql = "SELECT rol FROM usuario WHERE idUsuario = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, userId);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    String rol = rs.getString("rol");
                    return "admin".equalsIgnoreCase(rol);
                }
            }
        }
        return false;
    }
    
    /**
     * Extraer objeto Usuario desde ResultSet
     */
    private Usuario extractUsuarioFromResultSet(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        
        usuario.setIdUsuario(rs.getInt("idUsuario"));
        usuario.setUsuario(rs.getString("usuario"));
        usuario.setCorreo(rs.getString("correo"));
        usuario.setContrasena(rs.getString("contrasena"));
        usuario.setNombre(rs.getString("nombre"));
        usuario.setApellido(rs.getString("apellido"));
        
        Date fechaNac = rs.getDate("fechaNacimiento");
        if (fechaNac != null) {
            usuario.setFechaNacimiento(fechaNac.toLocalDate());
        }
        
        usuario.setRol(rs.getString("rol"));
        usuario.setFotoPerfil(rs.getString("fotoPerfil"));
        
        return usuario;
    }
    
    /**
     * Contar total de usuarios
     */
    public int count() throws SQLException {
        String sql = "SELECT COUNT(*) as total FROM usuario";
        
        try (Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            if (rs.next()) {
                return rs.getInt("total");
            }
        }
        return 0;
    }
    
    /**
     * Contar usuarios por rol
     */
    public int countByRol(String rol) throws SQLException {
        String sql = "SELECT COUNT(*) as total FROM usuario WHERE rol = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, rol);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("total");
                }
            }
        }
        return 0;
    }
}

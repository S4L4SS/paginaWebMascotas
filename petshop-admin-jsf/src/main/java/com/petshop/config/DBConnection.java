package com.petshop.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Configuración de conexión a la base de datos MySQL
 * Patrón Singleton para manejo eficiente de conexiones
 */
public class DBConnection {
    
    private static final String URL = "jdbc:mysql://localhost:3306/mascotasdb?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "";
    
    private static DBConnection instance;
    private Connection connection;
    
    private DBConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection(URL, USER, PASSWORD);
            this.connection.setAutoCommit(true); // Asegurar que autocommit esté activado
            System.out.println("✓ Conexión establecida con MySQL (AutoCommit: ON)");
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("✗ Error al conectar con la base de datos: " + e.getMessage());
            throw new RuntimeException("Error de conexión a la base de datos", e);
        }
    }
    
    /**
     * Obtiene la instancia única de la conexión (Singleton)
     */
    public static synchronized DBConnection getInstance() {
        if (instance == null || !isConnectionValid()) {
            instance = new DBConnection();
        }
        return instance;
    }
    
    /**
     * Obtiene la conexión activa
     */
    public Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
                connection.setAutoCommit(true); // Asegurar autocommit
            }
        } catch (SQLException e) {
            System.err.println("Error al reconectar: " + e.getMessage());
        }
        return connection;
    }
    
    /**
     * Verifica si la conexión es válida
     */
    private static boolean isConnectionValid() {
        try {
            return instance != null && 
                   instance.connection != null && 
                   !instance.connection.isClosed() &&
                   instance.connection.isValid(2);
        } catch (SQLException e) {
            return false;
        }
    }
    
    /**
     * Cierra la conexión
     */
    public void closeConnection() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
                System.out.println("✓ Conexión cerrada");
            }
        } catch (SQLException e) {
            System.err.println("Error al cerrar conexión: " + e.getMessage());
        }
    }
}

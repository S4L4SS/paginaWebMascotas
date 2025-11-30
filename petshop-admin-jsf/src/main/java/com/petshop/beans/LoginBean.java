package com.petshop.beans;

import com.petshop.dao.UsuarioDAO;
import com.petshop.model.Usuario;

import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import java.io.Serializable;
import java.sql.SQLException;

/**
 * Managed Bean para gestionar el login y autenticación de usuarios
 * SessionScoped - mantiene la sesión del usuario durante toda la navegación
 */
@ManagedBean(name = "loginBean")
@SessionScoped
public class LoginBean implements Serializable {
    private static final long serialVersionUID = 1L;
    
    // Propiedades del formulario
    private String username;
    private String password;
    
    // Usuario autenticado
    private Usuario usuarioActual;
    
    // DAO
    private UsuarioDAO usuarioDAO;
    
    // Constructor
    public LoginBean() {
        this.usuarioDAO = new UsuarioDAO();
        checkErrorParameter();
    }
    
    /**
     * Verificar si hay parámetro de error en la URL
     */
    private void checkErrorParameter() {
        FacesContext context = FacesContext.getCurrentInstance();
        String error = context.getExternalContext().getRequestParameterMap().get("error");
        
        if ("noAdmin".equals(error)) {
            addErrorMessage("No cuenta con acceso de administrador. Solo administradores pueden acceder al sistema.");
        }
    }
    
    /**
     * Método para realizar el login
     * Valida las credenciales y verifica que el usuario sea admin
     */
    public String login() {
        FacesContext context = FacesContext.getCurrentInstance();
        
        // Validar que los campos no estén vacíos
        if (username == null || username.trim().isEmpty()) {
            addErrorMessage("Por favor ingrese su usuario");
            return null;
        }
        
        if (password == null || password.trim().isEmpty()) {
            addErrorMessage("Por favor ingrese su contraseña");
            return null;
        }
        
        try {
            // Autenticar usuario con la base de datos
            Usuario usuario = usuarioDAO.autenticar(username, password);
            
            if (usuario != null) {
                // Verificar que el usuario tenga rol de admin
                if ("admin".equalsIgnoreCase(usuario.getRol())) {
                    // Login exitoso - usuario es admin
                    usuarioActual = usuario;
                    
                    // Guardar en la sesión
                    context.getExternalContext().getSessionMap().put("usuarioActual", usuario);
                    
                    addInfoMessage("¡Bienvenido " + usuario.getNombreCompleto() + "!");
                    
                    // Redirigir al dashboard
                    return "/dashboard?faces-redirect=true";
                } else {
                    // Usuario existe pero no es admin
                    addErrorMessage("No cuenta con acceso de administrador. Solo administradores pueden acceder al sistema.");
                    return null;
                }
            } else {
                // Credenciales incorrectas
                addErrorMessage("Usuario o contraseña incorrectos");
                return null;
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
            addErrorMessage("Error al conectar con la base de datos: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Método para cerrar sesión
     */
    public String logout() {
        FacesContext context = FacesContext.getCurrentInstance();
        
        // Invalidar sesión
        context.getExternalContext().invalidateSession();
        
        // Limpiar variables
        usuarioActual = null;
        username = null;
        password = null;
        
        addInfoMessage("Sesión cerrada correctamente");
        
        // Redirigir al login
        return "/login?faces-redirect=true";
    }
    
    /**
     * Verificar si hay un usuario autenticado
     */
    public boolean isLoggedIn() {
        return usuarioActual != null;
    }
    
    /**
     * Verificar si el usuario actual es admin
     */
    public boolean isAdmin() {
        return usuarioActual != null && usuarioActual.isAdmin();
    }
    
    /**
     * Obtener el nombre para mostrar del usuario actual
     */
    public String getNombreUsuario() {
        if (usuarioActual != null) {
            return usuarioActual.getNombreCompleto();
        }
        return "Invitado";
    }
    
    // Métodos de utilidad para mensajes
    private void addErrorMessage(String message) {
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage(FacesMessage.SEVERITY_ERROR, "Error", message));
    }
    
    private void addInfoMessage(String message) {
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage(FacesMessage.SEVERITY_INFO, "Información", message));
    }
    
    private void addWarnMessage(String message) {
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage(FacesMessage.SEVERITY_WARN, "Advertencia", message));
    }
    
    // Getters y Setters
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Usuario getUsuarioActual() {
        return usuarioActual;
    }
    
    public void setUsuarioActual(Usuario usuarioActual) {
        this.usuarioActual = usuarioActual;
    }
}

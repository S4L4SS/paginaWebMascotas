package com.petshop.filter;

import com.petshop.model.Usuario;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Filtro de autenticación para proteger páginas de administración
 * Verifica que el usuario esté autenticado y tenga rol de admin
 */
@WebFilter(filterName = "AuthFilter", urlPatterns = {"/dashboard.xhtml", "/admin/*"})
public class AuthFilter implements Filter {
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Inicialización del filtro
        System.out.println("AuthFilter inicializado - Protegiendo páginas de administración");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpSession session = httpRequest.getSession(false);
        
        // Obtener la URI solicitada
        String requestURI = httpRequest.getRequestURI();
        
        // Verificar si el usuario está autenticado
        boolean loggedIn = false;
        boolean isAdmin = false;
        
        if (session != null) {
            Usuario usuarioActual = (Usuario) session.getAttribute("usuarioActual");
            
            if (usuarioActual != null) {
                loggedIn = true;
                isAdmin = "admin".equalsIgnoreCase(usuarioActual.getRol());
            }
        }
        
        // Si está autenticado y es admin, permitir el acceso
        if (loggedIn && isAdmin) {
            chain.doFilter(request, response);
        } else {
            // No está autenticado o no es admin - redirigir al login
            String contextPath = httpRequest.getContextPath();
            
            if (loggedIn && !isAdmin) {
                // Usuario autenticado pero no es admin
                System.out.println("Usuario sin privilegios de admin intentó acceder a: " + requestURI);
                httpResponse.sendRedirect(contextPath + "/login.xhtml?error=noAdmin");
            } else {
                // No está autenticado
                System.out.println("Usuario no autenticado intentó acceder a: " + requestURI);
                httpResponse.sendRedirect(contextPath + "/login.xhtml");
            }
        }
    }
    
    @Override
    public void destroy() {
        // Limpieza del filtro
        System.out.println("AuthFilter destruido");
    }
}

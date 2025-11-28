package com.petshop.config;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashSet;
import java.util.Set;

/**
 * Configuración de la aplicación JAX-RS para RESTful APIs
 * Define la ruta base para todos los endpoints REST
 */
@ApplicationPath("/api")
public class ApplicationConfig extends Application {
    
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new HashSet<>();
        addRestResourceClasses(resources);
        return resources;
    }
    
    /**
     * Registra las clases de recursos REST
     */
    private void addRestResourceClasses(Set<Class<?>> resources) {
        // Agregar aquí las clases REST
        resources.add(com.petshop.rest.ProductoRest.class);
        // Configuración de CORS si es necesario
        resources.add(CorsFilter.class);
    }
}

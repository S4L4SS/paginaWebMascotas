package com.petshop.servlets;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Servlet para servir imágenes de productos
 * Funciona como proxy para obtener imágenes del backend Node.js
 * Ruta: /images/*
 */
@WebServlet("/images/*")
public class ImageServlet extends HttpServlet {
    
    private static final long serialVersionUID = 1L;
    private static final String BACKEND_IMAGE_URL = "http://localhost:4000/uploads/productos/";
    private static final String DEFAULT_IMAGE = "/resources/images/no-image.svg";
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Obtener el nombre del archivo de la ruta
        String pathInfo = request.getPathInfo();
        
        if (pathInfo == null || pathInfo.equals("/")) {
            serveDefaultImage(response);
            return;
        }
        
        // Remover el "/" inicial
        String imageName = pathInfo.substring(1);
        
        System.out.println("🖼️ ImageServlet - Solicitando imagen: " + imageName);
        
        try {
            // Construir URL completa del backend
            String imageUrl = BACKEND_IMAGE_URL + imageName;
            System.out.println("🔗 URL Backend: " + imageUrl);
            
            // Hacer petición al backend
            URL url = new URL(imageUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            
            int responseCode = connection.getResponseCode();
            
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // Obtener tipo de contenido
                String contentType = connection.getContentType();
                if (contentType != null) {
                    response.setContentType(contentType);
                } else {
                    // Determinar tipo por extensión
                    if (imageName.toLowerCase().endsWith(".png")) {
                        response.setContentType("image/png");
                    } else if (imageName.toLowerCase().endsWith(".jpg") || imageName.toLowerCase().endsWith(".jpeg")) {
                        response.setContentType("image/jpeg");
                    } else if (imageName.toLowerCase().endsWith(".gif")) {
                        response.setContentType("image/gif");
                    } else if (imageName.toLowerCase().endsWith(".webp")) {
                        response.setContentType("image/webp");
                    } else {
                        response.setContentType("image/png");
                    }
                }
                
                // Configurar cache
                response.setHeader("Cache-Control", "public, max-age=31536000"); // 1 año
                
                // Copiar la imagen al response
                try (InputStream in = connection.getInputStream();
                     OutputStream out = response.getOutputStream()) {
                    
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                }
                
                System.out.println("✅ Imagen servida correctamente: " + imageName);
                
            } else {
                System.out.println("⚠️ Imagen no encontrada en backend: " + imageName + " (código: " + responseCode + ")");
                serveDefaultImage(response);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error al obtener imagen: " + imageName);
            e.printStackTrace();
            serveDefaultImage(response);
        }
    }
    
    /**
     * Servir imagen por defecto cuando no se encuentra la imagen
     */
    private void serveDefaultImage(HttpServletResponse response) throws IOException {
        response.setContentType("image/png");
        response.setHeader("Cache-Control", "public, max-age=3600");
        
        try (InputStream defaultImage = getServletContext().getResourceAsStream(DEFAULT_IMAGE)) {
            if (defaultImage != null) {
                try (OutputStream out = response.getOutputStream()) {
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = defaultImage.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                }
            } else {
                // Si no hay imagen por defecto, enviar un pixel transparente
                response.setContentType("image/gif");
                byte[] transparentGif = {
                    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00,
                    0x01, 0x00, (byte)0x80, 0x00, 0x00, (byte)0xFF, (byte)0xFF, (byte)0xFF,
                    0x00, 0x00, 0x00, 0x21, (byte)0xF9, 0x04, 0x01, 0x00,
                    0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
                    0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x44,
                    0x01, 0x00, 0x3B
                };
                response.getOutputStream().write(transparentGif);
            }
        }
    }
}

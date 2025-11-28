package com.petshop.servlets;

import com.google.gson.Gson;
import com.petshop.dto.ProductoDTO;
import com.petshop.facade.ProductoFacade;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Servlet para operaciones AJAX con productos
 * Soporta: GET, POST, PUT via AJAX/jQuery
 * Ruta: /ProductoServlet
 */
@WebServlet("/ProductoServlet")
public class ProductoServlet extends HttpServlet {
    
    private static final long serialVersionUID = 1L;
    private ProductoFacade productoFacade;
    private Gson gson;
    
    @Override
    public void init() throws ServletException {
        super.init();
        this.productoFacade = new ProductoFacade();
        this.gson = new Gson();
        System.out.println("✅ ProductoServlet inicializado - Ruta: /ProductoServlet");
        System.out.println("📍 Context Path: " + getServletContext().getContextPath());
    }
    
    /**
     * GET - Obtener productos o un producto específico
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Habilitar CORS
        setCorsHeaders(response);
        
        PrintWriter out = response.getWriter();
        
        try {
            String action = request.getParameter("action");
            String idParam = request.getParameter("id");
            
            if ("getById".equals(action) && idParam != null) {
                // Obtener producto por ID
                Integer id = Integer.parseInt(idParam);
                ProductoDTO producto = productoFacade.obtenerProductoPorId(id);
                
                if (producto != null) {
                    out.print(gson.toJson(producto));
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print(gson.toJson(createErrorResponse("Producto no encontrado")));
                }
            } else if ("stockBajo".equals(action)) {
                // Obtener productos con stock bajo
                List<ProductoDTO> productos = productoFacade.obtenerProductosStockBajo();
                out.print(gson.toJson(productos));
            } else if ("count".equals(action)) {
                // Contar productos
                int count = productoFacade.contarProductos();
                Map<String, Integer> result = new HashMap<>();
                result.put("count", count);
                out.print(gson.toJson(result));
            } else {
                // Obtener todos los productos
                List<ProductoDTO> productos = productoFacade.obtenerTodosLosProductos();
                out.print(gson.toJson(productos));
            }
            
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(createErrorResponse("ID inválido")));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(createErrorResponse("Error del servidor: " + e.getMessage())));
        }
    }
    
    /**
     * POST - Crear nuevo producto o actualizar stock (AJAX)
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Habilitar CORS
        setCorsHeaders(response);
        
        PrintWriter out = response.getWriter();
        
        try {
            String action = request.getParameter("action");
            
            if ("updateStock".equals(action)) {
                // Actualizar stock via AJAX
                String idStr = request.getParameter("id");
                String stockStr = request.getParameter("stock");
                
                System.out.println("📝 Recibida petición updateStock - ID: " + idStr + ", Stock: " + stockStr);
                
                if (idStr == null || stockStr == null) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.print(gson.toJson(createErrorResponse("Parámetros 'id' y 'stock' son requeridos")));
                    return;
                }
                
                Integer id = Integer.parseInt(idStr);
                Integer nuevoStock = Integer.parseInt(stockStr);
                
                System.out.println("🔄 Actualizando stock - Producto ID: " + id + " -> Nuevo stock: " + nuevoStock);
                
                boolean exito = productoFacade.actualizarStock(id, nuevoStock);
                
                if (exito) {
                    ProductoDTO producto = productoFacade.obtenerProductoPorId(id);
                    System.out.println("✅ Stock actualizado exitosamente - Producto: " + producto.getNombre());
                    Map<String, Object> responseData = createSuccessResponse("Stock actualizado exitosamente", producto);
                    out.print(gson.toJson(responseData));
                    out.flush();
                } else {
                    System.err.println("❌ Error: No se pudo actualizar el stock");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print(gson.toJson(createErrorResponse("No se pudo actualizar el stock en la base de datos")));
                }
                
            } else {
                // Crear nuevo producto
                ProductoDTO producto = new ProductoDTO();
                producto.setNombre(request.getParameter("nombre"));
                producto.setDescripcion(request.getParameter("descripcion"));
                producto.setPrecio(Double.parseDouble(request.getParameter("precio")));
                producto.setStock(Integer.parseInt(request.getParameter("stock")));
                producto.setImagen(request.getParameter("imagen"));
                
                // Validar
                String error = productoFacade.validarProducto(producto);
                if (error != null) {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    out.print(gson.toJson(createErrorResponse(error)));
                    return;
                }
                
                boolean exito = productoFacade.crearProducto(producto);
                
                if (exito) {
                    response.setStatus(HttpServletResponse.SC_CREATED);
                    out.print(gson.toJson(createSuccessResponse("Producto creado", producto)));
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.print(gson.toJson(createErrorResponse("No se pudo crear el producto")));
                }
            }
            
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(createErrorResponse("Datos numéricos inválidos")));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(createErrorResponse("Error del servidor: " + e.getMessage())));
        }
    }
    
    /**
     * PUT - Actualizar producto (simulado via POST con _method=PUT)
     */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Habilitar CORS
        setCorsHeaders(response);
        
        PrintWriter out = response.getWriter();
        
        try {
            Integer id = Integer.parseInt(request.getParameter("id"));
            
            ProductoDTO producto = new ProductoDTO();
            producto.setIdProducto(id);
            producto.setNombre(request.getParameter("nombre"));
            producto.setDescripcion(request.getParameter("descripcion"));
            producto.setPrecio(Double.parseDouble(request.getParameter("precio")));
            producto.setStock(Integer.parseInt(request.getParameter("stock")));
            producto.setImagen(request.getParameter("imagen"));
            
            // Validar
            String error = productoFacade.validarProducto(producto);
            if (error != null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(createErrorResponse(error)));
                return;
            }
            
            boolean exito = productoFacade.actualizarProducto(producto);
            
            if (exito) {
                out.print(gson.toJson(createSuccessResponse("Producto actualizado", producto)));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(createErrorResponse("Producto no encontrado")));
            }
            
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(createErrorResponse("Datos numéricos inválidos")));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(createErrorResponse("Error del servidor: " + e.getMessage())));
        }
    }
    
    /**
     * DELETE - Eliminar producto
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Habilitar CORS
        setCorsHeaders(response);
        
        PrintWriter out = response.getWriter();
        
        try {
            Integer id = Integer.parseInt(request.getParameter("id"));
            boolean exito = productoFacade.eliminarProducto(id);
            
            if (exito) {
                out.print(gson.toJson(createSuccessResponse("Producto eliminado", null)));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print(gson.toJson(createErrorResponse("Producto no encontrado")));
            }
            
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(gson.toJson(createErrorResponse("ID inválido")));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(createErrorResponse("Error del servidor: " + e.getMessage())));
        }
    }
    
    /**
     * OPTIONS - Para CORS preflight
     */
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
    
    // Métodos auxiliares
    
    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Max-Age", "3600");
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
    
    private Map<String, Object> createSuccessResponse(String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return response;
    }
}

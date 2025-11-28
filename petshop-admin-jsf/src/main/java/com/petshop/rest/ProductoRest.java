package com.petshop.rest;

import com.petshop.dto.ProductoDTO;
import com.petshop.facade.ProductoFacade;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

/**
 * RESTful Web Service para Productos
 * Endpoints: GET, POST, PUT, DELETE
 * Ruta base: /api/productos
 */
@Path("/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoRest {
    
    private ProductoFacade productoFacade;
    
    public ProductoRest() {
        this.productoFacade = new ProductoFacade();
    }
    
    /**
     * GET /api/productos
     * Obtener todos los productos
     */
    @GET
    public Response getAllProductos() {
        try {
            List<ProductoDTO> productos = productoFacade.obtenerTodosLosProductos();
            return Response.ok(productos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al obtener productos: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * GET /api/productos/{id}
     * Obtener producto por ID
     */
    @GET
    @Path("/{id}")
    public Response getProductoById(@PathParam("id") Integer id) {
        try {
            ProductoDTO producto = productoFacade.obtenerProductoPorId(id);
            if (producto != null) {
                return Response.ok(producto).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Producto no encontrado"))
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al obtener producto: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * GET /api/productos/buscar?nombre={nombre}
     * Buscar productos por nombre
     */
    @GET
    @Path("/buscar")
    public Response buscarProductos(@QueryParam("nombre") String nombre) {
        try {
            if (nombre == null || nombre.trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("El parámetro 'nombre' es requerido"))
                        .build();
            }
            
            List<ProductoDTO> productos = productoFacade.buscarProductosPorNombre(nombre);
            return Response.ok(productos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al buscar productos: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * POST /api/productos
     * Crear nuevo producto
     */
    @POST
    public Response createProducto(ProductoDTO productoDTO) {
        try {
            // Validar producto
            String error = productoFacade.validarProducto(productoDTO);
            if (error != null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse(error))
                        .build();
            }
            
            boolean exito = productoFacade.crearProducto(productoDTO);
            if (exito) {
                return Response.status(Response.Status.CREATED)
                        .entity(productoDTO)
                        .build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity(new ErrorResponse("No se pudo crear el producto"))
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al crear producto: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * PUT /api/productos/{id}
     * Actualizar producto existente
     */
    @PUT
    @Path("/{id}")
    public Response updateProducto(@PathParam("id") Integer id, ProductoDTO productoDTO) {
        try {
            // Asegurar que el ID coincida
            productoDTO.setIdProducto(id);
            
            // Validar producto
            String error = productoFacade.validarProducto(productoDTO);
            if (error != null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse(error))
                        .build();
            }
            
            boolean exito = productoFacade.actualizarProducto(productoDTO);
            if (exito) {
                return Response.ok(productoDTO).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Producto no encontrado"))
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al actualizar producto: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * PATCH /api/productos/{id}/stock
     * Actualizar solo el stock de un producto
     */
    @PATCH
    @Path("/{id}/stock")
    public Response updateStock(@PathParam("id") Integer id, 
                               @QueryParam("stock") Integer nuevoStock) {
        try {
            if (nuevoStock == null || nuevoStock < 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Stock inválido"))
                        .build();
            }
            
            boolean exito = productoFacade.actualizarStock(id, nuevoStock);
            if (exito) {
                ProductoDTO producto = productoFacade.obtenerProductoPorId(id);
                return Response.ok(producto).build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Producto no encontrado"))
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al actualizar stock: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * DELETE /api/productos/{id}
     * Eliminar producto
     */
    @DELETE
    @Path("/{id}")
    public Response deleteProducto(@PathParam("id") Integer id) {
        try {
            boolean exito = productoFacade.eliminarProducto(id);
            if (exito) {
                return Response.ok()
                        .entity(new SuccessResponse("Producto eliminado correctamente"))
                        .build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity(new ErrorResponse("Producto no encontrado"))
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al eliminar producto: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * GET /api/productos/stock-bajo
     * Obtener productos con stock bajo
     */
    @GET
    @Path("/stock-bajo")
    public Response getProductosStockBajo() {
        try {
            List<ProductoDTO> productos = productoFacade.obtenerProductosStockBajo();
            return Response.ok(productos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al obtener productos: " + e.getMessage()))
                    .build();
        }
    }
    
    /**
     * GET /api/productos/count
     * Obtener cantidad total de productos
     */
    @GET
    @Path("/count")
    public Response getCount() {
        try {
            int count = productoFacade.contarProductos();
            return Response.ok(new CountResponse(count)).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error al contar productos: " + e.getMessage()))
                    .build();
        }
    }
    
    // Clases auxiliares para respuestas
    
    public static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
    
    public static class SuccessResponse {
        private String message;
        
        public SuccessResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
    
    public static class CountResponse {
        private int count;
        
        public CountResponse(int count) {
            this.count = count;
        }
        
        public int getCount() {
            return count;
        }
        
        public void setCount(int count) {
            this.count = count;
        }
    }
}

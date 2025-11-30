package com.petshop.beans;

import com.petshop.dto.ProductoDTO;
import com.petshop.facade.ProductoFacade;
import javax.annotation.PostConstruct;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import org.primefaces.model.file.UploadedFile;
import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Managed Bean JSF para gestión de productos
 * @ManagedBean - Permite que JSF gestione el bean
 * @SessionScoped - El bean vive durante toda la sesión del usuario
 */
@ManagedBean(name = "productoBean")
@SessionScoped
public class ProductoBean implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    private ProductoFacade productoFacade;
    private List<ProductoDTO> productos;
    private ProductoDTO productoSeleccionado;
    private ProductoDTO nuevoProducto;
    private String terminoBusqueda;
    private boolean modoEdicion;
    private UploadedFile archivoSubido;
    
    /**
     * Inicialización del bean
     */
    @PostConstruct
    public void init() {
        System.out.println("🔄 ProductoBean.init() - Inicializando bean");
        productoFacade = new ProductoFacade();
        nuevoProducto = new ProductoDTO();
        cargarProductos();
    }
    
    /**
     * Cargar todos los productos (forzar recarga)
     */
    public void recargarProductos() {
        System.out.println("🔄 Forzando recarga de productos...");
        cargarProductos();
    }
    
    /**
     * Cargar todos los productos
     */
    public void cargarProductos() {
        productos = productoFacade.obtenerTodosLosProductos();
        System.out.println("✓ Productos cargados: " + (productos != null ? productos.size() : 0));
        if (productos != null && !productos.isEmpty()) {
            for (ProductoDTO p : productos) {
                System.out.println("  - ID: " + p.getIdProducto() + ", Nombre: " + p.getNombre() + 
                                 ", Stock: " + p.getStock());
            }
        }
    }
    
    /**
     * Buscar productos por nombre
     */
    public void buscarProductos() {
        if (terminoBusqueda != null && !terminoBusqueda.trim().isEmpty()) {
            productos = productoFacade.buscarProductosPorNombre(terminoBusqueda);
            addMessage("Búsqueda", "Se encontraron " + productos.size() + " productos", 
                      FacesMessage.SEVERITY_INFO);
        } else {
            cargarProductos();
        }
    }
    
    /**
     * Limpiar búsqueda y recargar todos
     */
    public void limpiarBusqueda() {
        terminoBusqueda = null;
        cargarProductos();
    }
    
    /**
     * Preparar para crear nuevo producto
     */
    public void prepararNuevoProducto() {
        nuevoProducto = new ProductoDTO();
        modoEdicion = false;
    }
    
    /**
     * Crear nuevo producto (navegación)
     */
    public String irANuevoProducto() {
        nuevoProducto = new ProductoDTO();
        modoEdicion = false;
        return "nuevo?faces-redirect=true";
    }
    
    /**
     * Volver a la lista de productos
     */
    public String volverALista() {
        return "lista?faces-redirect=true";
    }
    
    /**
     * Ir al dashboard
     */
    public String irADashboard() {
        return "/dashboard?faces-redirect=true";
    }
    
    /**
     * Guardar nuevo producto
     */
    public String guardarNuevoProducto() {
        String error = productoFacade.validarProducto(nuevoProducto);
        if (error != null) {
            addMessage("Error de validación", error, FacesMessage.SEVERITY_ERROR);
            return null;
        }
        
        boolean exito = productoFacade.crearProducto(nuevoProducto);
        if (exito) {
            System.out.println("✅ Producto creado: " + nuevoProducto.getNombre());
            addMessage("Éxito", "Producto creado correctamente: " + nuevoProducto.getNombre(), 
                      FacesMessage.SEVERITY_INFO);
            
            // Limpiar el formulario
            nuevoProducto = new ProductoDTO();
            
            // Recargar productos para que aparezcan en la lista
            cargarProductos();
            
            // Redirigir a la lista
            return "lista?faces-redirect=true";
        } else {
            addMessage("Error", "No se pudo crear el producto", FacesMessage.SEVERITY_ERROR);
            return null;
        }
    }
    
    /**
     * Cancelar creación de nuevo producto
     */
    public String cancelarNuevoProducto() {
        nuevoProducto = new ProductoDTO(); // Limpiar el formulario
        System.out.println("❌ Creación de producto cancelada");
        return "lista?faces-redirect=true";
    }
    
    /**
     * Preparar para editar producto y navegar a la página de edición
     */
    public String prepararEdicion(ProductoDTO producto) {
        if (producto == null) {
            addMessage("Error", "Producto no encontrado", FacesMessage.SEVERITY_ERROR);
            return null;
        }
        
        // Clonar el producto para evitar modificar el original
        productoSeleccionado = new ProductoDTO();
        productoSeleccionado.setIdProducto(producto.getIdProducto());
        productoSeleccionado.setNombre(producto.getNombre());
        productoSeleccionado.setDescripcion(producto.getDescripcion());
        productoSeleccionado.setPrecio(producto.getPrecio());
        productoSeleccionado.setStock(producto.getStock());
        productoSeleccionado.setImagen(producto.getImagen());
        modoEdicion = true;
        
        System.out.println("✅ Producto seleccionado para editar: " + producto.getNombre() + 
                          " (ID: " + producto.getIdProducto() + ")");
        System.out.println("💾 productoSeleccionado guardado en sesión: " + productoSeleccionado);
        
        return "editar?faces-redirect=true&id=" + producto.getIdProducto();
    }
    
    /**
     * Cargar producto para edición desde parámetro de URL
     */
    public void cargarProductoParaEdicion() {
        Map<String, String> params = FacesContext.getCurrentInstance()
                .getExternalContext().getRequestParameterMap();
        String idStr = params.get("id");
        
        if (idStr != null && productoSeleccionado == null) {
            try {
                Integer id = Integer.parseInt(idStr);
                productoSeleccionado = productoFacade.obtenerProductoPorId(id);
                modoEdicion = true;
                System.out.println("🔄 Producto cargado desde URL - ID: " + id);
            } catch (NumberFormatException e) {
                addMessage("Error", "ID de producto inválido", FacesMessage.SEVERITY_ERROR);
            }
        } else if (productoSeleccionado != null) {
            System.out.println("✅ Producto ya existía en sesión: " + productoSeleccionado.getNombre());
        }
    }
    
    /**
     * Actualizar producto existente
     */
    public String actualizarProducto() {
        if (productoSeleccionado == null) {
            addMessage("Error", "No hay producto seleccionado", FacesMessage.SEVERITY_ERROR);
            return null;
        }
        
        String error = productoFacade.validarProducto(productoSeleccionado);
        if (error != null) {
            addMessage("Error de validación", error, FacesMessage.SEVERITY_ERROR);
            return null;
        }
        
        boolean exito = productoFacade.actualizarProducto(productoSeleccionado);
        if (exito) {
            addMessage("Éxito", "Producto actualizado correctamente", FacesMessage.SEVERITY_INFO);
            System.out.println("✓ Producto actualizado: " + productoSeleccionado.getNombre());
            cargarProductos();
            productoSeleccionado = null;
            modoEdicion = false;
            return "lista?faces-redirect=true"; // Redirigir a la lista
        } else {
            addMessage("Error", "No se pudo actualizar el producto", FacesMessage.SEVERITY_ERROR);
            return null;
        }
    }
    
    /**
     * Cancelar edición
     */
    public String cancelarEdicion() {
        productoSeleccionado = null;
        modoEdicion = false;
        System.out.println("❌ Edición cancelada");
        return "lista?faces-redirect=true";
    }
    
    /**
     * Eliminar producto
     */
    public void eliminarProducto(ProductoDTO producto) {
        boolean exito = productoFacade.eliminarProducto(producto.getIdProducto());
        if (exito) {
            addMessage("Éxito", "Producto eliminado correctamente", FacesMessage.SEVERITY_INFO);
            cargarProductos();
        } else {
            addMessage("Error", "No se pudo eliminar el producto", FacesMessage.SEVERITY_ERROR);
        }
    }
    
    /**
     * Actualizar stock de un producto (AJAX)
     */
    public void actualizarStock(ProductoDTO producto) {
        if (producto == null || producto.getIdProducto() == null) {
            addMessage("Error", "Producto no válido", FacesMessage.SEVERITY_ERROR);
            return;
        }
        
        System.out.println("🔄 AJAX actualizarStock() - ID: " + producto.getIdProducto() + 
                          ", Stock actual: " + producto.getStock());
        
        boolean exito = productoFacade.actualizarStock(
            producto.getIdProducto(), 
            producto.getStock()
        );
        
        if (exito) {
            addMessage("Stock actualizado", 
                      "Stock de " + producto.getNombre() + " actualizado a " + producto.getStock(), 
                      FacesMessage.SEVERITY_INFO);
            System.out.println("✅ Stock actualizado vía AJAX: " + producto.getNombre() + " -> " + producto.getStock());
            // Recargar productos para reflejar cambios
            cargarProductos();
        } else {
            addMessage("Error", "No se pudo actualizar el stock", FacesMessage.SEVERITY_ERROR);
            System.err.println("❌ Error al actualizar stock vía AJAX");
        }
    }
    
    /**
     * Obtener productos con stock bajo
     */
    public List<ProductoDTO> getProductosStockBajo() {
        return productoFacade.obtenerProductosStockBajo();
    }
    
    /**
     * Obtener total de productos
     */
    public int getTotalProductos() {
        return productoFacade.contarProductos();
    }
    
    /**
     * Agregar mensaje FacesMessage al contexto
     */
    private void addMessage(String summary, String detail, FacesMessage.Severity severity) {
        FacesContext.getCurrentInstance().addMessage(null, 
            new FacesMessage(severity, summary, detail));
    }
    
    // Getters y Setters
    
    public List<ProductoDTO> getProductos() {
        return productos;
    }
    
    public void setProductos(List<ProductoDTO> productos) {
        this.productos = productos;
    }
    
    public ProductoDTO getProductoSeleccionado() {
        return productoSeleccionado;
    }
    
    public void setProductoSeleccionado(ProductoDTO productoSeleccionado) {
        this.productoSeleccionado = productoSeleccionado;
    }
    
    public ProductoDTO getNuevoProducto() {
        return nuevoProducto;
    }
    
    public void setNuevoProducto(ProductoDTO nuevoProducto) {
        this.nuevoProducto = nuevoProducto;
    }
    
    public String getTerminoBusqueda() {
        return terminoBusqueda;
    }
    
    public void setTerminoBusqueda(String terminoBusqueda) {
        this.terminoBusqueda = terminoBusqueda;
    }
    
    public boolean isModoEdicion() {
        return modoEdicion;
    }
    
    public void setModoEdicion(boolean modoEdicion) {
        this.modoEdicion = modoEdicion;
    }
    
    public UploadedFile getArchivoSubido() {
        return archivoSubido;
    }
    
    public void setArchivoSubido(UploadedFile archivoSubido) {
        this.archivoSubido = archivoSubido;
    }
    
    /**
     * Guardar archivo de imagen en el servidor
     * Retorna la ruta relativa para guardar en BD
     */
    private String guardarImagenEnServidor(UploadedFile archivo) {
        if (archivo == null || archivo.getSize() == 0) {
            return null;
        }
        
        try {
            // Obtener extensión del archivo
            String nombreOriginal = archivo.getFileName();
            String extension = "";
            if (nombreOriginal.contains(".")) {
                extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            }
            
            // Generar nombre único para evitar colisiones
            String nombreUnico = System.currentTimeMillis() + "-" + 
                               UUID.randomUUID().toString().substring(0, 8) + extension;
            
            // Ruta absoluta donde guardar (directorio uploads/productos/)
            String contextPath = FacesContext.getCurrentInstance()
                    .getExternalContext().getRealPath("/");
            Path uploadsDir = Paths.get(contextPath, "uploads", "productos");
            
            // Crear directorio si no existe
            if (!Files.exists(uploadsDir)) {
                Files.createDirectories(uploadsDir);
                System.out.println("📁 Directorio creado: " + uploadsDir.toString());
            }
            
            // Guardar el archivo
            Path archivoDestino = uploadsDir.resolve(nombreUnico);
            try (InputStream input = archivo.getInputStream()) {
                Files.copy(input, archivoDestino, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("✅ Imagen guardada: " + archivoDestino.toString());
            }
            
            // Retornar ruta relativa para BD (como en Node.js)
            String rutaRelativa = "uploads/productos/" + nombreUnico;
            System.out.println("💾 Ruta para BD: " + rutaRelativa);
            return rutaRelativa;
            
        } catch (IOException e) {
            System.err.println("❌ Error al guardar imagen: " + e.getMessage());
            e.printStackTrace();
            addMessage("Error", "No se pudo guardar la imagen: " + e.getMessage(), 
                      FacesMessage.SEVERITY_ERROR);
            return null;
        }
    }
    
    /**
     * Guardar nuevo producto con imagen
     */
    public String guardarNuevoProductoConImagen() {
        System.out.println("📤 guardarNuevoProductoConImagen() - Iniciando...");
        System.out.println("   archivoSubido: " + (archivoSubido != null ? archivoSubido.getFileName() + " (" + archivoSubido.getSize() + " bytes)" : "null"));
        
        // Si hay archivo subido, guardarlo y actualizar la ruta
        if (archivoSubido != null && archivoSubido.getSize() > 0) {
            System.out.println("   ✅ Archivo detectado, guardando...");
            String rutaImagen = guardarImagenEnServidor(archivoSubido);
            if (rutaImagen != null) {
                nuevoProducto.setImagen(rutaImagen);
                System.out.println("   ✅ Ruta guardada: " + rutaImagen);
            } else {
                System.out.println("   ❌ Error al guardar imagen en servidor");
            }
            archivoSubido = null; // Limpiar archivo después de procesar
        } else {
            System.out.println("   ⚠️ No se detectó archivo subido o está vacío");
            // Si no hay imagen subida, poner una imagen por defecto
            if (nuevoProducto.getImagen() == null || nuevoProducto.getImagen().trim().isEmpty()) {
                nuevoProducto.setImagen("uploads/productos/default.png");
                System.out.println("   ℹ️ Usando imagen por defecto");
            }
        }
        
        // Continuar con el guardado normal
        return guardarNuevoProducto();
    }
    
    /**
     * Actualizar producto con nueva imagen (si se sube)
     */
    public String actualizarProductoConImagen() {
        System.out.println("📤 actualizarProductoConImagen() - Iniciando...");
        System.out.println("   archivoSubido: " + (archivoSubido != null ? archivoSubido.getFileName() + " (" + archivoSubido.getSize() + " bytes)" : "null"));
        System.out.println("   Imagen actual: " + productoSeleccionado.getImagen());
        
        // Si hay archivo subido, guardarlo y actualizar la ruta
        if (archivoSubido != null && archivoSubido.getSize() > 0) {
            System.out.println("   ✅ Archivo detectado, guardando...");
            String rutaImagen = guardarImagenEnServidor(archivoSubido);
            if (rutaImagen != null) {
                productoSeleccionado.setImagen(rutaImagen);
                System.out.println("   ✅ Nueva ruta guardada: " + rutaImagen);
            } else {
                System.out.println("   ❌ Error al guardar imagen en servidor");
            }
            archivoSubido = null; // Limpiar archivo después de procesar
        } else {
            System.out.println("   ℹ️ No se detectó nuevo archivo, manteniendo imagen actual");
        }
        
        // Continuar con la actualización normal
        return actualizarProducto();
    }
}

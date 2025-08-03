package com.ferreteria.service;

import com.ferreteria.model.Producto;
import com.ferreteria.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findByActivoTrue();
    }

    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findById(id);
    }

    public Producto guardarProducto(Producto producto) {
        validarProducto(producto);
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto producto) {
        Optional<Producto> productoExistente = productoRepository.findById(id);
        if (productoExistente.isPresent()) {
            producto.setId(id);
            validarProducto(producto);
            return productoRepository.save(producto);
        }
        throw new RuntimeException("Producto no encontrado con ID: " + id);
    }

    public void eliminarProducto(Long id) {
        if (productoRepository.existsById(id)) {
            // Soft delete - marcar como inactivo
            Producto producto = productoRepository.findById(id).get();
            producto.setActivo(false);
            productoRepository.save(producto);
        } else {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
    }

    public List<Producto> buscarProductos(String termino) {
        if (termino == null || termino.trim().isEmpty()) {
            return obtenerTodosLosProductos();
        }
        return productoRepository.buscarProductos(termino);
    }

    public List<Producto> obtenerProductosPorCategoria(String categoria) {
        return productoRepository.findByCategoriaIgnoreCaseAndActivoTrue(categoria);
    }

    public List<Producto> obtenerProductosConStockBajo() {
        return productoRepository.findProductosConStockBajo();
    }

    public List<String> obtenerCategorias() {
        return productoRepository.findAllCategorias();
    }

    public List<String> obtenerProveedores() {
        return productoRepository.findAllProveedores();
    }

    public boolean actualizarStock(Long productoId, int cantidad) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();
            if (producto.tieneStock(cantidad)) {
                producto.reducirStock(cantidad);
                productoRepository.save(producto);
                return true;
            }
        }
        return false;
    }

    public void aumentarStock(Long productoId, int cantidad) {
        Optional<Producto> productoOpt = productoRepository.findById(productoId);
        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();
            producto.aumentarStock(cantidad);
            productoRepository.save(producto);
        }
    }

    private void validarProducto(Producto producto) {
        if (producto.getNombre() == null || producto.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        if (producto.getStock() == null || producto.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        if (producto.getStockMinimo() == null || producto.getStockMinimo() < 0) {
            throw new IllegalArgumentException("El stock mínimo no puede ser negativo");
        }
    }
}

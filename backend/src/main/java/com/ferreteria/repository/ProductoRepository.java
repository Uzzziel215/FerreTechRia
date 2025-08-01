package com.ferreteria.repository;

import com.ferreteria.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos activos
    List<Producto> findByActivoTrue();

    // Buscar por nombre (case insensitive)
    @Query("SELECT p FROM Producto p WHERE LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) AND p.activo = true")
    List<Producto> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);

    // Buscar por código de barras
    Optional<Producto> findByCodigoBarrasAndActivoTrue(String codigoBarras);

    // Buscar por categoría
    List<Producto> findByCategoriaIgnoreCaseAndActivoTrue(String categoria);

    // Buscar por proveedor
    List<Producto> findByProveedorIgnoreCaseAndActivoTrue(String proveedor);

    // Productos con stock bajo
    @Query("SELECT p FROM Producto p WHERE p.stock <= p.stockMinimo AND p.activo = true")
    List<Producto> findProductosConStockBajo();

    // Obtener todas las categorías distintas
    @Query("SELECT DISTINCT p.categoria FROM Producto p WHERE p.activo = true ORDER BY p.categoria")
    List<String> findAllCategorias();

    // Obtener todos los proveedores distintos
    @Query("SELECT DISTINCT p.proveedor FROM Producto p WHERE p.activo = true ORDER BY p.proveedor")
    List<String> findAllProveedores();

    // Búsqueda general (nombre, descripción, código de barras)
    @Query("SELECT p FROM Producto p WHERE " +
           "(LOWER(p.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "p.codigoBarras LIKE CONCAT('%', :termino, '%')) AND " +
           "p.activo = true")
    List<Producto> buscarProductos(@Param("termino") String termino);

    // Contar productos por categoría
    @Query("SELECT p.categoria, COUNT(p) FROM Producto p WHERE p.activo = true GROUP BY p.categoria")
    List<Object[]> contarProductosPorCategoria();
}

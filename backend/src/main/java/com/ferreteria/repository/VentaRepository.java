package com.ferreteria.repository;

import com.ferreteria.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    // Buscar ventas por rango de fechas
    List<Venta> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);

    // Buscar ventas por cliente
    @Query("SELECT v FROM Venta v WHERE v.cliente.id = :clienteId ORDER BY v.fecha DESC")
    List<Venta> findByClienteIdOrderByFechaDesc(@Param("clienteId") Long clienteId);

    // Buscar ventas por usuario
    @Query("SELECT v FROM Venta v WHERE v.usuario.id = :usuarioId ORDER BY v.fecha DESC")
    List<Venta> findByUsuarioIdOrderByFechaDesc(@Param("usuarioId") Long usuarioId);

    // Buscar ventas por estado
    List<Venta> findByEstadoOrderByFechaDesc(Venta.EstadoVenta estado);

    // Ventas del día
    @Query("SELECT v FROM Venta v WHERE DATE(v.fecha) = DATE(:fecha)")
    List<Venta> findVentasDelDia(@Param("fecha") LocalDateTime fecha);

    // Ventas del mes
    @Query("SELECT v FROM Venta v WHERE YEAR(v.fecha) = :año AND MONTH(v.fecha) = :mes")
    List<Venta> findVentasDelMes(@Param("año") int año, @Param("mes") int mes);

    // Total de ventas por día
    @Query("SELECT DATE(v.fecha), SUM(v.total) FROM Venta v WHERE v.estado = 'COMPLETADA' GROUP BY DATE(v.fecha) ORDER BY DATE(v.fecha) DESC")
    List<Object[]> obtenerTotalVentasPorDia();

    // Últimas ventas
    List<Venta> findTop10ByOrderByFechaDesc();
}

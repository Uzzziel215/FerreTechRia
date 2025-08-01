package com.ferreteria.repository;

import com.ferreteria.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Buscar clientes activos
    List<Cliente> findByActivoTrue();

    // Buscar por nombre (case insensitive)
    @Query("SELECT c FROM Cliente c WHERE LOWER(c.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) AND c.activo = true")
    List<Cliente> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);

    // Buscar por email
    Optional<Cliente> findByEmailAndActivoTrue(String email);

    // Clientes con descuento
    @Query("SELECT c FROM Cliente c WHERE c.descuento > 0 AND c.activo = true")
    List<Cliente> findClientesConDescuento();

    // Buscar por teléfono
    Optional<Cliente> findByTelefonoAndActivoTrue(String telefono);

    // Búsqueda general (nombre, email, teléfono)
    @Query("SELECT c FROM Cliente c WHERE " +
           "(LOWER(c.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "c.telefono LIKE CONCAT('%', :termino, '%')) AND " +
           "c.activo = true")
    List<Cliente> buscarClientes(@Param("termino") String termino);
}

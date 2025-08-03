package com.ferreteria.repository;

import com.ferreteria.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuarios activos
    List<Usuario> findByActivoTrue();

    // Buscar por nombre de usuario
    Optional<Usuario> findByNombre(String nombre);

    // Buscar por nombre de usuario y si está activo
    Optional<Usuario> findByNombreAndActivoTrue(String nombre);

    // Buscar por rol
    List<Usuario> findByRolAndActivoTrue(Usuario.RolUsuario rol);

    // Verificar si existe usuario con nombre
    boolean existsByNombreAndActivoTrue(String nombre);
}

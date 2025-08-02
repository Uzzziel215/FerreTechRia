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
    Optional<Usuario> findByNombreAndActivoTrue(String nombre);

    // Autenticación
    @Query("SELECT u FROM Usuario u WHERE u.nombre = :nombre AND u.contraseña = :contraseña AND u.activo = true")
    Optional<Usuario> findByNombreAndContraseña(@Param("nombre") String nombre, @Param("contraseña") String contraseña);

    // Buscar por rol
    List<Usuario> findByRolAndActivoTrue(Usuario.RolUsuario rol);

    // Verificar si existe usuario con nombre
    boolean existsByNombreAndActivoTrue(String nombre);
}

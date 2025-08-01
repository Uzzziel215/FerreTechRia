package com.ferreteria.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Column(name = "nombre", nullable = false, unique = true, length = 100)
    private String nombre;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Column(name = "contraseña", nullable = false, length = 255)
    private String contraseña;
    
    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 20)
    private RolUsuario rol;
    
    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    // Enum para roles
    public enum RolUsuario {
        administrador, vendedor, cajero
    }

    // Constructores
    public Usuario() {}

    public Usuario(String nombre, String contraseña, RolUsuario rol) {
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.rol = rol;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getContraseña() { return contraseña; }
    public void setContraseña(String contraseña) { this.contraseña = contraseña; }

    public RolUsuario getRol() { return rol; }
    public void setRol(RolUsuario rol) { this.rol = rol; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    // Métodos de negocio
    public boolean esAdministrador() {
        return RolUsuario.administrador.equals(this.rol);
    }

    public boolean esVendedor() {
        return RolUsuario.vendedor.equals(this.rol);
    }

    public boolean esCajero() {
        return RolUsuario.cajero.equals(this.rol);
    }

    public boolean tienePermiso(String accion) {
        switch (this.rol) {
            case administrador:
                return true; // Administrador tiene todos los permisos
            case vendedor:
                return accion.equals("vender") || accion.equals("consultar");
            case cajero:
                return accion.equals("vender") || accion.equals("consultar") || accion.equals("devolucion");
            default:
                return false;
        }
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", rol='" + rol + '\'' +
                '}';
    }
}

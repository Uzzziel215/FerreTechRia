package com.ferreteria.model;

import jakarta.validation.constraints.Size;

public class UsuarioActualizacionDTO {

    @Size(min = 3, max = 100, message = "El nombre de usuario debe tener entre 3 y 100 caracteres")
    private String nombre;

    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String contraseña;

    private Usuario.RolUsuario rol;

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public Usuario.RolUsuario getRol() {
        return rol;
    }

    public void setRol(Usuario.RolUsuario rol) {
        this.rol = rol;
    }
}

package com.ferreteria.service;

import com.ferreteria.model.Usuario;
import com.ferreteria.model.UsuarioActualizacionDTO;
import com.ferreteria.model.UsuarioCreacionDTO;
import com.ferreteria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        validarUsuario(usuario);
        return usuarioRepository.save(usuario);
    }

    public Usuario crearUsuario(UsuarioCreacionDTO usuarioDTO) {
        Usuario usuario = new Usuario();
        usuario.setNombre(usuarioDTO.getNombre());
        usuario.setContraseña(passwordEncoder.encode(usuarioDTO.getContraseña()));
        usuario.setRol(usuarioDTO.getRol());
        return guardarUsuario(usuario);
    }

    public Usuario actualizarUsuario(Long id, UsuarioActualizacionDTO usuarioDTO) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));

        if (usuarioDTO.getNombre() != null && !usuarioDTO.getNombre().trim().isEmpty()) {
            usuarioExistente.setNombre(usuarioDTO.getNombre());
        }
        if (usuarioDTO.getContraseña() != null && !usuarioDTO.getContraseña().isEmpty()) {
            usuarioExistente.setContraseña(passwordEncoder.encode(usuarioDTO.getContraseña()));
        }
        if (usuarioDTO.getRol() != null) {
            usuarioExistente.setRol(usuarioDTO.getRol());
        }

        return usuarioRepository.save(usuarioExistente);
    }

    public void eliminarUsuario(Long id) {
        if (usuarioRepository.findById(id).isPresent()) {
            usuarioRepository.deleteById(id);
        } else {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
    }

    public boolean verificarPermisos(Long usuarioId, String accion) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        return usuario.map(u -> u.tienePermiso(accion)).orElse(false);
    }

    private void validarUsuario(Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario es obligatorio");
        }
        if (usuario.getContraseña() == null || usuario.getContraseña().trim().isEmpty()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (usuario.getRol() == null) {
            throw new IllegalArgumentException("El rol es obligatorio");
        }
    }
}

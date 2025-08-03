package com.ferreteria.service;

import com.ferreteria.model.Usuario;
import com.ferreteria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNombre(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new User(usuario.getNombre(), usuario.getContraseña(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name().toUpperCase())));
    }
}

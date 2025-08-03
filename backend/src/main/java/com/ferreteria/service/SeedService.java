package com.ferreteria.service;

import com.ferreteria.model.Producto;
import com.ferreteria.model.Usuario;
import com.ferreteria.repository.ProductoRepository;
import com.ferreteria.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SeedService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void poblarBaseDeDatos() {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setCorreo("admin@ferretech.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.RolUsuario.ADMIN);
            usuarioRepository.save(admin);

            Usuario user = new Usuario();
            user.setNombre("Usuario");
            user.setCorreo("user@ferretech.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRol(Usuario.RolUsuario.USER);
            usuarioRepository.save(user);
        }

        if (productoRepository.count() == 0) {
            Producto p1 = new Producto();
            p1.setNombre("Martillo");
            p1.setPrecio(new BigDecimal("150.00"));
            p1.setStock(100);

            Producto p2 = new Producto();
            p2.setNombre("Destornillador");
            p2.setPrecio(new BigDecimal("80.50"));
            p2.setStock(200);

            Producto p3 = new Producto();
            p3.setNombre("Taladro");
            p3.setPrecio(new BigDecimal("1200.00"));
            p3.setStock(50);

            productoRepository.saveAll(List.of(p1, p2, p3));
        }
    }
}

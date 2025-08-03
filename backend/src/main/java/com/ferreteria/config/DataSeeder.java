package com.ferreteria.config;

import com.ferreteria.model.Cliente;
import com.ferreteria.model.Producto;
import com.ferreteria.model.Usuario;
import com.ferreteria.repository.ClienteRepository;
import com.ferreteria.repository.ProductoRepository;
import com.ferreteria.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository,
                      ProductoRepository productoRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.productoRepository = productoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Solo ejecutar el seeder si el usuario 'admin' no existe.
        if (usuarioRepository.findByUsuario("admin").isEmpty()) {
            // Crear usuario administrador
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setUsuario("admin");
            admin.setContrasena(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.RolUsuario.ADMINISTRADOR);
            usuarioRepository.save(admin);

            // Poblar clientes solo si la tabla está vacía
            if (clienteRepository.count() == 0) {
                List<Cliente> clientes = List.of(
                    new Cliente("Juan Pérez", "921-123-4567", "juan@email.com", 5.0),
                    new Cliente("María González", "921-234-5678", "maria@email.com", 10.0),
                    new Cliente("Carlos Rodríguez", "921-345-6789", "carlos@email.com", 0.0),
                    new Cliente("Ana López", "921-456-7890", "ana@email.com", 15.0),
                    new Cliente("Luis Martínez", "921-567-8901", "luis@email.com", 8.0)
                );
                clienteRepository.saveAll(clientes);
            }

            // Poblar productos solo si la tabla está vacía
            if (productoRepository.count() == 0) {
                List<Producto> productos = List.of(
                    new Producto("Martillo 16oz", "Martillo de acero con mango de madera", 150.0, 25, 5, "7501234567890", "Herramientas SA", "Herramientas"),
                    new Producto("Destornillador Phillips", "Destornillador Phillips #2", 45.0, 50, 10, "7501234567891", "Herramientas SA", "Herramientas"),
                    new Producto("Tornillos 1/4\"", "Caja de tornillos galvanizados 1/4\" x 100 pzas", 85.0, 3, 5, "7501234567892", "Ferretería Industrial", "Tornillería"),
                    new Producto("Pintura Blanca 1L", "Pintura vinílica blanca 1 litro", 120.0, 15, 8, "7501234567893", "Pinturas del Norte", "Pinturas"),
                    new Producto("Cable Eléctrico 12AWG", "Cable eléctrico calibre 12 por metro", 25.0, 2, 10, "7501234567894", "Eléctricos Modernos", "Eléctricos")
                );
                productoRepository.saveAll(productos);
            }
        }
    }
}

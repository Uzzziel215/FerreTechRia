package com.ferreteria.service;

import com.ferreteria.model.Producto;
import com.ferreteria.model.Usuario;
import com.ferreteria.model.UsuarioCreacionDTO;
import com.ferreteria.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class SeedService {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public void poblarBaseDeDatos() {
        crearUsuariosSiNoExisten();
        crearProductosSiNoExisten();
    }

    private void crearUsuariosSiNoExisten() {
        if (usuarioService.obtenerTodosLosUsuarios().isEmpty()) {
            UsuarioCreacionDTO admin = new UsuarioCreacionDTO();
            admin.setNombre("Administrador");
            admin.setCorreo("admin@ferretechria.com");
            admin.setContrasena("admin123");
            admin.setRol(Usuario.RolUsuario.ADMIN);
            usuarioService.crearUsuario(admin);

            UsuarioCreacionDTO vendedor = new UsuarioCreacionDTO();
            vendedor.setNombre("Vendedor");
            vendedor.setCorreo("vendedor@ferretechria.com");
            vendedor.setContrasena("vendedor123");
            vendedor.setRol(Usuario.RolUsuario.VENDEDOR);
            usuarioService.crearUsuario(vendedor);
        }
    }

    private void crearProductosSiNoExisten() {
        if (productoRepository.count() == 0) {
            List<Producto> productos = Arrays.asList(
                    new Producto("Martillo de uña", "Martillo de acero forjado, 16 oz", "Truper", 150.00, 50),
                    new Producto("Desarmador plano", "Punta magnética, mango de goma", "Stanley", 75.50, 120),
                    new Producto("Pinzas de electricista", "Corte de cable y agarre, 8 pulgadas", "Klein Tools", 250.00, 75),
                    new Producto("Cinta métrica 5m", "Cinta de acero con freno automático", "Pretul", 89.90, 200),
                    new Producto("Juego de llaves Allen", "9 piezas, punta hexagonal", "Urrea", 120.00, 60)
            );
            productoRepository.saveAll(productos);
        }
    }
}

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
            admin.setNombre("admin"); // El login es por nombre de usuario
            admin.setContraseña("admin123");
            admin.setRol(Usuario.RolUsuario.administrador); // Enum en minúsculas
            usuarioService.crearUsuario(admin);

            UsuarioCreacionDTO vendedor = new UsuarioCreacionDTO();
            vendedor.setNombre("vendedor"); // El login es por nombre de usuario
            vendedor.setContraseña("vendedor123");
            vendedor.setRol(Usuario.RolUsuario.vendedor); // Enum en minúsculas
            usuarioService.crearUsuario(vendedor);
        }
    }

    private void crearProductosSiNoExisten() {
        if (productoRepository.count() == 0) {
            List<Producto> productos = Arrays.asList(
                    new Producto("Martillo de uña", "Martillo de acero forjado, 16 oz", 150.00, 50, 10, "7501234567890", "Truper", "Herramientas Manuales"),
                    new Producto("Desarmador plano", "Punta magnética, mango de goma", 75.50, 120, 20, "7501234567891", "Stanley", "Herramientas Manuales"),
                    new Producto("Pinzas de electricista", "Corte de cable y agarre, 8 pulgadas", 250.00, 75, 15, "7501234567892", "Klein Tools", "Herramientas Eléctricas"),
                    new Producto("Cinta métrica 5m", "Cinta de acero con freno automático", 89.90, 200, 25, "7501234567893", "Pretul", "Medición"),
                    new Producto("Juego de llaves Allen", "9 piezas, punta hexagonal", 120.00, 60, 10, "7501234567894", "Urrea", "Herramientas Manuales")
            );
            productoRepository.saveAll(productos);
        }
    }
}

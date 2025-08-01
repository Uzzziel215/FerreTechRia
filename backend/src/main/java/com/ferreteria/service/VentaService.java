package com.ferreteria.service;

import com.ferreteria.model.*;
import com.ferreteria.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private UsuarioService usuarioService;

    public List<Venta> obtenerTodasLasVentas() {
        return ventaRepository.findAll();
    }

    public Optional<Venta> obtenerVentaPorId(Long id) {
        return ventaRepository.findById(id);
    }

    public Venta procesarVenta(VentaDTO ventaDTO) {
        Venta venta = new Venta();

        // Asignar usuario
        Usuario usuario = usuarioService.obtenerUsuarioPorId(ventaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + ventaDTO.getUsuarioId()));
        venta.setUsuario(usuario);

        // Asignar cliente si se proporcionó
        if (ventaDTO.getClienteId() != null) {
            Cliente cliente = clienteService.obtenerClientePorId(ventaDTO.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + ventaDTO.getClienteId()));
            venta.setCliente(cliente);
        }

        // Mapear detalles y validar stock
        List<DetalleVenta> detalles = ventaDTO.getDetalles().stream()
                .map(dto -> {
                    Producto producto = productoService.obtenerProductoPorId(dto.getProductoId())
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + dto.getProductoId()));

                    if (!producto.tieneStock(dto.getCantidad())) {
                        throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
                    }

                    DetalleVenta detalle = new DetalleVenta();
                    detalle.setProducto(producto);
                    detalle.setCantidad(dto.getCantidad());
                    detalle.setPrecioUnitario(producto.getPrecio());
                    detalle.setVenta(venta); // Establecer la relación inversa
                    detalle.calcularSubtotal(); // Asegurar que se calcule el subtotal
                    return detalle;
                })
                .collect(Collectors.toList());

        venta.setDetalles(detalles);

        // Calcular total
        venta.calcularTotal();

        // Actualizar stock de productos
        for (DetalleVenta detalle : venta.getDetalles()) {
            productoService.actualizarStock(detalle.getProducto().getId(), detalle.getCantidad());
        }

        // Guardar venta
        return ventaRepository.save(venta);
    }

    public List<Venta> obtenerVentasPorFecha(LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.findByFechaBetween(inicio, fin);
    }

    public List<Venta> obtenerVentasDelDia(LocalDateTime fecha) {
        return ventaRepository.findVentasDelDia(fecha);
    }

    public List<Venta> obtenerVentasPorCliente(Long clienteId) {
        return ventaRepository.findByClienteIdOrderByFechaDesc(clienteId);
    }

    public List<Venta> obtenerVentasPorUsuario(Long usuarioId) {
        return ventaRepository.findByUsuarioIdOrderByFechaDesc(usuarioId);
    }

    public BigDecimal calcularTotalVentas(List<Venta> ventas) {
        return ventas.stream()
                .map(Venta::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public int contarProductosVendidos(List<Venta> ventas) {
        return ventas.stream()
                .mapToInt(Venta::getCantidadProductos)
                .sum();
    }

    // Método para simular impresión de ticket
    public String generarTicket(Long ventaId) {
        Optional<Venta> ventaOpt = obtenerVentaPorId(ventaId);
        if (ventaOpt.isEmpty()) {
            throw new RuntimeException("Venta no encontrada");
        }

        Venta venta = ventaOpt.get();
        StringBuilder ticket = new StringBuilder();
        
        ticket.append("=================================\n");
        ticket.append("        FERRETERÍA EL MARTILLO\n");
        ticket.append("=================================\n");
        ticket.append("Fecha: ").append(venta.getFecha()).append("\n");
        ticket.append("Ticket: #").append(venta.getId()).append("\n");
        
        if (venta.getUsuario() != null) {
            ticket.append("Vendedor: ").append(venta.getUsuario().getNombre()).append("\n");
        }
        
        if (venta.getCliente() != null) {
            ticket.append("Cliente: ").append(venta.getCliente().getNombre()).append("\n");
        } else {
            ticket.append("Cliente: General\n");
        }
        
        ticket.append("\n---------------------------------\n");
        ticket.append("PRODUCTOS:\n");
        
        for (DetalleVenta detalle : venta.getDetalles()) {
            ticket.append(detalle.getProducto().getNombre()).append("\n");
            ticket.append("  ").append(detalle.getCantidad())
                  .append(" x $").append(String.format("%.2f", detalle.getPrecioUnitario()))
                  .append(" = $").append(String.format("%.2f", detalle.getSubtotal())).append("\n");
        }
        
        ticket.append("\n---------------------------------\n");
        
        if (venta.getCliente() != null && venta.getCliente().tieneDescuento()) {
            double subtotal = venta.getDetalles().stream()
                    .mapToDouble(DetalleVenta::getSubtotal)
                    .sum();
            BigDecimal descuento = venta.getCliente().calcularDescuento(subtotal);
            
            ticket.append("Subtotal: $").append(String.format("%.2f", subtotal)).append("\n");
            ticket.append("Descuento (").append(venta.getCliente().getDescuento())
                  .append("%): -$").append(String.format("%.2f", descuento.doubleValue())).append("\n");
        }
        
        ticket.append("TOTAL: $").append(String.format("%.2f", venta.getTotal().doubleValue())).append("\n");
        ticket.append("\n=================================\n");
        ticket.append("    ¡GRACIAS POR SU COMPRA!\n");
        ticket.append("=================================\n");
        
        return ticket.toString();
    }
}

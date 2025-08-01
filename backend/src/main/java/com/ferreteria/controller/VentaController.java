package com.ferreteria.controller;

import com.ferreteria.model.Venta;
import com.ferreteria.model.VentaDTO;
import com.ferreteria.model.VentaResponseDTO;
import com.ferreteria.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "http://localhost:3000")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @GetMapping
    public ResponseEntity<List<VentaResponseDTO>> obtenerTodasLasVentas() {
        List<Venta> ventas = ventaService.obtenerTodasLasVentas();
        List<VentaResponseDTO> ventasDTO = ventas.stream()
                .map(VentaResponseDTO::fromVenta)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ventasDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VentaResponseDTO> obtenerVentaPorId(@PathVariable Long id) {
        Optional<Venta> venta = ventaService.obtenerVentaPorId(id);
        return venta.map(v -> ResponseEntity.ok(VentaResponseDTO.fromVenta(v)))
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> procesarVenta(@Valid @RequestBody VentaDTO ventaDTO) {
        try {
            Venta nuevaVenta = ventaService.procesarVenta(ventaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(VentaResponseDTO.fromVenta(nuevaVenta));
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<VentaResponseDTO>> obtenerVentasPorFecha(
            @RequestParam String inicio,
            @RequestParam String fin) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
            LocalDateTime fechaInicio = LocalDateTime.parse(inicio, formatter);
            LocalDateTime fechaFin = LocalDateTime.parse(fin, formatter);
            
            List<Venta> ventas = ventaService.obtenerVentasPorFecha(fechaInicio, fechaFin);
            List<VentaResponseDTO> ventasDTO = ventas.stream()
                    .map(VentaResponseDTO::fromVenta)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ventasDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/hoy")
    public ResponseEntity<List<VentaResponseDTO>> obtenerVentasDelDia() {
        List<Venta> ventas = ventaService.obtenerVentasDelDia(LocalDateTime.now());
        List<VentaResponseDTO> ventasDTO = ventas.stream()
                .map(VentaResponseDTO::fromVenta)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ventasDTO);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<VentaResponseDTO>> obtenerVentasPorCliente(@PathVariable Long clienteId) {
        List<Venta> ventas = ventaService.obtenerVentasPorCliente(clienteId);
        List<VentaResponseDTO> ventasDTO = ventas.stream()
                .map(VentaResponseDTO::fromVenta)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ventasDTO);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<VentaResponseDTO>> obtenerVentasPorUsuario(@PathVariable Long usuarioId) {
        List<Venta> ventas = ventaService.obtenerVentasPorUsuario(usuarioId);
        List<VentaResponseDTO> ventasDTO = ventas.stream()
                .map(VentaResponseDTO::fromVenta)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ventasDTO);
    }

    @GetMapping("/reporte/diario")
    public ResponseEntity<Map<String, Object>> obtenerReporteDiario() {
        List<Venta> ventasHoy = ventaService.obtenerVentasDelDia(LocalDateTime.now());
        
        Map<String, Object> reporte = new HashMap<>();
        reporte.put("fecha", LocalDateTime.now().toLocalDate());
        reporte.put("cantidadVentas", ventasHoy.size());
        reporte.put("totalVentas", ventaService.calcularTotalVentas(ventasHoy).doubleValue());
        reporte.put("productosVendidos", ventaService.contarProductosVendidos(ventasHoy));
        reporte.put("ventas", ventasHoy.stream()
                .map(VentaResponseDTO::fromVenta)
                .collect(Collectors.toList()));
        
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/{id}/ticket")
    public ResponseEntity<?> generarTicket(@PathVariable Long id) {
        try {
            String ticket = ventaService.generarTicket(id);
            Map<String, String> response = new HashMap<>();
            response.put("ticket", ticket);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}

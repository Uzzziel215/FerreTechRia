package com.ferreteria.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class VentaResponseDTO {
    
    private Long id;
    private LocalDateTime fecha;
    private ClienteResponseDTO cliente;
    private UsuarioResponseDTO usuario;
    private List<DetalleVentaResponseDTO> detalles;
    private BigDecimal total;
    private String estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;

    // Constructor desde entidad Venta
    public static VentaResponseDTO fromVenta(Venta venta) {
        VentaResponseDTO dto = new VentaResponseDTO();
        dto.setId(venta.getId());
        dto.setFecha(venta.getFecha());
        dto.setTotal(venta.getTotal());
        dto.setEstado(venta.getEstado().name());
        dto.setFechaCreacion(venta.getFechaCreacion());
        dto.setFechaActualizacion(venta.getFechaActualizacion());
        
        // Mapear cliente si existe
        if (venta.getCliente() != null) {
            dto.setCliente(ClienteResponseDTO.fromCliente(venta.getCliente()));
        }
        
        // Mapear usuario si existe
        if (venta.getUsuario() != null) {
            dto.setUsuario(UsuarioResponseDTO.fromUsuario(venta.getUsuario()));
        }
        
        // Mapear detalles
        if (venta.getDetalles() != null) {
            dto.setDetalles(venta.getDetalles().stream()
                    .map(DetalleVentaResponseDTO::fromDetalleVenta)
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public ClienteResponseDTO getCliente() { return cliente; }
    public void setCliente(ClienteResponseDTO cliente) { this.cliente = cliente; }

    public UsuarioResponseDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioResponseDTO usuario) { this.usuario = usuario; }

    public List<DetalleVentaResponseDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetalleVentaResponseDTO> detalles) { this.detalles = detalles; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
} 
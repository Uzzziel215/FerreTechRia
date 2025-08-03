package com.ferreteria.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DetalleVentaResponseDTO {
    
    private Long id;
    private Long ventaId;
    private ProductoResponseDTO producto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private LocalDateTime fechaCreacion;

    // Constructor desde entidad DetalleVenta
    public static DetalleVentaResponseDTO fromDetalleVenta(DetalleVenta detalle) {
        DetalleVentaResponseDTO dto = new DetalleVentaResponseDTO();
        dto.setId(detalle.getId());
        dto.setVentaId(detalle.getVentaId());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setSubtotal(detalle.getSubtotal());
        dto.setFechaCreacion(detalle.getFechaCreacion());
        
        // Mapear producto si existe
        if (detalle.getProducto() != null) {
            dto.setProducto(ProductoResponseDTO.fromProducto(detalle.getProducto()));
        }
        
        return dto;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getVentaId() { return ventaId; }
    public void setVentaId(Long ventaId) { this.ventaId = ventaId; }

    public ProductoResponseDTO getProducto() { return producto; }
    public void setProducto(ProductoResponseDTO producto) { this.producto = producto; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}

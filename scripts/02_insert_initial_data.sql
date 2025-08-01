-- =====================================================
-- DATOS INICIALES PARA TESTING
-- =====================================================

-- Insertar usuarios iniciales
INSERT INTO usuarios (nombre, contraseña, rol) VALUES
('Admin Principal', 'admin123', 'administrador'),
('Vendedor 1', 'vend123', 'vendedor'),
('Cajero 1', 'caj123', 'cajero'),
('María Vendedora', 'maria123', 'vendedor');

-- Insertar clientes iniciales
INSERT INTO clientes (nombre, telefono, email, descuento) VALUES
('Juan Pérez', '921-123-4567', 'juan@email.com', 5.0),
('María González', '921-234-5678', 'maria@email.com', 10.0),
('Carlos Rodríguez', '921-345-6789', 'carlos@email.com', 0.0),
('Ana López', '921-456-7890', 'ana@email.com', 15.0),
('Luis Martínez', '921-567-8901', 'luis@email.com', 8.0);

-- Insertar productos iniciales
INSERT INTO productos (nombre, descripcion, precio, stock, stock_minimo, codigo_barras, proveedor, categoria) VALUES
('Martillo 16oz', 'Martillo de acero con mango de madera', 150.0, 25, 5, '7501234567890', 'Herramientas SA', 'Herramientas'),
('Destornillador Phillips', 'Destornillador Phillips #2', 45.0, 50, 10, '7501234567891', 'Herramientas SA', 'Herramientas'),
('Tornillos 1/4"', 'Caja de tornillos galvanizados 1/4" x 100 pzas', 85.0, 3, 5, '7501234567892', 'Ferretería Industrial', 'Tornillería'),
('Pintura Blanca 1L', 'Pintura vinílica blanca 1 litro', 120.0, 15, 8, '7501234567893', 'Pinturas del Norte', 'Pinturas'),
('Cable Eléctrico 12AWG', 'Cable eléctrico calibre 12 por metro', 25.0, 2, 10, '7501234567894', 'Eléctricos Modernos', 'Eléctricos');

COMMIT;

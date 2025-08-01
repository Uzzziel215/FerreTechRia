-- =====================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - FERRETERÍA
-- Sistema de Gestión de Ventas
-- PostgreSQL 12+
-- =====================================================

-- Crear la base de datos (ejecutar como superusuario)
-- CREATE DATABASE ferreteria_db;
-- \c ferreteria_db;

-- =====================================================
-- TABLA: usuarios
-- Gestión de usuarios del sistema con roles
-- =====================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('administrador', 'vendedor', 'cajero')),
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_nombre ON usuarios(nombre);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- =====================================================
-- TABLA: clientes
-- Gestión de clientes con descuentos
-- =====================================================
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    descuento DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (descuento >= 0 AND descuento <= 100),
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para clientes
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_activo ON clientes(activo);
CREATE INDEX idx_clientes_descuento ON clientes(descuento) WHERE descuento > 0;

-- Restricción única para email (solo si no es nulo)
CREATE UNIQUE INDEX idx_clientes_email_unique ON clientes(email) WHERE email IS NOT NULL AND email != '';

-- =====================================================
-- TABLA: productos
-- Catálogo de productos con control de inventario
-- =====================================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    stock_minimo INTEGER NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    codigo_barras VARCHAR(50),
    proveedor VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para productos
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_proveedor ON productos(proveedor);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_stock_bajo ON productos(stock, stock_minimo) WHERE stock <= stock_minimo;

-- Índice único para código de barras (solo si no es nulo)
CREATE UNIQUE INDEX idx_productos_codigo_barras_unique ON productos(codigo_barras) 
WHERE codigo_barras IS NOT NULL AND codigo_barras != '';

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX idx_productos_busqueda ON productos(nombre, categoria, proveedor) WHERE activo = true;

-- =====================================================
-- TABLA: ventas
-- Registro de ventas realizadas
-- =====================================================
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cliente_id INTEGER REFERENCES clientes(id) ON DELETE SET NULL,
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    estado VARCHAR(20) NOT NULL DEFAULT 'COMPLETADA' CHECK (estado IN ('COMPLETADA', 'CANCELADA', 'DEVUELTA')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para ventas
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_cliente_id ON ventas(cliente_id);
CREATE INDEX idx_ventas_usuario_id ON ventas(usuario_id);
CREATE INDEX idx_ventas_estado ON ventas(estado);
CREATE INDEX idx_ventas_total ON ventas(total);

-- Índices compuestos para reportes
CREATE INDEX idx_ventas_fecha_estado ON ventas(fecha, estado);
CREATE INDEX idx_ventas_usuario_fecha ON ventas(usuario_id, fecha);
CREATE INDEX idx_ventas_cliente_fecha ON ventas(cliente_id, fecha) WHERE cliente_id IS NOT NULL;

-- =====================================================
-- TABLA: detalle_ventas
-- Detalle de productos vendidos en cada venta
-- =====================================================
CREATE TABLE detalle_ventas (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario > 0),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para detalle_ventas
CREATE INDEX idx_detalle_ventas_venta_id ON detalle_ventas(venta_id);
CREATE INDEX idx_detalle_ventas_producto_id ON detalle_ventas(producto_id);

-- Índice compuesto para consultas frecuentes
CREATE INDEX idx_detalle_ventas_venta_producto ON detalle_ventas(venta_id, producto_id);

-- Restricción para evitar duplicados de producto en la misma venta
CREATE UNIQUE INDEX idx_detalle_ventas_unique ON detalle_ventas(venta_id, producto_id);

-- =====================================================
-- TABLA: devoluciones (OPCIONAL - Para futuras implementaciones)
-- Registro de devoluciones de productos
-- =====================================================
CREATE TABLE devoluciones (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE RESTRICT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT NOT NULL,
    total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    estado VARCHAR(20) NOT NULL DEFAULT 'PROCESADA' CHECK (estado IN ('PROCESADA', 'CANCELADA')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para devoluciones
CREATE INDEX idx_devoluciones_venta_id ON devoluciones(venta_id);
CREATE INDEX idx_devoluciones_fecha ON devoluciones(fecha);
CREATE INDEX idx_devoluciones_usuario_id ON devoluciones(usuario_id);

-- =====================================================
-- TABLA: detalle_devoluciones (OPCIONAL)
-- Detalle de productos devueltos
-- =====================================================
CREATE TABLE detalle_devoluciones (
    id SERIAL PRIMARY KEY,
    devolucion_id INTEGER NOT NULL REFERENCES devoluciones(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario > 0),
    subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para detalle_devoluciones
CREATE INDEX idx_detalle_devoluciones_devolucion_id ON detalle_devoluciones(devolucion_id);
CREATE INDEX idx_detalle_devoluciones_producto_id ON detalle_devoluciones(producto_id);

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- Automatización de procesos de negocio
-- =====================================================

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar fecha_actualizacion
CREATE TRIGGER trigger_usuarios_fecha_actualizacion
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_clientes_fecha_actualizacion
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_productos_fecha_actualizacion
    BEFORE UPDATE ON productos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_ventas_fecha_actualizacion
    BEFORE UPDATE ON ventas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

-- =====================================================
-- FUNCIÓN: Calcular subtotal automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_subtotal_detalle()
RETURNS TRIGGER AS $$
BEGIN
    NEW.subtotal = NEW.cantidad * NEW.precio_unitario;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular subtotal en detalle_ventas
CREATE TRIGGER trigger_detalle_ventas_subtotal
    BEFORE INSERT OR UPDATE ON detalle_ventas
    FOR EACH ROW
    EXECUTE FUNCTION calcular_subtotal_detalle();

-- Trigger para calcular subtotal en detalle_devoluciones
CREATE TRIGGER trigger_detalle_devoluciones_subtotal
    BEFORE INSERT OR UPDATE ON detalle_devoluciones
    FOR EACH ROW
    EXECUTE FUNCTION calcular_subtotal_detalle();

-- =====================================================
-- FUNCIÓN: Actualizar total de venta automáticamente
-- =====================================================
CREATE OR REPLACE FUNCTION actualizar_total_venta()
RETURNS TRIGGER AS $$
DECLARE
    nuevo_total DECIMAL(12,2);
    descuento_cliente DECIMAL(5,2) DEFAULT 0;
BEGIN
    -- Calcular subtotal de todos los detalles
    SELECT COALESCE(SUM(subtotal), 0) INTO nuevo_total
    FROM detalle_ventas 
    WHERE venta_id = COALESCE(NEW.venta_id, OLD.venta_id);
    
    -- Obtener descuento del cliente si existe
    SELECT COALESCE(c.descuento, 0) INTO descuento_cliente
    FROM ventas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    WHERE v.id = COALESCE(NEW.venta_id, OLD.venta_id);
    
    -- Aplicar descuento
    nuevo_total = nuevo_total * (1 - descuento_cliente / 100);
    
    -- Actualizar total en la venta
    UPDATE ventas 
    SET total = nuevo_total 
    WHERE id = COALESCE(NEW.venta_id, OLD.venta_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar total de venta
CREATE TRIGGER trigger_actualizar_total_venta_insert
    AFTER INSERT ON detalle_ventas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_total_venta();

CREATE TRIGGER trigger_actualizar_total_venta_update
    AFTER UPDATE ON detalle_ventas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_total_venta();

CREATE TRIGGER trigger_actualizar_total_venta_delete
    AFTER DELETE ON detalle_ventas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_total_venta();

-- =====================================================
-- VISTAS ÚTILES
-- Consultas frecuentes optimizadas
-- =====================================================

-- Vista: Productos con stock bajo
CREATE VIEW vista_productos_stock_bajo AS
SELECT 
    p.id,
    p.nombre,
    p.categoria,
    p.stock,
    p.stock_minimo,
    p.proveedor,
    (p.stock_minimo - p.stock) AS deficit_stock
FROM productos p
WHERE p.stock <= p.stock_minimo 
  AND p.activo = true
ORDER BY (p.stock_minimo - p.stock) DESC;

-- Vista: Resumen de ventas diarias
CREATE VIEW vista_ventas_diarias AS
SELECT 
    DATE(v.fecha) AS fecha,
    COUNT(*) AS cantidad_ventas,
    SUM(v.total) AS total_ventas,
    SUM(dv.cantidad) AS productos_vendidos,
    AVG(v.total) AS venta_promedio
FROM ventas v
JOIN detalle_ventas dv ON v.id = dv.venta_id
WHERE v.estado = 'COMPLETADA'
GROUP BY DATE(v.fecha)
ORDER BY fecha DESC;

-- Vista: Top productos más vendidos
CREATE VIEW vista_productos_mas_vendidos AS
SELECT 
    p.id,
    p.nombre,
    p.categoria,
    SUM(dv.cantidad) AS total_vendido,
    COUNT(DISTINCT dv.venta_id) AS veces_vendido,
    SUM(dv.subtotal) AS ingresos_generados
FROM productos p
JOIN detalle_ventas dv ON p.id = dv.producto_id
JOIN ventas v ON dv.venta_id = v.id
WHERE v.estado = 'COMPLETADA'
GROUP BY p.id, p.nombre, p.categoria
ORDER BY total_vendido DESC;

-- =====================================================
-- COMENTARIOS EN TABLAS
-- Documentación del esquema
-- =====================================================

COMMENT ON TABLE usuarios IS 'Usuarios del sistema con roles y permisos';
COMMENT ON TABLE clientes IS 'Clientes registrados con información de contacto y descuentos';
COMMENT ON TABLE productos IS 'Catálogo de productos con control de inventario';
COMMENT ON TABLE ventas IS 'Registro de ventas realizadas en el sistema';
COMMENT ON TABLE detalle_ventas IS 'Detalle de productos vendidos en cada venta';
COMMENT ON TABLE devoluciones IS 'Registro de devoluciones de productos';
COMMENT ON TABLE detalle_devoluciones IS 'Detalle de productos devueltos';

-- Comentarios en columnas importantes
COMMENT ON COLUMN productos.stock IS 'Cantidad actual disponible en inventario';
COMMENT ON COLUMN productos.stock_minimo IS 'Nivel mínimo de stock para generar alertas';
COMMENT ON COLUMN clientes.descuento IS 'Porcentaje de descuento aplicable (0-100)';
COMMENT ON COLUMN ventas.total IS 'Total de la venta incluyendo descuentos aplicados';
COMMENT ON COLUMN detalle_ventas.precio_unitario IS 'Precio del producto al momento de la venta';

-- =====================================================
-- PERMISOS Y SEGURIDAD
-- =====================================================

-- Crear rol para la aplicación
-- CREATE ROLE ferreteria_app WITH LOGIN PASSWORD 'tu_password_seguro';

-- Otorgar permisos necesarios
-- GRANT CONNECT ON DATABASE ferreteria_db TO ferreteria_app;
-- GRANT USAGE ON SCHEMA public TO ferreteria_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ferreteria_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ferreteria_app;

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================

-- Verificar la creación de tablas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verificar índices creados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

COMMIT;

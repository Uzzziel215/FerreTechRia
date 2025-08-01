export interface Usuario {
  id: number
  nombre: string
  rol: "administrador" | "vendedor" | "cajero"
  contraseña?: string // La contraseña no siempre se envía al frontend
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  stockMinimo: number
  codigoBarras?: string
  proveedor: string
  categoria: string
}

export interface Cliente {
  id: number
  nombre: string
  telefono: string
  email: string
  descuento: number
  direccion?: string
  fechaNacimiento?: string
}

export interface DetalleVenta {
  productoId: number
  producto: Producto
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Venta {
  id: number
  fecha: Date
  clienteId?: number
  cliente?: Cliente
  detalles: DetalleVenta[]
  total: number
  usuarioId: number
  usuario: Usuario
}

export interface Devolucion {
  id: number
  ventaId: number
  fecha: Date
  motivo: string
  productos: DetalleVenta[]
  total: number
}

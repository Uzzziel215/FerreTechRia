import api from "./apiConfig"
import { toast } from "react-hot-toast"

export const obtenerTodasLasVentas = async () => {
  try {
    const response = await api.get("/ventas")
    return response.data
  } catch (error) {
    console.error("Error al obtener ventas:", error)
    throw error
  }
}

export const obtenerVentaPorId = async (id) => {
  try {
    const response = await api.get(`/ventas/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener venta:", error)
    throw error
  }
}

export const crearVenta = async (ventaData) => {
  try {
    const response = await api.post("/ventas", ventaData)
    toast.success("Venta procesada exitosamente")
    return response.data
  } catch (error) {
    console.error("Error al crear venta:", error)
    throw error
  }
}

export const obtenerVentasPorFecha = async (inicio, fin) => {
  try {
    const response = await api.get("/ventas/fecha", {
      params: { inicio, fin },
    })
    return response.data
  } catch (error) {
    console.error("Error al obtener ventas por fecha:", error)
    throw error
  }
}

export const obtenerVentasDelDia = async () => {
  try {
    const response = await api.get("/ventas/hoy")
    return response.data
  } catch (error) {
    console.error("Error al obtener ventas del día:", error)
    throw error
  }
}

export const obtenerVentasPorCliente = async (clienteId) => {
  try {
    const response = await api.get(`/ventas/cliente/${clienteId}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener ventas por cliente:", error)
    throw error
  }
}

export const obtenerVentasPorUsuario = async (usuarioId) => {
  try {
    const response = await api.get(`/ventas/usuario/${usuarioId}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener ventas por usuario:", error)
    throw error
  }
}

export const obtenerReporteDiario = async () => {
  try {
    const response = await api.get("/ventas/reporte/diario")
    return response.data
  } catch (error) {
    console.error("Error al obtener reporte diario:", error)
    throw error
  }
}

export const generarTicket = async (ventaId) => {
  try {
    const response = await api.get(`/ventas/${ventaId}/ticket`)
    return response.data
  } catch (error) {
    console.error("Error al generar ticket:", error)
    throw error
  }
}

// Funciones auxiliares para el frontend
export const calcularTotalVenta = (detalles) => {
  return detalles.reduce((total, detalle) => {
    return total + (detalle.precioUnitario * detalle.cantidad)
  }, 0)
}

export const validarStock = (producto, cantidad) => {
  return producto.stock >= cantidad
}

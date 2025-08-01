import api from "./apiConfig"
import { toast } from "react-hot-toast"

export const obtenerTodosLosProductos = async () => {
  try {
    const response = await api.get("/productos")
    return response.data
  } catch (error) {
    console.error("Error al obtener productos:", error)
    throw error
  }
}

export const obtenerProductoPorId = async (id) => {
  try {
    const response = await api.get(`/productos/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener producto:", error)
    throw error
  }
}

export const crearProducto = async (producto) => {
  try {
    const response = await api.post("/productos", producto)
    toast.success("Producto creado exitosamente")
    return response.data
  } catch (error) {
    console.error("Error al crear producto:", error)
    throw error
  }
}

export const actualizarProducto = async (id, producto) => {
  try {
    const response = await api.put(`/productos/${id}`, producto)
    toast.success("Producto actualizado exitosamente")
    return response.data
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    throw error
  }
}

export const eliminarProducto = async (id) => {
  try {
    await api.delete(`/productos/${id}`)
    toast.success("Producto eliminado exitosamente")
  } catch (error) {
    console.error("Error al eliminar producto:", error)
    throw error
  }
}

export const buscarProductos = async (termino) => {
  try {
    const response = await api.get("/productos/buscar", {
      params: { termino },
    })
    return response.data
  } catch (error) {
    console.error("Error al buscar productos:", error)
    throw error
  }
}

export const obtenerProductosConStockBajo = async () => {
  try {
    const response = await api.get("/productos/stock-bajo")
    return response.data
  } catch (error) {
    console.error("Error al obtener productos con stock bajo:", error)
    throw error
  }
}

export const obtenerCategorias = async () => {
  try {
    const response = await api.get("/productos/categorias")
    return response.data
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    throw error
  }
}

export const obtenerProveedores = async () => {
  try {
    const response = await api.get("/productos/proveedores")
    return response.data
  } catch (error) {
    console.error("Error al obtener proveedores:", error)
    throw error
  }
}

export const actualizarStock = async (id, cantidad) => {
  try {
    const response = await api.put(`/productos/${id}/stock`, null, {
      params: { cantidad },
    })
    toast.success("Stock actualizado exitosamente")
    return response.data
  } catch (error) {
    console.error("Error al actualizar stock:", error)
    throw error
  }
}

export const aumentarStock = async (id, cantidad) => {
  try {
    const response = await api.put(`/productos/${id}/aumentar-stock`, null, {
      params: { cantidad },
    })
    toast.success("Stock aumentado exitosamente")
    return response.data
  } catch (error) {
    console.error("Error al aumentar stock:", error)
    throw error
  }
}

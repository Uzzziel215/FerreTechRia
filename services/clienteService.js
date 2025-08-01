import api from "./apiConfig"
import { toast } from "react-hot-toast"

export const obtenerTodosLosClientes = async () => {
  try {
    const response = await api.get("/clientes")
    return response.data
  } catch (error) {
    console.error("Error al obtener clientes:", error)
    throw error
  }
}

export const obtenerClientePorId = async (id) => {
  try {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener cliente:", error)
    throw error
  }
}

export const crearCliente = async (cliente) => {
  try {
    const response = await api.post("/clientes", cliente)
    toast.success("Cliente creado exitosamente")
    return response.data
  } catch (error) {
    console.error("Error al crear cliente:", error)
    throw error
  }
}

export const actualizarCliente = async (id, cliente) => {
  try {
    const response = await api.put(`/clientes/${id}`, cliente)
    toast.success("Cliente actualizado exitosamente")
    return response.data
  } catch (error) {
    console.error("Error al actualizar cliente:", error)
    throw error
  }
}

export const eliminarCliente = async (id) => {
  try {
    await api.delete(`/clientes/${id}`)
    toast.success("Cliente eliminado exitosamente")
  } catch (error) {
    console.error("Error al eliminar cliente:", error)
    throw error
  }
}

export const buscarClientes = async (termino) => {
  try {
    const response = await api.get("/clientes/buscar", {
      params: { termino },
    })
    return response.data
  } catch (error) {
    console.error("Error al buscar clientes:", error)
    throw error
  }
}

export const obtenerClientesConDescuento = async () => {
  try {
    const response = await api.get("/clientes/con-descuento")
    return response.data
  } catch (error) {
    console.error("Error al obtener clientes con descuento:", error)
    throw error
  }
}

export const buscarClientePorEmail = async (email) => {
  try {
    const response = await api.get(`/clientes/email/${email}`)
    return response.data
  } catch (error) {
    console.error("Error al buscar cliente por email:", error)
    throw error
  }
}

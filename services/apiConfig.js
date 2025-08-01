import axios from "axios"
import { toast } from "react-hot-toast"

// Configuración base de axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Mostrar loading si es necesario
    if (config.showLoading !== false) {
      // Aquí podrías mostrar un loading global
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    let message = "Error inesperado"
    
    if (error.response) {
      // Error del servidor
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          message = data.error || "Datos inválidos"
          break
        case 401:
          message = "No autorizado"
          // Redirigir al login si es necesario
          break
        case 403:
          message = "Acceso denegado"
          break
        case 404:
          message = "Recurso no encontrado"
          break
        case 500:
          message = "Error del servidor"
          break
        default:
          message = data.error || `Error ${status}`
      }
    } else if (error.request) {
      // Error de red
      message = "Error de conexión. Verifica tu internet."
    } else {
      // Error de configuración
      message = "Error de configuración"
    }
    
    // Mostrar toast de error
    toast.error(message)
    
    return Promise.reject(error)
  }
)

export default api

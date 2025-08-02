import axios from "axios"

const API_URL = "http://localhost:8080/api"

export const login = async (nombre, contraseña) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios/login`, {
      nombre,
      contraseña,
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || "Error de autenticación")
    }
    throw new Error("Error de conexión")
  }
}

export const verificarSesion = () => {
  const usuario = localStorage.getItem("usuario")
  return usuario ? JSON.parse(usuario) : null
}

export const logout = () => {
  localStorage.removeItem("usuario")
}

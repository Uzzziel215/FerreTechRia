import api from "./apiConfig"

export const login = async (nombre, contraseña) => {
  // El interceptor de errores en apiConfig.js se encargará de los errores
  const response = await api.post("/usuarios/login", {
    nombre,
    contraseña,
  })
  return response.data
}

export const verificarSesion = () => {
  const usuario = localStorage.getItem("usuario")
  return usuario ? JSON.parse(usuario) : null
}

export const logout = () => {
  localStorage.removeItem("usuario")
}

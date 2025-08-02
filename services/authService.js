import api from './apiConfig';

export const login = async (nombre, contraseña) => {
  try {
    const response = await api.post('/usuarios/login', {
      nombre,
      contraseña,
    });
    return response.data;
  } catch (error) {
    // The error handling is already done by the interceptor in apiConfig.js
    // We just need to re-throw the error for the component to catch it.
    throw error;
  }
};

export const verificarSesion = () => {
  const usuario = localStorage.getItem("usuario")
  return usuario ? JSON.parse(usuario) : null
}

export const logout = () => {
  localStorage.removeItem("usuario")
}

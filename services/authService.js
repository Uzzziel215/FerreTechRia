import api from "./apiConfig";

export const login = async (username, password) => {
  const response = await api.post("/usuarios/login", {
    username,
    password,
  });

  if (response.data && response.data.jwt) {
    localStorage.setItem("token", response.data.jwt);
  }
  
  return response.data;
};

export const verificarSesion = () => {
  const token = localStorage.getItem("token");
  // En una app real, podrías decodificar el token para obtener datos del usuario.
  // Por ahora, solo verificamos si el token existe.
  return token ? { token } : null;
};

export const logout = () => {
  localStorage.removeItem("token");
  // Opcional: redirigir al usuario a la página de login
  window.location.href = '/login';
};

import api from "./apiConfig"

export const login = async (username, password) => {
  const response = await api.post("/usuarios/login", {
    username,
    password,
  });
  return response.data;
};

export const seedDatabase = async () => {
  const response = await api.post("/seed/poblar-base");
  return response.data;
};

import { axiosClient } from "./axiosClient";

export const centroFormacionApi = {
  list: () => axiosClient.get("/api/centros"),

  create: (data) =>
    axiosClient.post("/api/centros", data),

  update: (id, data) =>
    axiosClient.put(`/api/centros/${id}`, data),

  remove: (id) =>
    axiosClient.delete(`/api/centros/${id}`)
};

// Mantener compatibilidad con Register.jsx
export const obtenerCentros = () => {
  return axiosClient.get("/api/centros");
};
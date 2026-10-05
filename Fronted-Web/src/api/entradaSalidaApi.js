import { axiosClient } from "./axiosClient";

export const entradaSalidaApi = {
  list: () => axiosClient.get("/api/entrada-salida-aprendiz"),

  getById: (id) =>
    axiosClient.get(`/api/entrada-salida-aprendiz/${id}`),

  create: (data) =>
    axiosClient.post("/api/entrada-salida-aprendiz", data),

  update: (id, data) =>
    axiosClient.patch(`/api/entrada-salida-aprendiz/${id}`, data),

  remove: (id) =>
    axiosClient.delete(`/api/entrada-salida-aprendiz/${id}`),

  registrarEntrada: (data) =>
    axiosClient.post("/api/entrada-salida-aprendiz", {
      id_aprendiz: Number(data.id_aprendiz),
      id_codigo_gr: Number(data.id_codigo_gr),
      hora_entrada: new Date().toISOString(),
      hora_salida: null,
    }),

  registrarSalida: (id) =>
    axiosClient.patch(`/api/entrada-salida-aprendiz/${id}`, {
      hora_salida: new Date().toISOString(),
    }),
};
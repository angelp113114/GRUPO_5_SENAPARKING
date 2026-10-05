import { axiosClient } from "./axiosClient";

export const vehiculosApi = {
  list: () => axiosClient.get("/api/vehiculos"),

  getById: (id) =>
    axiosClient.get(`/api/vehiculos/${id}`),

  create: (data) =>
    axiosClient.post("/api/vehiculos", data),

  update: (id, data) =>
    axiosClient.put(`/api/vehiculos/${id}`, data),

  remove: (id) =>
    axiosClient.delete(`/api/vehiculos/${id}`),
};
import { axiosClient } from "./axiosClient";

export const configGrApi = {
  list: () => axiosClient.get("/api/config-gr"),
  create: (data) => axiosClient.post("/api/config-gr", data),
  update: (id, data) => axiosClient.put(`/api/config-gr/${id}`, data),
  remove: (id) => axiosClient.delete(`/api/config-gr/${id}`),
};
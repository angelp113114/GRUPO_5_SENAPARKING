import axios from "axios";

const API = "http://localhost:3000/api/tipo-documento";

export const tipoDocumentosApi = {
  list: () => axios.get(API),

  getById: (id) => axios.get(`${API}/${id}`),

  create: (data) => axios.post(API, data),

  update: (id, data) => axios.put(`${API}/${id}`, data),

  remove: (id) => axios.delete(`${API}/${id}`),
};
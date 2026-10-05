import { axiosClient } from "./axiosClient";

// Crear soporte
export const crearSoporte = async (data) => {
  const res = await axiosClient.post("/api/soportes", data);
  return res.data;
};

// Mis soportes
export const obtenerMisSoportes = async () => {
  const res = await axiosClient.get("/api/soportes/mios");
  return res.data;
};

// Todos los soportes
export const obtenerTodosSoportes = async () => {
  const res = await axiosClient.get("/api/soportes");
  return res.data;
};

// Responder soporte
export const responderSoporte = async (id, data) => {
  const res = await axiosClient.put(
    `/api/soportes/${id}`,
    data
  );

  return res.data;
};

export const obtenerReportesRecibidos = async () => {
  const res = await axiosClient.get(
    "/api/soportes/reportes-recibidos"
  );

  return res.data;
};
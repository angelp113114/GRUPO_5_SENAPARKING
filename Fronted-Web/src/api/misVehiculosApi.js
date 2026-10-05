import { axiosClient } from "./axiosClient";

export const obtenerMisVehiculos = async () => {
  const respuesta = await axiosClient.get(
    "/api/vehiculos/mis-vehiculos"
  );

  return respuesta.data;
};
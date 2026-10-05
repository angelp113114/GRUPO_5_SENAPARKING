import { axiosClient } from "./axiosClient";

export const carnetApi = {

  obtenerMiCarnet: async () => {
    const respuesta = await axiosClient.get(
      "/api/carnet/mi-carnet"
    );

    console.log(
      "🎫 RESPUESTA CARNETS:",
      respuesta.data
    );

    return respuesta.data;
  },

  obtenerPendientes: () =>
    axiosClient.get("/api/carnet/pendientes"),

  generar: (id) =>
    axiosClient.post(`/api/carnet/generar/${id}`),

  escanear: (codigoQr) =>
    axiosClient.post("/api/carnet/escanear", {
      codigoQr,
    }),

};
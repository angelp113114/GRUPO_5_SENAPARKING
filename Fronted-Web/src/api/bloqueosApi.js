import axiosClient from "./axiosClient";

// ==========================================
// OBTENER USUARIOS
// ==========================================

export const obtenerUsuarios = async (busqueda = "") => {
  const response = await axiosClient.get("/auth/users", {
    params: {
      nombre: busqueda,
      page: 1,
      limit: 100,
    },
  });

  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

// ==========================================
// REPORTAR USUARIO
// ==========================================

export const reportarUsuario = async (userId, motivo) => {
  const response = await axiosClient.post(
    "/api/usuarios/accion",
    {
      userId,
      tipo: "reporte",
      motivo,
    }
  );

  return response.data;
};

// ==========================================
// BLOQUEAR USUARIO
// ==========================================

export const bloquearUsuario = async (
  userId,
  motivo = ""
) => {
  const response = await axiosClient.post(
    "/api/usuarios/accion",
    {
      userId,
      tipo: "bloqueo",
      motivo,
    }
  );

  return response.data;
};

// ==========================================
// DESBLOQUEAR USUARIO
// ==========================================

export const desbloquearUsuario = async (
  userId
) => {
  const response = await axiosClient.post(
    "/api/usuarios/accion",
    {
      userId,
      tipo: "desbloqueo",
      motivo: "",
    }
  );

  return response.data;
};

// ==========================================
// OBTENER REPORTES
// ==========================================

export const obtenerReportes = async () => {
  const response = await axiosClient.get(
    "/api/usuarios/reportes"
  );

  if (Array.isArray(response.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};
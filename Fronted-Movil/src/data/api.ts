import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =========================================================
   CONFIGURACIÓN DEL BACKEND
   ========================================================= */

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'http://192.168.10.9:3000';

/* =========================================================
   AXIOS
   ========================================================= */

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

/* =========================================================
   TOKEN DE AUTENTICACIÓN
   ========================================================= */

api.interceptors.request.use(
  async (config) => {
    try {
     const token = await AsyncStorage.getItem('accessToken');

console.log('🔑 TOKEN GUARDADO:', token ? 'SÍ' : 'NO');

if (token) {
  config.headers = config.headers || {};
  config.headers.Authorization = `Bearer ${token}`;

  console.log(
    '🔐 AUTH ENVIADO:',
    `Bearer ${token.substring(0, 20)}...`
  );
}

      /*
       * Cuando enviamos FormData no establecemos manualmente
       * Content-Type.
       *
       * React Native/Axios genera automáticamente:
       *
       * multipart/form-data; boundary=...
       */

      if (config.data instanceof FormData) {
        if (config.headers) {
          delete config.headers['Content-Type'];
          delete config.headers['content-type'];
        }
      }

      console.log(
        '➡️ PETICIÓN:',
        config.method?.toUpperCase(),
        `${config.baseURL}${config.url}`
      );
    } catch (error) {
      console.log('❌ Error en interceptor:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* =========================================================
   MANEJO DE MENSAJES DE ERROR
   ========================================================= */

export const messageOf = (error: any): string => {
  console.log('❌ ERROR AXIOS:', error);

  if (error?.response) {
    console.log('Status:', error.response.status);
    console.log('Data:', error.response.data);

    return (
      error.response.data?.message ||
      error.response.data?.error ||
      `Error del servidor (${error.response.status})`
    );
  }

  if (error?.request) {
    return 'No se pudo conectar con el servidor. Verifica que el backend esté encendido y que el celular/PC estén en la misma red.';
  }

  return (
    error?.message ||
    'Error de conexión con el servidor'
  );
};

/* =========================================================
   URL PARA ARCHIVOS / FOTOS
   ========================================================= */

export const fileUrl = (
  name?: string | null
): string => {
  if (!name) {
    return '';
  }

  let fileName = String(name).trim();

  if (!fileName) {
    return '';
  }

  /*
   * Si el backend ya devuelve una URL completa.
   */

  if (
    fileName.startsWith('http://') ||
    fileName.startsWith('https://')
  ) {
    return fileName;
  }

  /*
   * Normalizar rutas de Windows/Linux.
   */

  fileName = fileName.replace(/\\/g, '/');

  fileName = fileName.replace(/^\/+/, '');

  fileName = fileName.replace(/^uploads\/+/i, '');

  return `${API_URL}/uploads/${encodeURI(fileName)}`;
};

/* =========================================================
   AUTENTICACIÓN
   ========================================================= */

export const auth = {
  login: (
    email: string,
    password: string,
    rol: string
  ) =>
    api.post('/auth/login', {
      email,
      password,
      rol,
    }),

  register: (data: any) =>
    api.post('/auth/register', data),

  recovery: (email: string) =>
    api.post('/auth/recuperar-password', {
      email,
    }),

  verify: (
    email: string,
    pin: string
  ) =>
    api.post('/auth/verificar-pin', {
      email,
      pin,
    }),

  resend: (email: string) =>
    api.post('/auth/reenviar-pin', {
      email,
    }),

  reset: (password: string) =>
    api.post('/auth/restablecer-password', {
      password,
    }),

  me: () =>
    api.get('/auth/me'),

  logout: () =>
    api.post('/auth/logout'),
};

/* =========================================================
   RECURSOS DEL SISTEMA
   ========================================================= */

export const resources = {

  /* =======================================================
     USUARIOS
     ======================================================= */

  user: (id: any) =>
    api.get(`/auth/users/${id}`),

  users: (params: any = {}) =>
    api.get('/auth/users', {
      params,
    }),

  updateUser: (
    id: any,
    data: any
  ) =>
    api.put(`/auth/users/${id}`, data),

  deleteUser: (id: any) =>
    api.delete(`/auth/users/${id}`),

  /* =======================================================
     NOTIFICACIONES
     ======================================================= */

  notifications: () =>
    api.get('/api/notificaciones'),

  markNotificationsRead: () =>
    api.put('/api/notificaciones/leidas'),

  /* =======================================================
     CENTROS DE FORMACIÓN
     ======================================================= */

  centers: () =>
    api.get('/api/centros'),

  createCenter: (data: any) =>
    api.post('/api/centros', data),

  updateCenter: (
    id: any,
    data: any
  ) =>
    api.put(`/api/centros/${id}`, data),

  deleteCenter: (id: any) =>
    api.delete(`/api/centros/${id}`),

  /* =======================================================
     TIPOS DE DOCUMENTO
     ======================================================= */

  docs: () =>
    api.get('/api/tipo-documento'),

  createDoc: (data: any) =>
    api.post('/api/tipo-documento', data),

  updateDoc: (
    id: any,
    data: any
  ) =>
    api.put(`/api/tipo-documento/${id}`, data),

  deleteDoc: (id: any) =>
    api.delete(`/api/tipo-documento/${id}`),

  /* =======================================================
     CONFIGURACIÓN GUARDA
     ======================================================= */

  config: () =>
    api.get('/api/config-gr'),

  createConfig: (data: any) =>
    api.post('/api/config-gr', data),

  updateConfig: (
    id: any,
    data: any
  ) =>
    api.put(`/api/config-gr/${id}`, data),

  deleteConfig: (id: any) =>
    api.delete(`/api/config-gr/${id}`),

  /* =======================================================
     VEHÍCULOS
     PAGINACIÓN + BÚSQUEDA
     ======================================================= */

  vehicles: (params: any = {}) =>
    api.get('/api/vehiculos', {
      params,
    }),

  myVehicles: (params: any = {}) =>
    api.get('/api/vehiculos/mis-vehiculos', {
      params,
    }),

  createVehicle: (data: any) =>
    api.post('/api/vehiculos', data),

  updateVehicle: (
    id: any,
    data: any
  ) =>
    api.put(`/api/vehiculos/${id}`, data),

  deleteVehicle: (id: any) =>
    api.delete(`/api/vehiculos/${id}`),

  /* =======================================================
     ENTRADAS Y SALIDAS
     ======================================================= */

  records: (params: any = {}) =>
    api.get('/api/entrada-salida-aprendiz', {
      params,
    }),

  reportRecords: (periodo: string) =>
    api.get(
      `/api/entrada-salida-aprendiz/reporte?periodo=${encodeURIComponent(
        periodo
      )}`
    ),

  updateRecord: (
    id: any,
    data: any
  ) =>
    api.patch(
      `/api/entrada-salida-aprendiz/${id}`,
      data
    ),

  deleteRecord: (id: any) =>
    api.delete(
      `/api/entrada-salida-aprendiz/${id}`
    ),

  /* =======================================================
     SOPORTES
     ======================================================= */

  supports: (params: any = {}) =>
    api.get('/api/soportes', {
      params,
    }),

  mySupports: (params: any = {}) =>
    api.get('/api/soportes/mios', {
      params,
    }),

  createSupport: (data: any) =>
    api.post('/api/soportes', data),

  respondSupport: (
    id: any,
    data: any
  ) =>
    api.put(`/api/soportes/${id}`, data),

  resolvedSupports: (params: any = {}) =>
    api.get('/api/soportes/reportes-recibidos', {
      params,
    }),

  /* =======================================================
     REPORTES GENERALES
     ======================================================= */

  reports: (params: any = {}) =>
    api.get('/api/reportes', {
      params,
    }),

  myReports: (params: any = {}) =>
    api.get('/api/reportes/mios', {
      params,
    }),

  createReport: (data: any) =>
    api.post('/api/reportes', data),

  /* =======================================================
     SOLICITUDES DE CARNET
     ======================================================= */

  requestsCarnet: (params: any = {}) =>
    api.get('/api/carnet/pendientes', {
      params,
    }),

  requestCarnet: (data: FormData) =>
    api.post('/api/solicitudes-carnet', data),

  approveCarnetRequest: (id: any) =>
    api.put(
      `/api/solicitudes-carnet/${id}/aprobar`
    ),

  rejectCarnetRequest: (id: any) =>
    api.put(
      `/api/solicitudes-carnet/${id}/rechazar`
    ),

  /* =======================================================
     REPORTES DE PETICIONES DE CARNET
     ======================================================= */

  carnetReport: (tipo: string) =>
    api.get('/api/carnet/reportes', {
      params: {
        tipo,
      },
    }),

  /* =======================================================
     CARNET
     ======================================================= */

  generateCarnet: (id: any) =>
    api.post(`/api/carnet/generar/${id}`),

  carnet: () =>
    api.get('/api/carnet/mi-carnet'),

  scan: (codigoQr: string) =>
    api.post('/api/carnet/escanear', {
      codigoQr,
    }),

  /* =======================================================
     SOLICITUDES DE ACTUALIZACIÓN
     PAGINACIÓN + BÚSQUEDA
     ======================================================= */

  requestsUpdate: (
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ) =>
    api.get('/api/solicitudes-actualizacion', {
      params: {
        page,
        limit,
        search,
      },
    }),

  approveUpdate: (id: any) =>
    api.put(
      `/api/solicitudes-actualizacion/${id}/aprobar`
    ),

  rejectUpdate: (id: any) =>
    api.put(
      `/api/solicitudes-actualizacion/${id}/rechazar`
    ),

  updateRequestsApprove: (id: any) =>
    api.put(
      `/api/solicitudes-actualizacion/${id}/aprobar`
    ),

  updateRequestsReject: (id: any) =>
    api.put(
      `/api/solicitudes-actualizacion/${id}/rechazar`
    ),

  /* =======================================================
     ACCIONES DE USUARIO
     ======================================================= */

  action: (data: any) =>
    api.post('/api/usuarios/accion', data),
};
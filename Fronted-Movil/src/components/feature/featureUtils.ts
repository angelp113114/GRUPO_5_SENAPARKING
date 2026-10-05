export const statusText = (s: any) => {
  const value = String(s ?? '').trim().toLowerCase();
  if (value === 'pendiente') return '⏳ Pendiente';
  if (value === 'resuelto' || value === 'solucionado' || value === 'solucionada' || value === 'cerrado' || value === 'cerrada') return '✅ Resuelto';
  if (value === 'en proceso') return '🟡 En proceso';
  if (value === 'aprobada') return '🟢 Aprobada';
  if (value === 'rechazada') return '❌ Rechazada';
  if (value === 'carnet_generado') return '⚡ Carnet generado';
  return s || 'Sin estado';
};

export const arr = (d: any) =>
  Array.isArray(d)
    ? d
    : (d?.data || d?.rows || d?.users || d?.solicitudes || d?.registros || d?.notificaciones || []);

export const uriFile = (a: any) =>
  a
    ? {
        uri: a.uri,
        name: a.fileName || a.name || `archivo-${Date.now()}`,
        type: a.mimeType || 'application/octet-stream',
      }
    : null;

export function docsArray(value: any) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const p = JSON.parse(value);
    return Array.isArray(p) ? p : [value];
  } catch {
    return [value];
  }
}

export const pretty = (k: string) =>
  ({
    nombres: 'Nombres',
    apellidos: 'Apellidos',
    documento: 'Documento',
    tipoDocumento: 'Tipo de documento',
    celular: 'Celular',
    ficha: 'Ficha',
    centroFormacionId: 'Centro de formación',
    fechaVinculacion: 'Fecha de vinculación',
  } as any)[k] || k;

export function emptyFor(k: string) {
  return (
    {
      notifications: 'No tienes notificaciones.',
      support: 'No tienes solicitudes de soporte.',
      supportAdmin: 'No hay soportes que coincidan con la búsqueda.',
      myVehicles: 'No tienes vehículos registrados.',
      vehicles: 'No hay vehículos registrados.',
      records: 'No hay registros de entrada y salida.',
      users: 'No hay usuarios que coincidan con el filtro.',
      blocks: 'No hay usuarios que coincidan con la búsqueda.',
      pending: 'No hay peticiones de carnet.',
      updateRequests: 'No hay peticiones de actualización.',
      centers: 'No hay centros de formación.',
      docs: 'No hay tipos de documento.',
      reports: 'No hay reportes solucionados.',
    } as any
  )[k] || 'No hay información.';
}

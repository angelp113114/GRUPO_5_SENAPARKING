import { useEffect, useMemo, useState } from "react";
import  axiosClient  from "../../api/axiosClient";
import "../../styles/administrador/solicitudesActualizacion.css";

export default function SolicitudesActualizacionAdmin() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [procesando, setProcesando] = useState(null);

  // =========================================================
  // FILTRO
  // =========================================================

  const [documentoBusqueda, setDocumentoBusqueda] = useState("");

  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const [paginaActual, setPaginaActual] = useState(1);

  const solicitudesPorPagina = 10;

  // =========================================================
  // CARGAR SOLICITUDES
  // =========================================================

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await axiosClient.get(
        "/api/solicitudes-actualizacion"
      );

      setSolicitudes(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error(
        "Error cargando solicitudes:",
        error
      );

      setSolicitudes([]);
    }
  };

  // =========================================================
  // FILTRAR POR DOCUMENTO
  // =========================================================

  const solicitudesFiltradas = useMemo(() => {
    const busqueda = documentoBusqueda
      .trim()
      .toLowerCase();

    if (!busqueda) {
      return solicitudes;
    }

    return solicitudes.filter((s) => {
      const documento = String(
        s.user?.documento || ""
      ).toLowerCase();

      return documento.includes(busqueda);
    });
  }, [solicitudes, documentoBusqueda]);

  // =========================================================
  // CUANDO CAMBIA EL FILTRO
  // VOLVER A LA PRIMERA PÁGINA
  // =========================================================

  useEffect(() => {
    setPaginaActual(1);
  }, [documentoBusqueda]);

  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const totalPaginas = Math.ceil(
    solicitudesFiltradas.length /
      solicitudesPorPagina
  );

  const indiceInicial =
    (paginaActual - 1) *
    solicitudesPorPagina;

  const indiceFinal =
    indiceInicial + solicitudesPorPagina;

  const solicitudesPagina =
    solicitudesFiltradas.slice(
      indiceInicial,
      indiceFinal
    );

  // =========================================================
  // CAMBIAR PÁGINA
  // =========================================================

  const cambiarPagina = (pagina) => {
    if (
      pagina < 1 ||
      pagina > totalPaginas
    ) {
      return;
    }

    setPaginaActual(pagina);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // APROBAR
  // =========================================================

  const aprobar = async (id) => {
    if (
      !id ||
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      alert(
        "No se pudo identificar la solicitud."
      );

      return;
    }

    try {
      setProcesando(id);

      const res = await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/aprobar`
      );

      alert(
        res.data?.message ||
          "Solicitud aprobada correctamente."
      );

      await cargarSolicitudes();
    } catch (error) {
      console.error(
        "Error al aprobar:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Error al aprobar la solicitud."
      );
    } finally {
      setProcesando(null);
    }
  };

  // =========================================================
  // RECHAZAR
  // =========================================================

  const rechazar = async (id) => {
    if (
      !id ||
      !Number.isInteger(Number(id)) ||
      Number(id) <= 0
    ) {
      alert(
        "No se pudo identificar la solicitud."
      );

      return;
    }

    try {
      setProcesando(id);

      const res = await axiosClient.put(
        `/api/solicitudes-actualizacion/${id}/rechazar`
      );

      alert(
        res.data?.message ||
          "Solicitud rechazada correctamente."
      );

      await cargarSolicitudes();
    } catch (error) {
      console.error(
        "Error al rechazar:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Error al rechazar la solicitud."
      );
    } finally {
      setProcesando(null);
    }
  };

  // =========================================================
  // MOSTRAR ESTADO
  // =========================================================

  const obtenerEstadoTexto = (estado) => {
    switch (String(estado).toLowerCase()) {
      case "pendiente":
        return "Pendiente";

      case "aprobada":
        return "Aprobada";

      case "rechazada":
        return "Rechazada";

      case "resuelto":
        return "Resuelto";

      default:
        return estado || "Sin estado";
    }
  };

  // =========================================================
  // OBTENER CLASE ESTADO
  // =========================================================

  const obtenerEstadoClase = (estado) => {
    switch (String(estado).toLowerCase()) {
      case "pendiente":
        return "estado-pendiente";

      case "aprobada":
        return "estado-aprobada";

      case "rechazada":
        return "estado-rechazada";

      case "resuelto":
        return "estado-resuelto";

      default:
        return "estado-default";
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="actualizaciones-page">

      <div className="actualizaciones-container">

        {/* =================================================
            ENCABEZADO
        ================================================= */}

        <div className="actualizaciones-header">

          <div>
            <span className="actualizaciones-label">
              SENA PARKING
            </span>

            <h1>
              Solicitudes de actualización
            </h1>

            <p>
              Revisa y gestiona las solicitudes de
              modificación enviadas por los aprendices.
            </p>
          </div>

          <div className="actualizaciones-contador">
            {solicitudesFiltradas.length}
          </div>

        </div>


        {/* =================================================
            BUSCADOR
        ================================================= */}

        <div className="filtro-actualizaciones">

          <div className="filtro-icono">
            🔎
          </div>

          <div className="filtro-contenido">

            <label htmlFor="buscarDocumento">
              Buscar por documento
            </label>

            <input
              id="buscarDocumento"
              type="text"
              placeholder="Escribe el número de documento..."
              value={documentoBusqueda}
              onChange={(e) =>
                setDocumentoBusqueda(
                  e.target.value
                )
              }
            />

          </div>

          {documentoBusqueda && (
            <button
              type="button"
              className="limpiar-filtro"
              onClick={() =>
                setDocumentoBusqueda("")
              }
            >
              Limpiar
            </button>
          )}

        </div>


        {/* =================================================
            INFORMACIÓN DEL FILTRO
        ================================================= */}

        <div className="resultado-info">

          <span>
            Mostrando{" "}
            <strong>
              {solicitudesFiltradas.length}
            </strong>{" "}
            solicitud
            {solicitudesFiltradas.length !== 1
              ? "es"
              : ""}
          </span>

          {totalPaginas > 0 && (
            <span>
              Página{" "}
              <strong>
                {paginaActual}
              </strong>{" "}
              de{" "}
              <strong>
                {totalPaginas}
              </strong>
            </span>
          )}

        </div>


        {/* =================================================
            SIN SOLICITUDES
        ================================================= */}

        {solicitudesFiltradas.length === 0 && (

          <div className="sin-solicitudes">

            <div className="sin-solicitudes-icono">
              📭
            </div>

            <h3>
              No se encontraron solicitudes
            </h3>

            <p>
              {documentoBusqueda
                ? "No existe ninguna actualización asociada a ese documento."
                : "No hay solicitudes de actualización registradas."
              }
            </p>

          </div>

        )}


        {/* =================================================
            LISTA
        ================================================= */}

        <div className="lista-actualizaciones">

          {solicitudesPagina.map((s) => {

            let datosActuales = {};
            let datosNuevos = {};
            let documentos = [];

            // =================================================
            // DATOS ACTUALES
            // =================================================

            try {
              datosActuales =
                typeof s.datosActuales === "string"
                  ? JSON.parse(
                      s.datosActuales
                    )
                  : s.datosActuales || {};
            } catch (error) {
              console.error(
                "Error leyendo datos actuales:",
                error
              );

              datosActuales = {};
            }

            // =================================================
            // DATOS NUEVOS
            // =================================================

            try {
              datosNuevos =
                typeof s.datosNuevos === "string"
                  ? JSON.parse(
                      s.datosNuevos
                    )
                  : s.datosNuevos || {};
            } catch (error) {
              console.error(
                "Error leyendo datos nuevos:",
                error
              );

              datosNuevos = {};
            }

            // =================================================
            // DOCUMENTOS
            // =================================================

            try {
              documentos =
                typeof s.documentos === "string"
                  ? JSON.parse(s.documentos)
                  : Array.isArray(
                      s.documentos
                    )
                  ? s.documentos
                  : [];
            } catch (error) {
              console.error(
                "Error leyendo documentos:",
                error
              );

              documentos = [];
            }

            return (
              <div
                key={s.id}
                className="actualizacion-card"
              >

                {/* =========================================
                    CABECERA
                ========================================= */}

                <div className="actualizacion-card-header">

                  <div className="usuario-info">

                    <div className="usuario-avatar">
                      {(s.user?.nombres || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <h2>
                        {s.user?.nombres ||
                          "Sin nombre"}{" "}
                        {s.user?.apellidos ||
                          ""}
                      </h2>

                      <span>
                        Solicitud #{s.id}
                      </span>

                    </div>

                  </div>

                  <span
                    className={`estado-badge ${obtenerEstadoClase(
                      s.estado
                    )}`}
                  >
                    {obtenerEstadoTexto(
                      s.estado
                    )}
                  </span>

                </div>


                {/* =========================================
                    INFORMACIÓN GENERAL
                ========================================= */}

                <div className="informacion-general">

                  <div className="informacion-item">
                    <span>
                      Documento
                    </span>

                    <strong>
                      {s.user?.documento ||
                        "-"}
                    </strong>
                  </div>

                  <div className="informacion-item">
                    <span>
                      Ficha
                    </span>

                    <strong>
                      {s.user?.ficha ||
                        "-"}
                    </strong>
                  </div>

                  <div className="informacion-item">
                    <span>
                      Tipo de actualización
                    </span>

                    <strong>
                      {s.tipo || "-"}
                    </strong>
                  </div>

                </div>


                {/* =========================================
                    COMPARACIÓN
                ========================================= */}

                <div className="comparacion-actualizacion">

                  {/* DATOS ACTUALES */}

                  <div className="datos-panel actuales">

                    <div className="datos-panel-header">

                      <div className="datos-icono">
                        📋
                      </div>

                      <div>
                        <h3>
                          Datos actuales
                        </h3>

                        <p>
                          Información registrada
                        </p>
                      </div>

                    </div>

                    <div className="datos-lista">

                      {Object.keys(
                        datosActuales
                      ).length === 0 ? (

                        <p className="sin-datos">
                          No hay datos registrados.
                        </p>

                      ) : (

                        Object.entries(
                          datosActuales
                        ).map(([k, v]) => (

                          <div
                            key={k}
                            className="dato-fila"
                          >

                            <strong>
                              {k}
                            </strong>

                            <span>
                              {v !== undefined &&
                              v !== null &&
                              v !== ""
                                ? String(v)
                                : "-"}
                            </span>

                          </div>

                        ))

                      )}

                    </div>

                  </div>


                  {/* DATOS NUEVOS */}

                  <div className="datos-panel nuevos">

                    <div className="datos-panel-header">

                      <div className="datos-icono">
                        ✏️
                      </div>

                      <div>
                        <h3>
                          Datos nuevos
                        </h3>

                        <p>
                          Información solicitada
                        </p>
                      </div>

                    </div>

                    <div className="datos-lista">

                      {Object.keys(
                        datosNuevos
                      ).length === 0 ? (

                        <p className="sin-datos">
                          No hay datos nuevos.
                        </p>

                      ) : (

                        Object.entries(
                          datosNuevos
                        ).map(([k, v]) => (

                          <div
                            key={k}
                            className="dato-fila"
                          >

                            <strong>
                              {k}
                            </strong>

                            <span>
                              {v !== undefined &&
                              v !== null &&
                              v !== ""
                                ? String(v)
                                : "-"}
                            </span>

                          </div>

                        ))

                      )}

                    </div>

                  </div>

                </div>


                {/* =========================================
                    FOTO NUEVA
                ========================================= */}

                {s.fotoNueva && (

                  <div className="archivos-actualizacion">

                    <h3>
                      📷 Nueva fotografía
                    </h3>

                    <div className="foto-nueva">

                      <img
                        src={`http://localhost:3000/${String(
                          s.fotoNueva
                        ).replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt="Nueva fotografía"
                      />

                    </div>

                  </div>

                )}


                {/* =========================================
                    DOCUMENTOS
                ========================================= */}

                {documentos.length > 0 && (

                  <div className="archivos-actualizacion">

                    <h3>
                      📎 Documentos anexos
                    </h3>

                    <div className="documentos-lista">

                      {documentos.map(
                        (d, i) => (

                          <div
                            key={i}
                            className="documento-item"
                          >

                            <div className="documento-nombre">

                              <span className="documento-icono">
                                📄
                              </span>

                              <span>
                                {d.nombre ||
                                  `Documento ${
                                    i + 1
                                  }`}
                              </span>

                            </div>

                            {d.ruta && (

                              <a
                                href={`http://localhost:3000/${String(
                                  d.ruta
                                ).replace(
                                  /\\/g,
                                  "/"
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="documento-ver"
                              >
                                Ver documento
                              </a>

                            )}

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}


                {/* =========================================
                    ACCIONES
                ========================================= */}

                {s.estado === "pendiente" && (

                  <div className="acciones-actualizacion">

                    <div className="acciones-titulo">
                      <span>
                        Acción requerida
                      </span>

                      <small>
                        Revisa la información antes
                        de responder.
                      </small>
                    </div>

                    <div className="acciones-botones">

                      <button
                        type="button"
                        className="btn-aprobar-actualizacion"
                        disabled={
                          procesando !== null
                        }
                        onClick={() =>
                          aprobar(s.id)
                        }
                      >

                        {procesando === s.id
                          ? "Procesando..."
                          : "✓ Aprobar actualización"}

                      </button>

                      <button
                        type="button"
                        className="btn-rechazar-actualizacion"
                        disabled={
                          procesando !== null
                        }
                        onClick={() =>
                          rechazar(s.id)
                        }
                      >

                        {procesando === s.id
                          ? "Procesando..."
                          : "✕ Rechazar actualización"}

                      </button>

                    </div>

                  </div>

                )}

              </div>
            );
          })}

        </div>


        {/* =================================================
            PAGINACIÓN
        ================================================= */}

        {totalPaginas > 1 && (

          <div className="paginacion-actualizaciones">

            <button
              type="button"
              className="pagina-flecha"
              disabled={paginaActual === 1}
              onClick={() =>
                cambiarPagina(
                  paginaActual - 1
                )
              }
            >
              ← Anterior
            </button>


            <div className="numeros-pagina">

              {Array.from(
                { length: totalPaginas },
                (_, index) => index + 1
              ).map((pagina) => (

                <button
                  key={pagina}
                  type="button"
                  className={
                    pagina === paginaActual
                      ? "pagina activa"
                      : "pagina"
                  }
                  onClick={() =>
                    cambiarPagina(
                      pagina
                    )
                  }
                >
                  {pagina}
                </button>

              ))}

            </div>


            <button
              type="button"
              className="pagina-flecha"
              disabled={
                paginaActual ===
                totalPaginas
              }
              onClick={() =>
                cambiarPagina(
                  paginaActual + 1
                )
              }
            >
              Siguiente →
            </button>

          </div>

        )}

      </div>

    </div>
  );
}
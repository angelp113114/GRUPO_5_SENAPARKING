import { useEffect, useState } from "react";
import  axiosClient  from "../../api/axiosClient";
import "../../styles/administrador/verPeticiones.css";
import GenerarCarnet from "./GenerarCarnet";

// ======================================================
// URL DE LOS ARCHIVOS
// ======================================================

const URL_UPLOADS = "http://localhost:3000/uploads";

// ======================================================
// OBTENER URL DEL ARCHIVO
// ======================================================

const obtenerUrlArchivo = (archivo) => {
  if (!archivo) return null;

  return `${URL_UPLOADS}/${encodeURIComponent(archivo)}`;
};

export default function VerPeticiones() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ====================================================
  // CARGAR SOLICITUDES
  // ====================================================

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.get(
        "/api/solicitudes-carnet"
      );

      console.log(
        "📦 SOLICITUDES RECIBIDAS:",
        res.data
      );

      setSolicitudes(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (error) {

      console.error(
        "❌ ERROR CARGANDO SOLICITUDES:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Error al cargar las solicitudes"
      );

    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // CARGAR AL ENTRAR
  // ====================================================

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // ====================================================
  // APROBAR
  // ====================================================

  const aprobar = async (id) => {
    try {

      await axiosClient.put(
        `/api/solicitudes-carnet/${id}/aprobar`
      );

      alert(
        "Solicitud aprobada correctamente"
      );

      await cargarSolicitudes();

    } catch (error) {

      console.error(
        "❌ ERROR APROBAR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Error al aprobar la solicitud"
      );
    }
  };

  // ====================================================
  // RECHAZAR
  // ====================================================

  const rechazar = async (id) => {
    try {

      await axiosClient.put(
        `/api/solicitudes-carnet/${id}/rechazar`
      );

      alert(
        "Solicitud rechazada correctamente"
      );

      await cargarSolicitudes();

    } catch (error) {

      console.error(
        "❌ ERROR RECHAZAR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Error al rechazar la solicitud"
      );
    }
  };

  // ====================================================
  // MOSTRAR IMAGEN
  // ====================================================

  const verImagen = (archivo) => {

    if (!archivo) {
      return (
        <span className="sin-archivo">
          No adjunto
        </span>
      );
    }

    const url =
      obtenerUrlArchivo(archivo);

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="link-archivo"
      >
        🖼️ Ver imagen
      </a>
    );
  };

  // ====================================================
  // MOSTRAR ARCHIVO
  // ====================================================

  const verArchivo = (archivo) => {

    if (!archivo) {
      return (
        <span className="sin-archivo">
          No adjunto
        </span>
      );
    }

    const url =
      obtenerUrlArchivo(archivo);

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="link-archivo"
      >
        📄 Ver archivo
      </a>
    );
  };

  // ====================================================
  // CARGANDO
  // ====================================================

  if (loading) {
    return (
      <div className="peticiones-page">

        <div className="content-box">

          <h1>
            Solicitudes de Carnet
          </h1>

          <p>
            Cargando solicitudes...
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // VISTA
  // ====================================================

  return (
    <div className="peticiones-page">

      <div className="content-box">

        <h1>
          Solicitudes de Carnet
        </h1>

        <div className="tabla-contenedor">

          <table className="tablaSolicitudes">

            <thead>

              <tr>

                <th>Documento</th>

                <th>Aprendiz</th>

                <th>Ficha</th>

                <th>Tipo</th>

                <th>Marca</th>

                <th>Color</th>

                <th>Serial / Placa</th>

                <th>Cilindraje</th>

                <th>Modelo</th>

                <th>Estado</th>

                {/* FOTOS */}

                <th>Foto Aprendiz</th>

                <th>Foto Vehículo</th>

                <th>Foto Cédula</th>

                <th>Tarjeta Propiedad</th>

                <th>Placa / Serial</th>

                {/* MOTO */}

                <th>SOAT</th>

                <th>Tecnomecánica</th>

                {/* ACCIONES */}

                <th>Acciones</th>

              </tr>

            </thead>

            <tbody>

              {solicitudes.length > 0 ? (

                solicitudes.map((s) => (

                  <tr key={s.id}>

                    {/* ================================
                        DOCUMENTO
                    ================================= */}

                    <td>
                      {s.user?.documento || "-"}
                    </td>

                    {/* ================================
                        APRENDIZ
                    ================================= */}

                    <td>

                      {s.user?.nombres || ""}

                      {" "}

                      {s.user?.apellidos || ""}

                    </td>

                    {/* ================================
                        FICHA
                    ================================= */}

                    <td>
                      {s.user?.ficha || "-"}
                    </td>

                    {/* ================================
                        TIPO
                    ================================= */}

                    <td>
                      {s.tipoVehiculo || "-"}
                    </td>

                    {/* ================================
                        MARCA
                    ================================= */}

                    <td>
                      {s.marca || "-"}
                    </td>

                    {/* ================================
                        COLOR
                    ================================= */}

                    <td>
                      {s.color || "-"}
                    </td>

                    {/* ================================
                        SERIAL / PLACA
                    ================================= */}

                    <td>
                      {s.serialPlaca || "-"}
                    </td>

                    {/* ================================
                        CILINDRAJE
                    ================================= */}

                    <td>
                      {s.cilindraje || "-"}
                    </td>

                    {/* ================================
                        MODELO
                    ================================= */}

                    <td>
                      {s.modelo || "-"}
                    </td>

                    {/* ================================
                        ESTADO
                    ================================= */}

                    <td>

                      {s.estado === "pendiente" && (
                        <strong className="estado pendiente">
                          ⏳ Pendiente
                        </strong>
                      )}

                      {s.estado === "aprobada" && (
                        <strong className="estado aprobada">
                          🟢 Aprobada
                        </strong>
                      )}

                      {s.estado === "rechazada" && (
                        <strong className="estado rechazada">
                          ❌ Rechazada
                        </strong>
                      )}

                      {s.estado === "carnet_generado" && (
                        <strong className="estado generado">
                          ⚡ Carnet generado
                        </strong>
                      )}

                    </td>

                    {/* ================================
                        FOTO APRENDIZ
                    ================================= */}

                    <td>
                      {verImagen(
                        s.fotoAprendiz
                      )}
                    </td>

                    {/* ================================
                        FOTO VEHÍCULO
                    ================================= */}

                    <td>
                      {verImagen(
                        s.fotoVehiculo
                      )}
                    </td>

                    {/* ================================
                        FOTO CÉDULA
                    ================================= */}

                    <td>
                      {verImagen(
                        s.fotoCedula
                      )}
                    </td>

                    {/* ================================
                        TARJETA PROPIEDAD
                    ================================= */}

                    <td>
                      {verArchivo(
                        s.tarjetaPropiedad
                      )}
                    </td>

                    {/* ================================
                        FOTO PLACA / SERIAL
                    ================================= */}

                    <td>
                      {verImagen(
                        s.fotoPlacaSerial
                      )}
                    </td>

                    {/* ================================
                        SOAT
                    ================================= */}

                    <td>

                      {s.tipoVehiculo === "moto"
                        ? verArchivo(s.soat)
                        : "-"
                      }

                    </td>

                    {/* ================================
                        TECNOMECÁNICA
                    ================================= */}

                    <td>

                      {s.tipoVehiculo === "moto"
                        ? verArchivo(
                            s.tecnomecanica
                          )
                        : "-"
                      }

                    </td>

                    {/* ================================
                        ACCIONES
                    ================================= */}

                    <td className="acciones">

                      {/* APROBAR / RECHAZAR */}

                      {s.estado === "pendiente" && (
                        <>

                          <button
                            className="btn-aprobar"
                            onClick={() =>
                              aprobar(s.id)
                            }
                          >
                            Aprobar
                          </button>

                          <button
                            className="btn-rechazar"
                            onClick={() =>
                              rechazar(s.id)
                            }
                          >
                            Rechazar
                          </button>

                        </>
                      )}

                      {/* GENERAR CARNET */}

                      {s.estado === "aprobada" && (

                        <div className="generar-carnet">

                          <GenerarCarnet
                            solicitud={s}
                          />

                        </div>

                      )}

                      {s.estado === "carnet_generado" && (

                        <span className="carnet-generado">
                          ✅ Carnet generado
                        </span>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="18"
                    className="sin-solicitudes"
                  >
                    No hay solicitudes registradas
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
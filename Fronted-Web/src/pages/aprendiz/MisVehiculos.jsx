import { useEffect, useState } from "react";
import  axiosClient  from "../../api/axiosClient";
import "../../styles/aprendiz/misVehiculos.css";

export default function MisVehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarVehiculos();
  }, []);

  // =====================================================
  // CARGAR VEHÍCULOS
  // =====================================================

  const cargarVehiculos = async () => {
    try {
      setLoading(true);
      setError("");

      const respuesta = await axiosClient.get(
        "/api/vehiculos/mis-vehiculos"
      );

      const datos = respuesta.data;

      console.log("🚗 MIS VEHÍCULOS:", datos);

      let lista = [];

      if (Array.isArray(datos)) {
        lista = datos;
      } else if (Array.isArray(datos?.vehiculos)) {
        lista = datos.vehiculos;
      }

      // =====================================================
      // EVITAR VEHÍCULOS DUPLICADOS DEL MISMO CARNET
      // =====================================================

      const carnetsMostrados = new Set();

      const vehiculosUnicos = lista.filter((vehiculo) => {
        /*
         * Se intenta identificar el carnet mediante:
         * 1. id del carnet
         * 2. código QR
         * 3. id del vehículo como último recurso
         */

        const carnetId =
          vehiculo.carnet?.id ||
          vehiculo.carnetId ||
          vehiculo.carnet?.codigoQr ||
          vehiculo.codigoQr ||
          `vehiculo-${vehiculo.id}`;

        if (carnetsMostrados.has(carnetId)) {
          return false;
        }

        carnetsMostrados.add(carnetId);

        return true;
      });

      console.log(
        "🚗 VEHÍCULOS ÚNICOS:",
        vehiculosUnicos
      );

      setVehiculos(vehiculosUnicos);
    } catch (error) {
      console.error(
        "❌ Error al cargar mis vehículos:",
        error
      );

      setError(
        error.response?.data?.message ||
          "No se pudieron cargar los vehículos."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OBTENER URL DE LA FOTO
  // =====================================================

  const obtenerImagen = (archivo) => {
    if (!archivo) {
      return null;
    }

    // Si ya es una URL completa
    if (
      archivo.startsWith("http://") ||
      archivo.startsWith("https://")
    ) {
      return archivo;
    }

    // Limpiar posibles rutas
    const nombreArchivo = String(archivo)
      .replace(/\\/g, "/")
      .replace(/^\/+/, "")
      .replace(/^uploads\/+/i, "");

    return `http://localhost:3000/uploads/${encodeURIComponent(
      nombreArchivo
    )}`;
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (loading) {
    return (
      <div className="mis-vehiculos-container">
        <div className="mis-vehiculos-card">
          <div className="mis-vehiculos-header">
            <div>
              <span className="mis-vehiculos-label">
                SENA PARKING
              </span>

              <h1>Mis vehículos</h1>

              <p>
                Cargando los vehículos asociados a tus
                carnets...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // VISTA
  // =====================================================

  return (
    <div className="mis-vehiculos-container">
      <div className="mis-vehiculos-card">

        {/* =================================================
            ENCABEZADO
        ================================================= */}

        <div className="mis-vehiculos-header">
          <div>
            <span className="mis-vehiculos-label">
              SENA PARKING
            </span>

            <h1>Mis vehículos</h1>

            <p>
              Aquí puedes consultar los vehículos que
              tienen un carnet generado.
            </p>
          </div>

          <div className="mis-vehiculos-contador">
            {vehiculos.length}
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mis-vehiculos-error">
            {error}
          </div>
        )}

        {/* =================================================
            SIN VEHÍCULOS
        ================================================= */}

        {!error && vehiculos.length === 0 && (
          <div className="mis-vehiculos-vacio">
            <div className="vacio-icono">
              🚗
            </div>

            <h3>
              No tienes vehículos registrados
            </h3>

            <p>
              Cuando tu solicitud sea aprobada y se
              genere tu carnet, el vehículo aparecerá
              automáticamente aquí.
            </p>
          </div>
        )}

        {/* =================================================
            VEHÍCULOS
        ================================================= */}

        {vehiculos.length > 0 && (
          <div className="mis-vehiculos-grid">

            {vehiculos.map((vehiculo) => {
              const imagen = obtenerImagen(
                vehiculo.foto_principal
              );

              const tipo = String(
                vehiculo.tipo || ""
              ).toLowerCase();

              const esMoto = tipo === "moto";

              return (
                <div
                  className="vehiculo-card"
                  key={
                    vehiculo.carnet?.id ||
                    vehiculo.carnetId ||
                    vehiculo.id
                  }
                >

                  {/* =====================================
                      FOTO
                  ===================================== */}

                  <div className="vehiculo-imagen">

                    {imagen ? (
                      <img
                        src={imagen}
                        alt={
                          esMoto
                            ? "Foto de la motocicleta"
                            : "Foto de la bicicleta"
                        }
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          e.currentTarget.parentElement
                            .querySelector(
                              ".sin-imagen"
                            )
                            ?.classList.add(
                              "mostrar"
                            );
                        }}
                      />
                    ) : null}

                    <div
                      className={`sin-imagen ${
                        imagen ? "" : "mostrar"
                      }`}
                    >
                      Sin foto del vehículo
                    </div>
                  </div>

                  {/* =====================================
                      INFORMACIÓN
                  ===================================== */}

                  <div className="vehiculo-info">

                    <div className="vehiculo-titulo">

                      <div>
                        <span className="vehiculo-tipo">
                          {esMoto
                            ? "MOTOCICLETA"
                            : "BICICLETA"}
                        </span>

                        <h2>
                          {vehiculo.marca ||
                            "Vehículo"}
                        </h2>
                      </div>

                      <span className="carnet-activo">
                        Carnet generado
                      </span>

                    </div>

                    {/* =================================
                        DATOS
                    ================================= */}

                    <div className="vehiculo-datos">

                      <div>
                        <strong>Tipo</strong>

                        <span>
                          {esMoto
                            ? "Moto"
                            : "Bicicleta"}
                        </span>
                      </div>

                      <div>
                        <strong>Marca</strong>

                        <span>
                          {vehiculo.marca ||
                            "No registrada"}
                        </span>
                      </div>

                      <div>
                        <strong>Color</strong>

                        <span>
                          {vehiculo.color ||
                            "No registrado"}
                        </span>
                      </div>

                      <div>
                        <strong>
                          {esMoto
                            ? "Placa"
                            : "Serial"}
                        </strong>

                        <span>
                          {esMoto
                            ? vehiculo.placa ||
                              "No registrada"
                            : vehiculo.serial ||
                              "No registrado"}
                        </span>
                      </div>

                      {esMoto && (
                        <>
                          <div>
                            <strong>Modelo</strong>

                            <span>
                              {vehiculo.modelo ||
                                "No registrado"}
                            </span>
                          </div>

                          <div>
                            <strong>
                              Cilindraje
                            </strong>

                            <span>
                              {vehiculo.cilindraje ||
                                "No registrado"}
                            </span>
                          </div>
                        </>
                      )}

                    </div>

                    {/* =================================
                        CARNET
                    ================================= */}

                    {vehiculo.carnet && (
                      <div className="vehiculo-carnet">

                        <h3>
                          Información del carnet
                        </h3>

                        {vehiculo.carnet.codigoQr && (
                          <p>
                            <strong>
                              Código QR:
                            </strong>{" "}
                            {vehiculo.carnet.codigoQr}
                          </p>
                        )}

                        {vehiculo.carnet.estado && (
                          <p>
                            <strong>
                              Estado:
                            </strong>{" "}
                            <span>
                              {vehiculo.carnet.estado}
                            </span>
                          </p>
                        )}

                        {vehiculo.carnet
                          .fechaGeneracion && (
                          <p>
                            <strong>
                              Generado:
                            </strong>{" "}
                            {new Date(
                              vehiculo.carnet
                                .fechaGeneracion
                            ).toLocaleDateString()}
                          </p>
                        )}

                      </div>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* =================================================
            ACTUALIZAR
        ================================================= */}

        <button
          type="button"
          className="mis-vehiculos-recargar"
          onClick={cargarVehiculos}
        >
          Actualizar vehículos
        </button>

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { carnetApi } from "../../api/carnetApi";
import "../../styles/aprendiz/visualizarCarnet.css";

export default function VisualizarCarnet() {

  const [carnets, setCarnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCarnets();
  }, []);

  // =====================================================
  // CARGAR TODOS LOS CARNETS
  // =====================================================

  const cargarCarnets = async () => {

    try {

      setLoading(true);
      setError("");

      const respuesta =
        await carnetApi.obtenerMiCarnet();

      console.log(
        "🎫 TODOS LOS CARNETS:",
        respuesta
      );

      /*
       * IMPORTANTE:
       *
       * carnetApi ya devuelve respuesta.data
       *
       * Por lo tanto:
       *
       * respuesta = [
       *   carnet1,
       *   carnet2
       * ]
       */

      if (Array.isArray(respuesta)) {

        setCarnets(respuesta);

        return;
      }

      /*
       * Compatibilidad por si el backend
       * devuelve { carnets: [...] }
       */

      if (
        Array.isArray(respuesta?.carnets)
      ) {

        setCarnets(
          respuesta.carnets
        );

        return;
      }

      /*
       * Compatibilidad por si devuelve
       * { data: [...] }
       */

      if (
        Array.isArray(respuesta?.data)
      ) {

        setCarnets(
          respuesta.data
        );

        return;
      }

      /*
       * Compatibilidad con un solo carnet
       */

      if (
        respuesta &&
        respuesta.id
      ) {

        setCarnets([
          respuesta,
        ]);

        return;
      }

      setCarnets([]);

    } catch (error) {

      console.error(
        "❌ ERROR CARGANDO CARNETS:",
        error
      );

      console.error(
        "❌ RESPUESTA SERVIDOR:",
        error.response?.data
      );

      setCarnets([]);

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "No se pudieron cargar los carnets."
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================================
  // OBTENER IMAGEN
  // =====================================================

  const obtenerImagen = (archivo) => {

    if (!archivo) {
      return null;
    }

    /*
     * Base64
     */

    if (
      archivo.startsWith(
        "data:image/"
      )
    ) {

      return archivo;

    }

    /*
     * URL completa
     */

    if (
      archivo.startsWith(
        "http://"
      ) ||
      archivo.startsWith(
        "https://"
      )
    ) {

      return archivo;

    }

    /*
     * Archivo guardado en uploads
     */

    const nombreArchivo =
      String(archivo)
        .replace(/^[/\\]+/, "")
        .replace(
          /^uploads[/\\]+/,
          ""
        )
        .replace(
          /\\/g,
          "/"
        );

    return `http://localhost:3000/uploads/${nombreArchivo}`;

  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (loading) {

    return (

      <div className="visualizar-carnet-container">

        <div className="visualizar-carnet-card">

          <div className="visualizar-carnet-loading">

            <h2>
              Cargando carnets...
            </h2>

            <p>
              Consultando tus carnets generados.
            </p>

          </div>

        </div>

      </div>

    );

  }

  // =====================================================
  // VISTA PRINCIPAL
  // =====================================================

  return (

    <div className="visualizar-carnet-container">

      <div className="visualizar-carnet-card">

        {/* =================================================
            ENCABEZADO
        ================================================= */}

        <div className="visualizar-carnet-header">

          <div>

            <span className="visualizar-carnet-label">
              SENA PARKING
            </span>

            <h1>
              Mis carnets
            </h1>

            <p>
              Consulta todos los carnets generados
              para tus vehículos.
            </p>

          </div>

          <div className="visualizar-carnet-contador">
            {carnets.length}
          </div>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="visualizar-carnet-error">

            {error}

          </div>

        )}

        {/* =================================================
            SIN CARNETS
        ================================================= */}

        {!error &&
          carnets.length === 0 && (

          <div className="visualizar-carnet-vacio">

            <div className="vacio-icono">
              🎫
            </div>

            <h3>
              No tienes carnets generados
            </h3>

            <p>
              Cuando se genere un carnet,
              aparecerá aquí.
            </p>

          </div>

        )}

        {/* =================================================
            TODOS LOS CARNETS
        ================================================= */}

        {carnets.length > 0 && (

          <div className="carnets-lista">

            {carnets.map(
              (carnet, index) => {

                /*
                 * DATOS DEL CARNET
                 */

                const usuario =
                  carnet.user || {};

                const solicitud =
                  carnet.solicitud || {};

                const vehiculo =
                  carnet.vehiculo || {};

                /*
                 * FOTO DEL APRENDIZ
                 *
                 * Primero intenta la foto
                 * de la solicitud.
                 *
                 * Si no existe usa la del usuario.
                 */

                const fotoAprendiz =
                  obtenerImagen(
                    solicitud.fotoAprendiz ||
                    usuario.foto
                  );

                /*
                 * FOTO DEL VEHÍCULO
                 */

                const fotoVehiculo =
                  obtenerImagen(
                    solicitud.fotoVehiculo ||
                    vehiculo.foto_principal
                  );

                /*
                 * TIPO VEHÍCULO
                 */

                const tipoVehiculo =
                  String(
                    solicitud.tipoVehiculo ||
                    vehiculo.tipo ||
                    ""
                  ).toLowerCase();

                const esMoto =
                  tipoVehiculo === "moto";

                return (

                  <div
                    className="carnet-item"
                    key={
                      carnet.id ||
                      index
                    }
                  >

                    {/* =================================
                        ENCABEZADO CARNET
                    ================================= */}

                    <div className="carnet-item-header">

                      <div>

                        <span className="carnet-numero">
                          CARNET #{index + 1}
                        </span>

                        <h2>
                          SENA PARKING
                        </h2>

                      </div>

                      <span
                        className={`carnet-estado ${
                          carnet.estado ===
                          "activo"
                            ? "activo"
                            : "otro"
                        }`}
                      >
                        {carnet.estado ||
                          "activo"}
                      </span>

                    </div>

                    {/* =================================
                        INFORMACIÓN APRENDIZ + QR
                    ================================= */}

                    <div className="carnet-contenido">

                      {/* FOTO APRENDIZ */}

                      <div className="carnet-foto-aprendiz">

                        {fotoAprendiz ? (

                          <img
                            src={fotoAprendiz}
                            alt="Foto del aprendiz"
                            onError={(e) => {

                              e.currentTarget.style.display =
                                "none";

                              const sinFoto =
                                e.currentTarget
                                  .parentElement
                                  ?.querySelector(
                                    ".carnet-sin-foto"
                                  );

                              if (sinFoto) {
                                sinFoto.classList.add(
                                  "mostrar"
                                );
                              }

                            }}
                          />

                        ) : null}

                        <div
                          className={`carnet-sin-foto ${
                            fotoAprendiz
                              ? ""
                              : "mostrar"
                          }`}
                        >
                          Sin foto
                        </div>

                      </div>

                      {/* DATOS APRENDIZ */}

                      <div className="carnet-datos">

                        <div className="dato">

                          <strong>
                            Nombre
                          </strong>

                          <span>

                            {usuario.nombres ||
                              ""}

                            {" "}

                            {usuario.apellidos ||
                              ""}

                          </span>

                        </div>

                        <div className="dato">

                          <strong>
                            Documento
                          </strong>

                          <span>

                            {usuario.tipoDocumento ||
                              ""}

                            {" "}

                            {usuario.documento ||
                              "No registrado"}

                          </span>

                        </div>

                        <div className="dato">

                          <strong>
                            Ficha
                          </strong>

                          <span>
                            {usuario.ficha ||
                              "No registrada"}
                          </span>

                        </div>

                        <div className="dato">

                          <strong>
                            Centro de formación
                          </strong>

                          <span>

                            {usuario
                              .centroFormacion
                              ?.nombre ||
                              "No registrado"}

                          </span>

                        </div>

                      </div>

                      {/* =================================
                          QR DEL CARNET
                      ================================= */}

                      <div className="carnet-qr">

                        <h3>
                          Código QR
                        </h3>

                        {carnet.qrImage ? (

                          <img
                            src={
                              carnet.qrImage
                            }
                            alt="Código QR del carnet"
                          />

                        ) : (

                          <div className="qr-sin-imagen">

                            QR no disponible

                          </div>

                        )}

                        <small>
                          {carnet.codigoQr ||
                            "Código no disponible"}
                        </small>

                      </div>

                    </div>

                    {/* =================================
                        VEHÍCULO DE ESTE CARNET
                    ================================= */}

                    <div className="carnet-vehiculo">

                      <h3>
                        Vehículo asociado a este carnet
                      </h3>

                      <div className="vehiculo-contenido">

                        {/* FOTO VEHÍCULO */}

                        <div className="carnet-foto-vehiculo">

                          {fotoVehiculo ? (

                            <img
                              src={fotoVehiculo}
                              alt="Foto del vehículo"
                              onError={(e) => {

                                e.currentTarget.style.display =
                                  "none";

                                const sinFoto =
                                  e.currentTarget
                                    .parentElement
                                    ?.querySelector(
                                      ".vehiculo-sin-foto"
                                    );

                                if (sinFoto) {
                                  sinFoto.classList.add(
                                    "mostrar"
                                  );
                                }

                              }}
                            />

                          ) : null}

                          <div
                            className={`vehiculo-sin-foto ${
                              fotoVehiculo
                                ? ""
                                : "mostrar"
                            }`}
                          >
                            Sin foto del vehículo
                          </div>

                        </div>

                        {/* DATOS VEHÍCULO */}

                        <div className="vehiculo-datos-carnet">

                          <div>

                            <strong>
                              Tipo
                            </strong>

                            <span>
                              {esMoto
                                ? "Motocicleta"
                                : "Bicicleta"}
                            </span>

                          </div>

                          <div>

                            <strong>
                              Marca
                            </strong>

                            <span>
                              {solicitud.marca ||
                                vehiculo.marca ||
                                "No registrada"}
                            </span>

                          </div>

                          <div>

                            <strong>
                              Color
                            </strong>

                            <span>
                              {solicitud.color ||
                                vehiculo.color ||
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
                                ? (
                                    solicitud.serialPlaca ||
                                    vehiculo.placa ||
                                    "No registrada"
                                  )
                                : (
                                    solicitud.serialPlaca ||
                                    vehiculo.serial ||
                                    "No registrado"
                                  )}

                            </span>

                          </div>

                          {/* DATOS MOTO */}

                          {esMoto && (

                            <>

                              <div>

                                <strong>
                                  Modelo
                                </strong>

                                <span>
                                  {solicitud.modelo ||
                                    vehiculo.modelo ||
                                    "No registrado"}
                                </span>

                              </div>

                              <div>

                                <strong>
                                  Cilindraje
                                </strong>

                                <span>
                                  {solicitud.cilindraje ||
                                    vehiculo.cilindraje ||
                                    "No registrado"}
                                </span>

                              </div>

                            </>

                          )}

                        </div>

                      </div>

                    </div>

                    {/* =================================
                        INFORMACIÓN CARNET
                    ================================= */}

                    <div className="carnet-footer">

                      <div>

                        <strong>
                          ID del carnet
                        </strong>

                        <span>
                          {carnet.id}
                        </span>

                      </div>

                      <div>

                        <strong>
                          Generado
                        </strong>

                        <span>

                          {carnet.fechaGeneracion
                            ? new Date(
                                carnet.fechaGeneracion
                              ).toLocaleDateString()
                            : carnet.createdAt
                            ? new Date(
                                carnet.createdAt
                              ).toLocaleDateString()
                            : "No disponible"}

                        </span>

                      </div>

                      <div>

                        <strong>
                          Estado
                        </strong>

                        <span>
                          {carnet.estado ||
                            "activo"}
                        </span>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

        {/* =============================================
            ACTUALIZAR
        ============================================= */}

        <button
          type="button"
          className="visualizar-carnet-recargar"
          onClick={cargarCarnets}
        >
          Actualizar carnets
        </button>

      </div>

    </div>

  );

}
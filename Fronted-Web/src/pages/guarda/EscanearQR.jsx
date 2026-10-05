import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import  axiosClient  from "../../api/axiosClient";
import "../../styles/guarda/EscanearQR.css";

const API_URL = "http://localhost:3000";

const construirUrlImagen = (ruta) => {
  if (!ruta) return null;

  let rutaLimpia = String(ruta).trim();

  if (!rutaLimpia) return null;

  if (
    rutaLimpia.startsWith("http://") ||
    rutaLimpia.startsWith("https://") ||
    rutaLimpia.startsWith("data:")
  ) {
    return rutaLimpia;
  }

  rutaLimpia = rutaLimpia.replace(/\\/g, "/");
  rutaLimpia = rutaLimpia.replace(/^(\.\.\/)+/, "");
  rutaLimpia = rutaLimpia.replace(/^\/+/, "");

  if (rutaLimpia.startsWith("uploads/")) {
    return `${API_URL}/${rutaLimpia}`;
  }

  return `${API_URL}/uploads/${rutaLimpia}`;
};

export default function EscanearQR() {
  const [escaneando, setEscaneando] = useState(false);
  const [carnet, setCarnet] = useState(null);

  const iniciarEscaneo = async () => {
    try {
      const html5QrCode = new Html5Qrcode("reader");

      await html5QrCode.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          try {
            await html5QrCode.stop();
          } catch (error) {
            console.error(
              "Error al detener la cámara:",
              error
            );
          }

          setEscaneando(false);

          try {
            console.log("🔎 QR ESCANEADO:", decodedText);

            const { data } = await axiosClient.post(
              "/api/carnet/escanear",
              {
                codigoQr: decodedText,
              }
            );

            console.log(
              "RESPUESTA DEL SERVIDOR:",
              data
            );

            setCarnet(data);

            alert(
              data.message ||
                `${
                  data.tipo === "entrada"
                    ? "Entrada"
                    : "Salida"
                } registrada correctamente`
            );
          } catch (error) {
            console.error(
              "ERROR AL VALIDAR QR:",
              error
            );

            console.error(
              "RESPUESTA:",
              error.response?.data
            );

            alert(
              error.response?.data?.message ||
                "Error al consultar el carnet"
            );
          }
        },
        () => {}
      );

      setEscaneando(true);
    } catch (error) {
      console.error(
        "ERROR AL ABRIR CÁMARA:",
        error
      );

      alert(
        "No fue posible abrir la cámara"
      );
    }
  };

  useEffect(() => {
    return () => {
      const reader =
        document.getElementById("reader");

      if (reader) {
        reader.innerHTML = "";
      }
    };
  }, []);

  console.log("CARNET:", carnet);

  return (
    <div className="escanear-page">

      <div className="escanear-container">

        {/* =========================
            ENCABEZADO
        ========================= */}

        <div className="escanear-header">

          <span>SENA PARKING</span>

          <h1>Escanear QR</h1>

          <p>
            Escanea el código QR del carnet para
            consultar los datos y registrar el acceso.
          </p>

        </div>

        {/* =========================
            ESCÁNER
        ========================= */}

        <section className="scanner-card">

          {!escaneando && !carnet && (
            <div className="scanner-inicio">

              <div className="scanner-icono">
                📷
              </div>

              <h2>
                Escanear carnet
              </h2>

              <p>
                Presiona el botón para activar la cámara
                y escanear el código QR del carnet.
              </p>

              <button
                className="btn-escanear"
                onClick={iniciarEscaneo}
              >
                ESCANEAR QR
              </button>

            </div>
          )}

          {escaneando && (
            <div className="scanner-activo">

              <div className="scanner-titulo">
                <span className="scanner-punto"></span>

                Cámara activa
              </div>

              <p>
                Coloca el código QR dentro del área
                de escaneo.
              </p>

            </div>
          )}

          <div id="reader"></div>

        </section>

        {/* =========================
            RESULTADO
        ========================= */}

        {carnet && (
          <section className="resultado-qr">

            <div className="resultado-header">

              <div>
                <span>RESULTADO DEL ESCANEO</span>

                <h2>
                  {(carnet.tipo || "registro").toUpperCase()}
                </h2>
              </div>

              <div className="estado-acceso">
                {carnet.estado ||
                  "Registrado"}
              </div>

            </div>

            <div className="mensaje-qr">
              <strong>Mensaje</strong>

              <p>
                {carnet.message ||
                  "Registro realizado correctamente"}
              </p>
            </div>

            {/* =========================
                IMÁGENES
            ========================= */}

            <div className="imagenes-qr">

              {carnet.user?.foto && (
                <div className="imagen-card">

                  <span>
                    APRENDIZ
                  </span>

                  <img
                    src={construirUrlImagen(
                      carnet.user.foto
                    )}
                    alt="Aprendiz"
                    className="foto-aprendiz"
                    onError={(e) => {
                      console.error(
                        "No se pudo cargar la foto del aprendiz:",
                        e.currentTarget.src
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>
              )}

              {carnet.vehiculo?.foto_principal && (
                <div className="imagen-card">

                  <span>
                    VEHÍCULO
                  </span>

                  <img
                    src={construirUrlImagen(
                      carnet.vehiculo.foto_principal
                    )}
                    alt="Vehículo"
                    className="foto-vehiculo"
                    onError={(e) => {
                      console.error(
                        "No se pudo cargar la foto del vehículo:",
                        e.currentTarget.src
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>
              )}

            </div>

            {/* =========================
                DATOS DEL APRENDIZ
            ========================= */}

            <div className="datos-seccion">

              <div className="datos-titulo">
                <span>01</span>

                <h3>
                  Datos del aprendiz
                </h3>
              </div>

              <div className="datos-grid">

                <div className="dato">
                  <span>Nombre</span>

                  <strong>
                    {carnet.user?.nombres || ""}
                    {" "}
                    {carnet.user?.apellidos || ""}
                  </strong>
                </div>

                <div className="dato">
                  <span>Tipo de documento</span>

                  <strong>
                    {carnet.user?.tipoDocumento ||
                      "No disponible"}
                  </strong>
                </div>

                <div className="dato">
                  <span>Documento</span>

                  <strong>
                    {carnet.user?.documento ||
                      "No disponible"}
                  </strong>
                </div>

                <div className="dato">
                  <span>Ficha</span>

                  <strong>
                    {carnet.user?.ficha ||
                      "No disponible"}
                  </strong>
                </div>

                <div className="dato">
                  <span>Correo</span>

                  <strong>
                    {carnet.user?.email ||
                      "No disponible"}
                  </strong>
                </div>

                <div className="dato">
                  <span>Celular</span>

                  <strong>
                    {carnet.user?.celular ||
                      "No disponible"}
                  </strong>
                </div>

                <div className="dato">
                  <span>Centro</span>

                  <strong>
                    {carnet.user?.centroFormacion?.nombre ||
                      "No disponible"}
                  </strong>
                </div>

                <div className="dato">
                  <span>Ciudad</span>

                  <strong>
                    {carnet.user?.centroFormacion?.ciudad ||
                      "No disponible"}
                  </strong>
                </div>

              </div>

            </div>

            {/* =========================
                DATOS DEL VEHÍCULO
            ========================= */}

            {carnet.vehiculo && (
              <div className="datos-seccion">

                <div className="datos-titulo">
                  <span>02</span>

                  <h3>
                    Datos del vehículo
                  </h3>
                </div>

                <div className="datos-grid">

                  <div className="dato">
                    <span>Tipo</span>

                    <strong>
                      {carnet.vehiculo.tipo ||
                        "No disponible"}
                    </strong>
                  </div>

                  <div className="dato">
                    <span>Marca</span>

                    <strong>
                      {carnet.vehiculo.marca ||
                        "No disponible"}
                    </strong>
                  </div>

                  <div className="dato">
                    <span>Color</span>

                    <strong>
                      {carnet.vehiculo.color ||
                        "No disponible"}
                    </strong>
                  </div>

                  <div className="dato">
                    <span>Placa</span>

                    <strong>
                      {carnet.vehiculo.placa ||
                        "No disponible"}
                    </strong>
                  </div>

                  <div className="dato">
                    <span>Serial</span>

                    <strong>
                      {carnet.vehiculo.serial ||
                        "No disponible"}
                    </strong>
                  </div>

                  <div className="dato">
                    <span>Modelo</span>

                    <strong>
                      {carnet.vehiculo.modelo ||
                        "No disponible"}
                    </strong>
                  </div>

                  <div className="dato">
                    <span>Cilindraje</span>

                    <strong>
                      {carnet.vehiculo.cilindraje ||
                        "No disponible"}
                    </strong>
                  </div>

                </div>

              </div>
            )}

            {/* =========================
                REGISTRO DE ACCESO
            ========================= */}

            <div className="datos-seccion">

              <div className="datos-titulo">
                <span>03</span>

                <h3>
                  Registro de acceso
                </h3>
              </div>

              <div className="datos-grid">

                <div className="dato">
                  <span>Movimiento</span>

                  <strong>
                    {(carnet.tipo ||
                      "No disponible").toUpperCase()}
                  </strong>
                </div>

                <div className="dato">
                  <span>Estado</span>

                  <strong>
                    {carnet.estado ||
                      "No disponible"}
                  </strong>
                </div>

                {carnet.registro && (
                  <>
                    <div className="dato">
                      <span>Fecha</span>

                      <strong>
                        {carnet.registro.fecha ||
                          "No disponible"}
                      </strong>
                    </div>

                    <div className="dato">
                      <span>
                        Hora de entrada
                      </span>

                      <strong>
                        {carnet.registro.hora_entrada
                          ? new Date(
                              carnet.registro.hora_entrada
                            ).toLocaleString()
                          : "No disponible"}
                      </strong>
                    </div>

                    {carnet.registro.hora_salida && (
                      <div className="dato">
                        <span>
                          Hora de salida
                        </span>

                        <strong>
                          {new Date(
                            carnet.registro.hora_salida
                          ).toLocaleString()}
                        </strong>
                      </div>
                    )}
                  </>
                )}

              </div>

            </div>

          </section>
        )}

      </div>

    </div>
  );
}
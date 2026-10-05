import { useEffect, useState } from "react";
import  axiosClient  from "../../api/axiosClient";
import "../../styles/aprendiz/peticionCarnet.css";

export default function PeticionCarnet() {
  const [user, setUser] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  // ==============================
  // VEHÍCULO
  // ==============================

  const [tipoVehiculo, setTipoVehiculo] = useState("bicicleta");
  const [marca, setMarca] = useState("");
  const [color, setColor] = useState("");
  const [serialPlaca, setSerialPlaca] = useState("");
  const [cilindraje, setCilindraje] = useState("");
  const [modelo, setModelo] = useState("");

  // ==============================
  // ARCHIVOS
  // ==============================

  const [fotoAprendiz, setFotoAprendiz] = useState(null);
  const [fotoVehiculo, setFotoVehiculo] = useState(null);

  const [fotoCedula, setFotoCedula] = useState(null);
  const [tarjetaPropiedad, setTarjetaPropiedad] = useState(null);

  const [soat, setSoat] = useState(null);
  const [tecnomecanica, setTecnomecanica] = useState(null);

  const [fotoPlacaSerial, setFotoPlacaSerial] = useState(null);

  const [loading, setLoading] = useState(false);

  // ==============================
  // CARGAR USUARIO
  // ==============================

  useEffect(() => {
    cargarUsuario();
  }, []);

  const cargarUsuario = async () => {
    try {
      setCargandoUsuario(true);

      const usuarioLocal = JSON.parse(
        localStorage.getItem("user")
      );

      if (!usuarioLocal?.id) {
        setUser(null);
        return;
      }

      const res = await axiosClient.get(
        `/auth/users/${usuarioLocal.id}`
      );

      setUser(res.data);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

    } catch (error) {
      console.error(
        "Error al cargar usuario:",
        error
      );

      try {
        const usuarioLocal = JSON.parse(
          localStorage.getItem("user")
        );

        setUser(usuarioLocal);
      } catch {
        setUser(null);
      }

    } finally {
      setCargandoUsuario(false);
    }
  };

  // ==============================
  // CAMBIAR VEHÍCULO
  // ==============================

  const cambiarTipoVehiculo = (tipo) => {
    setTipoVehiculo(tipo);

    setSerialPlaca("");
    setCilindraje("");
    setModelo("");
    setSoat(null);
    setTecnomecanica(null);
    setFotoPlacaSerial(null);
  };

  // ==============================
  // ENVIAR SOLICITUD
  // ==============================

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    if (loading) return;

    // ==============================
    // VALIDACIONES
    // ==============================

    if (!fotoAprendiz) {
      alert("Debe seleccionar la foto del aprendiz.");
      return;
    }

    if (!fotoVehiculo) {
      alert("Debe seleccionar la foto del vehículo.");
      return;
    }

    if (!fotoCedula) {
      alert("Debe seleccionar la foto de la cédula.");
      return;
    }

    if (!tarjetaPropiedad) {
      alert("Debe seleccionar la tarjeta de propiedad.");
      return;
    }

    if (!serialPlaca.trim()) {
      alert(
        tipoVehiculo === "bicicleta"
          ? "Debe ingresar el serial de la bicicleta."
          : "Debe ingresar la placa de la moto."
      );
      return;
    }

    // ==============================
    // BICICLETA
    // ==============================

    if (tipoVehiculo === "bicicleta") {
      if (!fotoPlacaSerial) {
        alert("Debe seleccionar la foto del serial.");
        return;
      }
    }

    // ==============================
    // MOTO
    // ==============================

    if (tipoVehiculo === "moto") {
      if (!modelo.trim()) {
        alert("Debe ingresar el modelo.");
        return;
      }

      if (!cilindraje.trim()) {
        alert("Debe ingresar el cilindraje.");
        return;
      }

      if (!soat) {
        alert("Debe seleccionar el SOAT.");
        return;
      }

      if (!tecnomecanica) {
        alert("Debe seleccionar la tecnomecánica.");
        return;
      }

      if (!fotoPlacaSerial) {
        alert("Debe seleccionar la foto de la placa.");
        return;
      }
    }

    try {
      setLoading(true);

      // ==============================
      // FORMDATA
      // ==============================

      const formData = new FormData();

      // VEHÍCULO
      formData.append(
        "tipoVehiculo",
        tipoVehiculo
      );

      formData.append(
        "marca",
        marca.trim()
      );

      formData.append(
        "color",
        color.trim()
      );

      formData.append(
        "serialPlaca",
        serialPlaca.trim()
      );

      if (tipoVehiculo === "moto") {
        formData.append(
          "cilindraje",
          cilindraje.trim()
        );

        formData.append(
          "modelo",
          modelo.trim()
        );
      }

      // ==============================
      // FOTOS
      // ==============================

      formData.append(
        "fotoAprendiz",
        fotoAprendiz
      );

      formData.append(
        "fotoVehiculo",
        fotoVehiculo
      );

      // ==============================
      // DOCUMENTOS
      // ==============================

      formData.append(
        "fotoCedula",
        fotoCedula
      );

      formData.append(
        "tarjetaPropiedad",
        tarjetaPropiedad
      );

      // ==============================
      // SERIAL / PLACA
      // ==============================

      formData.append(
        "fotoPlacaSerial",
        fotoPlacaSerial
      );

      // ==============================
      // DOCUMENTOS MOTO
      // ==============================

      if (tipoVehiculo === "moto") {
        formData.append(
          "soat",
          soat
        );

        formData.append(
          "tecnomecanica",
          tecnomecanica
        );
      }

      // ==============================
      // DEBUG
      // ==============================

      console.log(
        "================================"
      );

      console.log(
        "📤 ENVIANDO SOLICITUD"
      );

      console.log(
        "👤 Usuario:",
        user?.id
      );

      console.log(
        "🚲 Tipo:",
        tipoVehiculo
      );

      console.log(
        "================================"
      );

      for (const [key, value] of formData.entries()) {
        console.log(
          "📦",
          key,
          value instanceof File
            ? value.name
            : value
        );
      }

      // ==============================
      // POST
      // ==============================

      const respuesta =
        await axiosClient.post(
          "/api/solicitudes-carnet",
          formData
        );

      console.log(
        "✅ RESPUESTA:",
        respuesta.data
      );

      alert(
        "Solicitud enviada correctamente."
      );

      window.location.reload();

    } catch (error) {
      console.error(
        "❌ ERROR:",
        error
      );

      console.error(
        "❌ STATUS:",
        error.response?.status
      );

      console.error(
        "❌ BACKEND:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Error al enviar la solicitud."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // CARGANDO
  // ==============================

  if (cargandoUsuario) {
    return (
      <div className="peticion-container">
        <div className="peticion-card">
          <div className="peticion-header">
            <h2>
              Cargando información del aprendiz...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // SIN USUARIO
  // ==============================

  if (!user) {
    return (
      <div className="peticion-container">
        <div className="peticion-card">

          <div className="peticion-header">
            <h2>
              No se pudo cargar la información
              del aprendiz.
            </h2>
          </div>

          <button
            type="button"
            className="peticion-button"
            onClick={cargarUsuario}
          >
            Actualizar
          </button>

        </div>
      </div>
    );
  }

  // ==============================
  // FORMULARIO
  // ==============================

  return (
    <div className="peticion-container">

      <div className="peticion-card">

        <div className="peticion-header">

          <h1>
            Solicitud de Carnet
          </h1>

          <p>
            Complete la información requerida para
            solicitar su carnet de acceso a SENA Parking.
          </p>

        </div>

        <form onSubmit={enviarSolicitud}>

          {/* ==============================
              DATOS APRENDIZ
          ============================== */}

          <section className="peticion-section">

            <h3>
              Datos del aprendiz
            </h3>

            <div className="peticion-fields">

              <div className="peticion-group">
                <label>
                  Documento
                </label>

                <input
                  type="text"
                  value={user.documento || ""}
                  disabled
                />
              </div>

              <div className="peticion-group">
                <label>
                  Nombre completo
                </label>

                <input
                  type="text"
                  value={`${user.nombres || ""} ${user.apellidos || ""}`}
                  disabled
                />
              </div>

              <div className="peticion-group">
                <label>
                  Ficha
                </label>

                <input
                  type="text"
                  value={user.ficha || ""}
                  disabled
                />
              </div>

            </div>

          </section>

          {/* ==============================
              VEHÍCULO
          ============================== */}

          <section className="peticion-section">

            <h3>
              Información del vehículo
            </h3>

            <div className="peticion-fields">

              <div className="peticion-group">

                <label>
                  Tipo de vehículo
                </label>

                <select
                  value={tipoVehiculo}
                  onChange={(e) =>
                    cambiarTipoVehiculo(
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="bicicleta">
                    Bicicleta
                  </option>

                  <option value="moto">
                    Moto
                  </option>
                </select>

              </div>

              <div className="peticion-group">

                <label>
                  Marca
                </label>

                <input
                  type="text"
                  value={marca}
                  onChange={(e) =>
                    setMarca(e.target.value)
                  }
                  required
                />

              </div>

              <div className="peticion-group">

                <label>
                  Color
                </label>

                <input
                  type="text"
                  value={color}
                  onChange={(e) =>
                    setColor(e.target.value)
                  }
                  required
                />

              </div>

              <div className="peticion-group">

                <label>
                  {tipoVehiculo === "bicicleta"
                    ? "Serial"
                    : "Placa"}
                </label>

                <input
                  type="text"
                  value={serialPlaca}
                  onChange={(e) =>
                    setSerialPlaca(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {tipoVehiculo === "moto" && (
                <>

                  <div className="peticion-group">

                    <label>
                      Cilindraje
                    </label>

                    <input
                      type="text"
                      value={cilindraje}
                      onChange={(e) =>
                        setCilindraje(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  <div className="peticion-group">

                    <label>
                      Modelo
                    </label>

                    <input
                      type="text"
                      value={modelo}
                      onChange={(e) =>
                        setModelo(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                </>
              )}

            </div>

          </section>

          {/* ==============================
              FOTOGRAFÍAS
          ============================== */}

          <section className="peticion-section">

            <h3>
              Fotografías
            </h3>

            <div className="peticion-fields">

              <div className="peticion-group">

                <label>
                  Foto del aprendiz
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFotoAprendiz(
                      e.target.files?.[0] || null
                    )
                  }
                  required
                />

              </div>

              <div className="peticion-group">

                <label>
                  Foto del vehículo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFotoVehiculo(
                      e.target.files?.[0] || null
                    )
                  }
                  required
                />

              </div>

            </div>

          </section>

          {/* ==============================
              DOCUMENTOS
          ============================== */}

          <section className="peticion-section">

            <h3>
              Documentos requeridos
            </h3>

            <div className="peticion-fields">

              {/* CÉDULA */}

              <div className="peticion-group">

                <label>
                  Foto de la cédula
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFotoCedula(
                      e.target.files?.[0] || null
                    )
                  }
                  required
                />

              </div>

              {/* TARJETA */}

              <div className="peticion-group">

                <label>
                  Tarjeta de propiedad
                </label>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    setTarjetaPropiedad(
                      e.target.files?.[0] || null
                    )
                  }
                  required
                />

              </div>

              {/* BICICLETA */}

              {tipoVehiculo === "bicicleta" && (
                <div className="peticion-group">

                  <label>
                    Foto del serial
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFotoPlacaSerial(
                        e.target.files?.[0] || null
                      )
                    }
                    required
                  />

                </div>
              )}

              {/* MOTO */}

              {tipoVehiculo === "moto" && (
                <>

                  <div className="peticion-group">

                    <label>
                      SOAT
                    </label>

                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        setSoat(
                          e.target.files?.[0] || null
                        )
                      }
                      required
                    />

                  </div>

                  <div className="peticion-group">

                    <label>
                      Tecnomecánica
                    </label>

                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        setTecnomecanica(
                          e.target.files?.[0] || null
                        )
                      }
                      required
                    />

                  </div>

                  <div className="peticion-group">

                    <label>
                      Foto de la placa
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFotoPlacaSerial(
                          e.target.files?.[0] || null
                        )
                      }
                      required
                    />

                  </div>

                </>
              )}

            </div>

          </section>

          {/* ==============================
              BOTÓN
          ============================== */}

          <button
            type="submit"
            className="peticion-button"
            disabled={loading}
          >
            {loading
              ? "Enviando..."
              : "Enviar solicitud"}
          </button>

        </form>

      </div>

    </div>
  );
}
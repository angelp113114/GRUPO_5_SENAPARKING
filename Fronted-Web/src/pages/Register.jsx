import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import  axiosClient  from "../api/axiosClient";
import { obtenerCentros } from "../api/centroFormacionApi";
import { tipoDocumentosApi } from "../api/tipoDocumentosApi";

import "../styles/register.css";

export default function Register() {

  const [rol, setRol] =
    useState("aprendiz");

  const [centros, setCentros] =
    useState([]);

  const [tiposDocumento, setTiposDocumento] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingCentros, setLoadingCentros] =
    useState(true);

  const [loadingTiposDocumento, setLoadingTiposDocumento] =
    useState(true);

  const [error, setError] =
    useState("");

  const [aceptar, setAceptar] =
    useState(false);

  const [formData, setFormData] =
    useState({
      nombres: "",
      apellidos: "",
      documento: "",
      tipoDocumento: "",
      celular: "",
      ficha: "",
      centroFormacionId: "",
      fechaVinculacion: "",
      fechaFinalizacion: "",
      email: "",
      password: "",
    });

  // ==========================================
  // CARGAR CENTROS
  // ==========================================

  useEffect(() => {

    const cargarCentros = async () => {

      try {

        setLoadingCentros(true);

        const res =
          await obtenerCentros();

        console.log(
          "🏫 RESPUESTA CENTROS:",
          res.data
        );

        let datos = [];

        if (Array.isArray(res.data)) {

          datos = res.data;

        } else if (
          Array.isArray(res.data?.data)
        ) {

          datos = res.data.data;

        } else if (
          Array.isArray(res.data?.centros)
        ) {

          datos = res.data.centros;
        }

        console.log(
          "🏫 CENTROS CARGADOS:",
          datos
        );

        setCentros(datos);

      } catch (error) {

        console.error(
          "❌ ERROR CARGANDO CENTROS:",
          error
        );

        setCentros([]);

      } finally {

        setLoadingCentros(false);
      }
    };

    cargarCentros();

  }, []);

  // ==========================================
  // CARGAR TIPOS DE DOCUMENTO
  // ==========================================

  useEffect(() => {

    const cargarTiposDocumento = async () => {

      try {

        setLoadingTiposDocumento(true);

        const res =
          await tipoDocumentosApi.list();

        console.log(
          "📄 RESPUESTA TIPOS DOCUMENTO:",
          res.data
        );

        let datos = [];

        if (Array.isArray(res.data)) {

          datos = res.data;

        } else if (
          Array.isArray(res.data?.data)
        ) {

          datos = res.data.data;
        }

        console.log(
          "📄 TIPOS DE DOCUMENTO CARGADOS:",
          datos
        );

        setTiposDocumento(datos);

      } catch (error) {

        console.error(
          "❌ ERROR CARGANDO TIPOS DE DOCUMENTO:",
          error
        );

        setTiposDocumento([]);

      } finally {

        setLoadingTiposDocumento(false);
      }
    };

    cargarTiposDocumento();

  }, []);

  // ==========================================
  // CAMBIAR INPUT
  // ==========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CAMBIAR ROL
  // ==========================================

  const cambiarRol = (nuevoRol) => {

    setRol(nuevoRol);

    setError("");

    if (nuevoRol === "guarda") {

      setAceptar(false);

      setFormData((prev) => ({
        ...prev,

        ficha: "",
        centroFormacionId: "",
        fechaVinculacion: "",
        fechaFinalizacion: "",
      }));
    }
  };

  // ==========================================
  // REGISTRO
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (
      rol === "aprendiz" &&
      !aceptar
    ) {

      setError(
        "Debes aceptar los términos y condiciones."
      );

      return;
    }

    if (!formData.tipoDocumento) {

      setError(
        "Selecciona el tipo de documento."
      );

      return;
    }

    if (
      rol === "aprendiz" &&
      (
        !formData.ficha ||
        !formData.centroFormacionId ||
        !formData.fechaVinculacion ||
        !formData.fechaFinalizacion
      )
    ) {

      setError(
        "Completa todos los datos del aprendiz."
      );

      return;
    }

    setLoading(true);

    try {

      const dataToSend = {

        nombres:
          formData.nombres.trim(),

        apellidos:
          formData.apellidos.trim(),

        documento:
          formData.documento.trim(),

        tipoDocumento:
          formData.tipoDocumento,

        celular:
          formData.celular.trim(),

        email:
          formData.email.trim(),

        password:
          formData.password,

        rol,
      };

      if (rol === "aprendiz") {

        dataToSend.ficha =
          formData.ficha.trim();

        dataToSend.centroFormacionId =
          formData.centroFormacionId;

        dataToSend.fechaVinculacion =
          formData.fechaVinculacion;

        dataToSend.fechaFinalizacion =
          formData.fechaFinalizacion;
      }

      console.log(
        "📤 DATOS REGISTRO:",
        dataToSend
      );

      const res =
        await axiosClient.post(
          "/auth/register",
          dataToSend
        );

      console.log(
        "✅ REGISTRO:",
        res.data
      );

      alert(
        `Registro exitoso. Bienvenido ${formData.nombres}`
      );

      window.location.href =
        "/login";

    } catch (err) {

      console.error(
        "❌ ERROR REGISTRO:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "No fue posible completar el registro."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <div className="register-card">

        <div className="register-header">
          <h1>CREAR CUENTA</h1>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ROL */}

          <div className="role-section">

            <label>
              Tipo de usuario
            </label>

            <div className="role-buttons">

              <button
                type="button"
                className={
                  rol === "aprendiz"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() =>
                  cambiarRol("aprendiz")
                }
              >
                Aprendiz
              </button>

              <button
                type="button"
                className={
                  rol === "guarda"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() =>
                  cambiarRol("guarda")
                }
              >
                Guarda
              </button>

            </div>
          </div>

          {/* DATOS PERSONALES */}

          <div className="form-section">

            <h3>
              Datos personales
            </h3>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Nombres
                </label>

                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Apellidos
                </label>

                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Tipo de documento
                </label>

                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                  disabled={loadingTiposDocumento}
                >

                  <option value="">
                    {loadingTiposDocumento
                      ? "Cargando..."
                      : "Seleccionar"}
                  </option>

                  {tiposDocumento.map(
                    (tipo) => (

                      <option
                        key={tipo.id}
                        value={tipo.sigla}
                      >
                        {tipo.nombre_documento}
                      </option>

                    )
                  )}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Número de documento
                </label>

                <input
                  type="text"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Número de celular
                </label>

                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </div>

          {/* DATOS APRENDIZ */}

          {rol === "aprendiz" && (

            <div className="form-section">

              <h3>
                Información del aprendiz
              </h3>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Ficha
                  </label>

                  <input
                    type="text"
                    name="ficha"
                    value={formData.ficha}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Centro de formación
                  </label>

                  <select
                    name="centroFormacionId"
                    value={formData.centroFormacionId}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      {loadingCentros
                        ? "Cargando centros..."
                        : "Seleccionar centro"}
                    </option>

                    {centros.map(
                      (centro) => (

                        <option
                          key={centro.id}
                          value={centro.id}
                        >
                          {centro.nombre}

                          {centro.ciudad
                            ? ` - ${centro.ciudad}`
                            : ""}
                        </option>

                      )
                    )}

                  </select>

                  {!loadingCentros &&
                    centros.length === 0 && (
                      <small>
                        No hay centros disponibles.
                      </small>
                    )}

                </div>

                <div className="form-group">

                  <label>
                    Fecha de vinculación
                  </label>

                  <input
                    type="date"
                    name="fechaVinculacion"
                    value={
                      formData.fechaVinculacion
                    }
                    onChange={handleChange}
                    max={
                      formData.fechaFinalizacion ||
                      undefined
                    }
                    required
                  />

                </div>

                <div className="form-group">

                  <label>
                    Fecha de finalización
                  </label>

                  <input
                    type="date"
                    name="fechaFinalizacion"
                    value={
                      formData.fechaFinalizacion
                    }
                    onChange={handleChange}
                    min={
                      formData.fechaVinculacion ||
                      undefined
                    }
                    required
                  />

                </div>

              </div>

            </div>
          )}

          {/* DATOS ACCESO */}

          <div className="form-section">

            <h3>
              Datos de acceso
            </h3>

            <div className="form-grid">

              <div className="form-group full">

                <label>
                  Correo electrónico
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="form-group full">

                <label>
                  Contraseña
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />

              </div>

            </div>

          </div>

          {/* TÉRMINOS */}

          {rol === "aprendiz" && (

            <label className="terms">

              <input
                type="checkbox"
                checked={aceptar}
                onChange={(e) =>
                  setAceptar(
                    e.target.checked
                  )
                }
              />

              <span>
                Acepto los términos y condiciones
              </span>

            </label>
          )}

          {/* ERROR */}

          {error && (

            <div className="register-error">
              {error}
            </div>

          )}

          {/* BOTÓN */}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Registrando..."
              : "CREAR CUENTA"}
          </button>

          <Link
            to="/"
            className="back-home"
          >
            Volver al inicio
          </Link>

        </form>

      </div>

    </div>
  );
}
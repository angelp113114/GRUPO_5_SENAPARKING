import { useState, useEffect } from "react";
import  axiosClient  from "../../api/axiosClient";
import "../../styles/aprendiz/actualizarDatos.css";

export default function ActualizarDatos() {
  const [tipo, setTipo] = useState("datos_personales");
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [documentos, setDocumentos] = useState([]);

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    tipoDocumento: "",
    celular: "",
    ficha: "",
    centroFormacionId: "",
    fechaVinculacion: "",
    fechaFinalizacion: "",

    tipoVehiculo: "",
    marca: "",
    color: "",
    serialPlaca: "",
    cilindraje: "",
    modelo: ""
  });

  useEffect(() => {
    cargarUsuario();
    cargarVehiculos();
  }, []);

  const cargarUsuario = async () => {
    try {
      const usuarioLocal = JSON.parse(
        localStorage.getItem("user")
      );

      if (!usuarioLocal?.id) return;

      const res = await axiosClient.get(
        `/auth/users/${usuarioLocal.id}`
      );

      const usuario = res.data;

      localStorage.setItem(
        "user",
        JSON.stringify(usuario)
      );

      setFormData((prev) => ({
        ...prev,
        nombres: usuario.nombres || "",
        apellidos: usuario.apellidos || "",
        documento: usuario.documento || "",
        tipoDocumento: usuario.tipoDocumento || "",
        celular: usuario.celular || "",
        ficha: usuario.ficha || "",
        centroFormacionId:
          usuario.centroFormacionId || "",
        fechaVinculacion:
          usuario.fechaVinculacion || "",
        fechaFinalizacion:
          usuario.fechaFinalizacion || ""
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const cargarVehiculos = async () => {
    try {
      const res = await axiosClient.get(
        "/api/vehiculos/mis-vehiculos"
      );

      setVehiculos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tipoVehiculo") {
      const vehiculo = vehiculos.find(
        (v) =>
          v.tipo?.toLowerCase() ===
          value.toLowerCase()
      );

      if (vehiculo) {
        setFormData((prev) => ({
          ...prev,
          tipoVehiculo: value,
          marca: vehiculo.marca || "",
          color: vehiculo.color || "",
          serialPlaca:
            value === "bicicleta"
              ? vehiculo.serial || ""
              : vehiculo.placa || "",
          cilindraje: vehiculo.cilindraje || "",
          modelo: vehiculo.modelo || ""
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          tipoVehiculo: value,
          marca: "",
          color: "",
          serialPlaca: "",
          cilindraje: "",
          modelo: ""
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const enviarSolicitud = async (e) => {
    e.preventDefault();

    try {
      const usuario = JSON.parse(
        localStorage.getItem("user")
      );

      let datosActuales = {};
      let datosNuevos = {};

      if (tipo === "datos_personales") {
        datosActuales = {
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          documento: usuario.documento,
          tipoDocumento: usuario.tipoDocumento,
          celular: usuario.celular,
          ficha: usuario.ficha,
          centroFormacionId:
            usuario.centroFormacionId,
          fechaVinculacion:
            usuario.fechaVinculacion,
          fechaFinalizacion:
            usuario.fechaFinalizacion
        };

        datosNuevos = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          documento: formData.documento,
          tipoDocumento: formData.tipoDocumento,
          celular: formData.celular,
          ficha: formData.ficha,
          centroFormacionId:
            formData.centroFormacionId,
          fechaVinculacion:
            formData.fechaVinculacion,
          fechaFinalizacion:
            formData.fechaFinalizacion
        };
      } else {
        datosNuevos = {
          tipoVehiculo: formData.tipoVehiculo,
          marca: formData.marca,
          color: formData.color,
          serialPlaca: formData.serialPlaca,
          cilindraje: formData.cilindraje,
          modelo: formData.modelo
        };
      }

      const form = new FormData();

      form.append("tipo", tipo);

      form.append(
        "datosActuales",
        JSON.stringify(datosActuales)
      );

      form.append(
        "datosNuevos",
        JSON.stringify(datosNuevos)
      );

      if (tipo === "datos_personales") {
        if (fotoPerfil) {
          form.append("fotoNueva", fotoPerfil);
        }
      } else {
        if (nuevaFoto) {
          form.append("fotoNueva", nuevaFoto);
        }
      }

      documentos.forEach((doc) => {
        form.append("documentos", doc);
      });

      await axiosClient.post(
        "/api/solicitudes-actualizacion",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert(
        "Solicitud enviada correctamente."
      );
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Error al enviar solicitud"
      );
    }
  };

  return (
    <div className="actualizar-page">

      <div className="actualizar-container">

        {/* ENCABEZADO */}

        <div className="actualizar-header">
          

          <h2>
            ACTUALIZACIÓN DE DATOS
          </h2>

          <p>
            Modifica tus datos personales o la
            información de tu vehículo y envía una
            solicitud para su revisión.
          </p>
        </div>

        {/* TIPO DE ACTUALIZACIÓN */}

        <div className="tipo-actualizacion">

          <label>
            ¿Qué desea actualizar?
          </label>

          <select
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value)
            }
          >
            <option value="datos_personales">
              Datos Personales
            </option>

            <option value="datos_vehiculo">
              Datos del Vehículo
            </option>
          </select>

        </div>

        <form onSubmit={enviarSolicitud}>

          {/* =========================
              DATOS PERSONALES
          ========================= */}

          {tipo === "datos_personales" && (
            <>

              <div className="form-section">

                <div className="section-title">
                  <h3>
                    Información personal
                  </h3>

                  <p>
                    Actualiza la información
                    registrada en tu cuenta.
                  </p>
                </div>

                <div className="form-grid">

                  <div className="campo">
                    <label>Nombres</label>

                    <input
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="campo">
                    <label>Apellidos</label>

                    <input
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="campo">
                    <label>Documento</label>

                    <input
                      name="documento"
                      value={formData.documento}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="campo">
                    <label>
                      Tipo Documento
                    </label>

                    <input
                      name="tipoDocumento"
                      value={
                        formData.tipoDocumento
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="campo">
                    <label>Celular</label>

                    <input
                      name="celular"
                      value={formData.celular}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="campo">
                    <label>Ficha</label>

                    <input
                      name="ficha"
                      value={formData.ficha}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="campo">
                    <label>
                      Fecha Vinculación
                    </label>

                    <input
                      type="date"
                      name="fechaVinculacion"
                      value={
                        formData.fechaVinculacion
                      }
                      onChange={handleChange}
                    />
                  </div>

                  <div className="campo">
                    <label>
                      Fecha Finalización
                    </label>

                    <input
                      type="date"
                      name="fechaFinalizacion"
                      value={
                        formData.fechaFinalizacion
                      }
                      onChange={handleChange}
                    />
                  </div>

                </div>

              </div>

              {/* ARCHIVOS PERSONALES */}

              <div className="archivos-section">

                <h3>
                  Documentos y fotografía
                </h3>

                <p>
                  Adjunta los archivos necesarios
                  para respaldar la actualización.
                </p>

                <div className="archivo-campo">

                  <label>
                    Nueva foto del aprendiz
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFotoPerfil(
                        e.target.files[0]
                      )
                    }
                  />

                </div>

                <div className="archivo-campo">

                  <label>
                    Documentos anexos
                  </label>

                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setDocumentos(
                        Array.from(
                          e.target.files
                        )
                      )
                    }
                  />

                </div>

              </div>

            </>
          )}

          {/* =========================
              VEHÍCULO
          ========================= */}

          {tipo === "datos_vehiculo" && (
            <>

              <div className="form-section">

                <div className="section-title">
                  <h3>
                    Información del vehículo
                  </h3>

                  <p>
                    Selecciona el tipo de vehículo
                    y actualiza sus datos.
                  </p>
                </div>

                <div className="campo">

                  <label>
                    Tipo Vehículo
                  </label>

                  <select
                    name="tipoVehiculo"
                    value={
                      formData.tipoVehiculo
                    }
                    onChange={handleChange}
                  >
                    <option value="">
                      Seleccione
                    </option>

                    <option value="bicicleta">
                      Bicicleta
                    </option>

                    <option value="moto">
                      Moto
                    </option>
                  </select>

                </div>

                {/* BICICLETA */}

                {formData.tipoVehiculo ===
                  "bicicleta" && (
                  <div className="form-grid">

                    <div className="campo">
                      <label>Marca</label>

                      <input
                        name="marca"
                        value={formData.marca}
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="campo">
                      <label>Color</label>

                      <input
                        name="color"
                        value={formData.color}
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="campo">
                      <label>Serial</label>

                      <input
                        name="serialPlaca"
                        value={
                          formData.serialPlaca
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                  </div>
                )}

                {/* MOTO */}

                {formData.tipoVehiculo ===
                  "moto" && (
                  <div className="form-grid">

                    <div className="campo">
                      <label>Marca</label>

                      <input
                        name="marca"
                        value={formData.marca}
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="campo">
                      <label>Color</label>

                      <input
                        name="color"
                        value={formData.color}
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="campo">
                      <label>Placa</label>

                      <input
                        name="serialPlaca"
                        value={
                          formData.serialPlaca
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="campo">
                      <label>
                        Cilindraje
                      </label>

                      <input
                        name="cilindraje"
                        value={
                          formData.cilindraje
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                    <div className="campo">
                      <label>Modelo</label>

                      <input
                        name="modelo"
                        value={
                          formData.modelo
                        }
                        onChange={
                          handleChange
                        }
                      />
                    </div>

                  </div>
                )}

              </div>

              {/* ARCHIVOS VEHÍCULO */}

              <div className="archivos-section">

                <h3>
                  Fotografía y documentos
                </h3>

                <p>
                  Puedes adjuntar una nueva
                  fotografía y documentos relacionados
                  con el vehículo.
                </p>

                <div className="archivo-campo">

                  <label>
                    Nueva Foto del Vehículo
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNuevaFoto(
                        e.target.files[0]
                      )
                    }
                  />

                </div>

                <div className="archivo-campo">

                  <label>
                    Documentos anexos
                  </label>

                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setDocumentos(
                        Array.from(
                          e.target.files
                        )
                      )
                    }
                  />

                </div>

              </div>

            </>
          )}

          <button
            type="submit"
            className="btn-actualizar"
          >
            Enviar Solicitud
          </button>

        </form>

      </div>

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { vehiculosApi } from "../../api/vehiculosApi";
import "../../styles/administrador/vehiculos.css";

const initialForm = {
  tipo: "bicicleta",
  id_centro_de_formacion: "",
  marca: "",
  color: "",
  serial: "",
  placa: "",
  cilindraje: "",
  modelo: "",
  foto_principal: "",
  foto_secundaria: "",
};

const VEHICULOS_POR_PAGINA = 10;

export default function VehiculosCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  // =========================================================
  // FILTRO
  // =========================================================

  const [filtro, setFiltro] = useState("");

  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const [paginaActual, setPaginaActual] = useState(1);

  // =========================================================
  // CARGAR VEHÍCULOS
  // =========================================================

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await vehiculosApi.list();

      console.log("🚗 VEHÍCULOS:", res.data?.data);

      setItems(
        Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );

      setPaginaActual(1);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Error cargando vehículos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  // =========================================================
  // CAMBIAR FILTRO
  // =========================================================

  const handleFiltro = (e) => {
    setFiltro(e.target.value);
    setPaginaActual(1);
  };

  // =========================================================
  // FILTRAR VEHÍCULOS
  // DOCUMENTO / PLACA / SERIAL
  // =========================================================

  const vehiculosFiltrados = useMemo(() => {
    const texto = filtro.trim().toLowerCase();

    if (!texto) {
      return items;
    }

    return items.filter((item) => {
      const documento = String(
        item.User?.documento || ""
      ).toLowerCase();

      const placa = String(
        item.placa || ""
      ).toLowerCase();

      const serial = String(
        item.serial || ""
      ).toLowerCase();

      return (
        documento.includes(texto) ||
        placa.includes(texto) ||
        serial.includes(texto)
      );
    });
  }, [items, filtro]);

  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const totalPaginas = Math.ceil(
    vehiculosFiltrados.length /
      VEHICULOS_POR_PAGINA
  );

  const indiceInicial =
    (paginaActual - 1) *
    VEHICULOS_POR_PAGINA;

  const vehiculosPagina =
    vehiculosFiltrados.slice(
      indiceInicial,
      indiceInicial + VEHICULOS_POR_PAGINA
    );

  // Si después de eliminar o filtrar la página queda vacía
  useEffect(() => {
    if (
      totalPaginas > 0 &&
      paginaActual > totalPaginas
    ) {
      setPaginaActual(totalPaginas);
    }
  }, [totalPaginas, paginaActual]);

  // =========================================================
  // CAMBIAR PÁGINA
  // =========================================================

  const cambiarPagina = (pagina) => {
    if (
      pagina >= 1 &&
      pagina <= totalPaginas
    ) {
      setPaginaActual(pagina);
    }
  };

  // =========================================================
  // FORMULARIO
  // =========================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingItem(null);
    setFormData({ ...initialForm });
    setError("");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);

    setFormData({
      tipo: item.tipo || "bicicleta",

      id_centro_de_formacion:
        item.id_centro_de_formacion || "",

      marca: item.marca || "",
      color: item.color || "",
      serial: item.serial || "",
      placa: item.placa || "",
      cilindraje: item.cilindraje || "",
      modelo: item.modelo || "",
      foto_principal:
        item.foto_principal || "",

      foto_secundaria:
        item.foto_secundaria || "",
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ ...initialForm });
  };

  // =========================================================
  // GUARDAR
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (!formData.id_centro_de_formacion) {
        return setError(
          "Centro de formación obligatorio"
        );
      }

      if (!formData.marca) {
        return setError(
          "Marca obligatoria"
        );
      }

      if (
        formData.tipo === "bicicleta" &&
        !formData.serial
      ) {
        return setError(
          "Serial obligatorio"
        );
      }

      if (
        formData.tipo === "moto" &&
        !formData.placa
      ) {
        return setError(
          "Placa obligatoria"
        );
      }

      if (editingItem) {
        await vehiculosApi.update(
          editingItem.id,
          formData
        );
      } else {
        await vehiculosApi.create(formData);
      }

      closeForm();

      await loadVehiculos();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Error guardando vehículo"
      );
    }
  };

  // =========================================================
  // ELIMINAR
  // =========================================================

  const handleDelete = async (item) => {
    if (
      !window.confirm(
        "¿Eliminar vehículo?"
      )
    ) {
      return;
    }

    try {
      setError("");

      await vehiculosApi.remove(
        item.id
      );

      await loadVehiculos();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Error eliminando vehículo"
      );
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="vehiculos-container">

      {/* ================= HEADER ================= */}

      <div className="vehiculos-header">

        <div>
          <h1>
            Gestión de Vehículos
          </h1>

          <p>
            Administra los vehículos registrados
            en SENA Parking.
          </p>
        </div>

        <button
          className="vehiculos-btn-primary"
          onClick={openCreateForm}
        >
          + Nuevo Vehículo
        </button>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="vehiculos-error">
          {error}
        </div>
      )}

      {/* ================= TABLA ================= */}

      <div className="vehiculos-card">

        <div className="vehiculos-card-header">

          <div>
            <h2>
              Vehículos registrados
            </h2>

            <p className="vehiculos-resultados">
              Mostrando{" "}
              {vehiculosFiltrados.length}{" "}
              vehículo
              {vehiculosFiltrados.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <button
            className="vehiculos-btn-refresh"
            onClick={loadVehiculos}
            disabled={loading}
          >
            {loading
              ? "Cargando..."
              : "Actualizar"}
          </button>

        </div>

        {/* ================= FILTRO ================= */}

        <div className="vehiculos-filtros">

          <div className="vehiculos-filtro">

            <label htmlFor="buscarVehiculo">
              Buscar vehículo
            </label>

            <input
              id="buscarVehiculo"
              type="text"
              value={filtro}
              onChange={handleFiltro}
              placeholder="Buscar por documento, placa o serial..."
            />

          </div>

          {filtro && (
            <button
              type="button"
              className="vehiculos-btn-limpiar"
              onClick={() => {
                setFiltro("");
                setPaginaActual(1);
              }}
            >
              Limpiar
            </button>
          )}

        </div>

        {/* ================= TABLA ================= */}

        <div className="vehiculos-table-wrapper">

          {loading ? (

            <div className="vehiculos-loading">
              ⏳ Cargando vehículos...
            </div>

          ) : (

            <table className="vehiculos-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Propietario</th>
                  <th>Documento</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Color</th>
                  <th>Placa</th>
                  <th>Serial</th>
                  <th>Centro</th>
                  <th>Ficha</th>
                  <th>Acciones</th>
                </tr>

              </thead>

              <tbody>

                {vehiculosPagina.length > 0 ? (

                  vehiculosPagina.map(
                    (item) => (

                      <tr key={item.id}>

                        <td>
                          {item.id}
                        </td>

                        <td>
                          {item.User
                            ? `${item.User.nombres || ""} ${
                                item.User.apellidos || ""
                              }`
                            : "-"}
                        </td>

                        {/* DOCUMENTO */}

                        <td>
                          <span className="vehiculos-documento">
                            {item.User?.documento ||
                              "-"}
                          </span>
                        </td>

                        <td>
                          <span className="vehiculos-tipo">
                            {item.tipo}
                          </span>
                        </td>

                        <td>
                          {item.marca || "-"}
                        </td>

                        <td>
                          {item.color || "-"}
                        </td>

                        <td>
                          {item.placa || "-"}
                        </td>

                        <td>
                          {item.serial || "-"}
                        </td>

                        <td>
                          {item.User
                            ?.centroFormacion
                            ?.nombre || "-"}
                        </td>

                        <td>
                          {item.User?.ficha ||
                            "-"}
                        </td>

                        <td>

                          <div className="vehiculos-actions">

                            <button
                              className="vehiculos-btn-edit"
                              onClick={() =>
                                openEditForm(
                                  item
                                )
                              }
                            >
                              Editar
                            </button>

                            <button
                              className="vehiculos-btn-delete"
                              onClick={() =>
                                handleDelete(
                                  item
                                )
                              }
                            >
                              Eliminar
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="11"
                      className="vehiculos-empty"
                    >
                      {filtro
                        ? "No se encontraron vehículos con ese documento, placa o serial."
                        : "No hay vehículos registrados"}
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          )}

        </div>

        {/* ================= PAGINACIÓN ================= */}

        {!loading &&
          totalPaginas > 1 && (

            <div className="vehiculos-paginacion">

              <button
                type="button"
                disabled={
                  paginaActual === 1
                }
                onClick={() =>
                  cambiarPagina(
                    paginaActual - 1
                  )
                }
              >
                ← Anterior
              </button>

              <div className="vehiculos-paginas">

                {Array.from(
                  {
                    length: totalPaginas,
                  },
                  (_, index) => {
                    const pagina =
                      index + 1;

                    return (
                      <button
                        type="button"
                        key={pagina}
                        className={
                          paginaActual ===
                          pagina
                            ? "pagina-activa"
                            : ""
                        }
                        onClick={() =>
                          cambiarPagina(
                            pagina
                          )
                        }
                      >
                        {pagina}
                      </button>
                    );
                  }
                )}

              </div>

              <button
                type="button"
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

      {/* ================= MODAL ================= */}

      {showForm && (

        <div className="vehiculos-modal-overlay">

          <div className="vehiculos-modal">

            <div className="vehiculos-modal-header">

              <h2>
                {editingItem
                  ? "Editar Vehículo"
                  : "Nuevo Vehículo"}
              </h2>

              <button
                type="button"
                className="vehiculos-close"
                onClick={closeForm}
              >
                ×
              </button>

            </div>

            <form
              className="vehiculos-form"
              onSubmit={handleSubmit}
            >

              <div className="vehiculos-form-grid">

                <div className="vehiculos-field">

                  <label>
                    Tipo de Vehículo
                  </label>

                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                  >
                    <option value="bicicleta">
                      Bicicleta
                    </option>

                    <option value="moto">
                      Moto
                    </option>
                  </select>

                </div>

                <div className="vehiculos-field">

                  <label>
                    Centro de Formación
                  </label>

                  <input
                    name="id_centro_de_formacion"
                    placeholder="ID Centro de Formación"
                    value={
                      formData.id_centro_de_formacion
                    }
                    onChange={handleChange}
                  />

                </div>

                <div className="vehiculos-field">

                  <label>
                    Marca
                  </label>

                  <input
                    name="marca"
                    placeholder="Marca"
                    value={formData.marca}
                    onChange={handleChange}
                  />

                </div>

                <div className="vehiculos-field">

                  <label>
                    Color
                  </label>

                  <input
                    name="color"
                    placeholder="Color"
                    value={formData.color}
                    onChange={handleChange}
                  />

                </div>

                {formData.tipo ===
                  "bicicleta" && (

                  <div className="vehiculos-field">

                    <label>
                      Serial
                    </label>

                    <input
                      name="serial"
                      placeholder="Serial"
                      value={formData.serial}
                      onChange={handleChange}
                    />

                  </div>

                )}

                {formData.tipo ===
                  "moto" && (

                  <>

                    <div className="vehiculos-field">

                      <label>
                        Placa
                      </label>

                      <input
                        name="placa"
                        placeholder="Placa"
                        value={formData.placa}
                        onChange={handleChange}
                      />

                    </div>

                    <div className="vehiculos-field">

                      <label>
                        Cilindraje
                      </label>

                      <input
                        name="cilindraje"
                        placeholder="Cilindraje"
                        value={
                          formData.cilindraje
                        }
                        onChange={handleChange}
                      />

                    </div>

                    <div className="vehiculos-field">

                      <label>
                        Modelo
                      </label>

                      <input
                        name="modelo"
                        placeholder="Modelo"
                        value={
                          formData.modelo
                        }
                        onChange={handleChange}
                      />

                    </div>

                  </>

                )}

                <div className="vehiculos-field">

                  <label>
                    Foto principal
                  </label>

                  <input
                    name="foto_principal"
                    placeholder="URL Foto Principal"
                    value={
                      formData.foto_principal
                    }
                    onChange={handleChange}
                  />

                </div>

                <div className="vehiculos-field">

                  <label>
                    Foto secundaria
                  </label>

                  <input
                    name="foto_secundaria"
                    placeholder="URL Foto Secundaria"
                    value={
                      formData.foto_secundaria
                    }
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="vehiculos-form-actions">

                <button
                  type="submit"
                  className="vehiculos-btn-primary"
                >
                  {editingItem
                    ? "Actualizar"
                    : "Guardar"}
                </button>

                <button
                  type="button"
                  className="vehiculos-btn-cancel"
                  onClick={closeForm}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
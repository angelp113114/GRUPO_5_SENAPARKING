// /src/pages/ConfigGrCrud.jsx

import { useEffect, useState } from "react";
import { centroFormacionApi } from "../../api/centroFormacionApi";
import "../../styles/administrador/centroFormacion.css";

export default function ConfigGrCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    ciudad: "",
    direccion: "",
    estado: "activo",
  });

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await centroFormacionApi.list();

      console.log("Centros de Formación cargados:", res.data);

      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Error cargando centros de formación");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingItem(null);

    setFormData({
      nombre: "",
      ciudad: "",
      direccion: "",
      estado: "activo",
    });

    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);

    setFormData({
      nombre: item.nombre || "",
      ciudad: item.ciudad || "",
      direccion: item.direccion || "",
      estado: item.estado || "activo",
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (editingItem) {
        await centroFormacionApi.update(
          editingItem.id,
          formData
        );

        alert("Centro de Formación actualizado correctamente");
      } else {
        await centroFormacionApi.create(formData);

        alert("Centro de Formación creado correctamente");
      }

      setShowForm(false);
      setEditingItem(null);

      await loadItems();
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
          "Error guardando centro de formación"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm("¿Eliminar este Centro de Formación?")) {
      return;
    }

    try {
      await centroFormacionApi.remove(item.id);

      await loadItems();
    } catch (err) {
      console.error(err);
      setError("Error eliminando centro de formación");
    }
  };

  return (
    <div className="cf-container">

      {/* TÍTULO */}

      <div className="cf-header">
        <h1>🏫 Centros de Formación</h1>
        <p>
          Gestiona los Centros de Formación registrados en SENA Parking.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="cf-error">
          {error}
        </div>
      )}

      {/* BOTÓN NUEVO */}

      <div className="cf-actions">
        <button
          className="cf-btn-primary"
          onClick={openCreateForm}
        >
          ➕ Nuevo Centro de Formación
        </button>
      </div>

      {/* TABLA */}

      <div className="cf-card">

        <div className="cf-card-header">
          <h2>Listado de Centros de Formación</h2>

          <button
            className="cf-btn-refresh"
            onClick={loadItems}
            disabled={loading}
          >
            {loading ? "Cargando..." : "🔄 Actualizar"}
          </button>
        </div>

        {loading ? (
          <p className="cf-loading">
            ⏳ Cargando Centros de Formación...
          </p>
        ) : (
          <div className="cf-table-container">
            <table className="cf-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Ciudad</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id}>

                      <td>{item.id}</td>

                      <td className="cf-nombre">
                        {item.nombre}
                      </td>

                      <td>
                        {item.ciudad}
                      </td>

                      <td>
                        {item.direccion}
                      </td>

                      <td>
                        <span
                          className={
                            item.estado === "activo"
                              ? "cf-estado activo"
                              : "cf-estado inactivo"
                          }
                        >
                          {item.estado === "activo"
                            ? "🟢 Activo"
                            : "🔴 Inactivo"}
                        </span>
                      </td>

                      <td>
                        <div className="cf-buttons">

                          <button
                            className="cf-btn-edit"
                            onClick={() =>
                              openEditForm(item)
                            }
                          >
                            ✏️ Editar
                          </button>

                          <button
                            className="cf-btn-delete"
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            🗑️ Eliminar
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="cf-empty"
                    >
                      No hay Centros de Formación registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* MODAL */}

      {showForm && (
        <div className="cf-modal-overlay">

          <div className="cf-modal">

            <div className="cf-modal-header">
              <h2>
                {editingItem
                  ? "✏️ Editar Centro de Formación"
                  : "➕ Crear Centro de Formación"}
              </h2>

              <button
                className="cf-close"
                type="button"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="cf-form"
            >

              <div className="cf-form-group">
                <label>
                  Nombre del Centro de Formación
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del Centro de Formación"
                  required
                />
              </div>

              <div className="cf-form-group">
                <label>
                  Ciudad
                </label>

                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  required
                />
              </div>

              <div className="cf-form-group">
                <label>
                  Dirección
                </label>

                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Dirección"
                  required
                />
              </div>

              <div className="cf-form-group">
                <label>
                  Estado
                </label>

                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="activo">
                    Activo
                  </option>

                  <option value="inactivo">
                    Inactivo
                  </option>
                </select>
              </div>

              <div className="cf-modal-actions">

                <button
                  className="cf-btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Guardando..."
                    : editingItem
                    ? "💾 Actualizar"
                    : "✅ Crear"}
                </button>

                <button
                  className="cf-btn-cancel"
                  type="button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  ❌ Cancelar
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
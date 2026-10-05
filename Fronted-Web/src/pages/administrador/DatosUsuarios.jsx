import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";

import "../../styles/administrador/datosUsuario.css";

export default function DatosUsuarios() {

  // ==========================================
  // ESTADOS
  // ==========================================

  const [usuarios, setUsuarios] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [pagina, setPagina] = useState(1);

  const usuariosPorPagina = 10;

  // ==========================================
  // CARGAR USUARIOS
  // ==========================================

  const cargarUsuarios = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axiosClient.get(
        "/auth/users",
        {
          params: {
            page: 1,
            limit: 1000,
          },
        }
      );

      console.log(
        "USUARIOS DATOS:",
        response.data
      );

      let datos = [];

      if (
        Array.isArray(
          response.data?.data
        )
      ) {

        datos = response.data.data;

      } else if (
        Array.isArray(response.data)
      ) {

        datos = response.data;

      } else if (
        Array.isArray(
          response.data?.users
        )
      ) {

        datos = response.data.users;

      }

      setUsuarios(datos);

    } catch (err) {

      console.error(
        "ERROR CARGANDO USUARIOS:",
        err
      );

      setError(
        err.response?.data?.message ||
        "No se pudieron cargar los usuarios"
      );

      setUsuarios([]);

    } finally {

      setLoading(false);

    }

  };

  // ==========================================
  // CARGAR AL INICIAR
  // ==========================================

  useEffect(() => {

    cargarUsuarios();

  }, []);

  // ==========================================
  // FILTRO EN TIEMPO REAL
  // ==========================================

  const usuariosFiltrados = useMemo(() => {

    const texto =
      busqueda
        .trim()
        .toLowerCase();

    if (!texto) {

      return usuarios;

    }

    return usuarios.filter(
      (usuario) => {

        const nombre =
          `${usuario.nombres || ""} ${
            usuario.apellidos || ""
          }`.toLowerCase();

        const documento =
          String(
            usuario.documento || ""
          ).toLowerCase();

        const email =
          String(
            usuario.email || ""
          ).toLowerCase();

        const rol =
          String(
            usuario.rol || ""
          ).toLowerCase();

        const ficha =
          String(
            usuario.ficha || ""
          ).toLowerCase();

        return (
          nombre.includes(texto) ||
          documento.includes(texto) ||
          email.includes(texto) ||
          rol.includes(texto) ||
          ficha.includes(texto)
        );

      }
    );

  }, [usuarios, busqueda]);

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      usuariosFiltrados.length /
      usuariosPorPagina
    )
  );

  // ==========================================
  // REINICIAR PÁGINA AL BUSCAR
  // ==========================================

  useEffect(() => {

    setPagina(1);

  }, [busqueda]);

  // ==========================================
  // CORREGIR PÁGINA
  // ==========================================

  useEffect(() => {

    if (pagina > totalPaginas) {

      setPagina(totalPaginas);

    }

  }, [
    pagina,
    totalPaginas
  ]);

  // ==========================================
  // USUARIOS DE LA PÁGINA
  // ==========================================

  const indiceInicial =
    (pagina - 1) *
    usuariosPorPagina;

  const indiceFinal =
    indiceInicial +
    usuariosPorPagina;

  const usuariosPagina =
    usuariosFiltrados.slice(
      indiceInicial,
      indiceFinal
    );

  // ==========================================
  // CAMBIAR PÁGINA
  // ==========================================

  const paginaAnterior = () => {

    if (pagina > 1) {

      setPagina(pagina - 1);

    }

  };

  const paginaSiguiente = () => {

    if (pagina < totalPaginas) {

      setPagina(pagina + 1);

    }

  };

  // ==========================================
  // VISTA
  // ==========================================

  return (

    <div className="du-container">

      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="du-header">

        <div>

          <h1>
            👥 Datos de Usuarios
          </h1>

          <p>
            Consulta la información
            de los usuarios registrados en
            SENA Parking.
          </p>

        </div>

        <div className="du-total">

          <span>
            Total usuarios
          </span>

          <strong>
            {usuariosFiltrados.length}
          </strong>

        </div>

      </div>

      {/* ======================================
          TARJETA PRINCIPAL
      ====================================== */}

      <div className="du-card">

        <div className="du-card-header">

          <div>

            <h2>
              Información de Usuarios
            </h2>

            <p>
              Consulta los datos registrados
              en el sistema.
            </p>

          </div>

        </div>

        {/* ====================================
            BUSCADOR
        ==================================== */}

        <div className="du-search">

          <input
            type="text"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
            placeholder="Buscar por nombre, apellido o documento..."
          />

          {busqueda && (

            <button
              type="button"
              className="du-clear"
              onClick={() =>
                setBusqueda("")
              }
            >
              Limpiar
            </button>

          )}

        </div>

        {/* ====================================
            LOADING
        ==================================== */}

        {loading && (

          <div className="du-message">

            <span>
              Cargando usuarios...
            </span>

          </div>

        )}

        {/* ====================================
            ERROR
        ==================================== */}

        {!loading && error && (

          <div className="du-error">

            {error}

          </div>

        )}

        {/* ====================================
            TABLA
        ==================================== */}

        {!loading &&
        !error && (
          <>

            {usuariosPagina.length === 0 ? (

              <div className="du-empty">

                <span>
                  👤
                </span>

                <p>
                  {busqueda
                    ? "No se encontraron usuarios con esa búsqueda."
                    : "No hay información de usuarios para mostrar."
                  }
                </p>

              </div>

            ) : (

              <div className="du-table-container">

                <table className="du-table">

                  <thead>

                    <tr>

                      <th>
                        ID
                      </th>

                      <th>
                        Nombre completo
                      </th>

                      <th>
                        Documento
                      </th>

                      <th>
                        Correo
                      </th>

                      <th>
                        Rol
                      </th>

                      <th>
                        Ficha
                      </th>

                      <th>
                        Celular
                      </th>

                      <th>
                        Estado
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {usuariosPagina.map(
                      (usuario) => (

                        <tr
                          key={
                            usuario.id
                          }
                        >

                          <td>
                            {usuario.id}
                          </td>

                          <td>

                            <strong>
                              {usuario.nombres || "-"}
                              {" "}
                              {usuario.apellidos || ""}
                            </strong>

                          </td>

                          <td>
                            {usuario.documento || "-"}
                          </td>

                          <td>
                            {usuario.email || "-"}
                          </td>

                          <td>

                            <span
                              className={`du-role du-role-${String(
                                usuario.rol || ""
                              ).toLowerCase()}`}
                            >
                              {usuario.rol || "-"}
                            </span>

                          </td>

                          <td>
                            {usuario.ficha || "-"}
                          </td>

                          <td>
                            {usuario.celular || "-"}
                          </td>

                          <td>

                            <span
                              className={
                                usuario.estado ===
                                "bloqueado"
                                  ? "du-status blocked"
                                  : "du-status active"
                              }
                            >
                              {usuario.estado ||
                                "activo"}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

            {/* ==================================
                PAGINACIÓN
            ================================== */}

            <div className="du-pagination">

              <button
                type="button"
                className="du-pagination-btn"
                onClick={
                  paginaAnterior
                }
                disabled={
                  pagina === 1
                }
              >
                Anterior
              </button>

              <div className="du-pagination-info">

                Página{" "}

                <strong>
                  {pagina}
                </strong>

                {" "}de{" "}

                <strong>
                  {totalPaginas}
                </strong>

              </div>

              <button
                type="button"
                className="du-pagination-btn"
                onClick={
                  paginaSiguiente
                }
                disabled={
                  pagina ===
                  totalPaginas
                }
              >
                Siguiente
              </button>

            </div>

          </>
        )}

      </div>

    </div>

  );

}
import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  reportarUsuario,
  bloquearUsuario,
  desbloquearUsuario,
} from "../../api/bloqueosApi";

import "../../styles/administrador/bloqueos.css";

export default function Bloqueos() {

  // ==========================================
  // ESTADOS
  // ==========================================

  const [usuarios, setUsuarios] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  const [pagina, setPagina] = useState(1);

  const usuariosPorPagina = 10;

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [modal, setModal] = useState(false);

  const [tipoAccion, setTipoAccion] = useState("");

  const [usuarioSeleccionado, setUsuarioSeleccionado] =
    useState(null);

  const [motivo, setMotivo] = useState("");

  const [procesando, setProcesando] = useState(false);


  // ==========================================
  // CARGAR USUARIOS
  // ==========================================

  const cargarUsuarios = async () => {

    try {

      setLoading(true);

      setError("");

      const respuesta = await obtenerUsuarios();

      console.log(
        "USUARIOS BLOQUEOS:",
        respuesta
      );

      let lista = [];

      if (Array.isArray(respuesta)) {

        lista = respuesta;

      } else if (
        Array.isArray(respuesta?.data)
      ) {

        lista = respuesta.data;

      } else if (
        Array.isArray(respuesta?.usuarios)
      ) {

        lista = respuesta.usuarios;

      }

      setUsuarios(lista);

    } catch (err) {

      console.error(
        "ERROR CARGANDO USUARIOS:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "No se pudieron cargar los usuarios."
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

  const usuariosFiltrados = usuarios.filter(
    (usuario) => {

      const texto =
        busqueda
          .toLowerCase()
          .trim();

      if (!texto) {
        return true;
      }

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

      return (
        nombre.includes(texto) ||
        documento.includes(texto) ||
        email.includes(texto) ||
        rol.includes(texto)
      );

    }
  );


  // ==========================================
  // REINICIAR PAGINA AL BUSCAR
  // ==========================================

  useEffect(() => {

    setPagina(1);

  }, [busqueda]);


  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const totalPaginas =
    Math.ceil(
      usuariosFiltrados.length /
      usuariosPorPagina
    );

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
  // ABRIR MODAL
  // ==========================================

  const abrirModal = (
    usuario,
    tipo
  ) => {

    setUsuarioSeleccionado(usuario);

    setTipoAccion(tipo);

    setMotivo("");

    setModal(true);

  };


  // ==========================================
  // CERRAR MODAL
  // ==========================================

  const cerrarModal = () => {

    if (procesando) {
      return;
    }

    setModal(false);

    setUsuarioSeleccionado(null);

    setTipoAccion("");

    setMotivo("");

  };


  // ==========================================
  // EJECUTAR ACCIÓN
  // ==========================================

  const ejecutarAccion = async () => {

    if (!usuarioSeleccionado) {
      return;
    }

    if (
      (tipoAccion === "reporte" ||
        tipoAccion === "bloqueo") &&
      !motivo.trim()
    ) {

      alert(
        "Debe escribir el motivo."
      );

      return;
    }

    try {

      setProcesando(true);

      const id =
        usuarioSeleccionado.id;


      // ================================
      // REPORTE
      // ================================

      if (
        tipoAccion === "reporte"
      ) {

        await reportarUsuario(
          id,
          motivo.trim()
        );

        alert(
          "Reporte enviado correctamente."
        );

      }


      // ================================
      // BLOQUEAR
      // ================================

      if (
        tipoAccion === "bloqueo"
      ) {

        await bloquearUsuario(
          id,
          motivo.trim()
        );

        setUsuarios(
          (lista) =>
            lista.map(
              (usuario) =>
                usuario.id === id
                  ? {
                      ...usuario,
                      estado:
                        "bloqueado",
                    }
                  : usuario
            )
        );

        alert(
          "Usuario bloqueado correctamente."
        );

      }


      // ================================
      // DESBLOQUEAR
      // ================================

      if (
        tipoAccion === "desbloqueo"
      ) {

        await desbloquearUsuario(
          id
        );

        setUsuarios(
          (lista) =>
            lista.map(
              (usuario) =>
                usuario.id === id
                  ? {
                      ...usuario,
                      estado:
                        "activo",
                    }
                  : usuario
            )
        );

        alert(
          "Usuario desbloqueado correctamente."
        );

      }


      cerrarModal();

    } catch (err) {

      console.error(
        "ERROR EJECUTANDO ACCIÓN:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "No se pudo ejecutar la acción."
      );

    } finally {

      setProcesando(false);

    }

  };


  // ==========================================
  // CAMBIAR PÁGINA
  // ==========================================

  const cambiarPagina = (
    nuevaPagina
  ) => {

    if (
      nuevaPagina < 1 ||
      nuevaPagina > totalPaginas
    ) {
      return;
    }

    setPagina(nuevaPagina);

  };


  // ==========================================
  // CONTADOR
  // ==========================================

  const totalUsuarios =
    usuarios.length;


  // ==========================================
  // VISTA
  // ==========================================

  return (

    <div className="bloqueos-container">

      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <div className="bloqueos-header">

        <div>

          <h1>
            Bloqueos y reportes
          </h1>

          <p>
            Administra el estado de los usuarios
            y registra reportes dentro del sistema.
          </p>

        </div>


        <div className="total-usuarios">

          <span>
            Total de usuarios
          </span>

          <strong>
            {totalUsuarios}
          </strong>

        </div>

      </div>


      {/* ======================================
          TARJETA
      ====================================== */}

      <div className="bloqueos-card">


        {/* ====================================
            BUSCADOR
        ==================================== */}

        <div className="search-container">

          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, apellido, documento, correo o rol..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
          />

        </div>


        {/* ====================================
            ERROR
        ==================================== */}

        {error && (

          <div className="error-users">

            {error}

          </div>

        )}


        {/* ====================================
            LOADING
        ==================================== */}

        {loading && (

          <div className="loading-users">

            Cargando usuarios...

          </div>

        )}


        {/* ====================================
            USUARIOS
        ==================================== */}

        {!loading && !error && (

          <div className="user-list">


            {usuariosPagina.length === 0 ? (

              <div className="empty-users">

                {busqueda
                  ? "No se encontraron usuarios con esa búsqueda."
                  : "No hay usuarios registrados."
                }

              </div>

            ) : (

              usuariosPagina.map(
                (usuario) => (

                  <div
                    className="user-card"
                    key={usuario.id}
                  >


                    {/* ======================
                        INFORMACIÓN
                    ====================== */}

                    <div className="user-info">

                      <div className="user-name">

                        {usuario.nombres}{" "}

                        {usuario.apellidos}

                      </div>


                      <div className="user-document">

                        <strong>
                          Documento:
                        </strong>{" "}

                        {usuario.documento ||
                          "No registrado"}

                      </div>


                      <div className="user-email">

                        <strong>
                          Correo:
                        </strong>{" "}

                        {usuario.email ||
                          "No registrado"}

                      </div>


                      <div className="user-role">

                        <strong>
                          Rol:
                        </strong>{" "}

                        <span>
                          {usuario.rol ||
                            "Sin rol"}
                        </span>

                      </div>


                      {usuario.ficha && (

                        <div className="user-ficha">

                          <strong>
                            Ficha:
                          </strong>{" "}

                          {usuario.ficha}

                        </div>

                      )}

                    </div>


                    {/* ======================
                        ESTADO
                    ====================== */}

                    <div>

                      <span
                        className={
                          usuario.estado ===
                          "bloqueado"
                            ? "badge blocked"
                            : "badge active"
                        }
                      >

                        {usuario.estado ===
                        "bloqueado"
                          ? "Bloqueado"
                          : "Activo"
                        }

                      </span>

                    </div>


                    {/* ======================
                        ACCIONES
                    ====================== */}

                    <div className="actions">


                      {/* REPORTAR */}

                      <button
                        type="button"
                        className="btn btn-report"
                        onClick={() =>
                          abrirModal(
                            usuario,
                            "reporte"
                          )
                        }
                      >

                        Reportar

                      </button>


                      {/* BLOQUEAR */}

                      {usuario.estado !==
                        "bloqueado" && (

                        <button
                          type="button"
                          className="btn btn-block"
                          onClick={() =>
                            abrirModal(
                              usuario,
                              "bloqueo"
                            )
                          }
                        >

                          Bloquear

                        </button>

                      )}


                      {/* DESBLOQUEAR */}

                      {usuario.estado ===
                        "bloqueado" && (

                        <button
                          type="button"
                          className="btn btn-unblock"
                          onClick={() =>
                            abrirModal(
                              usuario,
                              "desbloqueo"
                            )
                          }
                        >

                          Desbloquear

                        </button>

                      )}

                    </div>

                  </div>

                )
              )

            )}

          </div>

        )}


        {/* ====================================
            PAGINACIÓN
        ==================================== */}

        {!loading &&
          !error &&
          usuariosFiltrados.length > 0 && (

          <div className="pagination">

            <button
              type="button"
              className="pagination-btn"
              disabled={pagina === 1}
              onClick={() =>
                cambiarPagina(
                  pagina - 1
                )
              }
            >

              Anterior

            </button>


            <div className="pagination-info">

              Página{" "}

              <strong>
                {pagina}
              </strong>{" "}

              de{" "}

              <strong>
                {totalPaginas}
              </strong>

            </div>


            <button
              type="button"
              className="pagination-btn"
              disabled={
                pagina ===
                totalPaginas
              }
              onClick={() =>
                cambiarPagina(
                  pagina + 1
                )
              }
            >

              Siguiente

            </button>

          </div>

        )}

      </div>


      {/* ======================================
          MODAL
      ====================================== */}

      {modal &&
        usuarioSeleccionado && (

        <div
          className="modal-overlay"
          onClick={cerrarModal}
        >

          <div
            className="modal-bloqueo"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            <h2>

              {tipoAccion ===
                "reporte" &&
                "Reportar usuario"
              }

              {tipoAccion ===
                "bloqueo" &&
                "Bloquear usuario"
              }

              {tipoAccion ===
                "desbloqueo" &&
                "Desbloquear usuario"
              }

            </h2>


            <p>

              Usuario:{" "}

              <strong>
                {usuarioSeleccionado.nombres}{" "}
                {usuarioSeleccionado.apellidos}
              </strong>

            </p>


            {/* ============================
                MOTIVO
            ============================ */}

            {tipoAccion !==
              "desbloqueo" && (

              <>

                <label>
                  Motivo
                </label>

                <textarea
                  value={motivo}
                  onChange={(e) =>
                    setMotivo(
                      e.target.value
                    )
                  }
                  placeholder="Escriba el motivo..."
                  disabled={procesando}
                />

              </>

            )}


            {/* ============================
                BOTONES
            ============================ */}

            <div className="modal-actions">

              <button
                type="button"
                className="btn btn-cancel"
                onClick={cerrarModal}
                disabled={procesando}
              >

                Cancelar

              </button>


              <button
                type="button"
                className={
                  tipoAccion ===
                  "desbloqueo"
                    ? "btn btn-unblock"
                    : tipoAccion ===
                      "reporte"
                    ? "btn btn-report"
                    : "btn btn-block"
                }
                onClick={
                  ejecutarAccion
                }
                disabled={procesando}
              >

                {procesando
                  ? "Procesando..."
                  : tipoAccion ===
                    "reporte"
                  ? "Enviar reporte"
                  : tipoAccion ===
                    "bloqueo"
                  ? "Bloquear usuario"
                  : "Desbloquear usuario"
                }

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}
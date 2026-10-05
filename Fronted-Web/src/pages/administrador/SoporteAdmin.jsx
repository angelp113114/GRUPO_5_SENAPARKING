import { useEffect, useState } from "react";

import {
  obtenerTodosSoportes,
  responderSoporte,
} from "../../api/soporteApi";

import "../../Styles/administrador/SoporteAdmin.css";

export default function SoporteAdmin() {
  const [soportes, setSoportes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(true);

  const soportesPorPagina = 5;

  // ==========================================
  // CARGAR SOPORTES
  // ==========================================

  const cargar = async () => {
    try {
      setCargando(true);

      const data = await obtenerTodosSoportes();

      console.log("SOPORTES RECIBIDOS:", data);

      setSoportes(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "ERROR CARGANDO SOPORTES:",
        error
      );

      alert("Error cargando solicitudes");

      setSoportes([]);
    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // CARGAR AL INICIAR
  // ==========================================

  useEffect(() => {
    cargar();
  }, []);

  // ==========================================
  // FILTRO POR NOMBRE / APELLIDO / DOCUMENTO
  // ==========================================

  const soportesFiltrados = soportes.filter(
    (ticket) => {
      const texto = busqueda
        .toLowerCase()
        .trim();

      if (!texto) {
        return true;
      }

      const nombres =
        String(
          ticket.user?.nombres || ""
        ).toLowerCase();

      const apellidos =
        String(
          ticket.user?.apellidos || ""
        ).toLowerCase();

      const documento =
        String(
          ticket.user?.documento || ""
        ).toLowerCase();

      const nombreCompleto =
        `${nombres} ${apellidos}`;

      return (
        nombres.includes(texto) ||
        apellidos.includes(texto) ||
        nombreCompleto.includes(texto) ||
        documento.includes(texto)
      );
    }
  );

  // ==========================================
  // PAGINACIÓN
  // ==========================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      soportesFiltrados.length /
        soportesPorPagina
    )
  );

  const indiceInicial =
    (paginaActual - 1) *
    soportesPorPagina;

  const indiceFinal =
    indiceInicial +
    soportesPorPagina;

  const soportesPagina =
    soportesFiltrados.slice(
      indiceInicial,
      indiceFinal
    );

  // ==========================================
  // REINICIAR PAGINA AL CAMBIAR FILTRO
  // ==========================================

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // ==========================================
  // CAMBIAR PAGINA
  // ==========================================

  const cambiarPagina = (pagina) => {
    if (
      pagina < 1 ||
      pagina > totalPaginas
    ) {
      return;
    }

    setPaginaActual(pagina);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // GUARDAR RESPUESTA
  // ==========================================

  const guardar = async (ticket) => {
    try {
      await responderSoporte(
        ticket.id,
        {
          respuesta:
            ticket.respuesta || "",

          estado:
            ticket.estado || "Pendiente",
        }
      );

      alert(
        "Soporte actualizado correctamente"
      );

      await cargar();
    } catch (error) {
      console.error(
        "ERROR ACTUALIZANDO SOPORTE:",
        error
      );

      alert(
        "Error al actualizar el soporte"
      );
    }
  };

  // ==========================================
  // CAMBIAR ESTADO
  // ==========================================

  const cambiarEstado = (
    id,
    estado
  ) => {
    setSoportes(
      (actuales) =>
        actuales.map((ticket) =>
          ticket.id === id
            ? {
                ...ticket,
                estado,
              }
            : ticket
        )
    );
  };

  // ==========================================
  // CAMBIAR RESPUESTA
  // ==========================================

  const cambiarRespuesta = (
    id,
    respuesta
  ) => {
    setSoportes(
      (actuales) =>
        actuales.map((ticket) =>
          ticket.id === id
            ? {
                ...ticket,
                respuesta,
              }
            : ticket
        )
    );
  };

  // ==========================================
  // VISTA
  // ==========================================

  return (
    <div className="adminSoporte">

      {/* ======================================
          CABECERA
      ====================================== */}

      <div className="soporte-titulo">

        <h2>
          Solicitudes de Soporte
        </h2>

        <p>
          Gestiona y responde las solicitudes
          de los aprendices
        </p>

      </div>


      {/* ======================================
          FILTRO
      ====================================== */}

      <div className="soporte-filtro">

        <label>
          Buscar solicitud
        </label>

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

        {busqueda !== "" && (
          <button
            type="button"
            className="btn-limpiar-filtro"
            onClick={() => {
              setBusqueda("");
              setPaginaActual(1);
            }}
          >
            Limpiar
          </button>
        )}

      </div>


      {/* ======================================
          RESULTADOS
      ====================================== */}

      <div className="soporte-resultados">

        {busqueda ? (
          <p>
            Resultados encontrados:
            {" "}
            <strong>
              {soportesFiltrados.length}
            </strong>
          </p>
        ) : (
          <p>
            Total de solicitudes:
            {" "}
            <strong>
              {soportes.length}
            </strong>
          </p>
        )}

      </div>


      {/* ======================================
          CARGANDO
      ====================================== */}

      {cargando ? (

        <div className="soporte-vacio">

          <p>
            Cargando solicitudes...
          </p>

        </div>

      ) : soportesFiltrados.length === 0 ? (

        /* ====================================
           SIN RESULTADOS
        ==================================== */

        <div className="soporte-vacio">

          <p>
            {busqueda
              ? "No se encontraron solicitudes con esa búsqueda."
              : "No hay solicitudes de soporte."
            }
          </p>

        </div>

      ) : (

        /* ====================================
           SOLICITUDES
        ==================================== */

        <>

          {soportesPagina.map(
            (ticket) => (

              <div
                className="cardSoporte"
                key={ticket.id}
              >

                {/* ==============================
                    USUARIO
                ============================== */}

                <h3>
                  {ticket.user?.nombres || ""}
                  {" "}
                  {ticket.user?.apellidos || ""}
                </h3>


                {/* ==============================
                    INFORMACIÓN
                ============================== */}

                <div className="informacion-soporte">

                  <p>
                    <strong>
                      Documento:
                    </strong>
                    {" "}
                    {ticket.user?.documento ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>
                    {" "}
                    {ticket.user?.email ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Ficha:
                    </strong>
                    {" "}
                    {ticket.user?.ficha ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Asunto:
                    </strong>
                    {" "}
                    {ticket.asunto ||
                      "-"}
                  </p>

                </div>


                {/* ==============================
                    DESCRIPCIÓN
                ============================== */}

                <div className="descripcion-soporte">

                  <h4>
                    Descripción
                  </h4>

                  <p>
                    {ticket.descripcion ||
                      "Sin descripción"}
                  </p>

                </div>


                {/* ==============================
                    ESTADO
                ============================== */}

                <div className="campo-soporte">

                  <label>
                    Estado
                  </label>

                  <select
                    value={
                      ticket.estado ||
                      "Pendiente"
                    }
                    onChange={(e) =>
                      cambiarEstado(
                        ticket.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pendiente">
                      Pendiente
                    </option>

                    <option value="En proceso">
                      En proceso
                    </option>

                    <option value="Resuelto">
                      Resuelto
                    </option>

                  </select>

                </div>


                {/* ==============================
                    RESPUESTA
                ============================== */}

                <div className="campo-soporte">

                  <label>
                    Respuesta
                  </label>

                  <textarea
                    placeholder="Escriba una respuesta..."
                    value={
                      ticket.respuesta ||
                      ""
                    }
                    onChange={(e) =>
                      cambiarRespuesta(
                        ticket.id,
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* ==============================
                    BOTÓN
                ============================== */}

                <div className="acciones-soporte">

                  <button
                    type="button"
                    onClick={() =>
                      guardar(ticket)
                    }
                  >
                    Guardar respuesta
                  </button>

                </div>

              </div>

            )
          )}


          {/* ====================================
              PAGINACIÓN
              SIEMPRE ABAJO
          ==================================== */}

          <div className="soporte-paginacion">

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


            <div className="paginacion-info">

              <span>
                Página
              </span>

              <strong>
                {paginaActual}
              </strong>

              <span>
                de
              </span>

              <strong>
                {totalPaginas}
              </strong>

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

        </>

      )}

    </div>
  );
}
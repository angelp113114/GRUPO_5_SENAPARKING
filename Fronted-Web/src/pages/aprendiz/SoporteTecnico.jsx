import { useEffect, useState } from "react";
import {
  crearSoporte,
  obtenerMisSoportes,
} from "../../api/soporteApi";

import "../../Styles/aprendiz/SoporteTecnico.css";

export default function SoporteTecnico() {
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [soportes, setSoportes] = useState([]);

  const cargar = async () => {
    try {
      const data = await obtenerMisSoportes();
      setSoportes(data);
    } catch (error) {
      console.error("Error cargando soportes:", error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const enviar = async (e) => {
    e.preventDefault();

    try {
      await crearSoporte({
        asunto,
        descripcion,
      });

      setAsunto("");
      setDescripcion("");

      await cargar();

      alert("Solicitud enviada correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al enviar la solicitud.");
    }
  };

  const solicitudes = soportes.filter(
    (s) => s.estado !== "Resuelto"
  );

  const reportesRecibidos = soportes.filter(
    (s) => s.estado === "Resuelto"
  );

  return (
    <div className="soporte-container">

      {/* ENCABEZADO */}

      <div className="soporte-header">
        <div>
          <span className="soporte-label">
            SENA PARKING
          </span>

          <h2>Soporte Técnico</h2>

          <p>
            Envía tus dudas, problemas o solicitudes de ayuda.
            Aquí también podrás consultar el estado de tus
            solicitudes y las respuestas del administrador.
          </p>
        </div>

        <div className="soporte-icon">
          🛠️
        </div>
      </div>


      {/* FORMULARIO */}

      <section className="soporte-card">

        <h3>Enviar solicitud</h3>

        <p className="soporte-descripcion">
          Completa los siguientes campos para enviar una
          solicitud al administrador.
        </p>

        <form
          onSubmit={enviar}
          className="soporte-form"
        >

          <div className="campo-soporte">

            <label>
              Asunto
            </label>

            <input
              type="text"
              placeholder="Escribe el asunto de tu solicitud"
              value={asunto}
              onChange={(e) =>
                setAsunto(e.target.value)
              }
              required
            />

          </div>


          <div className="campo-soporte">

            <label>
              Descripción
            </label>

            <textarea
              placeholder="Describe detalladamente el problema o solicitud"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              required
            />

          </div>


          <button type="submit">
            Enviar solicitud
          </button>

        </form>

      </section>


      {/* SOLICITUDES */}

      <section className="soporte-card">

        <div className="seccion-titulo">
          <div>
            <h3>Mis solicitudes</h3>

            <p>
              Consulta las solicitudes que todavía están
              en proceso.
            </p>
          </div>

          <span className="contador-soporte">
            {solicitudes.length}
          </span>
        </div>


        {solicitudes.length === 0 ? (

          <div className="soporte-vacio">
            <span>📭</span>

            <p>
              No tienes solicitudes pendientes.
            </p>
          </div>

        ) : (

          <div className="tickets">

            {solicitudes.map((item) => (

              <div
                key={item.id}
                className="ticket"
              >

                <div className="ticket-superior">

                  <div className="ticket-icon">
                    💬
                  </div>

                  <div>

                    <h4>
                      {item.asunto}
                    </h4>

                    <span
                      className={`estado ${item.estado}`}
                    >
                      {item.estado}
                    </span>

                  </div>

                </div>

                <div className="ticket-descripcion">

                  <strong>
                    Descripción
                  </strong>

                  <p>
                    {item.descripcion}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* RESPUESTAS */}

      <section className="soporte-card">

        <div className="seccion-titulo">
          <div>
            <h3>Reportes recibidos</h3>

            <p>
              Consulta las respuestas enviadas por el
              administrador.
            </p>
          </div>

          <span className="contador-soporte">
            {reportesRecibidos.length}
          </span>
        </div>


        {reportesRecibidos.length === 0 ? (

          <div className="soporte-vacio">
            <span>📬</span>

            <p>
              No tienes respuestas del administrador.
            </p>
          </div>

        ) : (

          <div className="tickets">

            {reportesRecibidos.map((item) => (

              <div
                key={item.id}
                className="ticket ticket-resuelto"
              >

                <div className="ticket-superior">

                  <div className="ticket-icon">
                    💬
                  </div>

                  <div>

                    <h4>
                      {item.asunto}
                    </h4>

                    <span className="estado Resuelto">
                      Resuelto
                    </span>

                  </div>

                </div>


                <div className="ticket-descripcion">

                  <strong>
                    Tu solicitud
                  </strong>

                  <p>
                    {item.descripcion}
                  </p>

                </div>


                <div className="respuesta">

                  <div className="respuesta-titulo">
                    ✓ Respuesta del administrador
                  </div>

                  <p>
                    {item.respuesta}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}
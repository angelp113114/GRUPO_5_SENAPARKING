import { useEffect, useState } from "react";
import { obtenerReportesRecibidos } from "../../api/soporteApi";

import "../../styles/administrador/reportesRecibidos.css";

export default function ReportesRecibidos() {
  const [reportes, setReportes] = useState([]);

  const cargar = async () => {
    try {
      const data = await obtenerReportesRecibidos();

      setReportes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setReportes([]);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="rr-container">

      {/* TÍTULO */}

      <div className="rr-header">
        <h1>📋 Reportes Recibidos</h1>

        <p>
          Consulta los reportes enviados por los aprendices.
        </p>
      </div>

      {/* CONTENIDO */}

      <div className="rr-content">

        {reportes.length === 0 ? (
          <div className="rr-empty">
            <span>📭</span>

            <h2>No existen reportes recibidos</h2>

            <p>
              Actualmente no hay reportes disponibles.
            </p>
          </div>
        ) : (
          <div className="rr-list">

            {reportes.map((item) => (
              <div
                key={item.id}
                className="rr-card"
              >

                {/* CABECERA */}

                <div className="rr-card-header">
                  <h2>
                    {item.asunto || "Sin asunto"}
                  </h2>

                  <span className="rr-id">
                    Reporte #{item.id}
                  </span>
                </div>

                {/* INFORMACIÓN DEL APRENDIZ */}

                <div className="rr-info">

                  <div className="rr-info-item">
                    <strong>👤 Aprendiz</strong>

                    <span>
                      {item.user?.nombres || "-"}{" "}
                      {item.user?.apellidos || ""}
                    </span>
                  </div>

                  <div className="rr-info-item">
                    <strong>📧 Correo</strong>

                    <span>
                      {item.user?.email || "-"}
                    </span>
                  </div>

                </div>

                {/* SOLICITUD */}

                <div className="rr-section">
                  <h3>📝 Solicitud</h3>

                  <div className="rr-description">
                    {item.descripcion || "Sin descripción"}
                  </div>
                </div>

                {/* RESPUESTA */}

                <div className="rr-section rr-response">
                  <h3>💬 Respuesta enviada</h3>

                  <div className="rr-description">
                    {item.respuesta || "Sin respuesta registrada."}
                  </div>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}
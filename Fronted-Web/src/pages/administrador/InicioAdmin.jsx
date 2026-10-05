import {
  FaUsers,
  FaClipboardList,
  FaCarSide,
  FaChartLine,
} from "react-icons/fa";

import "../../styles/administrador/inicioAdmin.css";

export default function InicioAdmin() {
  return (
    <div className="inicio-admin">

      <div className="admin-banner">
        <div>
          <h1>Panel Administrativo</h1>
          <p>
            Administra el sistema SENA Parking desde un único lugar.
            Gestiona usuarios, vehículos, solicitudes y consulta la información
            del sistema.
          </p>
        </div>

        <FaChartLine className="banner-icon" />
      </div>

      <div className="admin-grid">

        <div className="admin-card">
          <FaClipboardList className="admin-icon" />
          <h3>Peticiones</h3>
          <p>Gestiona las solicitudes de carnet y actualizaciones.</p>
        </div>

        <div className="admin-card">
          <FaCarSide className="admin-icon" />
          <h3>Vehículos</h3>
          <p>Administra la información de los vehículos registrados.</p>
        </div>

        <div className="admin-card">
          <FaUsers className="admin-icon" />
          <h3>Usuarios</h3>
          <p>Consulta y administra los aprendices registrados.</p>
        </div>

      </div>

      <div className="admin-info">
        <h2>Funciones principales</h2>

        <ul>
          <li>📋 Aprobar o rechazar solicitudes.</li>
          <li>🚗 Gestionar vehículos registrados.</li>
          <li>👥 Administrar usuarios.</li>
          <li>🔔 Enviar respuestas y notificaciones.</li>
        </ul>
      </div>

    </div>
  );
}
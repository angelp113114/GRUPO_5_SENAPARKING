import {
  FaShieldAlt,
  FaQrcode,
  FaCar,
  FaClipboardList,
  FaLock,
} from "react-icons/fa";

import "../../Styles/guarda/InicioGuarda.css";

export default function InicioGuarda() {
  return (
    <div className="inicio-guarda">

      <div className="hero-guarda">

        <div className="hero-texto">
          <h1>¡Bienvenido a SENA Parking!</h1>

          <p>
            Administra el control de ingreso y salida de aprendices y vehículos
            de forma rápida, segura y eficiente desde un solo lugar.
          </p>
        </div>

        <div className="hero-icono">
          <FaShieldAlt />
        </div>

      </div>

      <div className="cards-guarda">

        <div className="card-guarda">
          <FaQrcode className="icono-card"/>
          <h3>Escanear QR</h3>
          <p>Escanea el carnet del aprendiz para registrar el ingreso o salida.</p>
        </div>

        <div className="card-guarda">
          <FaCar className="icono-card"/>
          <h3>Control Vehicular</h3>
          <p>Verifica que el vehículo coincida con el registrado en el sistema.</p>
        </div>

        <div className="card-guarda">
          <FaClipboardList className="icono-card"/>
          <h3>Historial</h3>
          <p>Consulta el historial de ingresos y salidas registrados.</p>
        </div>

        <div className="card-guarda">
          <FaLock className="icono-card"/>
          <h3>Seguridad</h3>
          <p>Permite únicamente el acceso a vehículos autorizados.</p>
        </div>

      </div>

      <div className="mensaje-final">

        <h2>Accesos rápidos</h2>

        <ul>
          <li>📷 Escanear carnet.</li>
          <li>🚗 Verificar vehículo.</li>
          <li>📋 Consultar historial.</li>
          <li>🔒 Validar carnet activo.</li>
        </ul>

      </div>

    </div>
  );
}
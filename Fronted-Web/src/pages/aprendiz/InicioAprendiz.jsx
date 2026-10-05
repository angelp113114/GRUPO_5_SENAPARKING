import {
  FaIdCard,
  FaCar,
  FaBell,
  FaClipboardList,
  FaUserGraduate,
} from "react-icons/fa";

import "../../styles/aprendiz/inicioAprendiz.css";

export default function InicioAprendiz() {
  return (
    <div className="inicio-aprendiz">

      {/* =========================
          BANNER DE BIENVENIDA
      ========================= */}

      <section className="hero-inicio">

        <div>
          <h1>
            ¡Bienvenido a SENA Parking!
          </h1>

          <p>
            Gestiona de forma sencilla y segura tu carnet de ingreso,
            registra la información de tu vehículo, consulta tus solicitudes
            y mantente informado sobre las novedades relacionadas con el
            servicio de parqueadero.
          </p>
        </div>

        <div className="hero-icono">
          <FaUserGraduate />
        </div>

      </section>


      {/* =========================
          FUNCIONES PRINCIPALES
      ========================= */}

      <section>

        <h2>
          Funciones principales
        </h2>

        <div className="cards-acceso">

          {/* CARNET */}

          <div className="acceso-card">

            <div className="icono-card">
              <FaIdCard />
            </div>

            <h3>
              Mi Carnet
            </h3>

            <p>
              Consulta tu carnet digital, verifica su información y
              utiliza el código QR para facilitar la validación de
              tu ingreso al parqueadero.
            </p>

          </div>


          {/* SOLICITUDES */}

          <div className="acceso-card">

            <div className="icono-card">
              <FaClipboardList />
            </div>

            <h3>
              Solicitudes
            </h3>

            <p>
              Realiza solicitudes relacionadas con tu carnet y consulta
              el estado de cada trámite, incluyendo las solicitudes
              pendientes, aprobadas o rechazadas.
            </p>

          </div>


          {/* VEHÍCULO */}

          <div className="acceso-card">

            <div className="icono-card">
              <FaCar />
            </div>

            <h3>
              Vehículo
            </h3>

            <p>
              Consulta y actualiza los datos registrados de tu bicicleta
              o motocicleta para mantener la información del vehículo
              correctamente registrada.
            </p>

          </div>


          {/* NOTIFICACIONES */}

          <div className="acceso-card">

            <div className="icono-card">
              <FaBell />
            </div>

            <h3>
              Notificaciones
            </h3>

            <p>
              Consulta información importante sobre tus solicitudes,
              cambios en el sistema, novedades y avisos relacionados
              con tu carnet.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          INFORMACIÓN IMPORTANTE
      ========================= */}

      <section className="info-box">

        <h2>
          Información importante
        </h2>

        <ul>

          <li>
            <span>📇</span>{" "}
            Consulta y verifica los datos de tu carnet digital.
          </li>

          <li>
            <span>📝</span>{" "}
            Realiza solicitudes de carnet y consulta su estado.
          </li>

          <li>
            <span>🚗</span>{" "}
            Mantén actualizada la información de tu vehículo registrado.
          </li>

          <li>
            <span>🔔</span>{" "}
            Revisa periódicamente las notificaciones y novedades del sistema.
          </li>

        </ul>

      </section>

    </div>
  );
}

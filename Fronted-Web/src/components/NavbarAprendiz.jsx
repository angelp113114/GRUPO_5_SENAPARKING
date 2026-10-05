import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";
import "../styles/aprendiz/navbarAprendiz.css";
import logo from "../styles/logo/logo sena parking.png";

export default function NavbarAprendiz() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const res = await axiosClient.get("/api/notificaciones");
      setNotificaciones(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const abrirNotificaciones = async () => {
    const abrir = !mostrarNotificaciones;

    setMostrarNotificaciones(abrir);

    if (abrir) {
      try {
        await axiosClient.put("/api/notificaciones/leidas");

        setNotificaciones((prev) =>
          prev.map((n) => ({
            ...n,
            leida: true,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
    }
  };

  const cerrarMenu = () => {
    setMenuOpen(false);
  };

  const noLeidas = notificaciones.filter(
    (n) => !n.leida
  ).length;

  return (
    <header className="aprendiz-header">

      {/* LOGO */}

      <div className="logo">
        <img
          src={logo}
          alt="Sena Parking"
        />
      </div>

      {/* MENÚ PRINCIPAL */}

      <nav className="menu-principal">

        {/* INICIO */}

        <NavLink
          to="/dashboard-aprendiz"
          end
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          INICIO
        </NavLink>

        {/* VISUALIZAR CARNET */}

        <NavLink
          to="/dashboard-aprendiz/visualizar-carnet"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          VISUALIZAR CARNET
        </NavLink>

        {/* MIS VEHÍCULOS */}

        <NavLink
          to="/dashboard-aprendiz/mis-vehiculos"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          MIS VEHÍCULOS
        </NavLink>

        {/* ACTUALIZAR DATOS */}

        <NavLink
          to="/dashboard-aprendiz/actualizar-datos"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          ACTUALIZAR DATOS
        </NavLink>

        {/* PETICIÓN DEL CARNET */}

        <NavLink
          to="/dashboard-aprendiz/peticion-carnet"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          PETICIÓN DEL CARNET
        </NavLink>

      </nav>

      {/* CONTROLES DERECHOS */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >

        {/* NOTIFICACIONES */}

        <div className="campana-container">

          <button
            className="campana-btn"
            onClick={abrirNotificaciones}
          >
            🔔

            {noLeidas > 0 && (
              <span className="badge">
                {noLeidas}
              </span>
            )}
          </button>

          {mostrarNotificaciones && (

            <div className="panel-notificaciones">

              <h3>
                Notificaciones
              </h3>

              {notificaciones.length === 0 ? (

                <p>
                  No tienes notificaciones.
                </p>

              ) : (

                notificaciones.map((n) => (

                  <div
                    key={n.id}
                    className="notificacion-item"
                  >

                    <p>
                      {n.mensaje}
                    </p>

                    <small>
                      {new Date(
                        n.createdAt
                      ).toLocaleString()}
                    </small>

                  </div>

                ))

              )}

            </div>

          )}

        </div>

        {/* MENÚ HAMBURGUESA */}

        <div className="menu-hamburguesa">

          <button
            className="hamburguesa"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            ☰
          </button>

          {menuOpen && (

            <div className="dropdown">

              <NavLink
                to="/dashboard-aprendiz/manual"
                onClick={cerrarMenu}
              >
                Manual de uso
              </NavLink>

              <NavLink
                to="/dashboard-aprendiz/soporte"
                onClick={cerrarMenu}
              >
                Soporte técnico
              </NavLink>

              <button onClick={logout}>
                Cerrar sesión
              </button>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}
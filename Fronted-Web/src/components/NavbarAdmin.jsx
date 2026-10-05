import { NavLink } from "react-router-dom";
import { useState } from "react";
import { axiosClient } from "../api/axiosClient";
import logo from "../Styles/logo/logo sena parking.png";
import "../Styles/administrador/navbarAdmin.css";

export default function NavbarAdmin() {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
  try {
    await axiosClient.post("/auth/logout");
  } catch (error) {
    console.error(error);
  }

  localStorage.removeItem("user");
  window.location.href = "/";
};

  return (
    <nav className="navbar-admin">
      <div className="navbar-left">

        <div className="logo-admin">
          <img
            src={logo}
            alt="SenaParking"
          />
        </div>

        <NavLink
          end
          to="/dashboard-admin"
          className={({ isActive }) =>
            isActive
              ? "nav-link-admin active"
              : "nav-link-admin"
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/dashboard-admin/ver-peticiones"
          className={({ isActive }) =>
            isActive
              ? "nav-link-admin active"
              : "nav-link-admin"
          }
        >
          Ver Peticiones
        </NavLink>

        <NavLink
          to="/dashboard-admin/solicitudes-actualizacion"
          className={({ isActive }) =>
            isActive
              ? "nav-link-admin active"
              : "nav-link-admin"
          }
        >
          Solicitudes Actualización
        </NavLink>

        <NavLink
          to="/dashboard-admin/tipo-documentos"
          className={({ isActive }) =>
            isActive
              ? "nav-link-admin active"
              : "nav-link-admin"
          }
        >
          Tipo Documentos
        </NavLink>

        <NavLink
          to="/dashboard-admin/vehiculos"
          className={({ isActive }) =>
            isActive
              ? "nav-link-admin active"
              : "nav-link-admin"
          }
        >
          Vehículos
        </NavLink>

        <NavLink
          to="/dashboard-admin/bloqueos"
          className={({ isActive }) =>
            isActive
              ? "nav-link-admin active"
              : "nav-link-admin"
          }
        >
          Bloqueos / Reportes
        </NavLink>

        <NavLink
          to="/dashboard-admin/soporte"
          className={({ isActive }) =>
            isActive
              ? "nav-link-admin active"
              : "nav-link-admin"
          }
        >
          Soporte Técnico
        </NavLink>

      </div>

      <div className="menu-hamburguesa">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {menuOpen && (
          <div className="dropdown-admin">

            <NavLink
              to="/dashboard-admin/centros-formacion"
              onClick={() => setMenuOpen(false)}
            >
              Centros de Formación
            </NavLink>

            <NavLink
              to="/dashboard-admin/datos-usuarios"
              onClick={() => setMenuOpen(false)}
            >
              Datos Usuarios
            </NavLink>

            <NavLink
              to="/dashboard-admin/reportes"
              onClick={() => setMenuOpen(false)}
            >
              Reportes Recibidos
            </NavLink>

            <button onClick={logout}>
              Cerrar Sesión
            </button>

          </div>
        )}
      </div>
    </nav>
  );
}
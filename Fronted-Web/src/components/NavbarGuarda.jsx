import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../styles/logo/logo sena parking.png";
import "../styles/guarda/NavbarGuarda.css";
import { axiosClient } from "../api/axiosClient";

export default function NavbarGuarda() {
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <header className="guarda-header">

      {/* LOGO */}
      <div className="logo">
        <img
          src={logo}
          alt="Logo Sena Parking"
        />
      </div>

      {/* MENÚ */}
      <nav className="menu-principal">

        {/* INICIO */}
        <NavLink
          to="/dashboard-guarda"
          end
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          INICIO
        </NavLink>

        {/* ESCANEAR QR */}
        <NavLink
          to="/dashboard-guarda/escanear-qr"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          ESCANEAR QR
        </NavLink>

        {/* MANUAL */}
        <NavLink
          to="/dashboard-guarda/manual"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          MANUAL
        </NavLink>

        {/* ENTRADA / SALIDA */}
        <NavLink
          to="/dashboard-guarda/entrada-salida"
          className={({ isActive }) =>
            isActive ? "activo" : ""
          }
        >
          ENTRADA / SALIDA
        </NavLink>

      </nav>

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

            <button onClick={logout}>
              Cerrar sesión
            </button>

          </div>
        )}

      </div>

    </header>
  );
}
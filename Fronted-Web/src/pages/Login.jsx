import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient  from "../api/axiosClient";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("aprendiz");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/login", {
        email: email.trim(),
        password,
        rol,
      });

      const user = res.data?.user;

      if (!user) {
        setError("No se recibió la información del usuario.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log("LOGIN CORRECTO:", user);

      if (user.rol === "administrador") {
        navigate("/dashboard-admin", { replace: true });
        return;
      }

      if (user.rol === "guarda") {
        navigate("/dashboard-guarda", { replace: true });
        return;
      }

      if (user.rol === "aprendiz") {
        navigate("/dashboard-aprendiz", { replace: true });
        return;
      }

      localStorage.removeItem("user");
      setError("El rol del usuario no es válido.");

    } catch (err) {
      console.error("ERROR LOGIN:", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        "Error al iniciar sesión.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-header">
          <h1>INICIAR SESIÓN</h1>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="login-section">

            <label>Tipo de usuario</label>

            <div className="role-buttons">

              <button
                type="button"
                className={
                  rol === "aprendiz"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() => setRol("aprendiz")}
              >
                Aprendiz
              </button>

              <button
                type="button"
                className={
                  rol === "guarda"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() => setRol("guarda")}
              >
                Guarda
              </button>

              <button
                type="button"
                className={
                  rol === "administrador"
                    ? "role-button active"
                    : "role-button"
                }
                onClick={() => setRol("administrador")}
              >
                Administrador
              </button>

            </div>

          </div>

          <div className="login-section">

            <h3>Datos de acceso</h3>

            <div className="login-fields">

              <div className="login-group">

                <label>
                  Correo electrónico
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

              <div className="login-group">

                <label>
                  Contraseña
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

            </div>

          </div>

          <div className="forgot-container">

            <Link
              to="/olvide-contraseña"
              className="forgot-link"
            >
              ¿Olvidaste tu contraseña?
            </Link>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Ingresando..."
              : "INICIAR SESIÓN"}
          </button>

          <Link
            to="/"
            className="back-home"
          >
            Volver al inicio
          </Link>

        </form>

      </div>

    </div>
  );
}
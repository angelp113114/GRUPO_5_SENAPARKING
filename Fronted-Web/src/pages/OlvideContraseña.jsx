import { useState } from "react";
import  axiosClient  from "../api/axiosClient";
import { Link } from "react-router-dom";
import "../styles/olvideContraseña.css";

export default function OlvideContraseña() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarPin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMensaje("");

      await axiosClient.post(
        "/auth/recuperar-password",
        {
          email,
        }
      );

      localStorage.setItem(
        "emailRecuperacion",
        email
      );

      setMensaje(
        "Se ha enviado con éxito el PIN de recuperación."
      );

      setTimeout(() => {
        window.location.href =
          "/verificar-codigo";
      }, 1500);

    } catch (error) {
      setMensaje(
        error?.response?.data?.message ||
        "No fue posible enviar el PIN."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="olvide-container">

      <div className="olvide-card">

        <h2>Recuperar contraseña</h2>

        <p className="olvide-description">
          Ingresa tu correo electrónico y te enviaremos
          un PIN de recuperación de 6 dígitos.
        </p>

        <form onSubmit={enviarPin}>

          <label htmlFor="email">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Enviando..."
              : "CONFIRMAR"}
          </button>

        </form>

        {mensaje && (
          <div className="mensaje">
            {mensaje}
          </div>
        )}

        <Link
          to="/"
          className="volver-inicio"
        >
          Volver al inicio
        </Link>

      </div>

    </div>
  );
}
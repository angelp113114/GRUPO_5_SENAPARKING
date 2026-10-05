import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  axiosClient  from "../api/axiosClient";
import "../styles/cambiarContraseña.css";

export default function CambiarContraseña() {
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] =
    useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const cambiarPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    // ==========================================
    // OBTENER TOKEN DE RECUPERACIÓN
    // ==========================================

    const resetToken =
      localStorage.getItem(
        "tokenRecuperacion"
      );

    const pinVerificado =
      localStorage.getItem(
        "pinVerificado"
      );

    if (
      !resetToken ||
      pinVerificado !== "true"
    ) {
      setError(
        "La sesión de recuperación no es válida. Solicite un nuevo código."
      );
      return;
    }

    // ==========================================
    // VALIDAR CONTRASEÑA
    // ==========================================

    if (password.length < 8) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres."
      );
      return;
    }

    // ==========================================
    // CONFIRMAR CONTRASEÑA
    // ==========================================

    if (password !== confirmarPassword) {
      setError(
        "Las contraseñas no coinciden."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "TOKEN RECUPERACION:",
        resetToken
      );

      // ==========================================
      // CAMBIAR CONTRASEÑA
      // ==========================================

      const res = await axiosClient.post(
        "/auth/cambiar-password",
        {
          resetToken: resetToken,
          password: password,
        }
      );

      console.log(
        "RESPUESTA CAMBIAR PASSWORD:",
        res.data
      );

      // ==========================================
      // MENSAJE DE ÉXITO
      // ==========================================

      setMensaje(
        "Contraseña actualizada correctamente."
      );

      // ==========================================
      // LIMPIAR RECUPERACIÓN
      // ==========================================

      localStorage.removeItem(
        "tokenRecuperacion"
      );

      localStorage.removeItem(
        "pinVerificado"
      );

      localStorage.removeItem(
        "emailRecuperacion"
      );

      // Limpiar campos
      setPassword("");
      setConfirmarPassword("");

      // ==========================================
      // VOLVER AL LOGIN
      // ==========================================

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);

    } catch (err) {
      console.error(
        "ERROR CAMBIANDO CONTRASEÑA:",
        err
      );

      console.error(
        "RESPUESTA DEL ERROR:",
        err?.response?.data
      );

      setError(
        err?.response?.data?.message ||
        "No fue posible cambiar la contraseña."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cambiar-container">

      <div className="cambiar-card">

        <h2>
          Cambiar contraseña
        </h2>

        <p>
          Ingrese su nueva contraseña.
        </p>

        <form onSubmit={cambiarPassword}>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Nueva contraseña"
            required
          />

          <input
            type="password"
            value={confirmarPassword}
            onChange={(e) =>
              setConfirmarPassword(
                e.target.value
              )
            }
            placeholder="Confirmar contraseña"
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Actualizando..."
              : "Cambiar contraseña"}
          </button>

        </form>

        {mensaje && (
          <div className="success-message">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

      </div>

    </div>
  );
}
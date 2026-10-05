import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { axiosClient } from "../api/axiosClient";

export default function ProtectedRoute({
  children,
  rol,
}) {
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    verificar();
  }, []);

  const verificar = async () => {
    try {
      const res = await axiosClient.get(
        "/auth/me",
        {
          withCredentials: true,
        }
      );

      const usuario = res.data;

      console.log(
        "USUARIO AUTENTICADO:",
        usuario
      );

      // ==========================================
      // VALIDAR ROL
      // ==========================================

      if (
        rol &&
        usuario.rol !== rol
      ) {
        console.log(
          "Rol incorrecto:",
          usuario.rol
        );

        setAutorizado(false);
        return;
      }

      // ==========================================
      // GUARDAR USUARIO ACTUALIZADO
      // ==========================================

      localStorage.setItem(
        "user",
        JSON.stringify(usuario)
      );

      setAutorizado(true);

    } catch (error) {

      console.error(
        "ERROR SESION:",
        error
      );

      setAutorizado(false);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CARGANDO
  // ==========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Verificando sesión...
      </div>
    );
  }

  // ==========================================
  // NO AUTORIZADO
  // ==========================================

  if (!autorizado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // AUTORIZADO
  // ==========================================

  return children;
}
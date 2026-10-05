import { useState } from "react";
import { carnetApi } from "../../api/carnetApi";

export default function GenerarCarnet({
  solicitud,
  onGenerado,
}) {

  const [loading, setLoading] =
    useState(false);

  const handleGenerar = async () => {

    if (!solicitud?.id) {

      alert(
        "No se encontró el ID de la solicitud"
      );

      return;
    }

    try {

      setLoading(true);

      console.log(
        "🎫 GENERANDO CARNET"
      );

      console.log(
        "Solicitud:",
        solicitud.id
      );

      const res =
        await carnetApi.generar(
          solicitud.id
        );

      console.log(
        "✅ RESPUESTA GENERAR CARNET:",
        res.data
      );

      alert(
        "Carnet generado correctamente"
      );

      // Actualizar la tabla
      if (onGenerado) {
        await onGenerado();
      }

    } catch (error) {

      console.error(
        "❌ ERROR GENERANDO CARNET:",
        error
      );

      console.error(
        "BACKEND:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
        "Error al generar el carnet"
      );

    } finally {

      setLoading(false);

    }
  };

  if (!solicitud?.id) {
    return null;
  }

  if (solicitud.estado !== "aprobada") {
    return null;
  }

  return (
    <button
      type="button"
      className="btn-generar-carnet"
      onClick={handleGenerar}
      disabled={loading}
    >

      {loading
        ? "Generando..."
        : "🎫 Generar Carnet"}

    </button>
  );
}
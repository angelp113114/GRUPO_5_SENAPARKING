import { useEffect, useState } from "react";
import { entradaSalidaApi } from "../../api/entradaSalidaApi";
import "../../Styles/guarda/EntradaSalida.css";

export default function EntradaSalidaCrud() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const safeData = (res) => {
    const data = res.data?.data;
    return Array.isArray(data) ? data : [];
  };

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await entradaSalidaApi.list();
      setItems(safeData(res));
    } catch (err) {
      console.error(err);
      setError("Error cargando registros");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();

    const intervalo = setInterval(() => {
      loadItems();
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="es-container">

      <div className="es-header">
        <h1>🚪 Historial de Entradas y Salidas</h1>
        <p>Control en tiempo real de aprendices y vehículos</p>
      </div>

      {loading && <p className="es-loading">⏳ Cargando datos...</p>}

      {error && (
        <div className="es-error">
          {error}
        </div>
      )}

      <div className="es-card">

        <table className="es-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Aprendiz</th>
              <th>Vehículo</th>
              <th>Placa / Serial</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>
                    {item.fecha
                      ? new Date(item.fecha).toLocaleDateString("es-CO")
                      : "-"}
                  </td>

                  <td>{item.aprendiz}</td>
                  <td>{item.vehiculo}</td>
                  <td>{item.placaSerial}</td>

                  <td>
                    {item.hora_entrada
                      ? new Date(item.hora_entrada).toLocaleTimeString("es-CO")
                      : "-"}
                  </td>

                  <td>
                    {item.hora_salida
                      ? new Date(item.hora_salida).toLocaleTimeString("es-CO")
                      : "-"}
                  </td>

                  <td>
                    <span className={item.estado === "dentro" ? "estado-verde" : "estado-rojo"}>
                      {item.estado === "dentro" ? "🟢 Dentro" : "🔴 Fuera"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="es-empty">
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}
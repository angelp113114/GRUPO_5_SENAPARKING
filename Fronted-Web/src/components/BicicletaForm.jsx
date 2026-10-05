// Importa useState para manejar datos del formulario
import { useState } from "react";

// Componente de formulario para bicicletas
export default function BicicletaForm({ onSubmit, initialData, onCancel, tipo, isEditing }) {
 
  // Estado local con los datos del formulario
  const [formData, setFormData] = useState({
    tipo: tipo,                                      // "bicicleta"
    id_centro_de_formacion: initialData?.id_centro_de_formacion || "",  // ID del centro
    foto_de_la_bicicleta: initialData?.foto_de_la_bicicleta || "",      // URL foto principal
    foto_serial_bicicleta: initialData?.foto_serial_bicicleta || "",    // URL foto serial
    marca_de_la_bicicleta: initialData?.marca_de_la_bicicleta || "",    // Marca
    color_de_la_bicicleta: initialData?.color_de_la_bicicleta || "",    // Color
    serial_de_la_bicicleta: initialData?.serial_de_la_bicicleta || ""   // Serial único
  });

  // Actualiza el estado cuando el usuario escribe en un campo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cuando se envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();      // Evita que recargue la página
    onSubmit(formData);      // Envía los datos al padre
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo: Centro de Formación */}
      <div style={{ marginBottom: 15 }}>
        <label>Centro de Formación ID *</label>
        <input
          type="number"
          name="id_centro_de_formacion"
          value={formData.id_centro_de_formacion}
          onChange={handleChange}
          required  // Campo obligatorio
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Marca */}
      <div style={{ marginBottom: 15 }}>
        <label>Marca *</label>
        <input
          type="text"
          name="marca_de_la_bicicleta"
          value={formData.marca_de_la_bicicleta}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Color */}
      <div style={{ marginBottom: 15 }}>
        <label>Color *</label>
        <input
          type="text"
          name="color_de_la_bicicleta"
          value={formData.color_de_la_bicicleta}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Serial */}
      <div style={{ marginBottom: 15 }}>
        <label>Serial *</label>
        <input
          type="text"
          name="serial_de_la_bicicleta"
          value={formData.serial_de_la_bicicleta}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Foto bicicleta (opcional) */}
      <div style={{ marginBottom: 15 }}>
        <label>URL Foto de la bicicleta</label>
        <input
          type="text"
          name="foto_de_la_bicicleta"
          value={formData.foto_de_la_bicicleta}
          onChange={handleChange}
          placeholder="https://ejemplo.com/foto.jpg"
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Foto serial (opcional) */}
      <div style={{ marginBottom: 15 }}>
        <label>URL Foto del serial</label>
        <input
          type="text"
          name="foto_serial_bicicleta"
          value={formData.foto_serial_bicicleta}
          onChange={handleChange}
          placeholder="https://ejemplo.com/serial.jpg"
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Botones */}
      <div style={{ display: "flex", gap: 10 }}>
        <button type="submit" style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 4 }}>
          Guardar
        </button>
        <button type="button" onClick={onCancel} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: 4 }}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
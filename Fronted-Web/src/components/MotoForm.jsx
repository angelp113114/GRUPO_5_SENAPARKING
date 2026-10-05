// Importa useState para manejar datos del formulario
import { useState } from "react";

// Componente de formulario para motos
export default function MotoForm({ onSubmit, initialData, onCancel, tipo, isEditing }) {
 
  // Estado local con los datos de la moto
  const [formData, setFormData] = useState({
    tipo: tipo,                                          // "moto"
    id_centro_de_formacion: initialData?.id_centro_de_formacion || "",
    foto_moto: initialData?.foto_moto || "",             // URL foto de la moto
    foto_placa_moto: initialData?.foto_placa_moto || "", // URL foto placa
    tarjeta_de_propiedad_moto: initialData?.tarjeta_de_propiedad_moto || "", // URL tarjeta
    soat_y_tecnoc_mecanica_vigentes: initialData?.soat_y_tecnoc_mecanica_vigentes || "", // SI/NO
    marca_de_la_moto: initialData?.marca_de_la_moto || "",     // Marca
    cilindraje_moto: initialData?.cilindraje_moto || "",       // Cilindraje (ej: 200cc)
    color_de_la_moto: initialData?.color_de_la_moto || "",     // Color
    modelo_de_la_moto: initialData?.modelo_de_la_moto || "",   // Año del modelo
    placa: initialData?.placa || ""                           // Placa del vehículo
  });

  // Actualiza el estado cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cuando se envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
          required
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Marca */}
      <div style={{ marginBottom: 15 }}>
        <label>Marca *</label>
        <input
          type="text"
          name="marca_de_la_moto"
          value={formData.marca_de_la_moto}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Placa (obligatorio para motos) */}
      <div style={{ marginBottom: 15 }}>
        <label>Placa *</label>
        <input
          type="text"
          name="placa"
          value={formData.placa}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Cilindraje */}
      <div style={{ marginBottom: 15 }}>
        <label>Cilindraje</label>
        <input
          type="text"
          name="cilindraje_moto"
          value={formData.cilindraje_moto}
          onChange={handleChange}
          placeholder="Ej: 200cc"
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Color */}
      <div style={{ marginBottom: 15 }}>
        <label>Color</label>
        <input
          type="text"
          name="color_de_la_moto"
          value={formData.color_de_la_moto}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: Modelo */}
      <div style={{ marginBottom: 15 }}>
        <label>Modelo</label>
        <input
          type="text"
          name="modelo_de_la_moto"
          value={formData.modelo_de_la_moto}
          onChange={handleChange}
          placeholder="Ej: 2022"
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campos de fotos (opcionales) */}
      <div style={{ marginBottom: 15 }}>
        <label>URL Foto de la moto</label>
        <input
          type="text"
          name="foto_moto"
          value={formData.foto_moto}
          onChange={handleChange}
          placeholder="https://ejemplo.com/moto.jpg"
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>URL Foto de la placa</label>
        <input
          type="text"
          name="foto_placa_moto"
          value={formData.foto_placa_moto}
          onChange={handleChange}
          placeholder="https://ejemplo.com/placa.jpg"
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>URL Tarjeta de propiedad</label>
        <input
          type="text"
          name="tarjeta_de_propiedad_moto"
          value={formData.tarjeta_de_propiedad_moto}
          onChange={handleChange}
          placeholder="https://ejemplo.com/tarjeta.jpg"
          style={{ width: "100%", padding: 8, marginTop: 5, border: "1px solid #ddd", borderRadius: 4 }}
        />
      </div>

      {/* Campo: SOAT y Tecnomecánica */}
      <div style={{ marginBottom: 15 }}>
        <label>SOAT y Tecnomecánica vigentes</label>
        <input
          type="text"
          name="soat_y_tecnoc_mecanica_vigentes"
          value={formData.soat_y_tecnoc_mecanica_vigentes}
          onChange={handleChange}
          placeholder="SI/NO"
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
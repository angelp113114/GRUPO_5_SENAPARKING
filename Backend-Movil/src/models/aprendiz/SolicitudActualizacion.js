const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SolicitudActualizacion = sequelize.define(
  "SolicitudActualizacion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    tipo: {
      type: DataTypes.ENUM(
        "datos_personales",
        "datos_vehiculo"
      ),
      allowNull: false
    },

    datosActuales: {
      type: DataTypes.JSON,
      allowNull: false
    },

    datosNuevos: {
      type: DataTypes.JSON,
      allowNull: false
    },

    // Foto nueva enviada por el aprendiz
    fotoNueva: {
      type: DataTypes.TEXT,
      allowNull: true
    },

  
    // Documentos anexados
    documentos: {
      type: DataTypes.JSON,
      allowNull: true
    },

    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "aprobada",
        "rechazada"
      ),
      defaultValue: "pendiente"
    }
  }
);

module.exports = SolicitudActualizacion;
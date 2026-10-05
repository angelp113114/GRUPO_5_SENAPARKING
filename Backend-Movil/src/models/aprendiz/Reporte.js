const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Reporte = sequelize.define("Reporte", {
  asunto: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  respuesta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  estado: {
    type: DataTypes.ENUM(
      "Pendiente",
      "En proceso",
      "Resuelto"
    ),
    defaultValue: "Pendiente",
  },
});

module.exports = Reporte;
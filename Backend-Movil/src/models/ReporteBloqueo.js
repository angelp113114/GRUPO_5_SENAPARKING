const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReporteBloqueo = sequelize.define("ReporteBloqueo", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  tipo: {
    type: DataTypes.ENUM("reporte", "bloqueo"),
    allowNull: false
  },

  motivo: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  creadoPor: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = ReporteBloqueo;
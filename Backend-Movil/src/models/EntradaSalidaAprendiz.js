const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EntradaSalidaAprendiz = sequelize.define("EntradaSalidaAprendiz", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  id_aprendiz: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  id_codigo_gr: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  hora_entrada: {
    type: DataTypes.DATE,
    allowNull: false
  },

  hora_salida: {
    type: DataTypes.DATE,
    allowNull: true
  },

  estado: {
    type: DataTypes.ENUM("dentro", "fuera"),
    defaultValue: "dentro"
  }
});

module.exports = EntradaSalidaAprendiz;
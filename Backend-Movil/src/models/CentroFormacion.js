const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CentroFormacion = sequelize.define("CentroFormacion", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },

  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  },

  estado: {
    type: DataTypes.ENUM("activo", "inactivo"),
    defaultValue: "activo"
  }
});

module.exports = CentroFormacion;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notificacion = sequelize.define("Notificacion", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  titulo: DataTypes.STRING,
  mensaje: DataTypes.TEXT,

  leido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Notificacion;
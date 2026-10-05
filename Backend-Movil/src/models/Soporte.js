const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Soporte = sequelize.define(
  "Soporte",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    asunto: {
      type: DataTypes.STRING,
      allowNull: false
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    estado: {
      type: DataTypes.ENUM(
        "Pendiente",
        "En proceso",
        "Resuelto"
      ),
      defaultValue: "Pendiente"
    },

    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "Soportes", // ← Nombre exacto de la tabla
    freezeTableName: true  // ← Evita que Sequelize cambie el nombre
  }
);

module.exports = Soporte;
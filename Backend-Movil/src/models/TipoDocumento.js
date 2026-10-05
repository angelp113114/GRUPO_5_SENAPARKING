const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TipoDocumento = sequelize.define("tipo_documentos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true   // 🔥 ESTO FALTABA
  },
  sigla: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre_documento: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = TipoDocumento;
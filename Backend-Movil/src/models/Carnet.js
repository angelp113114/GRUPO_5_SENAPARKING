const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carnet = sequelize.define(
  "Carnet",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El usuario es obligatorio",
        },
        isInt: {
          msg: "El ID del usuario debe ser un número entero",
        },
        min: {
          args: [1],
          msg: "El ID del usuario debe ser válido",
        },
      },
    },

    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "El ID del vehículo debe ser un número entero",
        },
        min: {
          args: [1],
          msg: "El ID del vehículo debe ser válido",
        },
      },
    },

    solicitudId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La solicitud es obligatoria",
        },
        isInt: {
          msg: "El ID de la solicitud debe ser un número entero",
        },
        min: {
          args: [1],
          msg: "El ID de la solicitud debe ser válido",
        },
      },
    },

    codigoQr: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "El código QR es obligatorio",
        },

        notEmpty: {
          msg: "El código QR no puede estar vacío",
        },

        len: {
          args: [5, 255],
          msg: "El código QR debe tener entre 5 y 255 caracteres",
        },
      },
    },

    estado: {
      type: DataTypes.ENUM(
        "activo",
        "vencido",
        "bloqueado"
      ),
      allowNull: false,
      defaultValue: "activo",
      validate: {
        isIn: {
          args: [
            ["activo", "vencido", "bloqueado"],
          ],
          msg: "El estado del carnet no es válido",
        },
      },
    },
  },

  {
    hooks: {
      beforeValidate: (carnet) => {
        if (typeof carnet.codigoQr === "string") {
          carnet.codigoQr = carnet.codigoQr.trim();
        }
      },
    },
  }
);

module.exports = Carnet;
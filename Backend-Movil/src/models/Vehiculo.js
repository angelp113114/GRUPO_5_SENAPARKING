const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Vehiculo = sequelize.define(
  "vehiculos",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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

    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El tipo de vehículo es obligatorio",
        },
        notEmpty: {
          msg: "El tipo de vehículo no puede estar vacío",
        },
        len: {
          args: [2, 30],
          msg: "El tipo de vehículo debe tener entre 2 y 30 caracteres",
        },
      },
    },

    id_centro_de_formacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El centro de formación es obligatorio",
        },
        isInt: {
          msg: "El centro de formación debe ser un número entero",
        },
        min: {
          args: [1],
          msg: "El centro de formación debe ser un ID válido",
        },
      },
    },

    marca: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La marca del vehículo es obligatoria",
        },
        notEmpty: {
          msg: "La marca del vehículo no puede estar vacía",
        },
        len: {
          args: [2, 50],
          msg: "La marca debe tener entre 2 y 50 caracteres",
        },
      },
    },

    color: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 30],
          msg: "El color debe tener entre 2 y 30 caracteres",
        },
      },
    },

    serial: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 100],
          msg: "El serial debe tener entre 2 y 100 caracteres",
        },
      },
    },

    placa: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [3, 10],
          msg: "La placa debe tener entre 3 y 10 caracteres",
        },
        is: {
          args: /^[A-Za-z0-9-]+$/,
          msg: "La placa solo puede contener letras, números y guiones",
        },
      },
    },

    cilindraje: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 10],
          msg: "El cilindraje no puede superar los 10 caracteres",
        },
      },
    },

    modelo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 4],
          msg: "El modelo debe tener entre 2 y 4 caracteres",
        },
        isNumeric: {
          msg: "El modelo solo puede contener números",
        },
      },
    },

    foto_principal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    foto_secundaria: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "vehiculos",

    hooks: {
      beforeValidate: (vehiculo) => {
        if (typeof vehiculo.tipo === "string") {
          vehiculo.tipo = vehiculo.tipo.trim().toLowerCase();
        }

        if (typeof vehiculo.marca === "string") {
          vehiculo.marca = vehiculo.marca.trim();
        }

        if (typeof vehiculo.color === "string") {
          vehiculo.color = vehiculo.color.trim();
        }

        if (typeof vehiculo.serial === "string") {
          vehiculo.serial = vehiculo.serial.trim();
        }

        if (typeof vehiculo.placa === "string") {
          vehiculo.placa = vehiculo.placa.trim().toUpperCase();
        }

        if (typeof vehiculo.cilindraje === "string") {
          vehiculo.cilindraje = vehiculo.cilindraje.trim();
        }

        if (typeof vehiculo.modelo === "string") {
          vehiculo.modelo = vehiculo.modelo.trim();
        }
      },
    },
  }
);

module.exports = Vehiculo;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Los nombres son obligatorios",
        },
        notEmpty: {
          msg: "Los nombres no pueden estar vacíos",
        },
        len: {
          args: [2, 100],
          msg: "Los nombres deben tener entre 2 y 100 caracteres",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          msg: "Los nombres solo pueden contener letras y espacios",
        },
      },
    },

    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Los apellidos son obligatorios",
        },
        notEmpty: {
          msg: "Los apellidos no pueden estar vacíos",
        },
        len: {
          args: [2, 100],
          msg: "Los apellidos deben tener entre 2 y 100 caracteres",
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          msg: "Los apellidos solo pueden contener letras y espacios",
        },
      },
    },

    documento: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "El documento es obligatorio",
        },
        notEmpty: {
          msg: "El documento no puede estar vacío",
        },
        isNumeric: {
          msg: "El documento solo puede contener números",
        },
        len: {
          args: [6, 15],
          msg: "El documento debe tener entre 6 y 15 dígitos",
        },
      },
    },

    tipoDocumento: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El tipo de documento es obligatorio",
        },
        notEmpty: {
          msg: "El tipo de documento no puede estar vacío",
        },
        len: {
          args: [1, 20],
          msg: "El tipo de documento no es válido",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "El correo electrónico es obligatorio",
        },
        notEmpty: {
          msg: "El correo electrónico no puede estar vacío",
        },
        isEmail: {
          msg: "El correo electrónico no tiene un formato válido",
        },
        len: {
          args: [5, 150],
          msg: "El correo electrónico debe tener entre 5 y 150 caracteres",
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La contraseña es obligatoria",
        },
        notEmpty: {
          msg: "La contraseña no puede estar vacía",
        },
        len: {
          args: [8, 255],
          msg: "La contraseña debe tener al menos 8 caracteres",
        },
      },
    },

    centroFormacionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: "El centro de formación debe ser un número entero",
        },
        min: {
          args: [1],
          msg: "El centro de formación debe ser un ID válido",
        },
      },
    },

    ficha: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 30],
          msg: "La ficha no puede superar los 30 caracteres",
        },
      },
    },

    rol: {
      type: DataTypes.ENUM(
        "administrador",
        "guarda",
        "aprendiz"
      ),
      defaultValue: "aprendiz",
      validate: {
        isIn: {
          args: [
            ["administrador", "guarda", "aprendiz"],
          ],
          msg: "El rol seleccionado no es válido",
        },
      },
    },

    celular: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: "El celular solo puede contener números",
        },
        len: {
          args: [10, 10],
          msg: "El celular debe tener exactamente 10 dígitos",
        },
      },
    },

    foto: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 500],
          msg: "La ruta de la foto no puede superar los 500 caracteres",
        },
      },
    },

    fechaVinculacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          msg: "La fecha de vinculación no es válida",
        },
      },
    },

    fechaFinalizacion: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: {
          msg: "La fecha de finalización no es válida",
        },
      },
    },

    pinRecuperacion: {
      type: DataTypes.STRING(6),
      allowNull: true,
      validate: {
        isNumeric: {
          msg: "El PIN de recuperación solo puede contener números",
        },
        len: {
          args: [6, 6],
          msg: "El PIN de recuperación debe tener exactamente 6 dígitos",
        },
      },
    },

    fechaPin: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: "La fecha del PIN no es válida",
        },
      },
    },

    estado: {
      type: DataTypes.STRING,
      defaultValue: "activo",
      validate: {
        notEmpty: {
          msg: "El estado no puede estar vacío",
        },
        isIn: {
          args: [
            ["activo", "inactivo", "bloqueado"],
          ],
          msg: "El estado seleccionado no es válido",
        },
      },
    },
  },

  {
    hooks: {
      beforeValidate: (user) => {
        if (typeof user.nombres === "string") {
          user.nombres = user.nombres.trim();
        }

        if (typeof user.apellidos === "string") {
          user.apellidos = user.apellidos.trim();
        }

        if (typeof user.documento === "string") {
          user.documento = user.documento.trim();
        }

        if (typeof user.email === "string") {
          user.email = user.email.trim().toLowerCase();
        }

        if (typeof user.celular === "string") {
          user.celular = user.celular.trim();
        }

        if (typeof user.ficha === "string") {
          user.ficha = user.ficha.trim();
        }

        if (typeof user.pinRecuperacion === "string") {
          user.pinRecuperacion = user.pinRecuperacion.trim();
        }

        if (typeof user.estado === "string") {
          user.estado = user.estado.trim().toLowerCase();
        }
      },
    },
  }
);

module.exports = User;
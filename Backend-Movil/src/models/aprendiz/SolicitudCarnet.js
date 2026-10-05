
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SolicitudCarnet = sequelize.define(
  "SolicitudCarnet",
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

    tipoVehiculo: {
      type: DataTypes.ENUM("bicicleta", "moto"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "El tipo de vehículo es obligatorio",
        },
        isIn: {
          args: [["bicicleta", "moto"]],
          msg: "El tipo de vehículo debe ser bicicleta o moto",
        },
      },
    },

    marca: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La marca es obligatoria",
        },
        notEmpty: {
          msg: "La marca no puede estar vacía",
        },
        len: {
          args: [2, 50],
          msg: "La marca debe tener entre 2 y 50 caracteres",
        },
      },
    },

    color: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El color es obligatorio",
        },
        notEmpty: {
          msg: "El color no puede estar vacío",
        },
        len: {
          args: [2, 30],
          msg: "El color debe tener entre 2 y 30 caracteres",
        },
      },
    },

    // =====================================================
    // SERIAL DE BICICLETA / PLACA DE MOTO
    // Este valor se muestra en el carnet
    // =====================================================
    serialPlaca: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El serial o la placa es obligatorio",
        },
        notEmpty: {
          msg: "El serial o la placa no puede estar vacío",
        },
        len: {
          args: [3, 30],
          msg: "El serial o la placa debe tener entre 3 y 30 caracteres",
        },
        is: {
          args: /^[A-Za-z0-9-]+$/,
          msg: "El serial o la placa solo puede contener letras, números y guiones",
        },
      },
    },

    // =====================================================
    // FOTO DEL SERIAL / PLACA
    // Esta foto NO reemplaza el texto anterior.
    // Se utiliza como evidencia para el administrador.
    // =====================================================
    fotoPlacaSerial: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La foto de la placa o serial es obligatoria",
        },
        notEmpty: {
          msg: "La foto de la placa o serial es obligatoria",
        },
        len: {
          args: [1, 255],
          msg: "La ruta de la foto de la placa o serial no es válida",
        },
      },
    },

    // =====================================================
    // DATOS ADICIONALES DEL VEHÍCULO
    // =====================================================

    cilindraje: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [1, 10],
          msg: "El cilindraje no puede superar los 10 caracteres",
        },
        isNumeric: {
          msg: "El cilindraje solo puede contener números",
        },
      },
    },

    modelo: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 10],
          msg: "El modelo debe tener entre 2 y 10 caracteres",
        },
        isNumeric: {
          msg: "El modelo solo puede contener números",
        },
      },
    },

    // =====================================================
    // FOTO DEL APRENDIZ
    // =====================================================

    fotoAprendiz: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La foto del aprendiz es obligatoria",
        },
        notEmpty: {
          msg: "La foto del aprendiz es obligatoria",
        },
        len: {
          args: [1, 255],
          msg: "La ruta de la foto del aprendiz no es válida",
        },
      },
    },

    // =====================================================
    // FOTO COMPLETA DEL VEHÍCULO
    // =====================================================

    fotoVehiculo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La foto del vehículo es obligatoria",
        },
        notEmpty: {
          msg: "La foto del vehículo es obligatoria",
        },
        len: {
          args: [1, 255],
          msg: "La ruta de la foto del vehículo no es válida",
        },
      },
    },

    // =====================================================
    // FOTO DE LA CÉDULA
    // =====================================================

    fotoCedula: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La foto de la cédula es obligatoria",
        },
        notEmpty: {
          msg: "La foto de la cédula es obligatoria",
        },
        len: {
          args: [1, 255],
          msg: "La ruta de la foto de la cédula no es válida",
        },
      },
    },

    // =====================================================
    // TARJETA DE PROPIEDAD
    // =====================================================

    tarjetaPropiedad: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "La tarjeta de propiedad es obligatoria",
        },
        notEmpty: {
          msg: "La tarjeta de propiedad es obligatoria",
        },
        len: {
          args: [1, 255],
          msg: "La ruta de la tarjeta de propiedad no es válida",
        },
      },
    },

    // =====================================================
    // DOCUMENTOS EXCLUSIVOS PARA MOTO
    // =====================================================

    soat: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La ruta del SOAT no es válida",
        },
      },
    },

    tecnomecanica: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: "La ruta de la tecnomecánica no es válida",
        },
      },
    },

    // =====================================================
    // CAMPOS ANTIGUOS
    // Se mantienen para compatibilidad con solicitudes
    // anteriores.
    // =====================================================

    formatoDiligenciado: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    documentosAnexos: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // =====================================================
    // ESTADO DE LA SOLICITUD
    // =====================================================

    estado: {
      type: DataTypes.ENUM(
        "pendiente",
        "aprobada",
        "rechazada",
        "carnet_generado"
      ),
      allowNull: false,
      defaultValue: "pendiente",
      validate: {
        isIn: {
          args: [[
            "pendiente",
            "aprobada",
            "rechazada",
            "carnet_generado",
          ]],
          msg: "El estado de la solicitud no es válido",
        },
      },
    },
  },

  // =======================================================
  // OPCIONES Y HOOKS
  // =======================================================

  {
    hooks: {
      beforeValidate: (solicitud) => {
        // ---------------------------------------------------
        // Normalización de datos
        // ---------------------------------------------------

        if (typeof solicitud.tipoVehiculo === "string") {
          solicitud.tipoVehiculo = solicitud.tipoVehiculo
            .trim()
            .toLowerCase();
        }

        if (typeof solicitud.marca === "string") {
          solicitud.marca = solicitud.marca.trim();
        }

        if (typeof solicitud.color === "string") {
          solicitud.color = solicitud.color.trim();
        }

        // La placa/serial se guarda en mayúsculas
        if (typeof solicitud.serialPlaca === "string") {
          solicitud.serialPlaca = solicitud.serialPlaca
            .trim()
            .toUpperCase();
        }

        if (typeof solicitud.fotoPlacaSerial === "string") {
          solicitud.fotoPlacaSerial =
            solicitud.fotoPlacaSerial.trim();
        }

        if (typeof solicitud.cilindraje === "string") {
          solicitud.cilindraje = solicitud.cilindraje.trim();
        }

        if (typeof solicitud.modelo === "string") {
          solicitud.modelo = solicitud.modelo.trim();
        }

        if (typeof solicitud.fotoAprendiz === "string") {
          solicitud.fotoAprendiz = solicitud.fotoAprendiz.trim();
        }

        if (typeof solicitud.fotoVehiculo === "string") {
          solicitud.fotoVehiculo = solicitud.fotoVehiculo.trim();
        }

        if (typeof solicitud.fotoCedula === "string") {
          solicitud.fotoCedula = solicitud.fotoCedula.trim();
        }

        if (typeof solicitud.tarjetaPropiedad === "string") {
          solicitud.tarjetaPropiedad =
            solicitud.tarjetaPropiedad.trim();
        }

        if (typeof solicitud.soat === "string") {
          solicitud.soat = solicitud.soat.trim();
        }

        if (typeof solicitud.tecnomecanica === "string") {
          solicitud.tecnomecanica =
            solicitud.tecnomecanica.trim();
        }

        // ---------------------------------------------------
        // Validaciones específicas según el tipo de vehículo
        // ---------------------------------------------------

        // BICICLETA
        if (solicitud.tipoVehiculo === "bicicleta") {
          solicitud.soat = null;
          solicitud.tecnomecanica = null;
        }

        // MOTO
        if (solicitud.tipoVehiculo === "moto") {
          if (!solicitud.soat) {
            throw new Error(
              "El SOAT es obligatorio para las motos"
            );
          }

          if (!solicitud.tecnomecanica) {
            throw new Error(
              "La tecnomecánica es obligatoria para las motos"
            );
          }
        }
      },
    },
  }
);

module.exports = SolicitudCarnet;



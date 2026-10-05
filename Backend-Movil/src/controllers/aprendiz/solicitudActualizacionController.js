const { Op } = require("sequelize");

const SolicitudActualizacion = require("../../models/aprendiz/SolicitudActualizacion");
const User = require("../../models/User");
const Vehiculo = require("../../models/Vehiculo");
const CentroFormacion = require("../../models/CentroFormacion");
const Notificacion = require("../../models/Notificacion");
const generarOCrearCarnet = require("../../utils/generarOCrearCarnet");
const sequelize = require("../../config/database");

// ============================================================
// NORMALIZAR RUTA DE ARCHIVO
// ============================================================

const normalizarRuta = (ruta) => {
  if (!ruta) return null;

  return String(ruta)
    .replace(/\\/g, "/")
    .replace(/^.*?uploads[\\/]/i, "uploads/");
};

// ============================================================
// CONVERTIR JSON DE FORMA SEGURA
// ============================================================

const convertirObjeto = (valor) => {
  if (!valor) return {};

  if (typeof valor === "object") {
    return valor;
  }

  if (typeof valor === "string") {
    try {
      const resultado = JSON.parse(valor);

      if (
        resultado &&
        typeof resultado === "object"
      ) {
        return resultado;
      }
    } catch (error) {
      return {};
    }
  }

  return {};
};

// ============================================================
// DATOS PERSONALES ACTUALES DEL USUARIO
// ============================================================

const obtenerDatosPersonalesActuales = (usuario) => {
  return {
    nombres: usuario.nombres || "",
    apellidos: usuario.apellidos || "",
    documento: usuario.documento || "",
    tipoDocumento: usuario.tipoDocumento || "",
    celular: usuario.celular || "",
    ficha: usuario.ficha || "",
    centroFormacionId:
      usuario.centroFormacionId || "",
    fechaVinculacion:
      usuario.fechaVinculacion || "",
    fechaFinalizacion:
      usuario.fechaFinalizacion || "",
  };
};

// ============================================================
// DATOS DEL VEHÍCULO ACTUALES
// ============================================================

const obtenerDatosVehiculoActuales = (vehiculo) => {
  if (!vehiculo) {
    return {};
  }

  const tipo =
    vehiculo.tipo ||
    vehiculo.tipoVehiculo ||
    "";

  return {
    vehiculoId: vehiculo.id || "",
    tipoVehiculo: tipo,
    marca: vehiculo.marca || "",
    color: vehiculo.color || "",
    serialPlaca:
      vehiculo.placa ||
      vehiculo.serial ||
      "",
    cilindraje:
      vehiculo.cilindraje || "",
    modelo:
      vehiculo.modelo || "",
  };
};

// ============================================================
// CREAR SOLICITUD
// ============================================================

const crearSolicitud = async (req, res) => {
  try {
    let {
      tipo,
      datosActuales,
      datosNuevos,
    } = req.body;

    // ----------------------------------------------------------
    // VALIDAR USUARIO
    // ----------------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    // ----------------------------------------------------------
    // VALIDAR TIPO
    // ----------------------------------------------------------

    if (
      tipo !== "datos_personales" &&
      tipo !== "datos_vehiculo"
    ) {
      return res.status(400).json({
        message:
          "El tipo de actualización no es válido",
      });
    }

    // ----------------------------------------------------------
    // CONVERTIR DATOS NUEVOS
    // ----------------------------------------------------------

    datosNuevos = convertirObjeto(datosNuevos);

    if (
      !datosNuevos ||
      typeof datosNuevos !== "object"
    ) {
      return res.status(400).json({
        message:
          "Los datos nuevos son obligatorios",
      });
    }

    // ----------------------------------------------------------
    // BUSCAR USUARIO
    // ----------------------------------------------------------

    const usuario = await User.findByPk(
      req.user.id
    );

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    // ==========================================================
    // IMPORTANTE:
    // LOS DATOS ANTERIORES SE SACAN DE LA BASE DE DATOS
    // Y NO DEL CELULAR.
    // ==========================================================

    let datosAnterioresReales = {};

    // ==========================================================
    // ACTUALIZACIÓN DE DATOS PERSONALES
    // ==========================================================

    if (tipo === "datos_personales") {
      datosAnterioresReales =
        obtenerDatosPersonalesActuales(
          usuario
        );
    }

    // ==========================================================
    // ACTUALIZACIÓN DE VEHÍCULO
    // ==========================================================

    if (tipo === "datos_vehiculo") {
      let vehiculoId =
        datosNuevos.vehiculoId;

      let vehiculo;

      if (vehiculoId) {
        vehiculo = await Vehiculo.findOne({
          where: {
            id: Number(vehiculoId),
            userId: req.user.id,
          },
        });
      }

      // Si no viene ID, buscamos el primer vehículo
      if (!vehiculo) {
        vehiculo = await Vehiculo.findOne({
          where: {
            userId: req.user.id,
          },
          order: [["id", "ASC"]],
        });
      }

      if (!vehiculo) {
        return res.status(404).json({
          message:
            "El usuario no tiene un vehículo registrado",
        });
      }

      // Guardamos el ID real del vehículo
      datosNuevos.vehiculoId =
        vehiculo.id;

      datosAnterioresReales =
        obtenerDatosVehiculoActuales(
          vehiculo
        );
    }

    // ==========================================================
    // FOTO
    // ==========================================================

    const archivoFoto =
      req.files?.fotoNueva?.[0] || null;

    const fotoNueva = archivoFoto
      ? normalizarRuta(
          archivoFoto.path ||
            archivoFoto.filename
        )
      : null;

    // ==========================================================
    // DOCUMENTOS
    // ==========================================================

    const tiposDocumentos =
      Array.isArray(
        req.body.documentosTipos
      )
        ? req.body.documentosTipos
        : req.body.documentosTipos
        ? [req.body.documentosTipos]
        : [];

    const documentos = (
      req.files?.documentos || []
    ).map((archivo, i) => ({
      tipo: String(
        tiposDocumentos[i] ||
          "general"
      )
        .trim()
        .toLowerCase(),

      nombre:
        archivo.originalname,

      ruta: normalizarRuta(
        archivo.path ||
          archivo.filename
      ),

      mimeType:
        archivo.mimetype,

      tamaño:
        archivo.size,
    }));

    // ==========================================================
    // CREAR SOLICITUD
    // ==========================================================

    const solicitud =
      await SolicitudActualizacion.create({
        userId: req.user.id,
        tipo,

        // IMPORTANTE:
        // SIEMPRE GUARDAMOS EL ESTADO REAL
        // ANTES DE LA ACTUALIZACIÓN.
        datosActuales:
          datosAnterioresReales,

        datosNuevos,

        fotoNueva,

        documentos,

        estado: "pendiente",
      });

    return res.status(201).json({
      message:
        "Solicitud enviada correctamente",

      solicitud: {
        id: solicitud.id,
        userId: solicitud.userId,
        tipo: solicitud.tipo,

        datosActuales:
          datosAnterioresReales,

        datosNuevos,

        fotoNueva,

        documentos,

        estado:
          solicitud.estado,

        createdAt:
          solicitud.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "ERROR CREAR SOLICITUD:",
      error
    );

    if (
      error.name ===
      "SequelizeValidationError"
    ) {
      return res.status(400).json({
        message:
          "Los datos de la solicitud no son válidos",

        errores:
          error.errors.map((e) => ({
            campo: e.path,
            mensaje: e.message,
          })),
      });
    }

    return res.status(500).json({
      message:
        "Error al crear la solicitud",

      error:
        error.message,
    });
  }
};

// ============================================================
// LISTAR SOLICITUDES
// ============================================================

const listarSolicitudes = async (
  req,
  res
) => {
  try {
    let page = parseInt(
      req.query.page,
      10
    );

    let limit = parseInt(
      req.query.limit,
      10
    );

    if (
      !Number.isInteger(page) ||
      page < 1
    ) {
      page = 1;
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 50
    ) {
      limit = 10;
    }

    const offset =
      (page - 1) * limit;

    const search = String(
      req.query.search || ""
    ).trim();

    const where = {};

    // ==========================================================
    // INCLUDE USUARIO
    // ==========================================================

    const includeUser = {
      model: User,
      as: "user",
      required: true,

      attributes: [
        "id",
        "nombres",
        "apellidos",
        "documento",
        "tipoDocumento",
        "email",
        "celular",
        "ficha",
        "centroFormacionId",
        "fechaVinculacion",
        "fechaFinalizacion",
        "foto",
        "rol",
        "estado",
      ],

      include: [
        {
          model: CentroFormacion,
          as: "centroFormacion",
          required: false,

          attributes: [
            "id",
            "nombre",
            "ciudad",
            "direccion",
            "estado",
          ],
        },

        {
          model: Vehiculo,
          as: "vehiculos",
          required: false,
        },
      ],
    };

    // ==========================================================
    // BÚSQUEDA
    // ==========================================================

    if (search) {
      where[Op.or] = [
        {
          "$user.documento$": {
            [Op.like]:
              `%${search}%`,
          },
        },

        {
          "$user.nombres$": {
            [Op.like]:
              `%${search}%`,
          },
        },

        {
          "$user.apellidos$": {
            [Op.like]:
              `%${search}%`,
          },
        },

        {
          "$user.email$": {
            [Op.like]:
              `%${search}%`,
          },
        },

        {
          "$user.ficha$": {
            [Op.like]:
              `%${search}%`,
          },
        },
      ];
    }

    // ==========================================================
    // CONSULTA
    // ==========================================================

    const resultado =
      await SolicitudActualizacion.findAndCountAll(
        {
          where,

          include: [
            includeUser,
          ],

          order: [
            ["createdAt", "DESC"],
          ],

          limit,
          offset,

          distinct: true,
        }
      );

    const solicitudes =
      resultado.rows.map(
        (solicitud) => {
          const item =
            solicitud.toJSON();

          item.datosActuales =
            convertirObjeto(
              item.datosActuales
            );

          item.datosNuevos =
            convertirObjeto(
              item.datosNuevos
            );

          item.documentos =
            Array.isArray(
              item.documentos
            )
              ? item.documentos
              : convertirObjeto(
                  item.documentos
                );

          return item;
        }
      );

    const total = Number(
      resultado.count || 0
    );

    const totalPages =
      Math.ceil(
        total / limit
      );

    return res.status(200).json({
      data: solicitudes,

      pagination: {
        page,
        limit,
        total,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "ERROR LISTAR SOLICITUDES:",
      error
    );

    return res.status(500).json({
      message:
        "Error al listar las solicitudes",

      error:
        error.message,
    });
  }
};

// ============================================================
// APROBAR SOLICITUD
// ============================================================

const aprobarSolicitud = async (
  req,
  res
) => {
  let transaction;

  try {
    const solicitudId =
      Number(req.params.id);

    if (
      !Number.isInteger(
        solicitudId
      ) ||
      solicitudId <= 0
    ) {
      return res.status(400).json({
        message:
          "El ID de la solicitud no es válido",
      });
    }

    transaction =
      await sequelize.transaction();

    const solicitud =
      await SolicitudActualizacion.findByPk(
        solicitudId,
        {
          transaction,

          lock:
            transaction.LOCK.UPDATE,
        }
      );

    if (!solicitud) {
      await transaction.rollback();

      return res.status(404).json({
        message:
          "Solicitud no encontrada",
      });
    }

    if (
      solicitud.estado !==
      "pendiente"
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message:
          `La solicitud ya fue ${solicitud.estado}`,
      });
    }

    const usuario =
      await User.findByPk(
        solicitud.userId,
        {
          transaction,
        }
      );

    if (!usuario) {
      await transaction.rollback();

      return res.status(404).json({
        message:
          "El usuario asociado a la solicitud no existe",
      });
    }

    let datos =
      convertirObjeto(
        solicitud.datosNuevos
      );

    let usuarioActualizado =
      null;

    let vehiculoActualizado =
      null;

    // ==========================================================
    // DATOS PERSONALES
    // ==========================================================

    if (
      solicitud.tipo ===
      "datos_personales"
    ) {
      const datosUsuario = {};

      const camposPermitidos = [
        "nombres",
        "apellidos",
        "documento",
        "tipoDocumento",
        "celular",
        "ficha",
        "centroFormacionId",
        "fechaVinculacion",
        "fechaFinalizacion",
      ];

      camposPermitidos.forEach(
        (campo) => {
          if (
            datos[campo] !==
              undefined &&
            datos[campo] !== null &&
            datos[campo] !== ""
          ) {
            datosUsuario[campo] =
              datos[campo];
          }
        }
      );

      if (
        solicitud.fotoNueva
      ) {
        datosUsuario.foto =
          normalizarRuta(
            solicitud.fotoNueva
          );
      }

      if (
        Object.keys(
          datosUsuario
        ).length === 0
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message:
            "No existen datos válidos para actualizar",
        });
      }

      const [
        filasActualizadas,
      ] = await User.update(
        datosUsuario,
        {
          where: {
            id: solicitud.userId,
          },

          transaction,
        }
      );

      if (
        filasActualizadas !== 1
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message:
            "La base de datos no actualizó el usuario",
        });
      }

      usuarioActualizado =
        await User.findByPk(
          solicitud.userId,
          {
            transaction,
          }
        );
    }

    // ==========================================================
    // DATOS VEHÍCULO
    // ==========================================================

    if (
      solicitud.tipo ===
      "datos_vehiculo"
    ) {
      const whereVehiculo = {
        userId:
          solicitud.userId,
      };

      if (
        datos.vehiculoId !==
          undefined &&
        datos.vehiculoId !== null &&
        datos.vehiculoId !== ""
      ) {
        const vehiculoId =
          Number(
            datos.vehiculoId
          );

        if (
          !Number.isInteger(
            vehiculoId
          ) ||
          vehiculoId <= 0
        ) {
          await transaction.rollback();

          return res.status(400).json({
            message:
              "El ID del vehículo no es válido",
          });
        }

        whereVehiculo.id =
          vehiculoId;
      }

      const vehiculo =
        await Vehiculo.findOne({
          where:
            whereVehiculo,

          transaction,
        });

      if (!vehiculo) {
        await transaction.rollback();

        return res.status(404).json({
          message:
            "El usuario no tiene un vehículo registrado",
        });
      }

      const tipoVehiculo =
        datos.tipoVehiculo ||
        vehiculo.tipo ||
        vehiculo.tipoVehiculo;

      if (
        tipoVehiculo !==
          "bicicleta" &&
        tipoVehiculo !==
          "moto"
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message:
            "El tipo de vehículo no es válido",
        });
      }

      const datosVehiculo = {
        tipo:
          tipoVehiculo,

        marca:
          datos.marca ??
          vehiculo.marca ??
          null,

        color:
          datos.color ??
          vehiculo.color ??
          null,

        cilindraje:
          tipoVehiculo === "moto"
            ? datos.cilindraje ??
              vehiculo.cilindraje ??
              null
            : null,

        modelo:
          tipoVehiculo === "moto"
            ? datos.modelo ??
              vehiculo.modelo ??
              null
            : null,
      };

      if (
        tipoVehiculo ===
        "bicicleta"
      ) {
        datosVehiculo.serial =
          datos.serialPlaca ??
          vehiculo.serial ??
          null;

        datosVehiculo.placa =
          null;
      }

      if (
        tipoVehiculo ===
        "moto"
      ) {
        datosVehiculo.placa =
          datos.serialPlaca ??
          vehiculo.placa ??
          null;

        datosVehiculo.serial =
          null;
      }

      if (
        solicitud.fotoNueva
      ) {
        datosVehiculo.foto_principal =
          normalizarRuta(
            solicitud.fotoNueva
          );

        datosVehiculo.foto_secundaria =
          normalizarRuta(
            solicitud.fotoNueva
          );
      }

      const [
        filasActualizadas,
      ] = await Vehiculo.update(
        datosVehiculo,
        {
          where: {
            id: vehiculo.id,
          },

          transaction,
        }
      );

      if (
        filasActualizadas !== 1
      ) {
        await transaction.rollback();

        return res.status(400).json({
          message:
            "La base de datos no actualizó el vehículo",
        });
      }

      vehiculoActualizado =
        await Vehiculo.findByPk(
          vehiculo.id,
          {
            transaction,
          }
        );
    }

    // ==========================================================
    // ACTUALIZAR ESTADO
    // ==========================================================

    const [
      solicitudActualizada,
    ] =
      await SolicitudActualizacion.update(
        {
          estado:
            "aprobada",
        },

        {
          where: {
            id: solicitudId,
          },

          transaction,
        }
      );

    if (
      solicitudActualizada !== 1
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message:
          "No se pudo actualizar el estado de la solicitud",
      });
    }

    // ==========================================================
    // COMMIT
    // ==========================================================

    await transaction.commit();

    // ==========================================================
    // REGENERAR CARNET
    // ==========================================================

    let resultadoCarnet = {
      carnet: null,
      qrImage: null,
    };

    try {
      resultadoCarnet =
        await generarOCrearCarnet(
          solicitud.userId,
          solicitud.id
        );
    } catch (errorCarnet) {
      console.error(
        "ERROR REGENERANDO CARNET:",
        errorCarnet
      );
    }

    // ==========================================================
    // NOTIFICACIÓN
    // ==========================================================

    await Notificacion.create({
      userId:
        solicitud.userId,

      mensaje:
        "Datos actualizados y carnet regenerado correctamente.",
    });

    return res.status(200).json({
      message:
        "Solicitud aprobada y datos actualizados correctamente",

      usuarioActualizado,

      vehiculoActualizado,

      carnet:
        resultadoCarnet.carnet,

      qrImage:
        resultadoCarnet.qrImage,
    });
  } catch (error) {
    console.error(
      "ERROR APROBANDO SOLICITUD:",
      error
    );

    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error(
          "ERROR EN ROLLBACK:",
          rollbackError
        );
      }
    }

    return res.status(500).json({
      message:
        "Error al aprobar la solicitud",

      error:
        error.message,
    });
  }
};

// ============================================================
// RECHAZAR SOLICITUD
// ============================================================

const rechazarSolicitud = async (
  req,
  res
) => {
  try {
    const solicitudId =
      Number(req.params.id);

    if (
      !Number.isInteger(
        solicitudId
      ) ||
      solicitudId <= 0
    ) {
      return res.status(400).json({
        message:
          "El ID de la solicitud no es válido",
      });
    }

    const solicitud =
      await SolicitudActualizacion.findByPk(
        solicitudId
      );

    if (!solicitud) {
      return res.status(404).json({
        message:
          "Solicitud no encontrada",
      });
    }

    if (
      solicitud.estado !==
      "pendiente"
    ) {
      return res.status(400).json({
        message:
          `La solicitud ya fue ${solicitud.estado}`,
      });
    }

    await solicitud.update({
      estado:
        "rechazada",
    });

    await Notificacion.create({
      userId:
        solicitud.userId,

      mensaje:
        "Tu solicitud de actualización fue rechazada.",
    });

    return res.status(200).json({
      message:
        "Solicitud rechazada correctamente",
    });
  } catch (error) {
    console.error(
      "ERROR RECHAZAR SOLICITUD:",
      error
    );

    return res.status(500).json({
      message:
        "Error al rechazar la solicitud",

      error:
        error.message,
    });
  }
};

// ============================================================
// EXPORTAR
// ============================================================

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
};


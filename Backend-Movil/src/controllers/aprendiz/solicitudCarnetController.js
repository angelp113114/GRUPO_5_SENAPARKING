
const { Op } = require("sequelize");

const User = require("../../models/User");
const SolicitudCarnet = require("../../models/aprendiz/SolicitudCarnet");
const CentroFormacion = require("../../models/CentroFormacion");

// ============================================================
// CREAR SOLICITUD DE CARNET
// ============================================================

const crearSolicitud = async (req, res) => {
  try {
    const files = req.files || {};

    // ----------------------------------------------------------
    // VALIDAR USUARIO
    // ----------------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    // ----------------------------------------------------------
    // DATOS BÁSICOS
    // ----------------------------------------------------------

    const tipoVehiculo = String(
      req.body.tipoVehiculo || ""
    )
      .trim()
      .toLowerCase();

    if (!["bicicleta", "moto"].includes(tipoVehiculo)) {
      return res.status(400).json({
        message:
          "El tipo de vehículo debe ser bicicleta o moto",
      });
    }

    const marca = String(
      req.body.marca || ""
    ).trim();

    const color = String(
      req.body.color || ""
    ).trim();

    const serialPlaca = String(
      req.body.serialPlaca || ""
    ).trim();

    if (!marca) {
      return res.status(400).json({
        message: "La marca es obligatoria",
      });
    }

    if (!color) {
      return res.status(400).json({
        message: "El color es obligatorio",
      });
    }

    if (!serialPlaca) {
      return res.status(400).json({
        message:
          tipoVehiculo === "moto"
            ? "La placa es obligatoria"
            : "El serial es obligatorio",
      });
    }

    // ----------------------------------------------------------
    // FOTOS PRINCIPALES
    // ----------------------------------------------------------

    const fotoAprendiz =
      files.fotoAprendiz?.[0];

    const fotoVehiculo =
      files.fotoVehiculo?.[0];

    if (!fotoAprendiz) {
      return res.status(400).json({
        message:
          "La foto del aprendiz es obligatoria",
      });
    }

    if (!fotoVehiculo) {
      return res.status(400).json({
        message:
          "La foto del vehículo es obligatoria",
      });
    }

    // ----------------------------------------------------------
    // TIPOS DE DOCUMENTOS
    // ----------------------------------------------------------

    const tipos = Array.isArray(
      req.body.documentosTipos
    )
      ? req.body.documentosTipos
      : req.body.documentosTipos
        ? [req.body.documentosTipos]
        : [];

    const archivosDocumentos =
      files.documentosAnexos || [];

    // ----------------------------------------------------------
    // CREAR LISTA DE ANEXOS
    // ----------------------------------------------------------

    const anexos =
      archivosDocumentos.map(
        (file, index) => ({
          tipo: String(
            tipos[index] || "general"
          )
            .trim()
            .toLowerCase(),

          nombre: file.originalname,

          ruta: file.filename,

          mimeType: file.mimetype,

          tamaño: file.size,
        })
      );

    // ----------------------------------------------------------
    // DOCUMENTOS OBLIGATORIOS
    // ----------------------------------------------------------

    const required =
      tipoVehiculo === "moto"
        ? [
            "cedula",
            "tecno",
            "soat",
            "placa",
            "propiedad",
          ]
        : [
            "cedula",
            "serial",
            "propiedad",
          ];

    const presentes =
      anexos.map(
        (anexo) => anexo.tipo
      );

    const faltantes =
      required.filter(
        (tipo) =>
          !presentes.includes(tipo)
      );

    if (faltantes.length > 0) {
      return res.status(400).json({
        message:
          `Faltan anexos obligatorios: ${faltantes.join(", ")}`,
      });
    }

    // ----------------------------------------------------------
    // BUSCAR DOCUMENTOS POR TIPO
    // ----------------------------------------------------------

    const fotoCedula =
      anexos.find(
        (anexo) =>
          anexo.tipo === "cedula"
      );

    const tarjetaPropiedad =
      anexos.find(
        (anexo) =>
          anexo.tipo === "propiedad"
      );

    const fotoSoat =
      anexos.find(
        (anexo) =>
          anexo.tipo === "soat"
      );

    const fotoTecnomecanica =
      anexos.find(
        (anexo) =>
          anexo.tipo === "tecno"
      );

    // ----------------------------------------------------------
    // FOTO DE PLACA / SERIAL
    // ----------------------------------------------------------

    const fotoPlacaSerial =
      anexos.find(
        (anexo) =>
          anexo.tipo === "placa" ||
          anexo.tipo === "serial"
      );

    if (!fotoPlacaSerial) {
      return res.status(400).json({
        message:
          tipoVehiculo === "moto"
            ? "La foto de la placa es obligatoria"
            : "La foto del serial es obligatoria",
      });
    }

    // ----------------------------------------------------------
    // VALIDAR CÉDULA
    // ----------------------------------------------------------

    if (!fotoCedula) {
      return res.status(400).json({
        message:
          "La foto de la cédula es obligatoria",
      });
    }

    // ----------------------------------------------------------
    // VALIDAR PROPIEDAD
    // ----------------------------------------------------------

    if (!tarjetaPropiedad) {
      return res.status(400).json({
        message:
          "La tarjeta de propiedad es obligatoria",
      });
    }

    // ----------------------------------------------------------
    // VALIDACIONES PARA MOTO
    // ----------------------------------------------------------

    let cilindraje = null;
    let modelo = null;

    if (tipoVehiculo === "moto") {

      cilindraje = String(
        req.body.cilindraje || ""
      ).trim();

      modelo = String(
        req.body.modelo || ""
      ).trim();

      if (!cilindraje) {
        return res.status(400).json({
          message:
            "El cilindraje es obligatorio para las motos",
        });
      }

      if (!modelo) {
        return res.status(400).json({
          message:
            "El modelo es obligatorio para las motos",
        });
      }

      if (!fotoSoat) {
        return res.status(400).json({
          message:
            "El SOAT es obligatorio para las motos",
        });
      }

      if (!fotoTecnomecanica) {
        return res.status(400).json({
          message:
            "La tecnomecánica es obligatoria para las motos",
        });
      }
    }

    // ----------------------------------------------------------
    // CREAR SOLICITUD
    // ----------------------------------------------------------

    const solicitud =
      await SolicitudCarnet.create({
        userId: req.user.id,

        tipoVehiculo,

        marca,

        color,

        serialPlaca,

        fotoPlacaSerial:
          fotoPlacaSerial.ruta,

        cilindraje,

        modelo,

        fotoAprendiz:
          fotoAprendiz.filename,

        fotoVehiculo:
          fotoVehiculo.filename,

        fotoCedula:
          fotoCedula.ruta,

        tarjetaPropiedad:
          tarjetaPropiedad.ruta,

        soat:
          tipoVehiculo === "moto"
            ? fotoSoat.ruta
            : null,

        tecnomecanica:
          tipoVehiculo === "moto"
            ? fotoTecnomecanica.ruta
            : null,

        documentosAnexos:
          anexos.length > 0
            ? JSON.stringify(anexos)
            : null,

        estado: "pendiente",
      });

    return res.status(201).json({
      message:
        "Solicitud de carnet creada correctamente",

      solicitud,
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
          error.errors.map(
            (e) => ({
              campo: e.path,
              mensaje: e.message,
            })
          ),
      });
    }

    if (
      error.name ===
      "SequelizeDatabaseError"
    ) {

      return res.status(400).json({
        message:
          "Error al guardar la solicitud en la base de datos",

        error: error.message,
      });
    }

    return res.status(500).json({
      message:
        "Error al crear solicitud",

      error: error.message,
    });
  }
};

// ============================================================
// LISTAR SOLICITUDES
//
// Soporta:
// ?page=1
// ?limit=10
// ?search=123456789
//
// search busca por:
// - Documento del aprendiz
// - Placa
// - Serial
// ============================================================

const listarSolicitudes = async (
  req,
  res
) => {

  try {

    // ----------------------------------------------------------
    // PAGINACIÓN
    // ----------------------------------------------------------

    let page =
      parseInt(
        req.query.page,
        10
      );

    let limit =
      parseInt(
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
      limit > 100
    ) {
      limit = 10;
    }

    const offset =
      (page - 1) * limit;

    // ----------------------------------------------------------
    // BÚSQUEDA
    // ----------------------------------------------------------

    const search =
      String(
        req.query.search || ""
      ).trim();

    // ----------------------------------------------------------
    // WHERE DE SOLICITUD
    // ----------------------------------------------------------

    const whereSolicitud = {};

    // ----------------------------------------------------------
    // WHERE DEL USUARIO
    // ----------------------------------------------------------

    const whereUser = {};

    if (search) {

      whereUser.documento = {
        [Op.like]: `%${search}%`,
      };

      whereSolicitud.serialPlaca = {
        [Op.like]: `%${search}%`,
      };
    }

    // ----------------------------------------------------------
    // SI HAY BÚSQUEDA
    //
    // Necesitamos buscar:
    //
    // documento
    // O
    // placa/serial
    //
    // Por eso usamos Op.or.
    // ----------------------------------------------------------

    const includeUser = {
      model: User,
      as: "user",

      attributes: [
        "id",
        "documento",
        "tipoDocumento",
        "nombres",
        "apellidos",
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

          attributes: [
            "id",
            "nombre",
            "ciudad",
            "direccion",
            "estado",
          ],
        },
      ],
    };

    // ----------------------------------------------------------
    // CONSULTA SIN BÚSQUEDA
    // ----------------------------------------------------------

    if (!search) {

      const resultado =
        await SolicitudCarnet.findAndCountAll({
          include: [
            includeUser,
          ],

          order: [
            ["createdAt", "DESC"],
          ],

          limit,

          offset,

          distinct: true,
        });

      return res.json({
        data: resultado.rows,

        pagination: {
          page,
          limit,

          total:
            resultado.count,

          totalPages:
            Math.max(
              1,
              Math.ceil(
                resultado.count /
                  limit
              )
            ),
        },
      });
    }

    // ----------------------------------------------------------
    // CONSULTA CON BÚSQUEDA
    //
    // Buscar por:
    //
    // documento
    // O
    // serialPlaca
    // ----------------------------------------------------------

    const resultado =
      await SolicitudCarnet.findAndCountAll({

        where: {
          [Op.or]: [
            {
              serialPlaca: {
                [Op.like]:
                  `%${search}%`,
              },
            },
          ],
        },

        include: [
          {
            ...includeUser,

            required: false,

            where: {
              documento: {
                [Op.like]:
                  `%${search}%`,
              },
            },
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],

        limit,

        offset,

        distinct: true,
      });

    // ----------------------------------------------------------
    // SEGUNDA CONSULTA
    //
    // Si encontramos solicitudes por documento,
    // también debemos incluirlas.
    // ----------------------------------------------------------

    const resultadoDocumento =
      await SolicitudCarnet.findAndCountAll({

        include: [
          {
            ...includeUser,

            required: true,

            where: {
              documento: {
                [Op.like]:
                  `%${search}%`,
              },
            },
          },
        ],

        order: [
          ["createdAt", "DESC"],
        ],

        limit: 1000,

        distinct: true,
      });

    // ----------------------------------------------------------
    // COMBINAR RESULTADOS
    // ----------------------------------------------------------

    const mapa =
      new Map();

    resultado.rows.forEach(
      (item) => {
        mapa.set(
          item.id,
          item
        );
      }
    );

    resultadoDocumento.rows.forEach(
      (item) => {
        mapa.set(
          item.id,
          item
        );
      }
    );

    const todos =
      Array.from(
        mapa.values()
      ).sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );

    const total =
      todos.length;

    const inicio =
      (page - 1) * limit;

    const fin =
      inicio + limit;

    const pagina =
      todos.slice(
        inicio,
        fin
      );

    return res.json({
      data: pagina,

      pagination: {
        page,

        limit,

        total,

        totalPages:
          Math.max(
            1,
            Math.ceil(
              total / limit
            )
          ),
      },
    });

  } catch (error) {

    console.error(
      "ERROR LISTAR SOLICITUDES:",
      error
    );

    return res.status(500).json({
      message:
        "Error al listar solicitudes",

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

  try {

    const id =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      return res.status(400).json({
        message:
          "El ID de la solicitud no es válido",
      });
    }

    const solicitud =
      await SolicitudCarnet.findByPk(
        id
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
          "Solo se pueden aprobar solicitudes pendientes",
      });
    }

    solicitud.estado =
      "aprobada";

    await solicitud.save();

    return res.json({
      message:
        "Solicitud aprobada correctamente",

      solicitud,
    });

  } catch (error) {

    console.error(
      "ERROR APROBAR SOLICITUD:",
      error
    );

    return res.status(500).json({
      message:
        "Error al aprobar solicitud",

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

    const id =
      Number(
        req.params.id
      );

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {

      return res.status(400).json({
        message:
          "El ID de la solicitud no es válido",
      });
    }

    const solicitud =
      await SolicitudCarnet.findByPk(
        id
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
          "Solo se pueden rechazar solicitudes pendientes",
      });
    }

    solicitud.estado =
      "rechazada";

    await solicitud.save();

    return res.json({
      message:
        "Solicitud rechazada correctamente",

      solicitud,
    });

  } catch (error) {

    console.error(
      "ERROR RECHAZAR SOLICITUD:",
      error
    );

    return res.status(500).json({
      message:
        "Error al rechazar solicitud",

      error:
        error.message,
    });
  }
};

// ============================================================
// EXPORTACIONES
// ============================================================

module.exports = {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
};


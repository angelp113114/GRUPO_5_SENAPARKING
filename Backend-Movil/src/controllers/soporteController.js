const { Op } = require("sequelize");

const Soporte = require("../models/Soporte");
const User = require("../models/User");
const Notificacion = require("../models/Notificacion");

// ======================================================
// CREAR SOPORTE
// ======================================================

exports.crearSoporte = async (req, res) => {
  try {
    const { asunto, descripcion } = req.body;

    // ------------------------------------------
    // VALIDAR USUARIO
    // ------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    // ------------------------------------------
    // VALIDAR ASUNTO
    // ------------------------------------------

    if (
      typeof asunto !== "string" ||
      !asunto.trim()
    ) {
      return res.status(400).json({
        message: "El asunto es obligatorio"
      });
    }

    // ------------------------------------------
    // VALIDAR DESCRIPCIÓN
    // ------------------------------------------

    if (
      typeof descripcion !== "string" ||
      !descripcion.trim()
    ) {
      return res.status(400).json({
        message: "La descripción es obligatoria"
      });
    }

    // ------------------------------------------
    // CREAR SOPORTE
    // ------------------------------------------

    const soporte = await Soporte.create({
      asunto: asunto.trim().slice(0, 200),
      descripcion: descripcion.trim().slice(0, 2000),

      // IMPORTANTE:
      // Todo soporte nuevo empieza como Pendiente
      estado: "Pendiente",

      userId: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Solicitud de soporte creada correctamente",
      data: soporte
    });

  } catch (error) {

    console.error(
      "ERROR CREANDO SOPORTE:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error creando el soporte"
    });
  }
};


// ======================================================
// OBTENER MIS SOPORTES - APRENDIZ
// TRAE PENDIENTES + RESUELTOS
// ======================================================

exports.obtenerMisSoportes = async (req, res) => {
  try {

    // ------------------------------------------
    // VALIDAR USUARIO
    // ------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Usuario no autenticado"
      });
    }

    // ------------------------------------------
    // BUSCAR TODOS LOS SOPORTES DEL USUARIO
    // ------------------------------------------

    const soportes = await Soporte.findAll({
      where: {
        userId: req.user.id
      },

      attributes: [
        "id",
        "asunto",
        "descripcion",
        "estado",
        "respuesta",
        "userId",
        "createdAt",
        "updatedAt"
      ],

      order: [
        ["createdAt", "DESC"]
      ]
    });

    // ------------------------------------------
    // RESPUESTA
    // ------------------------------------------

    return res.json({
      success: true,
      data: soportes
    });

  } catch (error) {

    console.error(
      "ERROR OBTENIENDO MIS SOPORTES:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error obteniendo los soportes"
    });
  }
};


// ======================================================
// OBTENER TODOS LOS SOPORTES - ADMIN
// PAGINACIÓN + BÚSQUEDA POR ASUNTO
// ======================================================

exports.obtenerTodos = async (req, res) => {
  try {

    // ------------------------------------------
    // PAGINACIÓN
    // ------------------------------------------

    const pageRaw = Number.parseInt(
      req.query.page,
      10
    );

    const limitRaw = Number.parseInt(
      req.query.limit,
      10
    );

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0
        ? pageRaw
        : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, 50)
        : 10;

    // ------------------------------------------
    // BÚSQUEDA
    // ------------------------------------------

    const searchParam =
      req.query.search !== undefined
        ? req.query.search
        : "";

    if (typeof searchParam !== "string") {
      return res.status(400).json({
        message: "El término de búsqueda no es válido"
      });
    }

    const search = searchParam
      .trim()
      .slice(0, 100);

    // ------------------------------------------
    // WHERE
    // ------------------------------------------

    const where = {};

    if (search) {
      where.asunto = {
        [Op.like]: `%${search}%`
      };
    }

    // ------------------------------------------
    // OFFSET
    // ------------------------------------------

    const offset = (page - 1) * limit;

    // ------------------------------------------
    // CONSULTAR
    // ------------------------------------------

    const {
      count,
      rows
    } = await Soporte.findAndCountAll({

      where,

      include: [
        {
          model: User,
          as: "user",

          attributes: [
            "id",
            "nombres",
            "apellidos",
            "email"
          ]
        }
      ],

      order: [
        ["createdAt", "DESC"]
      ],

      limit,
      offset,

      distinct: true
    });

    // ------------------------------------------
    // RESPUESTA
    // ------------------------------------------

    return res.json({

      success: true,

      total: count,

      page,

      limit,

      totalPages:
        Math.ceil(count / limit),

      data: rows
    });

  } catch (error) {

    console.error(
      "ERROR OBTENIENDO TODOS LOS SOPORTES:",
      error
    );

    return res.status(500).json({

      success: false,

      message: "Error obteniendo los soportes",

      error: error.message
    });
  }
};


// ======================================================
// OBTENER REPORTES RECIBIDOS / RESUELTOS
// ADMIN
// ======================================================

exports.obtenerReportesRecibidos = async (req, res) => {
  try {

    // ------------------------------------------
    // PAGINACIÓN
    // ------------------------------------------

    const pageRaw = Number.parseInt(
      req.query.page,
      10
    );

    const limitRaw = Number.parseInt(
      req.query.limit,
      10
    );

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0
        ? pageRaw
        : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, 50)
        : 10;

    // ------------------------------------------
    // BÚSQUEDA
    // ------------------------------------------

    const searchParam =
      req.query.search !== undefined
        ? req.query.search
        : "";

    if (typeof searchParam !== "string") {
      return res.status(400).json({
        message: "El término de búsqueda no es válido"
      });
    }

    const search = searchParam
      .trim()
      .slice(0, 100);

    // ------------------------------------------
    // WHERE
    // ------------------------------------------

    const where = {
      estado: "Resuelto"
    };

    if (search) {
      where.asunto = {
        [Op.like]: `%${search}%`
      };
    }

    // ------------------------------------------
    // OFFSET
    // ------------------------------------------

    const offset = (page - 1) * limit;

    // ------------------------------------------
    // CONSULTAR
    // ------------------------------------------

    const {
      count,
      rows
    } = await Soporte.findAndCountAll({

      where,

      include: [
        {
          model: User,
          as: "user",

          attributes: [
            "id",
            "nombres",
            "apellidos",
            "email"
          ]
        }
      ],

      order: [
        ["updatedAt", "DESC"]
      ],

      limit,
      offset,

      distinct: true
    });

    // ------------------------------------------
    // RESPUESTA
    // ------------------------------------------

    return res.json({

      success: true,

      total: count,

      page,

      limit,

      totalPages:
        Math.ceil(count / limit),

      data: rows
    });

  } catch (error) {

    console.error(
      "ERROR OBTENIENDO REPORTES RECIBIDOS:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Error obteniendo los reportes recibidos",

      error: error.message
    });
  }
};


// ======================================================
// RESPONDER SOPORTE
// ADMIN
// CAMBIA ESTADO A "Resuelto"
// ======================================================

exports.responderSoporte = async (req, res) => {
  try {

    // ------------------------------------------
    // VALIDAR ID
    // ------------------------------------------

    const id = Number.parseInt(
      req.params.id,
      10
    );

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "El ID del soporte no es válido"
      });
    }

    // ------------------------------------------
    // BUSCAR SOPORTE
    // ------------------------------------------

    const soporte = await Soporte.findByPk(id);

    if (!soporte) {
      return res.status(404).json({
        message: "Soporte no encontrado"
      });
    }

    // ------------------------------------------
    // VALIDAR RESPUESTA
    // ------------------------------------------

    const respuesta =
      typeof req.body.respuesta === "string"
        ? req.body.respuesta.trim()
        : "";

    if (!respuesta) {
      return res.status(400).json({
        message: "La respuesta es obligatoria"
      });
    }

    // ------------------------------------------
    // EVITAR RESPONDER SOPORTE YA RESUELTO
    // ------------------------------------------

    if (
      String(soporte.estado || "")
        .trim()
        .toLowerCase() === "resuelto"
    ) {
      return res.status(400).json({
        message: "Este soporte ya fue resuelto"
      });
    }

    // ------------------------------------------
    // ACTUALIZAR SOPORTE
    // ------------------------------------------

    soporte.respuesta =
      respuesta.slice(0, 3000);

    soporte.estado = "Resuelto";

    await soporte.save();

    // ------------------------------------------
    // CREAR NOTIFICACIÓN
    // ------------------------------------------

    try {

      await Notificacion.create({

        userId: soporte.userId,

        titulo:
          "Respuesta de soporte técnico",

        mensaje:
          `Tu solicitud "${soporte.asunto}" fue respondida: ${respuesta}`

      });

    } catch (notificationError) {

      console.error(
        "ERROR CREANDO NOTIFICACIÓN:",
        notificationError
      );

      // No hacemos fallar la respuesta del soporte
      // si solamente falla la notificación.
    }

    // ------------------------------------------
    // RESPUESTA
    // ------------------------------------------

    return res.json({

      success: true,

      message:
        "Soporte respondido y marcado como Resuelto",

      data: soporte
    });

  } catch (error) {

    console.error(
      "ERROR RESPONDIENDO SOPORTE:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Error respondiendo el soporte"
    });
  }
};
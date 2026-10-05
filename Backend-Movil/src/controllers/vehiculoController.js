const { Op } = require("sequelize");

const Vehiculo = require("../models/Vehiculo");
const { User, CentroFormacion } = require("../models");

// =====================================================
// CREAR VEHÍCULO
// =====================================================
const createVehiculo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const {
      tipo,
      id_centro_de_formacion,
      marca,
      color,
      serial,
      placa,
      cilindraje,
      modelo,
      foto_principal,
      foto_secundaria,
    } = req.body;

    if (!tipo) {
      return res.status(400).json({
        message: "Tipo obligatorio",
      });
    }

    if (!id_centro_de_formacion) {
      return res.status(400).json({
        message: "Centro de formación obligatorio",
      });
    }

    if (!marca) {
      return res.status(400).json({
        message: "Marca obligatoria",
      });
    }

    const nuevo = await Vehiculo.create({
      tipo,
      id_centro_de_formacion,
      marca,
      color,
      serial,
      placa,
      cilindraje,
      modelo,
      foto_principal,
      foto_secundaria,

      // =================================================
      // EL PROPIETARIO SIEMPRE ES EL USUARIO LOGUEADO
      // =================================================
      userId: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Vehículo creado correctamente",
      data: nuevo,
    });
  } catch (error) {
    console.error("ERROR CREANDO VEHÍCULO:", error);

    return res.status(500).json({
      success: false,
      message: "Error creando vehículo",
      error: error.message,
    });
  }
};

// =====================================================
// OBTENER VEHÍCULOS
//
// ADMINISTRADOR → TODOS
// GUARDA        → TODOS
// APRENDIZ      → SOLAMENTE LOS SUYOS
//
// PAGINACIÓN + BÚSQUEDA POR SERIAL O PLACA
// =====================================================
const getVehiculos = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    // =================================================
    // PAGINACIÓN
    // =================================================
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }

    // Máximo 50 registros por página
    if (limit > 50) {
      limit = 50;
    }

    const offset = (page - 1) * limit;

    // =================================================
    // BÚSQUEDA
    // =================================================
    let search = "";

    if (typeof req.query.search === "string") {
      search = req.query.search.trim();
    }

    // Evitar búsquedas demasiado largas
    if (search.length > 100) {
      search = search.substring(0, 100);
    }

    // =================================================
    // FILTRO PRINCIPAL
    // =================================================
    const where = {};

    // =================================================
    // APRENDIZ
    //
    // MUY IMPORTANTE:
    // El ID sale del JWT mediante req.user.id.
    //
    // No usamos un userId enviado desde React Native.
    // =================================================
    if (req.user.rol === "aprendiz") {
      where.userId = req.user.id;
    }

    // =================================================
    // BÚSQUEDA POR SERIAL O PLACA
    // =================================================
    if (search) {
      where[Op.or] = [
        {
          serial: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          placa: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    // =================================================
    // CONSULTA
    // =================================================
    const { count, rows } = await Vehiculo.findAndCountAll({
      where,

      include: [
        {
          model: User,
          as: "User",

          attributes: [
            "id",
            "nombres",
            "apellidos",
            "ficha",
            "documento",
            "tipoDocumento",
            "email",
            "celular",
            "centroFormacionId",
            "fechaVinculacion",
            "fechaFinalizacion",
            "foto",
          ],

          include: [
            {
              model: CentroFormacion,
              as: "centroFormacion",

              attributes: [
                "id",
                "nombre",
              ],
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],

      limit,
      offset,

      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      total: count,
      page,
      limit,
      totalPages,
      data: rows,
    });
  } catch (error) {
    console.error("ERROR OBTENIENDO VEHÍCULOS:", error);

    return res.status(500).json({
      success: false,
      message: "Error obteniendo vehículos",
      error: error.message,
    });
  }
};

// =====================================================
// OBTENER MIS VEHÍCULOS
//
// ESTA FUNCIÓN TAMBIÉN QUEDA DISPONIBLE.
//
// SOLAMENTE VEHÍCULOS DEL USUARIO AUTENTICADO.
// =====================================================
const getMisVehiculos = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    // El ID sale directamente del JWT
    const userId = req.user.id;

    // =================================================
    // PAGINACIÓN
    // =================================================
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }

    if (limit > 50) {
      limit = 50;
    }

    const offset = (page - 1) * limit;

    // =================================================
    // BÚSQUEDA
    // =================================================
    let search = "";

    if (typeof req.query.search === "string") {
      search = req.query.search.trim();
    }

    if (search.length > 100) {
      search = search.substring(0, 100);
    }

    // =================================================
    // FILTRO
    // =================================================
    const where = {
      userId: userId,
    };

    if (search) {
      where[Op.or] = [
        {
          serial: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          placa: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    // =================================================
    // CONSULTA
    // =================================================
    const { count, rows } = await Vehiculo.findAndCountAll({
      where,

      include: [
        {
          model: User,
          as: "User",

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
            "foto",
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
              ],
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],

      limit,
      offset,

      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      total: count,
      page,
      limit,
      totalPages,
      data: rows,
    });
  } catch (error) {
    console.error("ERROR OBTENIENDO MIS VEHÍCULOS:", error);

    return res.status(500).json({
      success: false,
      message: "Error obteniendo mis vehículos",
      error: error.message,
    });
  }
};

// =====================================================
// OBTENER VEHÍCULO POR ID
//
// ADMINISTRADOR → CUALQUIERA
// GUARDA        → CUALQUIERA
// APRENDIZ      → SOLAMENTE UNO PROPIO
// =====================================================
const getVehiculoById = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const vehiculo = await Vehiculo.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "User",

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
            "foto",
          ],
        },
      ],
    });

    if (!vehiculo) {
      return res.status(404).json({
        message: "Vehículo no encontrado",
      });
    }

    // =================================================
    // ADMINISTRADOR Y GUARDA
    //
    // Pueden consultar cualquier vehículo.
    // =================================================
    if (
      ["administrador", "guarda"].includes(req.user.rol)
    ) {
      return res.status(200).json({
        success: true,
        data: vehiculo,
      });
    }

    // =================================================
    // APRENDIZ
    //
    // Solamente puede consultar su propio vehículo.
    // =================================================
    if (
      req.user.rol === "aprendiz" &&
      Number(vehiculo.userId) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        message: "No tienes permiso para consultar este vehículo",
      });
    }

    // Si el rol no está autorizado
    if (req.user.rol !== "aprendiz") {
      return res.status(403).json({
        message: "No tienes permiso para consultar este vehículo",
      });
    }

    return res.status(200).json({
      success: true,
      data: vehiculo,
    });
  } catch (error) {
    console.error("ERROR OBTENIENDO VEHÍCULO:", error);

    return res.status(500).json({
      success: false,
      message: "Error obteniendo vehículo",
      error: error.message,
    });
  }
};

// =====================================================
// ACTUALIZAR VEHÍCULO
//
// ADMINISTRADOR → CUALQUIERA
// APRENDIZ      → SOLAMENTE EL SUYO
// GUARDA        → NO PUEDE MODIFICAR
// =====================================================
const updateVehiculo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const vehiculo = await Vehiculo.findByPk(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        message: "Vehículo no encontrado",
      });
    }

    // =================================================
    // ADMINISTRADOR
    // Puede modificar cualquier vehículo.
    // =================================================
    if (req.user.rol === "administrador") {
      const datosActualizacion = {
        ...req.body,
      };

      // Nunca permitir cambiar propietario
      delete datosActualizacion.userId;

      await vehiculo.update(datosActualizacion);

      return res.status(200).json({
        success: true,
        message: "Vehículo actualizado correctamente",
        data: vehiculo,
      });
    }

    // =================================================
    // APRENDIZ
    // Solamente puede modificar su vehículo.
    // =================================================
    if (req.user.rol === "aprendiz") {
      if (
        Number(vehiculo.userId) !== Number(req.user.id)
      ) {
        return res.status(403).json({
          message: "No tienes permiso para modificar este vehículo",
        });
      }

      const datosActualizacion = {
        ...req.body,
      };

      // Nunca permitir cambiar propietario
      delete datosActualizacion.userId;

      await vehiculo.update(datosActualizacion);

      return res.status(200).json({
        success: true,
        message: "Vehículo actualizado correctamente",
        data: vehiculo,
      });
    }

    return res.status(403).json({
      message: "No tienes permiso para modificar este vehículo",
    });
  } catch (error) {
    console.error("ERROR ACTUALIZANDO VEHÍCULO:", error);

    return res.status(500).json({
      success: false,
      message: "Error actualizando vehículo",
      error: error.message,
    });
  }
};

// =====================================================
// ELIMINAR VEHÍCULO
//
// ADMINISTRADOR → CUALQUIERA
// APRENDIZ      → SOLAMENTE EL SUYO
// GUARDA        → NO PUEDE ELIMINAR
// =====================================================
const deleteVehiculo = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const vehiculo = await Vehiculo.findByPk(req.params.id);

    if (!vehiculo) {
      return res.status(404).json({
        message: "Vehículo no encontrado",
      });
    }

    // =================================================
    // ADMINISTRADOR
    // Puede eliminar cualquier vehículo.
    // =================================================
    if (req.user.rol === "administrador") {
      await vehiculo.destroy();

      return res.status(200).json({
        success: true,
        message: "Vehículo eliminado correctamente",
      });
    }

    // =================================================
    // APRENDIZ
    // Solamente puede eliminar su propio vehículo.
    // =================================================
    if (req.user.rol === "aprendiz") {
      if (
        Number(vehiculo.userId) !== Number(req.user.id)
      ) {
        return res.status(403).json({
          message: "No tienes permiso para eliminar este vehículo",
        });
      }

      await vehiculo.destroy();

      return res.status(200).json({
        success: true,
        message: "Vehículo eliminado correctamente",
      });
    }

    return res.status(403).json({
      message: "No tienes permiso para eliminar este vehículo",
    });
  } catch (error) {
    console.error("ERROR ELIMINANDO VEHÍCULO:", error);

    return res.status(500).json({
      success: false,
      message: "Error eliminando vehículo",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTACIONES
// =====================================================
module.exports = {
  createVehiculo,
  getVehiculos,
  getVehiculoById,
  updateVehiculo,
  deleteVehiculo,
  getMisVehiculos,
};


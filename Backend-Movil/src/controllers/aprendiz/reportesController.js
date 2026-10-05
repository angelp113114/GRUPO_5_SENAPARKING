const { Reporte, User } = require("../../models");

// Crear soporte (Aprendiz)
exports.crearReporte = async (req, res) => {
  try {
    const { asunto, descripcion } = req.body;

    const reporte = await Reporte.create({
      asunto,
      descripcion,
      userId: req.user.id,
    });

    res.status(201).json(reporte);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Obtener mis soportes (Aprendiz)
exports.obtenerMisReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(reportes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Obtener todos los soportes (Administrador)
exports.obtenerReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "nombres",
            "apellidos",
            "email",
            "ficha",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(reportes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Responder soporte (Administrador)
exports.actualizarReporte = async (req, res) => {
  try {
    const { respuesta, estado } = req.body;

    const reporte = await Reporte.findByPk(req.params.id);

    if (!reporte) {
      return res.status(404).json({
        message: "Reporte no encontrado",
      });
    }

    reporte.respuesta = respuesta;
    reporte.estado = estado;

    await reporte.save();

    res.json(reporte);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
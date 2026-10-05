const User = require("../models/User");
const ReporteBloqueo = require("../models/ReporteBloqueo");
const Notificacion = require("../models/Notificacion");

const ejecutarAccion = async (req, res) => {
  try {
    const { userId, tipo, motivo } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await ReporteBloqueo.create({
      userId,
      tipo,
      motivo,
      creadoPor: req.user.id
    });

    // 🔴 REPORTE
    if (tipo === "reporte") {
      await Notificacion.create({
        userId,
        titulo: "Nuevo reporte",
        mensaje: motivo
      });
    }

    // 🔴 BLOQUEO
    if (tipo === "bloqueo") {
      user.estado = "bloqueado";
      await user.save();

      await Notificacion.create({
        userId,
        titulo: "Cuenta bloqueada",
        mensaje: "Su usuario ha sido bloqueado."
      });
    }

    // 🟢 DESBLOQUEO (NUEVO)
    if (tipo === "desbloqueo") {
      user.estado = "activo";
      await user.save();

      await Notificacion.create({
        userId,
        titulo: "Cuenta reactivada",
        mensaje: "Su usuario ha sido desbloqueado."
      });
    }

    return res.json({ message: "Acción registrada" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { ejecutarAccion };
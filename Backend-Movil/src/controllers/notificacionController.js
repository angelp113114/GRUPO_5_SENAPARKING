const Notificacion = require("../models/Notificacion");

const obtenerNotificaciones = async (req, res) => {
  try {

    const notificaciones =
      await Notificacion.findAll({
        where: {
          userId: req.user.id
        },
        order: [["createdAt", "DESC"]]
      });

    res.json(notificaciones);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};

const marcarLeidas = async (req, res) => {

  try {

    await Notificacion.update(
      {
        leido: true
      },
      {
        where: {
          userId: req.user.id,
          leido: false
        }
      }
    );

    res.json({
      message: "Notificaciones actualizadas"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  obtenerNotificaciones,
  marcarLeidas
};
const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  obtenerNotificaciones,
  marcarLeidas
} = require("../controllers/notificacionController");

router.get(
  "/notificaciones",
  verifyToken,
  obtenerNotificaciones
);

router.put(
  "/notificaciones/leidas",
  verifyToken,
  marcarLeidas
);

module.exports = router;
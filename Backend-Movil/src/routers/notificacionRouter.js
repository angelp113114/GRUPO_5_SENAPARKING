const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  obtenerNotificaciones,
  marcarLeidas,
} = require("../controllers/notificacionController");

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Gestión de notificaciones de los usuarios
 */

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Obtener mis notificaciones
 *     tags: [Notificaciones]
 *     description: Obtiene las notificaciones del usuario autenticado, ordenadas desde la más reciente hasta la más antigua.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario autenticado.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 5
 *                   titulo:
 *                     type: string
 *                     example: "Solicitud de carnet"
 *                   mensaje:
 *                     type: string
 *                     example: "Tu solicitud de carnet fue aprobada"
 *                   leido:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-09-18T15:30:00.000Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-09-18T15:30:00.000Z"
 *       401:
 *         description: Token no válido o usuario no autenticado.
 *       500:
 *         description: Error al obtener las notificaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al obtener las notificaciones"
 */
router.get(
  "/notificaciones",
  verifyToken,
  obtenerNotificaciones
);

/**
 * @swagger
 * /api/notificaciones/leidas:
 *   put:
 *     summary: Marcar notificaciones como leídas
 *     tags: [Notificaciones]
 *     description: Marca como leídas todas las notificaciones no leídas del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notificaciones actualizadas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notificaciones actualizadas"
 *       401:
 *         description: Token no válido o usuario no autenticado.
 *       500:
 *         description: Error al actualizar las notificaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error al actualizar las notificaciones"
 */
router.put(
  "/notificaciones/leidas",
  verifyToken,
  marcarLeidas
);

module.exports = router;
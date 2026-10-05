const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  ejecutarAccion,
} = require("../controllers/reportesController");

/**
 * @swagger
 * tags:
 *   name: Reportes y acciones de usuarios
 *   description: Gestión de reportes, bloqueos y desbloqueos de usuarios
 */

/**
 * @swagger
 * /api/usuarios/accion:
 *   post:
 *     summary: Ejecutar una acción sobre un usuario
 *     tags: [Reportes y acciones de usuarios]
 *     description: Registra un reporte, bloqueo o desbloqueo sobre un usuario y genera la notificación correspondiente.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - tipo
 *               - motivo
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario sobre el cual se ejecutará la acción.
 *                 example: 5
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - reporte
 *                   - bloqueo
 *                   - desbloqueo
 *                 description: Tipo de acción que se desea ejecutar.
 *                 example: bloqueo
 *               motivo:
 *                 type: string
 *                 description: Motivo del reporte, bloqueo o desbloqueo.
 *                 example: "Incumplimiento de las normas del parqueadero"
 *     responses:
 *       200:
 *         description: Acción registrada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acción registrada"
 *       404:
 *         description: El usuario indicado no existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.post(
  "/usuarios/accion",
  verifyToken,
  ejecutarAccion
);

module.exports = router;
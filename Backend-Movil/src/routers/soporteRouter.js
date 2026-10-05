const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/roles");

const {
  crearSoporte,
  obtenerMisSoportes,
  obtenerTodos,
  obtenerReportesRecibidos,
  responderSoporte
} = require("../controllers/soporteController");

/**
 * @swagger
 * tags:
 *   name: Soporte
 *   description: Gestión de solicitudes de soporte técnico
 */

/**
 * @swagger
 * /api/soportes:
 *   post:
 *     summary: Crear una solicitud de soporte
 *     tags: [Soporte]
 *     description: Permite a un aprendiz crear una solicitud de soporte técnico.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asunto
 *               - descripcion
 *             properties:
 *               asunto:
 *                 type: string
 *                 maxLength: 200
 *                 example: "Problema con el carnet digital"
 *               descripcion:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "No puedo visualizar correctamente mi carnet digital."
 *     responses:
 *       201:
 *         description: Solicitud de soporte creada correctamente.
 *       400:
 *         description: El asunto o la descripción son obligatorios.
 *       401:
 *         description: Usuario no autenticado.
 *       403:
 *         description: El usuario no tiene permisos para crear solicitudes de soporte.
 *       500:
 *         description: Error creando el soporte.
 */
router.post(
  "/soportes",
  verifyToken,
  authorizeRoles("aprendiz"),
  crearSoporte
);

/**
 * @swagger
 * /api/soportes/mios:
 *   get:
 *     summary: Obtener mis solicitudes de soporte
 *     tags: [Soporte]
 *     description: Permite a un aprendiz consultar todas sus solicitudes de soporte, tanto pendientes como resueltas.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes de soporte del usuario.
 *       401:
 *         description: Usuario no autenticado.
 *       403:
 *         description: El usuario no tiene permisos para consultar sus soportes.
 *       500:
 *         description: Error obteniendo los soportes.
 */
router.get(
  "/soportes/mios",
  verifyToken,
  authorizeRoles("aprendiz"),
  obtenerMisSoportes
);

/**
 * @swagger
 * /api/soportes:
 *   get:
 *     summary: Obtener todos los soportes
 *     tags: [Soporte]
 *     description: Permite al administrador consultar las solicitudes de soporte con paginación y búsqueda por asunto.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Cantidad de registros por página.
 *         example: 10
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Término de búsqueda por asunto.
 *         example: "carnet"
 *     responses:
 *       200:
 *         description: Lista de soportes obtenida correctamente.
 *       400:
 *         description: El término de búsqueda no es válido.
 *       401:
 *         description: Usuario no autenticado.
 *       403:
 *         description: Solo los administradores pueden consultar todos los soportes.
 *       500:
 *         description: Error obteniendo los soportes.
 */
router.get(
  "/soportes",
  verifyToken,
  authorizeRoles("administrador"),
  obtenerTodos
);

/**
 * @swagger
 * /api/soportes/reportes-recibidos:
 *   get:
 *     summary: Obtener reportes de soporte resueltos
 *     tags: [Soporte]
 *     description: Permite al administrador consultar los soportes que ya fueron respondidos y marcados como Resuelto.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Cantidad de registros por página.
 *         example: 10
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Término de búsqueda por asunto.
 *         example: "carnet"
 *     responses:
 *       200:
 *         description: Reportes recibidos obtenidos correctamente.
 *       400:
 *         description: El término de búsqueda no es válido.
 *       401:
 *         description: Usuario no autenticado.
 *       403:
 *         description: Solo los administradores pueden consultar los reportes.
 *       500:
 *         description: Error obteniendo los reportes recibidos.
 */
router.get(
  "/soportes/reportes-recibidos",
  verifyToken,
  authorizeRoles("administrador"),
  obtenerReportesRecibidos
);

/**
 * @swagger
 * /api/soportes/{id}:
 *   put:
 *     summary: Responder una solicitud de soporte
 *     tags: [Soporte]
 *     description: Permite al administrador responder una solicitud de soporte. Al responderla, su estado cambia automáticamente a Resuelto y se genera una notificación para el aprendiz.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la solicitud de soporte.
 *         example: 15
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuesta
 *             properties:
 *               respuesta:
 *                 type: string
 *                 maxLength: 3000
 *                 example: "Hemos revisado el inconveniente y realizamos la corrección correspondiente."
 *     responses:
 *       200:
 *         description: Soporte respondido y marcado como Resuelto.
 *       400:
 *         description: ID inválido, respuesta obligatoria o soporte ya resuelto.
 *       401:
 *         description: Usuario no autenticado.
 *       403:
 *         description: Solo los administradores pueden responder soportes.
 *       404:
 *         description: Soporte no encontrado.
 *       500:
 *         description: Error respondiendo el soporte.
 */
router.put(
  "/soportes/:id",
  verifyToken,
  authorizeRoles("administrador"),
  responderSoporte
);

module.exports = router;
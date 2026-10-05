const router = require("express").Router();

const controller = require("../../controllers/aprendiz/reportesController");

const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/roles");

/**
 * @swagger
 * tags:
 *   name: Reportes de Aprendiz
 *   description: Gestión de reportes realizados por aprendices
 */

/**
 * @swagger
 * /api/reportes:
 *   post:
 *     summary: Crear un reporte
 *     tags: [Reportes de Aprendiz]
 *     description: Permite a un aprendiz crear un nuevo reporte.
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
 *                 description: Asunto del reporte.
 *                 example: "Problema con el parqueadero"
 *               descripcion:
 *                 type: string
 *                 description: Descripción detallada del reporte.
 *                 example: "La puerta del parqueadero no permite el ingreso."
 *     responses:
 *       201:
 *         description: Reporte creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 asunto:
 *                   type: string
 *                   example: "Problema con el parqueadero"
 *                 descripcion:
 *                   type: string
 *                   example: "La puerta del parqueadero no permite el ingreso."
 *                 userId:
 *                   type: integer
 *                   example: 5
 *                 estado:
 *                   type: string
 *                   nullable: true
 *                   example: "Pendiente"
 *                 respuesta:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Token no válido o usuario no autenticado.
 *       403:
 *         description: El usuario no tiene permisos porque debe ser aprendiz.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/reportes",
  verifyToken,
  authorizeRoles("aprendiz"),
  controller.crearReporte
);

/**
 * @swagger
 * /api/reportes/mios:
 *   get:
 *     summary: Obtener mis reportes
 *     tags: [Reportes de Aprendiz]
 *     description: Permite a un aprendiz consultar los reportes que ha creado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes del aprendiz autenticado.
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
 *                   asunto:
 *                     type: string
 *                     example: "Problema con el parqueadero"
 *                   descripcion:
 *                     type: string
 *                     example: "La puerta del parqueadero no permite el ingreso."
 *                   userId:
 *                     type: integer
 *                     example: 5
 *                   estado:
 *                     type: string
 *                     nullable: true
 *                     example: "Pendiente"
 *                   respuesta:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Token no válido o usuario no autenticado.
 *       403:
 *         description: El usuario no tiene permisos porque debe ser aprendiz.
 *       500:
 *         description: Error obteniendo los reportes.
 */
router.get(
  "/reportes/mios",
  verifyToken,
  authorizeRoles("aprendiz"),
  controller.obtenerMisReportes
);

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener todos los reportes
 *     tags: [Reportes de Aprendiz]
 *     description: Permite a un administrador consultar todos los reportes registrados en el sistema.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los reportes.
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
 *                   asunto:
 *                     type: string
 *                     example: "Problema con el parqueadero"
 *                   descripcion:
 *                     type: string
 *                     example: "La puerta del parqueadero no permite el ingreso."
 *                   userId:
 *                     type: integer
 *                     example: 5
 *                   estado:
 *                     type: string
 *                     nullable: true
 *                     example: "Pendiente"
 *                   respuesta:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 5
 *                       nombres:
 *                         type: string
 *                         example: "Santiago"
 *                       apellidos:
 *                         type: string
 *                         example: "Igua Romero"
 *                       email:
 *                         type: string
 *                         example: "santiago@example.com"
 *                       ficha:
 *                         type: string
 *                         example: "2873712"
 *       401:
 *         description: Token no válido o usuario no autenticado.
 *       403:
 *         description: El usuario no tiene permisos porque debe ser administrador.
 *       500:
 *         description: Error obteniendo los reportes.
 */
router.get(
  "/reportes",
  verifyToken,
  authorizeRoles("administrador"),
  controller.obtenerReportes
);

/**
 * @swagger
 * /api/reportes/{id}:
 *   put:
 *     summary: Actualizar un reporte
 *     tags: [Reportes de Aprendiz]
 *     description: Permite a un administrador responder un reporte y actualizar su estado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del reporte que se desea actualizar.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuesta
 *               - estado
 *             properties:
 *               respuesta:
 *                 type: string
 *                 description: Respuesta del administrador al reporte.
 *                 example: "Se revisó el problema y ya fue solucionado."
 *               estado:
 *                 type: string
 *                 description: Estado actual del reporte.
 *                 example: "Resuelto"
 *     responses:
 *       200:
 *         description: Reporte actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 asunto:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 respuesta:
 *                   type: string
 *                   example: "Se revisó el problema y ya fue solucionado."
 *                 estado:
 *                   type: string
 *                   example: "Resuelto"
 *                 userId:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Token no válido o usuario no autenticado.
 *       403:
 *         description: El usuario no tiene permisos porque debe ser administrador.
 *       404:
 *         description: Reporte no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reporte no encontrado"
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
  "/reportes/:id",
  verifyToken,
  authorizeRoles("administrador"),
  controller.actualizarReporte
);

module.exports = router;
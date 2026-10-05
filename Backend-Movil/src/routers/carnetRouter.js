
const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  generarCarnet,
  obtenerPendientes,
  obtenerMiCarnet,
  escanearCarnet,
  obtenerReportePeticiones,
} = require("../controllers/carnetController");

/**
 * @swagger
 * tags:
 *   name: Carnet
 *   description: Gestión, generación, consulta y validación de carnets
 */

/**
 * ============================================================
 * OBTENER PETICIONES DE CARNET PENDIENTES
 * ============================================================
 *
 * GET /api/carnet/pendientes
 */
router.get(
  "/pendientes",
  verifyToken,
  obtenerPendientes
);

/**
 * @swagger
 * /api/carnet/pendientes:
 *   get:
 *     summary: Obtener peticiones de carnet pendientes
 *     tags: [Carnet]
 *     description: Obtiene las solicitudes de carnet pendientes con paginación y búsqueda.
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
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Busca por nombre, apellido, documento, serial o placa.
 *     responses:
 *       200:
 *         description: Peticiones obtenidas correctamente.
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error obteniendo las peticiones.
 */

/**
 * ============================================================
 * REPORTES DE PETICIONES
 * ============================================================
 *
 * GET /api/carnet/reportes
 */
router.get(
  "/reportes",
  verifyToken,
  obtenerReportePeticiones
);

/**
 * @swagger
 * /api/carnet/reportes:
 *   get:
 *     summary: Obtener reportes de peticiones de carnet
 *     tags: [Carnet]
 *     description: Genera reportes según el período seleccionado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - diario
 *             - semanal
 *             - mensual
 *         description: Tipo de período para generar el reporte.
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 *       400:
 *         description: Tipo de reporte inválido.
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error generando el reporte.
 */

/**
 * ============================================================
 * GENERAR CARNET
 * ============================================================
 *
 * POST /api/carnet/generar/:id
 */
router.post(
  "/generar/:id",
  verifyToken,
  generarCarnet
);

/**
 * @swagger
 * /api/carnet/generar/{id}:
 *   post:
 *     summary: Generar carnet
 *     tags: [Carnet]
 *     description: Genera un nuevo carnet a partir de una petición aprobada.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la petición de carnet.
 *     responses:
 *       201:
 *         description: Carnet generado correctamente.
 *       400:
 *         description: La petición de carnet no es válida.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Petición de carnet no encontrada.
 *       500:
 *         description: Error generando el carnet.
 */

/**
 * ============================================================
 * OBTENER MIS CARNETS
 * ============================================================
 *
 * GET /api/carnet/mi-carnet
 */
router.get(
  "/mi-carnet",
  verifyToken,
  obtenerMiCarnet
);

/**
 * @swagger
 * /api/carnet/mi-carnet:
 *   get:
 *     summary: Obtener mis carnets
 *     tags: [Carnet]
 *     description: Obtiene todos los carnets asociados al usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carnets obtenidos correctamente.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: El usuario no tiene carnets registrados.
 *       500:
 *         description: Error obteniendo los carnets.
 */

/**
 * ============================================================
 * ESCANEAR CARNET
 * ============================================================
 *
 * POST /api/carnet/escanear
 *
 * IMPORTANTE:
 * El frontend debe enviar EXACTAMENTE el texto leído
 * por el código QR en la propiedad "codigoQr".
 *
 * Ejemplo:
 *
 * {
 *   "codigoQr": "SENA-5-1758451234567-12"
 * }
 */
router.post(
  "/escanear",
  verifyToken,
  escanearCarnet
);

/**
 * @swagger
 * /api/carnet/escanear:
 *   post:
 *     summary: Escanear y validar carnet mediante QR
 *     tags: [Carnet]
 *     description: Busca exactamente el carnet asociado al código QR escaneado y registra la entrada o salida.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoQr
 *             properties:
 *               codigoQr:
 *                 type: string
 *                 description: Texto exacto contenido en el código QR.
 *                 example: "SENA-5-1758451234567-12"
 *     responses:
 *       200:
 *         description: Carnet validado correctamente.
 *       400:
 *         description: Código QR inválido o faltante.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Carnet no encontrado.
 *       500:
 *         description: Error escaneando el carnet.
 */

module.exports = router;

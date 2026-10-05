const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/roles");

const {
  createRegistro,
  getRegistros,
  generarReporte,
  updateRegistro,
  deleteRegistro,
} = require("../controllers/entradaSalidaAprendizController");

/**
 * @swagger
 * tags:
 *   name: Entrada y Salida Aprendiz
 *   description: Gestión de registros de entrada y salida de aprendices
 */

/**
 * ============================================================
 * CREAR REGISTRO DE ENTRADA / SALIDA
 * ============================================================
 *
 * POST /api/entrada-salida-aprendiz
 *
 * Este endpoint queda protegido.
 */
router.post(
  "/entrada-salida-aprendiz",
  verifyToken,
  createRegistro
);

/**
 * @swagger
 * /api/entrada-salida-aprendiz:
 *   post:
 *     summary: Registrar entrada o salida de un aprendiz
 *     tags: [Entrada y Salida Aprendiz]
 *     description: Registra una entrada o salida asociada al aprendiz autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_aprendiz
 *               - id_codigo_gr
 *             properties:
 *               id_aprendiz:
 *                 type: integer
 *                 description: ID del aprendiz.
 *                 example: 1
 *               id_codigo_gr:
 *                 type: integer
 *                 description: ID del código GR utilizado.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Registro creado correctamente.
 *       400:
 *         description: Datos obligatorios faltantes.
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error creando el registro.
 */

/**
 * ============================================================
 * OBTENER REGISTROS
 * ============================================================
 *
 * GET /api/entrada-salida-aprendiz
 */
router.get(
  "/entrada-salida-aprendiz",
  verifyToken,
  getRegistros
);

/**
 * @swagger
 * /api/entrada-salida-aprendiz:
 *   get:
 *     summary: Listar registros de entrada y salida
 *     tags: [Entrada y Salida Aprendiz]
 *     description: Obtiene los registros de entrada y salida incluyendo información del aprendiz y vehículo.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registros obtenidos correctamente.
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error obteniendo los registros.
 */

/**
 * ============================================================
 * GENERAR REPORTE
 * ============================================================
 *
 * GET /api/entrada-salida-aprendiz/reporte
 */
router.get(
  "/entrada-salida-aprendiz/reporte",
  verifyToken,
  generarReporte
);

/**
 * @swagger
 * /api/entrada-salida-aprendiz/reporte:
 *   get:
 *     summary: Generar reporte de entradas y salidas
 *     tags: [Entrada y Salida Aprendiz]
 *     description: Genera un reporte según el período seleccionado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - diario
 *             - semanal
 *             - mensual
 *           default: diario
 *         description: Período del reporte.
 *         example: diario
 *     responses:
 *       200:
 *         description: Reporte generado correctamente.
 *       400:
 *         description: Periodo no válido.
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error generando el reporte.
 */

/**
 * ============================================================
 * ACTUALIZAR REGISTRO
 * ============================================================
 *
 * PATCH /api/entrada-salida-aprendiz/:id
 */
router.patch(
  "/entrada-salida-aprendiz/:id",
  verifyToken,
  updateRegistro
);

/**
 * @swagger
 * /api/entrada-salida-aprendiz/{id}:
 *   patch:
 *     summary: Actualizar registro de entrada o salida
 *     tags: [Entrada y Salida Aprendiz]
 *     description: Actualiza un registro existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del registro.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: Registro actualizado correctamente.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Registro no encontrado.
 *       500:
 *         description: Error actualizando el registro.
 */

/**
 * ============================================================
 * ELIMINAR REGISTRO
 * ============================================================
 *
 * DELETE /api/entrada-salida-aprendiz/:id
 */
router.delete(
  "/entrada-salida-aprendiz/:id",
  verifyToken,
  authorizeRoles("guarda", "administrador"),
  deleteRegistro
);

/**
 * @swagger
 * /api/entrada-salida-aprendiz/{id}:
 *   delete:
 *     summary: Eliminar registro de entrada y salida
 *     tags: [Entrada y Salida Aprendiz]
 *     description: Elimina un registro existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del registro.
 *         example: 1
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Registro no encontrado.
 *       500:
 *         description: Error eliminando el registro.
 */

module.exports = router;







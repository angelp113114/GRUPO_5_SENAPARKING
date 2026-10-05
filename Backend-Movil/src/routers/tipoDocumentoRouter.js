const express = require("express");

const {
  createTipoDocumento,
  getTipoDocumentos,
  getTipoDocumentoById,
  updateTipoDocumento,
  deleteTipoDocumento,
} = require("../controllers/tipoDocumentoController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tipo de Documento
 *   description: Gestión de los tipos de documento de los usuarios
 */

/**
 * @swagger
 * /api/tipo-documento:
 *   post:
 *     summary: Crear un tipo de documento
 *     tags: [Tipo de Documento]
 *     description: Crea un nuevo tipo de documento en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Cédula de Ciudadanía
 *             required:
 *               - nombre
 *     responses:
 *       201:
 *         description: Tipo de documento creado correctamente.
 *       400:
 *         description: Datos inválidos o incompletos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/tipo-documento", createTipoDocumento);

/**
 * @swagger
 * /api/tipo-documento:
 *   get:
 *     summary: Obtener todos los tipos de documento
 *     tags: [Tipo de Documento]
 *     description: Obtiene la lista de todos los tipos de documento registrados.
 *     responses:
 *       200:
 *         description: Lista de tipos de documento obtenida correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/tipo-documento", getTipoDocumentos);

/**
 * @swagger
 * /api/tipo-documento/{id}:
 *   get:
 *     summary: Obtener un tipo de documento por ID
 *     tags: [Tipo de Documento]
 *     description: Obtiene un tipo de documento específico mediante su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de documento.
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo de documento encontrado correctamente.
 *       404:
 *         description: Tipo de documento no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/tipo-documento/:id", getTipoDocumentoById);

/**
 * @swagger
 * /api/tipo-documento/{id}:
 *   put:
 *     summary: Actualizar un tipo de documento
 *     tags: [Tipo de Documento]
 *     description: Actualiza la información de un tipo de documento existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de documento.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Tarjeta de Identidad
 *             required:
 *               - nombre
 *     responses:
 *       200:
 *         description: Tipo de documento actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Tipo de documento no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put("/tipo-documento/:id", updateTipoDocumento);

/**
 * @swagger
 * /api/tipo-documento/{id}:
 *   delete:
 *     summary: Eliminar un tipo de documento
 *     tags: [Tipo de Documento]
 *     description: Elimina un tipo de documento existente mediante su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de documento.
 *         example: 1
 *     responses:
 *       200:
 *         description: Tipo de documento eliminado correctamente.
 *       404:
 *         description: Tipo de documento no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/tipo-documento/:id", deleteTipoDocumento);

module.exports = router;
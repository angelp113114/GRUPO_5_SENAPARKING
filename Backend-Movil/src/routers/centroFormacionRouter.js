const express = require("express");

const router = express.Router();

const {
  crearCentro,
  listarCentros,
  obtenerCentro,
  actualizarCentro,
  eliminarCentro
} = require("../controllers/centroFormacionController");

/**
 * @swagger
 * tags:
 *   name: Centros de Formación
 *   description: Gestión de centros de formación del SENA
 */

/**
 * @swagger
 * /api/centros:
 *   post:
 *     summary: Crear un centro de formación
 *     tags: [Centros de Formación]
 *     description: Registra un nuevo centro de formación en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - ciudad
 *               - direccion
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del centro de formación.
 *                 example: "Centro de Gestión Administrativa"
 *               ciudad:
 *                 type: string
 *                 description: Ciudad donde se encuentra el centro.
 *                 example: "Bogotá"
 *               direccion:
 *                 type: string
 *                 description: Dirección del centro de formación.
 *                 example: "Av. Carrera 30 # 17-28"
 *     responses:
 *       201:
 *         description: Centro de formación creado correctamente.
 *       400:
 *         description: Todos los campos son obligatorios.
 *       409:
 *         description: Ese centro de formación ya existe.
 *       500:
 *         description: Error al crear el centro.
 */
router.post(
  "/centros",
  crearCentro
);

/**
 * @swagger
 * /api/centros:
 *   get:
 *     summary: Listar centros de formación
 *     tags: [Centros de Formación]
 *     description: Obtiene todos los centros de formación registrados, ordenados alfabéticamente por nombre.
 *     responses:
 *       200:
 *         description: Lista de centros de formación.
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
 *                   nombre:
 *                     type: string
 *                     example: "Centro de Gestión Administrativa"
 *                   ciudad:
 *                     type: string
 *                     example: "Bogotá"
 *                   direccion:
 *                     type: string
 *                     example: "Av. Carrera 30 # 17-28"
 *       500:
 *         description: Error al listar centros.
 */
router.get(
  "/centros",
  listarCentros
);

/**
 * @swagger
 * /api/centros/{id}:
 *   get:
 *     summary: Obtener un centro de formación por ID
 *     tags: [Centros de Formación]
 *     description: Obtiene la información de un centro de formación específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del centro de formación.
 *         example: 1
 *     responses:
 *       200:
 *         description: Centro de formación encontrado correctamente.
 *       404:
 *         description: Centro no encontrado.
 *       500:
 *         description: Error al obtener el centro.
 */
router.get(
  "/centros/:id",
  obtenerCentro
);

/**
 * @swagger
 * /api/centros/{id}:
 *   put:
 *     summary: Actualizar un centro de formación
 *     tags: [Centros de Formación]
 *     description: Actualiza la información de un centro de formación existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del centro de formación.
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
 *                 description: Nombre del centro de formación.
 *                 example: "Centro de Gestión Administrativa"
 *               ciudad:
 *                 type: string
 *                 description: Ciudad del centro de formación.
 *                 example: "Bogotá"
 *               direccion:
 *                 type: string
 *                 description: Dirección del centro de formación.
 *                 example: "Av. Carrera 30 # 17-28"
 *     responses:
 *       200:
 *         description: Centro actualizado correctamente.
 *       404:
 *         description: Centro no encontrado.
 *       500:
 *         description: Error al actualizar el centro.
 */
router.put(
  "/centros/:id",
  actualizarCentro
);

/**
 * @swagger
 * /api/centros/{id}:
 *   delete:
 *     summary: Eliminar un centro de formación
 *     tags: [Centros de Formación]
 *     description: Elimina un centro de formación registrado en el sistema.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID del centro de formación.
 *         example: 1
 *     responses:
 *       200:
 *         description: Centro eliminado correctamente.
 *       404:
 *         description: Centro no encontrado.
 *       500:
 *         description: Error al eliminar el centro.
 */
router.delete(
  "/centros/:id",
  eliminarCentro
);

module.exports = router;
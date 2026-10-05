const express = require("express");

const {
  createVehiculo,
  getVehiculos,
  getVehiculoById,
  updateVehiculo,
  deleteVehiculo,
  getMisVehiculos,
} = require("../controllers/vehiculoController");

const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vehículos
 *   description: Gestión de vehículos registrados en SENAPARKING
 */

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags: [Vehículos]
 *     description: Obtiene todos los vehículos registrados en el sistema.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/",
  verifyToken,
  getVehiculos
);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear un vehículo
 *     tags: [Vehículos]
 *     description: Registra un nuevo vehículo. El propietario se asigna automáticamente según el usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: Moto
 *               id_centro_de_formacion:
 *                 type: integer
 *                 example: 1
 *               marca:
 *                 type: string
 *                 example: Yamaha
 *               color:
 *                 type: string
 *                 example: Negro
 *               serial:
 *                 type: string
 *                 example: ABC123456
 *               placa:
 *                 type: string
 *                 example: ABC12D
 *               cilindraje:
 *                 type: integer
 *                 example: 125
 *               modelo:
 *                 type: integer
 *                 example: 2025
 *               foto_principal:
 *                 type: string
 *                 example: moto_principal.jpg
 *               foto_secundaria:
 *                 type: string
 *                 example: moto_secundaria.jpg
 *     responses:
 *       201:
 *         description: Vehículo creado correctamente.
 *       400:
 *         description: Datos inválidos o incompletos.
 *       401:
 *         description: Token inválido o ausente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/",
  verifyToken,
  createVehiculo
);

/**
 * @swagger
 * /api/vehiculos/mis-vehiculos:
 *   get:
 *     summary: Obtener mis vehículos
 *     tags: [Vehículos]
 *     description: Obtiene los vehículos pertenecientes al usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehículos del usuario obtenidos correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       404:
 *         description: No se encontraron vehículos.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/mis-vehiculos",
  verifyToken,
  getMisVehiculos
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehículo por ID
 *     tags: [Vehículos]
 *     description: Obtiene la información de un vehículo específico. El controlador verifica que el usuario tenga acceso al vehículo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo.
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehículo encontrado correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       403:
 *         description: El usuario no tiene permiso para acceder al vehículo.
 *       404:
 *         description: Vehículo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/mis-vehiculos",
  verifyToken,
  getMisVehiculos
);


/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar un vehículo
 *     tags: [Vehículos]
 *     description: Actualiza la información de un vehículo. El controlador verifica que el usuario tenga permiso sobre el vehículo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 example: Moto
 *               id_centro_de_formacion:
 *                 type: integer
 *                 example: 1
 *               marca:
 *                 type: string
 *                 example: Yamaha
 *               color:
 *                 type: string
 *                 example: Rojo
 *               serial:
 *                 type: string
 *                 example: ABC123456
 *               placa:
 *                 type: string
 *                 example: XYZ45A
 *               cilindraje:
 *                 type: integer
 *                 example: 125
 *               modelo:
 *                 type: integer
 *                 example: 2025
 *               foto_principal:
 *                 type: string
 *                 example: moto_principal.jpg
 *               foto_secundaria:
 *                 type: string
 *                 example: moto_secundaria.jpg
 *     responses:
 *       200:
 *         description: Vehículo actualizado correctamente.
 *       400:
 *         description: Datos inválidos.
 *       401:
 *         description: Token inválido o ausente.
 *       403:
 *         description: El usuario no tiene permiso para actualizar el vehículo.
 *       404:
 *         description: Vehículo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
  "/:id",
  verifyToken,
  updateVehiculo
);

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     tags: [Vehículos]
 *     description: Elimina un vehículo. El controlador verifica que el usuario tenga permiso sobre el vehículo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del vehículo.
 *         example: 1
 *     responses:
 *       200:
 *         description: Vehículo eliminado correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       403:
 *         description: El usuario no tiene permiso para eliminar el vehículo.
 *       404:
 *         description: Vehículo no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete(
  "/:id",
  verifyToken,
  deleteVehiculo
);


module.exports = router;
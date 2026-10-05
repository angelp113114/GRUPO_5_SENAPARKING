const express = require("express");

const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");

const {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
} = require("../../controllers/aprendiz/solicitudActualizacionController");

const upload = require("../../middlewares/uploadSolicitud");

/**
 * @swagger
 * tags:
 *   name: Solicitudes de Actualización
 *   description: Gestión de solicitudes para actualizar datos personales y datos del vehículo
 */

/**
 * @swagger
 * /api/solicitudes-actualizacion:
 *   post:
 *     summary: Crear solicitud de actualización
 *     tags: [Solicitudes de Actualización]
 *     description: Permite al usuario autenticado solicitar una actualización de sus datos personales o de su vehículo. Puede adjuntar una foto nueva y documentos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tipo
 *               - datosNuevos
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - datos_personales
 *                   - datos_vehiculo
 *                 description: Tipo de información que se desea actualizar.
 *                 example: datos_vehiculo
 *               datosActuales:
 *                 type: string
 *                 description: Datos actuales de la información que se desea actualizar. El controlador obtiene los datos reales directamente de la base de datos.
 *                 example: "{}"
 *               datosNuevos:
 *                 type: string
 *                 description: Objeto JSON con los nuevos datos solicitados.
 *                 example: "{\"vehiculoId\":1,\"tipoVehiculo\":\"moto\",\"marca\":\"Yamaha\",\"color\":\"Negro\",\"serialPlaca\":\"ABC123\",\"cilindraje\":\"150\",\"modelo\":\"2025\"}"
 *               fotoNueva:
 *                 type: string
 *                 format: binary
 *                 description: Nueva fotografía asociada a la actualización.
 *               documentos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Documentos adicionales que respaldan la solicitud. Se pueden adjuntar hasta 10.
 *               documentosTipos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tipos correspondientes a los documentos enviados.
 *                 example: ["documento", "soporte"]
 *     responses:
 *       201:
 *         description: Solicitud enviada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitud enviada correctamente"
 *                 solicitud:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     tipo:
 *                       type: string
 *                       example: "datos_vehiculo"
 *                     datosActuales:
 *                       type: object
 *                     datosNuevos:
 *                       type: object
 *                     fotoNueva:
 *                       type: string
 *                       nullable: true
 *                       example: "uploads/solicitudes/foto.jpg"
 *                     documentos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           tipo:
 *                             type: string
 *                             example: "documento"
 *                           nombre:
 *                             type: string
 *                             example: "documento.pdf"
 *                           ruta:
 *                             type: string
 *                             example: "uploads/solicitudes/documento.pdf"
 *                           mimeType:
 *                             type: string
 *                             example: "application/pdf"
 *                           tamaño:
 *                             type: integer
 *                             example: 150000
 *                     estado:
 *                       type: string
 *                       example: "pendiente"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Datos inválidos o tipo de actualización no válido.
 *       401:
 *         description: Usuario no autenticado.
 *       404:
 *         description: Usuario o vehículo no encontrado.
 *       500:
 *         description: Error al crear la solicitud.
 */
router.post(
  "/solicitudes-actualizacion",
  verifyToken,
  upload.fields([
    {
      name: "fotoNueva",
      maxCount: 1,
    },
    {
      name: "documentos",
      maxCount: 10,
    },
  ]),
  crearSolicitud
);

/**
 * @swagger
 * /api/solicitudes-actualizacion:
 *   get:
 *     summary: Listar solicitudes de actualización
 *     tags: [Solicitudes de Actualización]
 *     description: Obtiene las solicitudes de actualización registradas, incluyendo información del usuario, centro de formación y vehículos.
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
 *         description: Cantidad de solicitudes por página.
 *         example: 10
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Busca por documento, nombres, apellidos, correo electrónico o ficha del usuario.
 *         example: Santiago
 *     responses:
 *       200:
 *         description: Solicitudes obtenidas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Usuario no autenticado.
 *       500:
 *         description: Error al listar las solicitudes.
 */
router.get(
  "/solicitudes-actualizacion",
  verifyToken,
  listarSolicitudes
);

/**
 * @swagger
 * /api/solicitudes-actualizacion/{id}/aprobar:
 *   put:
 *     summary: Aprobar solicitud de actualización
 *     tags: [Solicitudes de Actualización]
 *     description: Aprueba una solicitud pendiente, actualiza los datos personales o del vehículo y regenera el carnet correspondiente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la solicitud que se desea aprobar.
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitud aprobada y datos actualizados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitud aprobada y datos actualizados correctamente"
 *                 usuarioActualizado:
 *                   type: object
 *                   nullable: true
 *                 vehiculoActualizado:
 *                   type: object
 *                   nullable: true
 *                 carnet:
 *                   type: object
 *                   nullable: true
 *                 qrImage:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: ID inválido, solicitud ya procesada o datos no válidos.
 *       404:
 *         description: Solicitud, usuario o vehículo no encontrado.
 *       500:
 *         description: Error al aprobar la solicitud.
 */
router.put(
  "/solicitudes-actualizacion/:id/aprobar",
  verifyToken,
  aprobarSolicitud
);

/**
 * @swagger
 * /api/solicitudes-actualizacion/{id}/rechazar:
 *   put:
 *     summary: Rechazar solicitud de actualización
 *     tags: [Solicitudes de Actualización]
 *     description: Rechaza una solicitud que se encuentre actualmente en estado pendiente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de la solicitud que se desea rechazar.
 *         example: 1
 *     responses:
 *       200:
 *         description: Solicitud rechazada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Solicitud rechazada correctamente"
 *       400:
 *         description: ID inválido o la solicitud ya fue procesada.
 *       404:
 *         description: Solicitud no encontrada.
 *       500:
 *         description: Error al rechazar la solicitud.
 */
router.put(
  "/solicitudes-actualizacion/:id/rechazar",
  verifyToken,
  rechazarSolicitud
);

module.exports = router;
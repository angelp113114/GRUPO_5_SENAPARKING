const express = require("express");

const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");

const upload = require("../../middlewares/upload");

const {
  crearSolicitud,
  listarSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
} = require("../../controllers/aprendiz/solicitudCarnetController");

/**
 * @swagger
 * tags:
 *   name: Solicitudes de Carnet
 *   description: Gestión de solicitudes para generar el carnet vehicular
 */

/**
 * @swagger
 * /api/solicitudes-carnet:
 *   post:
 *     summary: Crear una solicitud de carnet
 *     description: |
 *       Permite al usuario autenticado crear una solicitud de carnet
 *       para una bicicleta o moto, adjuntando las fotografías y
 *       documentos obligatorios.
 *     tags: [Solicitudes de Carnet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tipoVehiculo
 *               - marca
 *               - color
 *               - serialPlaca
 *               - fotoAprendiz
 *               - fotoVehiculo
 *               - documentosAnexos
 *             properties:
 *               tipoVehiculo:
 *                 type: string
 *                 enum:
 *                   - bicicleta
 *                   - moto
 *                 example: moto
 *                 description: Tipo de vehículo.
 *
 *               marca:
 *                 type: string
 *                 example: Yamaha
 *                 description: Marca del vehículo.
 *
 *               color:
 *                 type: string
 *                 example: Negro
 *                 description: Color del vehículo.
 *
 *               serialPlaca:
 *                 type: string
 *                 example: ABC123
 *                 description: Placa de la moto o serial de la bicicleta.
 *
 *               cilindraje:
 *                 type: string
 *                 example: 150
 *                 description: Cilindraje de la moto. Obligatorio para motos.
 *
 *               modelo:
 *                 type: string
 *                 example: 2024
 *                 description: Modelo de la moto. Obligatorio para motos.
 *
 *               fotoAprendiz:
 *                 type: string
 *                 format: binary
 *                 description: Foto del aprendiz.
 *
 *               fotoVehiculo:
 *                 type: string
 *                 format: binary
 *                 description: Foto completa del vehículo.
 *
 *               fotoPlacaSerial:
 *                 type: string
 *                 format: binary
 *                 description: Foto de la placa de la moto o del serial de la bicicleta.
 *
 *               documentosTipos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - cedula
 *                     - tecno
 *                     - soat
 *                     - placa
 *                     - serial
 *                     - propiedad
 *                     - general
 *                 example:
 *                   - cedula
 *                   - propiedad
 *                   - soat
 *                   - tecno
 *                   - placa
 *                 description: |
 *                   Tipo correspondiente a cada archivo enviado en documentosAnexos.
 *                   El orden debe coincidir con los archivos.
 *
 *               documentosAnexos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: |
 *                   Documentos adicionales obligatorios según el tipo de vehículo.
 *
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud de carnet creada correctamente
 *                 solicitud:
 *                   type: object
 *                   description: Solicitud creada.
 *
 *       400:
 *         description: Datos inválidos o documentos obligatorios faltantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: La marca es obligatoria
 *
 *       401:
 *         description: Usuario no autenticado.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.post(
  "/solicitudes-carnet",
  verifyToken,
  upload.fields([
    {
      name: "fotoAprendiz",
      maxCount: 1,
    },
    {
      name: "fotoVehiculo",
      maxCount: 1,
    },
    {
      name: "fotoPlacaSerial",
      maxCount: 1,
    },
    {
      name: "documentosAnexos",
      maxCount: 10,
    },
  ]),
  crearSolicitud
);

/**
 * @swagger
 * /api/solicitudes-carnet:
 *   get:
 *     summary: Listar solicitudes de carnet
 *     description: |
 *       Obtiene las solicitudes de carnet con paginación.
 *       La búsqueda puede realizarse por documento del aprendiz,
 *       placa o serial del vehículo.
 *     tags: [Solicitudes de Carnet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página.
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de solicitudes por página.
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: |
 *           Texto de búsqueda por documento del aprendiz,
 *           placa o serial del vehículo.
 *
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
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/solicitudes-carnet",
  verifyToken,
  listarSolicitudes
);

/**
 * @swagger
 * /api/solicitudes-carnet/{id}/aprobar:
 *   put:
 *     summary: Aprobar una solicitud de carnet
 *     description: Cambia el estado de una solicitud pendiente a aprobada.
 *     tags: [Solicitudes de Carnet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *         description: ID de la solicitud.
 *
 *     responses:
 *       200:
 *         description: Solicitud aprobada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Solicitud aprobada correctamente
 *                 solicitud:
 *                   type: object
 *
 *       400:
 *         description: ID inválido o la solicitud no está pendiente.
 *
 *       404:
 *         description: Solicitud no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
  "/solicitudes-carnet/:id/aprobar",
  verifyToken,
  aprobarSolicitud
);

/**
 * @swagger
 * /api/solicitudes-carnet/{id}/rechazar:
 *   put:
 *     summary: Rechazar una solicitud de carnet
 *     description: Cambia el estado de una solicitud pendiente a rechazada.
 *     tags: [Solicitudes de Carnet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *         description: ID de la solicitud.
 *
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
 *                   example: Solicitud rechazada correctamente
 *                 solicitud:
 *                   type: object
 *
 *       400:
 *         description: ID inválido o la solicitud no está pendiente.
 *
 *       404:
 *         description: Solicitud no encontrada.
 *
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
  "/solicitudes-carnet/:id/rechazar",
  verifyToken,
  rechazarSolicitud
);

module.exports = router;
const express = require("express");

const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  recuperarPassword,
  verificarPin,
  reenviarPin,
  getCarnet,
  obtenerMiPerfil,
  logout,
  restablecerPassword
} = require("../controllers/authController");

const verifyToken = require("../middlewares/verifyToken");
const authorizeRoles = require("../middlewares/roles");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Registro, inicio de sesión y gestión de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un usuario
 *     tags: [Autenticación]
 *     description: Registra un nuevo usuario en el sistema SENAPARKING.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               documento:
 *                 type: string
 *                 example: "1234567890"
 *               tipoDocumento:
 *                 type: integer
 *                 example: 1
 *               nombres:
 *                 type: string
 *                 example: Juan
 *               apellidos:
 *                 type: string
 *                 example: Pérez
 *               ficha:
 *                 type: string
 *                 example: "2875634"
 *               celular:
 *                 type: string
 *                 example: "3001234567"
 *               centroFormacionId:
 *                 type: integer
 *                 example: 1
 *               fechaVinculacion:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-15"
 *               fechaFinalizacion:
 *                 type: string
 *                 format: date
 *                 example: "2027-01-15"
 *               rol:
 *                 type: string
 *                 example: aprendiz
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente.
 *       400:
 *         description: Datos inválidos o incompletos.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     description: Permite a un usuario iniciar sesión en SENAPARKING y obtener un token de acceso.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *       401:
 *         description: Credenciales incorrectas.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/recuperar-password:
 *   post:
 *     summary: Solicitar recuperación de contraseña
 *     tags: [Autenticación]
 *     description: Inicia el proceso de recuperación de contraseña mediante un PIN.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@gmail.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Solicitud de recuperación procesada correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/recuperar-password", recuperarPassword);

/**
 * @swagger
 * /auth/verificar-pin:
 *   post:
 *     summary: Verificar PIN de recuperación
 *     tags: [Autenticación]
 *     description: Verifica el PIN enviado durante el proceso de recuperación de contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@gmail.com
 *               pin:
 *                 type: string
 *                 example: "123456"
 *             required:
 *               - email
 *               - pin
 *     responses:
 *       200:
 *         description: PIN verificado correctamente.
 *       400:
 *         description: PIN inválido o expirado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/verificar-pin", verificarPin);

/**
 * @swagger
 * /auth/reenviar-pin:
 *   post:
 *     summary: Reenviar PIN de recuperación
 *     tags: [Autenticación]
 *     description: Solicita el reenvío del PIN para recuperar la contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@gmail.com
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: PIN reenviado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/reenviar-pin", reenviarPin);

/**
 * @swagger
 * /auth/restablecer-password:
 *   post:
 *     summary: Restablecer contraseña
 *     tags: [Autenticación]
 *     description: Permite al usuario autenticado establecer una nueva contraseña.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NuevaPassword123
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Contraseña restablecida correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/restablecer-password", verifyToken, restablecerPassword);

/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     description: Obtiene la lista de usuarios. Requiere permisos de administrador.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       403:
 *         description: El usuario no tiene permisos de administrador.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/users",
  verifyToken,
  authorizeRoles("administrador"),
  getUsers
);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     description: Obtiene la información de un usuario específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario.
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: Token inválido o ausente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/users/:id",
  verifyToken,
  getUserById
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener mi perfil
 *     tags: [Usuarios]
 *     description: Obtiene los datos del usuario autenticado mediante el token JWT.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/me",
  verifyToken,
  obtenerMiPerfil
);

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Usuarios]
 *     description: Actualiza la información de un usuario existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario.
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: Juan
 *               apellidos:
 *                 type: string
 *                 example: Pérez
 *               celular:
 *                 type: string
 *                 example: "3001234567"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@gmail.com
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.put(
  "/users/:id",
  verifyToken,
  updateUser
);

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Usuarios]
 *     description: Elimina un usuario del sistema. Requiere permisos de administrador.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario.
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       403:
 *         description: El usuario no tiene permisos de administrador.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete(
  "/users/:id",
  verifyToken,
  authorizeRoles("administrador"),
  deleteUser
);

/**
 * @swagger
 * /auth/carnet/{id}:
 *   get:
 *     summary: Obtener carnet de usuario
 *     tags: [Carnet]
 *     description: Obtiene la información del carnet asociado a un usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario.
 *         example: 1
 *     responses:
 *       200:
 *         description: Carnet obtenido correctamente.
 *       401:
 *         description: Token inválido o ausente.
 *       404:
 *         description: Carnet o usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get(
  "/carnet/:id",
  verifyToken,
  getCarnet
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Autenticación]
 *     description: Cierra la sesión del usuario.
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/logout", logout);

module.exports = router;
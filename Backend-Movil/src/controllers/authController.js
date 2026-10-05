const { Op } = require("sequelize");
const User = require("../models/User");
const CentroFormacion = require("../models/CentroFormacion");
const Vehiculo = require("../models/Vehiculo");
const TipoDocumento = require("../models/TipoDocumento");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");

// ==========================================
// FUNCIONES DE VALIDACIÓN
// ==========================================

const esTextoValido = (valor) => {
  return (
    typeof valor === "string" &&
    valor.trim().length > 0
  );
};

const esEmailValido = (email) => {
  return (
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  );
};

const esDocumentoValido = (documento) => {
  return (
    typeof documento === "string" &&
    /^\d{6,15}$/.test(documento.trim())
  );
};

const esCelularValido = (celular) => {
  return (
    typeof celular === "string" &&
    /^3\d{9}$/.test(celular.trim())
  );
};

const esPasswordValida = (password) => {
  return (
    typeof password === "string" &&
    password.length >= 8
  );
};

const esRolValido = (rol) => {
  return [
    "administrador",
    "guarda",
    "aprendiz"
  ].includes(rol);
};

const esFechaValida = (fecha) => {
  if (!fecha) {
    return true;
  }

  const fechaObj = new Date(fecha);

  return !isNaN(fechaObj.getTime());
};

const esIdValido = (id) => {
  return /^\d+$/.test(String(id));
};


// ==========================================
// BUSCAR TIPO DE DOCUMENTO
// ==========================================

const obtenerTipoDocumentoId = async (tipoDocumento) => {
  if (!esTextoValido(tipoDocumento)) {
    return null;
  }

  const valor = tipoDocumento
    .toString()
    .trim()
    .toUpperCase();

  // Si ya viene como ID numérico
  if (/^\d+$/.test(valor)) {
    const tipoPorId =
      await TipoDocumento.findByPk(
        Number(valor)
      );

    if (tipoPorId) {
      return tipoPorId.id;
    }
  }

  // La base de datos utiliza "sigla"
  // Ejemplo:
  // CC = 1
  // TI = 2

  const tipoPorSigla =
    await TipoDocumento.findOne({
      where: {
        sigla: valor
      }
    });

  if (tipoPorSigla) {
    return tipoPorSigla.id;
  }

  return null;
};


// ==========================================
// REGISTRAR USUARIO
// ==========================================

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      documento,
      tipoDocumento,
      nombres,
      apellidos,
      ficha,
      celular,
      centroFormacionId,
      fechaVinculacion,
      fechaFinalizacion,
      rol
    } = req.body;


    // ==========================================
    // VALIDACIONES
    // ==========================================

    if (!esEmailValido(email)) {
      return res.status(400).json({
        message:
          "El correo electrónico no es válido"
      });
    }

    if (!esPasswordValida(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener mínimo 8 caracteres"
      });
    }

    if (!esDocumentoValido(documento)) {
      return res.status(400).json({
        message:
          "El documento debe contener entre 6 y 15 números"
      });
    }

    if (!esTextoValido(tipoDocumento)) {
      return res.status(400).json({
        message:
          "El tipo de documento es obligatorio"
      });
    }

    if (!esTextoValido(nombres)) {
      return res.status(400).json({
        message:
          "Los nombres son obligatorios"
      });
    }

    if (!esTextoValido(apellidos)) {
      return res.status(400).json({
        message:
          "Los apellidos son obligatorios"
      });
    }

    if (!esRolValido(rol)) {
      return res.status(400).json({
        message:
          "El rol seleccionado no es válido"
      });
    }


    // ==========================================
    // CELULAR
    // ==========================================

    if (
      celular !== undefined &&
      celular !== null &&
      celular !== "" &&
      !esCelularValido(
        String(celular)
      )
    ) {
      return res.status(400).json({
        message:
          "El celular debe tener 10 números y comenzar por 3"
      });
    }


    // ==========================================
    // FECHAS
    // ==========================================

    if (!esFechaValida(fechaVinculacion)) {
      return res.status(400).json({
        message:
          "La fecha de vinculación no es válida"
      });
    }

    if (!esFechaValida(fechaFinalizacion)) {
      return res.status(400).json({
        message:
          "La fecha de finalización no es válida"
      });
    }


    if (
      fechaVinculacion &&
      fechaFinalizacion &&
      new Date(fechaFinalizacion) <
        new Date(fechaVinculacion)
    ) {
      return res.status(400).json({
        message:
          "La fecha de finalización no puede ser anterior a la fecha de vinculación"
      });
    }


    // ==========================================
    // CENTRO DE FORMACIÓN
    // ==========================================

    if (
      centroFormacionId !== undefined &&
      centroFormacionId !== null &&
      centroFormacionId !== ""
    ) {
      if (!esIdValido(centroFormacionId)) {
        return res.status(400).json({
          message:
            "El centro de formación no es válido"
        });
      }

      const centro =
        await CentroFormacion.findByPk(
          Number(centroFormacionId)
        );

      if (!centro) {
        return res.status(404).json({
          message:
            "El centro de formación no existe"
        });
      }
    }


    // ==========================================
    // NORMALIZAR DATOS
    // ==========================================

    const emailNormalizado =
      email.trim().toLowerCase();

    const documentoNormalizado =
      documento.trim();

    const nombresNormalizados =
      nombres.trim();

    const apellidosNormalizados =
      apellidos.trim();

    const tipoDocumentoNormalizado =
      tipoDocumento
        .toString()
        .trim()
        .toUpperCase();

    const celularNormalizado =
      celular !== undefined &&
      celular !== null &&
      celular !== ""
        ? String(celular).trim()
        : null;


    // ==========================================
    // VALIDAR LONGITUD NOMBRES
    // ==========================================

    if (
      nombresNormalizados.length < 2 ||
      nombresNormalizados.length > 100
    ) {
      return res.status(400).json({
        message:
          "Los nombres deben tener entre 2 y 100 caracteres"
      });
    }


    // ==========================================
    // VALIDAR LONGITUD APELLIDOS
    // ==========================================

    if (
      apellidosNormalizados.length < 2 ||
      apellidosNormalizados.length > 100
    ) {
      return res.status(400).json({
        message:
          "Los apellidos deben tener entre 2 y 100 caracteres"
      });
    }


    // ==========================================
    // OBTENER ID TIPO DOCUMENTO
    // ==========================================

    const tipoDocumentoId =
      await obtenerTipoDocumentoId(
        tipoDocumentoNormalizado
      );

    if (!tipoDocumentoId) {
      return res.status(400).json({
        message:
          "El tipo de documento seleccionado no existe"
      });
    }


    // ==========================================
    // BUSCAR USUARIO EXISTENTE
    // ==========================================

    const userExists =
      await User.findOne({
        where: {
          [Op.or]: [
            {
              email:
                emailNormalizado
            },
            {
              documento:
                documentoNormalizado
            }
          ]
        }
      });


    if (userExists) {

      if (
        userExists.email &&
        userExists.email.toLowerCase() ===
          emailNormalizado
      ) {
        return res.status(409).json({
          message:
            "El correo electrónico ya está registrado"
        });
      }

      if (
        userExists.documento ===
        documentoNormalizado
      ) {
        return res.status(409).json({
          message:
            "El documento ya está registrado"
        });
      }
    }


    // ==========================================
    // ENCRIPTAR PASSWORD
    // ==========================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // ==========================================
    // GENERAR QR
    // ==========================================

    const qrCode =
      uuidv4();


    // ==========================================
    // CREAR USUARIO
    // ==========================================

    const newUser =
      await User.create({

        email:
          emailNormalizado,

        password:
          hashedPassword,

        documento:
          documentoNormalizado,

        // IMPORTANTE:
        // Aquí se guarda el ID:
        // CC -> 1
        // TI -> 2
        tipoDocumento:
          tipoDocumentoId,

        nombres:
          nombresNormalizados,

        apellidos:
          apellidosNormalizados,

        ficha:
          ficha !== undefined &&
          ficha !== null &&
          ficha !== ""
            ? String(ficha).trim()
            : null,

        celular:
          celularNormalizado,

        centroFormacionId:
          centroFormacionId
            ? Number(centroFormacionId)
            : null,

        fechaVinculacion:
          fechaVinculacion || null,

        fechaFinalizacion:
          fechaFinalizacion || null,

        rol,

        qrCode
      });


    // ==========================================
    // RESPUESTA
    // ==========================================

    return res.status(201).json({

      message:
        "Usuario registrado correctamente",

      user: {

        id:
          newUser.id,

        email:
          newUser.email,

        documento:
          newUser.documento,

        tipoDocumento:
          newUser.tipoDocumento,

        nombres:
          newUser.nombres,

        apellidos:
          newUser.apellidos,

        ficha:
          newUser.ficha,

        celular:
          newUser.celular,

        centroFormacionId:
          newUser.centroFormacionId,

        fechaVinculacion:
          newUser.fechaVinculacion,

        fechaFinalizacion:
          newUser.fechaFinalizacion,

        rol:
          newUser.rol,

        qrCode:
          newUser.qrCode
      }
    });

  } catch (error) {

    console.error(
      "ERROR REGISTER:",
      error
    );

    if (
      error.name ===
      "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({
        message:
          "El correo o documento ya se encuentra registrado"
      });
    }

    if (
      error.name ===
      "SequelizeForeignKeyConstraintError"
    ) {
      return res.status(400).json({
        message:
          "El tipo de documento o centro de formación no existe"
      });
    }

    return res.status(500).json({
      message:
        "Error en el servidor"
    });
  }
};


// ==========================================
// LOGIN
// ==========================================

const login = async (req, res) => {
  try {

    const {
      email,
      password,
      rol
    } = req.body;


    if (!esEmailValido(email)) {
      return res.status(400).json({
        message:
          "Ingrese un correo electrónico válido"
      });
    }

    if (!esTextoValido(password)) {
      return res.status(400).json({
        message:
          "La contraseña es obligatoria"
      });
    }

    if (!esRolValido(rol)) {
      return res.status(400).json({
        message:
          "El rol seleccionado no es válido"
      });
    }


    const emailNormalizado =
      email.trim().toLowerCase();


    const user =
      await User.findOne({

        where: {
          email:
            emailNormalizado
        },

        include: [
          {
            model:
              CentroFormacion,

            as:
              "centroFormacion"
          }
        ]
      });


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!validPassword) {
      return res.status(401).json({
        message:
          "Contraseña incorrecta"
      });
    }


    if (user.rol !== rol) {
      return res.status(401).json({
        message:
          "Rol incorrecto"
      });
    }


    if (
      user.estado ===
      "bloqueado"
    ) {
      return res.status(403).json({
        message:
          "Usuario bloqueado. Comuníquese al soporte."
      });
    }


    // ==========================================
    // JWT
    // ==========================================

    const accessToken =
      jwt.sign(

        {
          id:
            user.id,

          email:
            user.email,

          rol:
            user.rol
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "24h"
        }
      );


    // ==========================================
    // COOKIE
    // ==========================================

    res.cookie(
      "accessToken",
      accessToken,
      {
        httpOnly:
          true,

        secure:
          false,

        sameSite:
          "lax",

        path:
          "/",

        maxAge:
          24 * 60 * 60 * 1000
      }
    );


    return res.status(200).json({

      message:
        "Login exitoso",

      accessToken,

      user: {

        id:
          user.id,

        email:
          user.email,

        nombres:
          user.nombres,

        apellidos:
          user.apellidos,

        rol:
          user.rol,

        documento:
          user.documento,

        tipoDocumento:
          user.tipoDocumento,

        ficha:
          user.ficha,

        celular:
          user.celular,

        centroFormacionId:
          user.centroFormacionId,

        fechaVinculacion:
          user.fechaVinculacion,

        fechaFinalizacion:
          user.fechaFinalizacion,

        foto:
          user.foto
      }
    });

  } catch (error) {

    console.error(
      "ERROR LOGIN:",
      error
    );

    return res.status(500).json({
      message:
        "Error en el servidor"
    });
  }
};


// ==========================================
// GET CARNET
// ==========================================

const getCarnet = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    if (!esIdValido(id)) {
      return res.status(400).json({
        message:
          "El ID del usuario no es válido"
      });
    }


    const user =
      await User.findByPk(id);


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    if (!user.qrCode) {
      return res.status(404).json({
        message:
          "El usuario no tiene un código QR"
      });
    }


    const qrImage =
      await QRCode.toDataURL(
        user.qrCode
      );


    return res.json({

      id:
        user.id,

      nombres:
        user.nombres,

      apellidos:
        user.apellidos,

      documento:
        user.documento,

      tipoDocumento:
        user.tipoDocumento,

      ficha:
        user.ficha,

      rol:
        user.rol,

      qrImage
    });

  } catch (error) {

    console.error(
      "ERROR GET CARNET:",
      error
    );

    return res.status(500).json({
      message:
        "Error generando carnet"
    });
  }
};


// ==========================================
// RECUPERAR PASSWORD
// ==========================================

const recuperarPassword = async (
  req,
  res
) => {

  try {

    const { email } =
      req.body;


    if (!esEmailValido(email)) {
      return res.status(400).json({
        message:
          "Ingrese un correo electrónico válido"
      });
    }


    const emailNormalizado =
      email.trim().toLowerCase();


    const user =
      await User.findOne({
        where: {
          email:
            emailNormalizado
        }
      });


    if (!user) {
      return res.status(404).json({
        message:
          "No existe usuario con ese correo"
      });
    }


    const pin =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();


    user.pinRecuperacion =
      pin;

    user.fechaPin =
      new Date();


    await user.save();


    console.log(
      `PIN: ${pin}`
    );


    return res.json({
      message:
        "PIN enviado"
    });

  } catch (error) {

    console.error(
      "ERROR RECUPERAR PASSWORD:",
      error
    );

    return res.status(500).json({
      message:
        "Error en servidor"
    });
  }
};


// ==========================================
// VERIFICAR PIN
// ==========================================

const verificarPin = async (
  req,
  res
) => {

  try {

    const {
      email,
      pin
    } = req.body;


    if (!esEmailValido(email)) {
      return res.status(400).json({
        message:
          "El correo electrónico no es válido"
      });
    }


    if (
      typeof pin !== "string" ||
      !/^\d{6}$/.test(pin)
    ) {
      return res.status(400).json({
        message:
          "El PIN debe contener exactamente 6 números"
      });
    }


    const emailNormalizado =
      email.trim().toLowerCase();


    const user =
      await User.findOne({
        where: {
          email:
            emailNormalizado
        }
      });


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    if (!user.pinRecuperacion) {
      return res.status(400).json({
        message:
          "No existe un PIN activo. Solicite uno nuevo."
      });
    }


    if (!user.fechaPin) {
      return res.status(400).json({
        message:
          "El PIN no es válido. Solicite uno nuevo."
      });
    }


    const ahora =
      new Date();

    const fechaPin =
      new Date(
        user.fechaPin
      );


    const diferencia =
      ahora.getTime() -
      fechaPin.getTime();


    const diezMinutos =
      10 * 60 * 1000;


    if (
      diferencia >
      diezMinutos
    ) {

      user.pinRecuperacion =
        null;

      user.fechaPin =
        null;

      await user.save();


      return res.status(400).json({
        message:
          "El PIN ha expirado. Solicite uno nuevo."
      });
    }


    if (
      String(
        user.pinRecuperacion
      ) !==
      String(pin)
    ) {
      return res.status(400).json({
        message:
          "Código incorrecto"
      });
    }


    const token =
      jwt.sign(

        {
          id:
            user.id,

          email:
            user.email,

          rol:
            user.rol
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "24h"
        }
      );


    res.cookie(
      "accessToken",
      token,
      {
        httpOnly:
          true,

        secure:
          false,

        sameSite:
          "lax",

        path:
          "/",

        maxAge:
          24 * 60 * 60 * 1000
      }
    );


    user.pinRecuperacion =
      null;

    user.fechaPin =
      null;

    await user.save();


    return res.json({

      message:
        "Código correcto",

      accessToken:
        token,

      user: {

        id:
          user.id,

        email:
          user.email,

        nombres:
          user.nombres,

        apellidos:
          user.apellidos,

        rol:
          user.rol,

        documento:
          user.documento,

        tipoDocumento:
          user.tipoDocumento,

        ficha:
          user.ficha,

        centroFormacionId:
          user.centroFormacionId
      }
    });

  } catch (error) {

    console.error(
      "ERROR VERIFICAR PIN:",
      error
    );

    return res.status(500).json({
      message:
        "Error en servidor"
    });
  }
};


// ==========================================
// REENVIAR PIN
// ==========================================

const reenviarPin = async (
  req,
  res
) => {

  try {

    const { email } =
      req.body;


    if (!esEmailValido(email)) {
      return res.status(400).json({
        message:
          "El correo electrónico no es válido"
      });
    }


    const emailNormalizado =
      email.trim().toLowerCase();


    const user =
      await User.findOne({
        where: {
          email:
            emailNormalizado
        }
      });


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    const pin =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();


    user.pinRecuperacion =
      pin;

    user.fechaPin =
      new Date();


    await user.save();


    console.log(
      `Nuevo PIN: ${pin}`
    );


    return res.json({
      message:
        "PIN reenviado"
    });

  } catch (error) {

    console.error(
      "ERROR REENVIAR PIN:",
      error
    );

    return res.status(500).json({
      message:
        "Error en servidor"
    });
  }
};


// ==========================================
// OBTENER USUARIOS CON PAGINACIÓN Y BÚSQUEDA
// ==========================================

const getUsers = async (req, res) => {
  try {
    // ==========================================
    // PAGINACIÓN
    // ==========================================

    const pageRaw = Number.parseInt(req.query.page, 10);
    const limitRaw = Number.parseInt(req.query.limit, 10);

    const page =
      Number.isFinite(pageRaw) && pageRaw > 0
        ? pageRaw
        : 1;

    const limit =
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(limitRaw, 50)
        : 10;

    // ==========================================
    // BÚSQUEDA
    // ==========================================

    /*
     * Se acepta "search" para la nueva búsqueda.
     *
     * También se acepta "nombre" para mantener
     * compatibilidad con el código anterior.
     */

    const searchParam =
      req.query.search !== undefined
        ? req.query.search
        : req.query.nombre !== undefined
        ? req.query.nombre
        : "";

    if (typeof searchParam !== "string") {
      return res.status(400).json({
        message:
          "El término de búsqueda no es válido",
      });
    }

    const search = searchParam
      .trim()
      .slice(0, 100);

    // ==========================================
    // CONDICIÓN DE BÚSQUEDA
    // ==========================================

    const where = {};

    if (search) {
      where[Op.or] = [
        {
          nombres: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          apellidos: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          documento: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }

    // ==========================================
    // PAGINACIÓN
    // ==========================================

    const offset =
      (page - 1) * limit;

    // ==========================================
    // CONSULTAR USUARIOS
    // ==========================================

    const {
      count,
      rows,
    } = await User.findAndCountAll({
      where,

      attributes: {
        exclude: [
          "password",
          "pinRecuperacion",
          "fechaPin",
        ],
      },

      include: [
        {
          model: CentroFormacion,
          as: "centroFormacion",
          required: false,
        },
      ],

      order: [
        ["nombres", "ASC"],
        ["apellidos", "ASC"],
      ],

      limit,
      offset,

      distinct: true,
    });

    // ==========================================
    // RESPUESTA
    // ==========================================

    return res.status(200).json({
      success: true,

      total: count,

      page,

      limit,

      totalPages:
        Math.ceil(count / limit),

      data: rows,
    });
  } catch (error) {
    console.error(
      "ERROR GET USERS:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Error obteniendo usuarios",
      error: error.message,
    });
  }
};


// ==========================================
// OBTENER USUARIO POR ID
// ==========================================

const getUserById = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    if (!esIdValido(id)) {
      return res.status(400).json({
        message:
          "El ID del usuario no es válido"
      });
    }


    const user =
      await User.findByPk(
        id,
        {
          attributes: {
            exclude: [
              "password",
              "pinRecuperacion",
              "fechaPin"
            ]
          }
        }
      );


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    return res.status(200).json(
      user
    );

  } catch (error) {

    console.error(
      "ERROR GET USER:",
      error
    );

    return res.status(500).json({
      message:
        "Error obteniendo usuario"
    });
  }
};


// ==========================================
// ACTUALIZAR USUARIO
// ==========================================

const updateUser = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    if (!esIdValido(id)) {
      return res.status(400).json({
        message:
          "El ID del usuario no es válido"
      });
    }


    const user =
      await User.findByPk(id);


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    const camposPermitidos = [
      "nombres",
      "apellidos",
      "email",
      "documento",
      "tipoDocumento",
      "ficha",
      "celular",
      "centroFormacionId",
      "fechaVinculacion",
      "fechaFinalizacion",
      "foto"
    ];


    const datosActualizados = {};


    for (
      const campo of camposPermitidos
    ) {

      if (
        req.body[campo] !==
        undefined
      ) {

        datosActualizados[campo] =
          req.body[campo];
      }
    }


    if (
      Object.keys(
        datosActualizados
      ).length === 0 &&
      req.body.password ===
        undefined
    ) {

      return res.status(400).json({
        message:
          "No hay datos válidos para actualizar"
      });
    }


    // ==========================================
    // NOMBRES
    // ==========================================

    if (
      datosActualizados.nombres !==
      undefined
    ) {

      if (
        !esTextoValido(
          datosActualizados.nombres
        )
      ) {
        return res.status(400).json({
          message:
            "Los nombres son obligatorios"
        });
      }


      datosActualizados.nombres =
        datosActualizados.nombres.trim();


      if (
        datosActualizados.nombres.length <
          2 ||
        datosActualizados.nombres.length >
          100
      ) {
        return res.status(400).json({
          message:
            "Los nombres deben tener entre 2 y 100 caracteres"
        });
      }
    }


    // ==========================================
    // APELLIDOS
    // ==========================================

    if (
      datosActualizados.apellidos !==
      undefined
    ) {

      if (
        !esTextoValido(
          datosActualizados.apellidos
        )
      ) {
        return res.status(400).json({
          message:
            "Los apellidos son obligatorios"
        });
      }


      datosActualizados.apellidos =
        datosActualizados.apellidos.trim();


      if (
        datosActualizados.apellidos.length <
          2 ||
        datosActualizados.apellidos.length >
          100
      ) {
        return res.status(400).json({
          message:
            "Los apellidos deben tener entre 2 y 100 caracteres"
        });
      }
    }


    // ==========================================
    // EMAIL
    // ==========================================

    if (
      datosActualizados.email !==
      undefined
    ) {

      if (
        !esEmailValido(
          datosActualizados.email
        )
      ) {
        return res.status(400).json({
          message:
            "El correo electrónico no es válido"
        });
      }


      datosActualizados.email =
        datosActualizados.email
          .trim()
          .toLowerCase();


      const emailExiste =
        await User.findOne({
          where: {

            email:
              datosActualizados.email,

            id: {
              [Op.ne]:
                id
            }
          }
        });


      if (emailExiste) {
        return res.status(409).json({
          message:
            "El correo electrónico ya está registrado"
        });
      }
    }


    // ==========================================
    // DOCUMENTO
    // ==========================================

    if (
      datosActualizados.documento !==
      undefined
    ) {

      if (
        !esDocumentoValido(
          String(
            datosActualizados.documento
          )
        )
      ) {
        return res.status(400).json({
          message:
            "El documento debe contener entre 6 y 15 números"
        });
      }


      datosActualizados.documento =
        String(
          datosActualizados.documento
        ).trim();


      const documentoExiste =
        await User.findOne({
          where: {

            documento:
              datosActualizados.documento,

            id: {
              [Op.ne]:
                id
            }
          }
        });


      if (documentoExiste) {
        return res.status(409).json({
          message:
            "El documento ya está registrado"
        });
      }
    }


    // ==========================================
    // TIPO DOCUMENTO
    // ==========================================

    if (
      datosActualizados.tipoDocumento !==
      undefined
    ) {

      if (
        !esTextoValido(
          String(
            datosActualizados.tipoDocumento
          )
        )
      ) {
        return res.status(400).json({
          message:
            "El tipo de documento es obligatorio"
        });
      }


      const tipoDocumentoId =
        await obtenerTipoDocumentoId(
          datosActualizados.tipoDocumento
        );


      if (!tipoDocumentoId) {
        return res.status(400).json({
          message:
            "El tipo de documento seleccionado no existe"
        });
      }


      datosActualizados.tipoDocumento =
        tipoDocumentoId;
    }


    // ==========================================
    // CELULAR
    // ==========================================

    if (
      datosActualizados.celular !==
        undefined &&
      datosActualizados.celular !==
        null &&
      datosActualizados.celular !==
        ""
    ) {

      if (
        !esCelularValido(
          String(
            datosActualizados.celular
          )
        )
      ) {
        return res.status(400).json({
          message:
            "El celular debe tener 10 números y comenzar por 3"
        });
      }


      datosActualizados.celular =
        String(
          datosActualizados.celular
        ).trim();
    }


    // ==========================================
    // CENTRO
    // ==========================================

    if (
      datosActualizados.centroFormacionId !==
        undefined &&
      datosActualizados.centroFormacionId !==
        null
    ) {

      if (
        !esIdValido(
          datosActualizados.centroFormacionId
        )
      ) {
        return res.status(400).json({
          message:
            "El centro de formación no es válido"
        });
      }


      const centro =
        await CentroFormacion.findByPk(
          Number(
            datosActualizados.centroFormacionId
          )
        );


      if (!centro) {
        return res.status(404).json({
          message:
            "El centro de formación no existe"
        });
      }


      datosActualizados.centroFormacionId =
        Number(
          datosActualizados.centroFormacionId
        );
    }


    // ==========================================
    // FECHAS
    // ==========================================

    if (
      datosActualizados.fechaVinculacion !==
        undefined &&
      !esFechaValida(
        datosActualizados.fechaVinculacion
      )
    ) {
      return res.status(400).json({
        message:
          "La fecha de vinculación no es válida"
      });
    }


    if (
      datosActualizados.fechaFinalizacion !==
        undefined &&
      !esFechaValida(
        datosActualizados.fechaFinalizacion
      )
    ) {
      return res.status(400).json({
        message:
          "La fecha de finalización no es válida"
      });
    }


    const fechaVinculacion =
      datosActualizados.fechaVinculacion ??
      user.fechaVinculacion;

    const fechaFinalizacion =
      datosActualizados.fechaFinalizacion ??
      user.fechaFinalizacion;


    if (
      fechaVinculacion &&
      fechaFinalizacion &&
      new Date(fechaFinalizacion) <
        new Date(fechaVinculacion)
    ) {
      return res.status(400).json({
        message:
          "La fecha de finalización no puede ser anterior a la fecha de vinculación"
      });
    }


    // ==========================================
    // PASSWORD
    // ==========================================

    if (
      req.body.password !==
      undefined
    ) {

      if (
        !esPasswordValida(
          req.body.password
        )
      ) {
        return res.status(400).json({
          message:
            "La contraseña debe tener mínimo 8 caracteres"
        });
      }


      datosActualizados.password =
        await bcrypt.hash(
          req.body.password,
          10
        );
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    await user.update(
      datosActualizados
    );


    const userResponse =
      user.toJSON();


    delete userResponse.password;
    delete userResponse.pinRecuperacion;
    delete userResponse.fechaPin;


    return res.status(200).json({

      message:
        "Usuario actualizado correctamente",

      user:
        userResponse
    });

  } catch (error) {

    console.error(
      "ERROR UPDATE USER:",
      error
    );

    if (
      error.name ===
      "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({
        message:
          "El correo o documento ya está registrado"
      });
    }

    if (
      error.name ===
      "SequelizeForeignKeyConstraintError"
    ) {
      return res.status(400).json({
        message:
          "El tipo de documento o centro de formación no existe"
      });
    }

    return res.status(500).json({
      message:
        "Error actualizando usuario"
    });
  }
};


// ==========================================
// ELIMINAR USUARIO
// ==========================================

const deleteUser = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    if (!esIdValido(id)) {
      return res.status(400).json({
        message:
          "El ID del usuario no es válido"
      });
    }


    const user =
      await User.findByPk(id);


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    await user.destroy();


    return res.status(200).json({
      message:
        "Usuario eliminado correctamente"
    });

  } catch (error) {

    console.error(
      "ERROR DELETE USER:",
      error
    );

    return res.status(500).json({
      message:
        "Error eliminando usuario"
    });
  }
};


// ==========================================
// OBTENER MI PERFIL
// ==========================================

const obtenerMiPerfil = async (
  req,
  res
) => {

  try {

    if (
      !req.user ||
      !req.user.id
    ) {
      return res.status(401).json({
        message:
          "Usuario no autenticado"
      });
    }


    if (
      !esIdValido(
        req.user.id
      )
    ) {
      return res.status(400).json({
        message:
          "El ID del usuario no es válido"
      });
    }


    const user =
      await User.findByPk(
        req.user.id,
        {
          attributes: {
            exclude: [
              "password",
              "pinRecuperacion",
              "fechaPin"
            ]
          },
          include: [
            {
              model: CentroFormacion,
              as: "centroFormacion",
              attributes: ["id", "nombre", "ciudad", "direccion"]
            },
            {
              model: Vehiculo,
              as: "vehiculos",
              attributes: [
                "id",
                "tipo",
                "marca",
                "color",
                "serial",
                "placa",
                "cilindraje",
                "modelo"
              ]
            }
          ]
        }
      );


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    return res.json(
      user
    );

  } catch (error) {

    console.error(
      "ERROR MI PERFIL:",
      error
    );

    return res.status(500).json({
      message:
        "Error obteniendo perfil"
    });
  }
};


// ==========================================
// LOGOUT
// ==========================================

const logout = (
  req,
  res
) => {

  res.clearCookie(
    "accessToken",
    {
      httpOnly:
        true,

      secure:
        false,

      sameSite:
        "lax",

      path:
        "/"
    }
  );


  return res.status(200).json({
    message:
      "Sesión cerrada"
  });
};


// ==========================================
// RESTABLECER PASSWORD
// ==========================================

const restablecerPassword = async (
  req,
  res
) => {

  try {

    const { password } =
      req.body;


    if (!esPasswordValida(password)) {
      return res.status(400).json({
        message:
          "La contraseña debe tener mínimo 8 caracteres"
      });
    }


    if (
      !req.user ||
      !req.user.id
    ) {
      return res.status(401).json({
        message:
          "Usuario no autenticado"
      });
    }


    const user =
      await User.findByPk(
        req.user.id
      );


    if (!user) {
      return res.status(404).json({
        message:
          "Usuario no encontrado"
      });
    }


    user.password =
      await bcrypt.hash(
        password,
        10
      );


    await user.save();


    return res.json({
      message:
        "Contraseña actualizada correctamente"
    });

  } catch (error) {

    console.error(
      "ERROR RESTABLECER PASSWORD:",
      error
    );

    return res.status(500).json({
      message:
        "Error al restablecer la contraseña"
    });
  }
};


// ==========================================
// EXPORTACIONES
// ==========================================

module.exports = {
  restablecerPassword,
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCarnet,
  recuperarPassword,
  verificarPin,
  reenviarPin,
  obtenerMiPerfil,
  logout
};
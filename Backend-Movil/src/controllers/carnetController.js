const { Op } = require("sequelize");
const QRCode = require("qrcode");

const Carnet = require("../models/Carnet");
const Vehiculo = require("../models/Vehiculo");
const User = require("../models/User");
const CentroFormacion = require("../models/CentroFormacion");
const SolicitudCarnet = require("../models/aprendiz/SolicitudCarnet");
const EntradaSalidaAprendiz = require("../models/EntradaSalidaAprendiz");


/* =========================================================
   GENERAR CARNET
========================================================= */

const generarCarnet = async (req, res) => {
  try {
    const solicitudId = Number(req.params.id);

    if (!Number.isInteger(solicitudId) || solicitudId <= 0) {
      return res.status(400).json({
        message: "El ID de la solicitud no es válido"
      });
    }

    const solicitud = await SolicitudCarnet.findByPk(solicitudId, {
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    });

    if (!solicitud) {
      return res.status(404).json({
        message: "Solicitud no encontrada"
      });
    }

    if (solicitud.estado !== "aprobada") {
      return res.status(400).json({
        message:
          "La solicitud debe estar aprobada para generar el carnet"
      });
    }

    if (!solicitud.user) {
      return res.status(404).json({
        message:
          "El usuario asociado a la solicitud no existe"
      });
    }

    if (!solicitud.user.centroFormacionId) {
      return res.status(400).json({
        message:
          "El usuario no tiene un centro de formación asociado"
      });
    }

    const {
      tipoVehiculo,
      marca,
      color,
      serialPlaca,
      cilindraje,
      modelo,
      fotoAprendiz,
      fotoVehiculo
    } = solicitud;

    if (!tipoVehiculo) {
      return res.status(400).json({
        message:
          "El tipo de vehículo es obligatorio"
      });
    }

    if (!marca) {
      return res.status(400).json({
        message:
          "La marca del vehículo es obligatoria"
      });
    }

    if (!color) {
      return res.status(400).json({
        message:
          "El color del vehículo es obligatorio"
      });
    }

    if (!serialPlaca) {
      return res.status(400).json({
        message:
          "La placa o serial del vehículo es obligatorio"
      });
    }

    if (!fotoVehiculo) {
      return res.status(400).json({
        message:
          "La foto del vehículo es obligatoria"
      });
    }

    /* =====================================================
       FOTO DEL APRENDIZ
    ===================================================== */

    if (fotoAprendiz) {
      solicitud.user.foto = fotoAprendiz;

      await solicitud.user.save();

      console.log(
        "FOTO DEL APRENDIZ GUARDADA:",
        solicitud.user.foto
      );
    } else {
      console.log(
        "ADVERTENCIA: la solicitud no tiene fotoAprendiz"
      );

      console.log(
        "FOTO ACTUAL DEL USUARIO:",
        solicitud.user.foto
      );
    }

    /* =====================================================
       GENERAR QR ÚNICO
    ===================================================== */

    const codigoQr =
      `SENA-${solicitud.userId}-${Date.now()}-${solicitud.id}`;

    const qrImage =
      await QRCode.toDataURL(codigoQr);

    /* =====================================================
       CREAR VEHÍCULO NUEVO
       
       IMPORTANTE:
       Cada carnet generado crea su propio vehículo.
    ===================================================== */

    const datosVehiculo = {
      userId: solicitud.userId,

      tipo: tipoVehiculo,

      id_centro_de_formacion:
        solicitud.user.centroFormacionId,

      marca:
        String(marca).trim(),

      color:
        String(color).trim(),

      serial:
        tipoVehiculo === "bicicleta"
          ? String(serialPlaca).trim()
          : null,

      placa:
        tipoVehiculo === "moto"
          ? String(serialPlaca).trim()
          : null,

      cilindraje:
        cilindraje
          ? String(cilindraje).trim()
          : null,

      modelo:
        modelo
          ? String(modelo).trim()
          : null,

      foto_principal:
        fotoVehiculo,

      foto_secundaria:
        fotoVehiculo
    };

    const vehiculo =
      await Vehiculo.create(datosVehiculo);

    console.log(
      "=============================================="
    );

    console.log(
      "VEHÍCULO NUEVO CREADO"
    );

    console.log(
      "ID VEHÍCULO:",
      vehiculo.id
    );

    console.log(
      "USUARIO:",
      solicitud.userId
    );

    console.log(
      "=============================================="
    );

    /* =====================================================
       CREAR CARNET NUEVO
       
       IMPORTANTE:
       Este carnet queda ligado EXCLUSIVAMENTE
       al vehículo recién creado.
    ===================================================== */

    const carnet =
      await Carnet.create({
        userId:
          solicitud.userId,

        vehicleId:
          vehiculo.id,

        solicitudId:
          solicitud.id,

        codigoQr,

        estado:
          "activo"
      });

    console.log(
      "=============================================="
    );

    console.log(
      "CARNET NUEVO CREADO"
    );

    console.log(
      "ID CARNET:",
      carnet.id
    );

    console.log(
      "ID VEHÍCULO:",
      carnet.vehicleId
    );

    console.log(
      "QR:",
      carnet.codigoQr
    );

    console.log(
      "=============================================="
    );

    /* =====================================================
       ACTUALIZAR SOLICITUD
    ===================================================== */

    solicitud.estado =
      "carnet_generado";

    await solicitud.save();

    return res.status(200).json({

      message:
        "Carnet generado correctamente",

      carnet: {
        id:
          carnet.id,

        userId:
          carnet.userId,

        vehicleId:
          carnet.vehicleId,

        solicitudId:
          carnet.solicitudId,

        codigoQr:
          carnet.codigoQr,

        estado:
          carnet.estado
      },

      vehiculo,

      qrImage,

      user: {
        id:
          solicitud.user.id,

        nombres:
          solicitud.user.nombres,

        apellidos:
          solicitud.user.apellidos,

        foto:
          solicitud.user.foto
      }

    });

  } catch (error) {

    console.error(
      "ERROR GENERAR CARNET:",
      error
    );

    return res.status(500).json({

      message:
        "Error al generar el carnet",

      error:
        error.message

    });
  }
};


/* =========================================================
   OBTENER MIS CARNETS
========================================================= */

const obtenerMiCarnet = async (req, res) => {

  try {

    if (!req.user?.id) {
      return res.status(401).json({
        message:
          "Usuario no autenticado"
      });
    }

    const userId =
      req.user.id;

    const carnets =
      await Carnet.findAll({

        where: {
          userId
        },

        include: [

          {
            model: User,

            as: "user",

            attributes: [
              "id",
              "rol",
              "nombres",
              "apellidos",
              "tipoDocumento",
              "documento",
              "email",
              "celular",
              "ficha",
              "centroFormacionId",
              "fechaVinculacion",
              "fechaFinalizacion",
              "foto"
            ],

            include: [

              {
                model: CentroFormacion,

                as: "centroFormacion"
              }

            ]
          },

          {
            model: Vehiculo,

            as: "vehiculo"
          }

        ],

        order: [
          ["createdAt", "DESC"]
        ]
      });

    if (!carnets.length) {

      return res.status(404).json({

        message:
          "El usuario no tiene un carnet generado"

      });
    }

    const resultado =
      await Promise.all(

        carnets.map(
          async (carnet) => {

            const qrImage =
              await QRCode.toDataURL(
                carnet.codigoQr
              );

            const fotoAprendiz =
              carnet.user?.foto || null;

            return {

              id:
                carnet.id,

              userId:
                carnet.userId,

              estado:
                carnet.estado,

              codigoQr:
                carnet.codigoQr,

              solicitudId:
                carnet.solicitudId,

              vehicleId:
                carnet.vehicleId,

              qrImage,

              user:

                carnet.user
                  ? {

                      id:
                        carnet.user.id,

                      rol:
                        carnet.user.rol,

                      nombres:
                        carnet.user.nombres,

                      apellidos:
                        carnet.user.apellidos,

                      tipoDocumento:
                        carnet.user.tipoDocumento,

                      documento:
                        carnet.user.documento,

                      email:
                        carnet.user.email,

                      celular:
                        carnet.user.celular,

                      ficha:
                        carnet.user.ficha,

                      centroFormacionId:
                        carnet.user
                          .centroFormacionId,

                      centroFormacion:
                        carnet.user
                          .centroFormacion,

                      fechaVinculacion:
                        carnet.user
                          .fechaVinculacion,

                      fechaFinalizacion:
                        carnet.user
                          .fechaFinalizacion,

                      foto:
                        fotoAprendiz
                    }

                  : null,

              vehiculo:

                carnet.vehiculo
                  ? {

                      id:
                        carnet.vehiculo.id,

                      userId:
                        carnet.vehiculo.userId,

                      foto_principal:
                        carnet.vehiculo
                          .foto_principal,

                      foto_secundaria:
                        carnet.vehiculo
                          .foto_secundaria,

                      tipo:
                        carnet.vehiculo.tipo,

                      marca:
                        carnet.vehiculo.marca,

                      color:
                        carnet.vehiculo.color,

                      serial:
                        carnet.vehiculo.serial,

                      placa:
                        carnet.vehiculo.placa,

                      modelo:
                        carnet.vehiculo.modelo,

                      cilindraje:
                        carnet.vehiculo.cilindraje
                    }

                  : null
            };
          }
        )
      );

    return res.status(200).json(
      resultado
    );

  } catch (error) {

    console.error(
      "ERROR OBTENER MIS CARNETS:",
      error
    );

    return res.status(500).json({

      message:
        "Error al obtener los carnets",

      error:
        error.message

    });
  }
};


/* =========================================================
   OBTENER PETICIONES
========================================================= */

const obtenerPendientes = async (req, res) => {

  try {

    const pageRaw =
      Number.parseInt(
        req.query.page,
        10
      );

    const limitRaw =
      Number.parseInt(
        req.query.limit,
        10
      );

    const page =
      Number.isFinite(pageRaw) &&
      pageRaw > 0
        ? pageRaw
        : 1;

    const limit =
      Number.isFinite(limitRaw) &&
      limitRaw > 0
        ? Math.min(
            limitRaw,
            50
          )
        : 10;

    const searchParam =
      req.query.search !== undefined
        ? req.query.search
        : "";

    if (
      typeof searchParam !==
      "string"
    ) {

      return res.status(400).json({

        success: false,

        message:
          "El término de búsqueda no es válido"

      });
    }

    const search =
      searchParam
        .trim()
        .slice(0, 100);

    const where = {};

    if (search) {

      where[Op.or] = [

        {
          "$user.nombres$": {
            [Op.like]:
              `%${search}%`
          }
        },

        {
          "$user.apellidos$": {
            [Op.like]:
              `%${search}%`
          }
        },

        {
          "$user.documento$": {
            [Op.like]:
              `%${search}%`
          }
        },

        {
          serialPlaca: {
            [Op.like]:
              `%${search}%`
          }
        }

      ];
    }

    const offset =
      (page - 1) * limit;

    const resultado =
      await SolicitudCarnet.findAndCountAll({

        where,

        include: [

          {

            model: User,

            as: "user",

            attributes: [

              "id",
              "rol",
              "nombres",
              "apellidos",
              "documento",
              "tipoDocumento",
              "email",
              "celular",
              "ficha",
              "centroFormacionId",
              "foto"

            ],

            required: true,

            include: [

              {

                model: CentroFormacion,

                as: "centroFormacion"

              }

            ]

          }

        ],

        order: [
          ["createdAt", "DESC"]
        ],

        limit,

        offset,

        distinct: true

      });

    const total =
      Array.isArray(resultado.count)
        ? resultado.count.length
        : resultado.count;

    const totalPages =
      Math.ceil(
        total / limit
      );

    return res.status(200).json({

      success: true,

      total,

      page,

      limit,

      totalPages,

      data:
        resultado.rows

    });

  } catch (error) {

    console.error(
      "ERROR OBTENER PETICIONES DE CARNET:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Error al obtener las peticiones de carnet",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined

    });
  }
};


/* =========================================================
   REPORTE DE PETICIONES
========================================================= */

const obtenerReportePeticiones = async (req, res) => {

  try {

    const tipoParam =
      req.query.tipo;

    if (
      typeof tipoParam !==
      "string"
    ) {

      return res.status(400).json({

        message:
          "El tipo de reporte es obligatorio"

      });
    }

    const tipo =
      tipoParam
        .trim()
        .toLowerCase();

    const tiposPermitidos = [
      "diario",
      "semanal",
      "mensual"
    ];

    if (
      !tiposPermitidos.includes(
        tipo
      )
    ) {

      return res.status(400).json({

        message:
          "El tipo de reporte debe ser diario, semanal o mensual"

      });
    }

    const ahora =
      new Date();

    let fechaInicio =
      new Date(ahora);

    let fechaFin =
      new Date(ahora);

    /* =====================================================
       DIARIO
    ===================================================== */

    if (tipo === "diario") {

      fechaInicio.setHours(
        0,
        0,
        0,
        0
      );

      fechaFin.setHours(
        23,
        59,
        59,
        999
      );
    }

    /* =====================================================
       SEMANAL
    ===================================================== */

    if (tipo === "semanal") {

      const dia =
        fechaInicio.getDay();

      const diferencia =
        dia === 0
          ? 6
          : dia - 1;

      fechaInicio.setDate(
        fechaInicio.getDate() -
          diferencia
      );

      fechaInicio.setHours(
        0,
        0,
        0,
        0
      );

      fechaFin =
        new Date(fechaInicio);

      fechaFin.setDate(
        fechaInicio.getDate() + 6
      );

      fechaFin.setHours(
        23,
        59,
        59,
        999
      );
    }

    /* =====================================================
       MENSUAL
    ===================================================== */

    if (tipo === "mensual") {

      fechaInicio =
        new Date(
          ahora.getFullYear(),
          ahora.getMonth(),
          1,
          0,
          0,
          0,
          0
        );

      fechaFin =
        new Date(
          ahora.getFullYear(),
          ahora.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
    }

    const solicitudes =
      await SolicitudCarnet.findAll({

        where: {

          createdAt: {

            [Op.between]: [
              fechaInicio,
              fechaFin
            ]

          }

        },

        include: [

          {

            model: User,

            as: "user",

            attributes: [

              "id",
              "nombres",
              "apellidos",
              "documento",
              "ficha",
              "centroFormacionId"

            ],

            include: [

              {

                model: CentroFormacion,

                as: "centroFormacion"

              }

            ]

          }

        ],

        order: [

          ["createdAt", "DESC"]

        ]

      });

    const total =
      solicitudes.length;

    const aprobadas =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          "aprobada"
      ).length;

    const carnetsGenerados =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          "carnet_generado"
      ).length;

    const rechazadas =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          "rechazada"
      ).length;

    const pendientes =
      solicitudes.filter(
        solicitud =>
          solicitud.estado ===
          "pendiente"
      ).length;

    return res.status(200).json({

      success: true,

      tipo,

      fechaInicio,

      fechaFin,

      resumen: {

        total,

        aprobadas,

        carnetsGenerados,

        rechazadas,

        pendientes

      },

      data:
        solicitudes

    });

  } catch (error) {

    console.error(
      "ERROR GENERAR REPORTE DE PETICIONES:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Error al generar el reporte",

      error:
        error.message

    });
  }
};


/* =========================================================
   ESCANEAR CARNET
========================================================= */

const escanearCarnet = async (req, res) => {

  try {

    /* =====================================================
       RECIBIR QR
    ===================================================== */

    const {
      codigoQr
    } = req.body;

    if (
      !codigoQr ||
      typeof codigoQr !== "string"
    ) {

      return res.status(400).json({

        message:
          "El código QR es obligatorio"

      });
    }

    const codigo =
      codigoQr.trim();

    if (!codigo) {

      return res.status(400).json({

        message:
          "El código QR no puede estar vacío"

      });
    }

    console.log(
      "================================================"
    );

    console.log(
      "QR ESCANEADO:",
      codigo
    );

    console.log(
      "================================================"
    );

    /* =====================================================
       BUSCAR CARNET POR QR EXACTO
       
       AQUÍ NO SE BUSCA POR USER ID.
       
       Se busca exclusivamente por:
       
       codigoQr
    ===================================================== */

    const carnet =
      await Carnet.findOne({

        where: {
          codigoQr: codigo
        },

        include: [

          {

            model: User,

            as: "user",

            attributes: [

              "id",
              "rol",
              "nombres",
              "apellidos",
              "tipoDocumento",
              "documento",
              "email",
              "celular",
              "ficha",
              "centroFormacionId",
              "fechaVinculacion",
              "fechaFinalizacion",
              "foto"

            ],

            include: [

              {

                model: CentroFormacion,

                as: "centroFormacion"

              }

            ]

          }

        ]

      });


    /* =====================================================
       CARNET NO EXISTE
    ===================================================== */

    if (!carnet) {

      console.log(
        "❌ CARNET NO ENCONTRADO"
      );

      return res.status(404).json({

        message:
          "Carnet no encontrado"

      });
    }


    /* =====================================================
       MOSTRAR QUÉ CARNET ENCONTRÓ
    ===================================================== */

    console.log(
      "✅ CARNET ENCONTRADO"
    );

    console.log(
      "ID CARNET:",
      carnet.id
    );

    console.log(
      "ID USUARIO:",
      carnet.userId
    );

    console.log(
      "ID VEHÍCULO DEL CARNET:",
      carnet.vehicleId
    );

    console.log(
      "ID SOLICITUD:",
      carnet.solicitudId
    );

    console.log(
      "QR GUARDADO:",
      carnet.codigoQr
    );


    /* =====================================================
       VALIDAR ESTADO
    ===================================================== */

    if (
      carnet.estado !== "activo"
    ) {

      return res.status(403).json({

        message:
          `El carnet está ${carnet.estado}`

      });
    }


    /* =====================================================
       VEHÍCULO EXACTO DEL CARNET
       
       IMPORTANTE:
       
       ANTES ESTABA:
       
       Vehiculo.findOne({
         where: {
           userId: carnet.userId
         }
       })
       
       Eso devolvía el primer vehículo.
       
       AHORA:
       
       carnet.vehicleId
              ↓
       Vehiculo.findByPk()
    ===================================================== */

    let vehiculo = null;

    if (carnet.vehicleId) {

      vehiculo =
        await Vehiculo.findByPk(
          carnet.vehicleId
        );
    }


    /* =====================================================
       COMPROBAR VEHÍCULO
    ===================================================== */

    if (!vehiculo) {

      console.log(
        "⚠️ EL VEHÍCULO DEL CARNET NO EXISTE"
      );

      console.log(
        "vehicleId:",
        carnet.vehicleId
      );

    } else {

      console.log(
        "=============================================="
      );

      console.log(
        "✅ VEHÍCULO DEL CARNET ENCONTRADO"
      );

      console.log(
        "ID VEHÍCULO:",
        vehiculo.id
      );

      console.log(
        "USUARIO VEHÍCULO:",
        vehiculo.userId
      );

      console.log(
        "MARCA:",
        vehiculo.marca
      );

      console.log(
        "COLOR:",
        vehiculo.color
      );

      console.log(
        "PLACA:",
        vehiculo.placa
      );

      console.log(
        "SERIAL:",
        vehiculo.serial
      );

      console.log(
        "=============================================="
      );
    }


    /* =====================================================
       ÚLTIMO REGISTRO DEL APRENDIZ
       
       Se mantiene con id_aprendiz porque
       tu modelo EntradaSalidaAprendiz trabaja
       con ese campo.
    ===================================================== */

    const ultimoRegistro =
      await EntradaSalidaAprendiz.findOne({

        where: {

          id_aprendiz:
            carnet.userId

        },

        order: [

          ["createdAt", "DESC"]

        ]

      });


    /* =====================================================
       DETERMINAR ENTRADA / SALIDA
    ===================================================== */

    let nuevoEstado;

    if (
      ultimoRegistro &&
      ultimoRegistro.estado === "dentro"
    ) {

      nuevoEstado =
        "fuera";

    } else {

      nuevoEstado =
        "dentro";

    }


    /* =====================================================
       FECHA Y HORA
    ===================================================== */

    const ahora =
      new Date();

    const fecha =
      ahora
        .toISOString()
        .split("T")[0];


    let registro;


    /* =====================================================
       ENTRADA
    ===================================================== */

    if (
      nuevoEstado === "dentro"
    ) {

      registro =
        await EntradaSalidaAprendiz.create({

          id_aprendiz:
            carnet.userId,

          id_codigo_gr:
            null,

          fecha,

          hora_entrada:
            ahora,

          hora_salida:
            null,

          estado:
            "dentro"

        });

    }


    /* =====================================================
       SALIDA
    ===================================================== */

    else {

      if (!ultimoRegistro) {

        return res.status(400).json({

          message:
            "No existe un registro de entrada abierto"

        });

      }

      await ultimoRegistro.update({

        hora_salida:
          ahora,

        estado:
          "fuera"

      });

      await ultimoRegistro.reload();

      registro =
        ultimoRegistro;

    }


    /* =====================================================
       RESPUESTA
       
       IMPORTANTE:
       
       Aquí devolvemos:
       
       carnet.vehicleId
       
       y el vehículo encontrado mediante
       ese vehicleId.
    ===================================================== */

    return res.status(200).json({

      message:
        nuevoEstado === "dentro"
          ? "Entrada registrada correctamente"
          : "Salida registrada correctamente",

      tipo:
        nuevoEstado === "dentro"
          ? "entrada"
          : "salida",

      estado:
        nuevoEstado,

      registro: {

        id:
          registro.id,

        id_aprendiz:
          registro.id_aprendiz,

        fecha:
          registro.fecha,

        hora_entrada:
          registro.hora_entrada,

        hora_salida:
          registro.hora_salida,

        estado:
          registro.estado

      },

      /* =================================================
         CARNET EXACTAMENTE ESCANEADO
      ================================================= */

      carnet: {

        id:
          carnet.id,

        userId:
          carnet.userId,

        vehicleId:
          carnet.vehicleId,

        solicitudId:
          carnet.solicitudId,

        estado:
          carnet.estado,

        codigoQr:
          carnet.codigoQr

      },

      /* =================================================
         USUARIO DEL CARNET
      ================================================= */

      user:

        carnet.user
          ? {

              id:
                carnet.user.id,

              rol:
                carnet.user.rol,

              nombres:
                carnet.user.nombres,

              apellidos:
                carnet.user.apellidos,

              tipoDocumento:
                carnet.user.tipoDocumento,

              documento:
                carnet.user.documento,

              email:
                carnet.user.email,

              celular:
                carnet.user.celular,

              ficha:
                carnet.user.ficha,

              centroFormacionId:
                carnet.user
                  .centroFormacionId,

              centroFormacion:
                carnet.user
                  .centroFormacion,

              fechaVinculacion:
                carnet.user
                  .fechaVinculacion,

              fechaFinalizacion:
                carnet.user
                  .fechaFinalizacion,

              foto:
                carnet.user.foto

            }

          : null,

      /* =================================================
         VEHÍCULO EXACTAMENTE RELACIONADO
         CON EL CARNET ESCANEADO
      ================================================= */

      vehiculo:

        vehiculo
          ? {

              id:
                vehiculo.id,

              userId:
                vehiculo.userId,

              foto_principal:
                vehiculo.foto_principal,

              foto_secundaria:
                vehiculo.foto_secundaria,

              tipo:
                vehiculo.tipo,

              marca:
                vehiculo.marca,

              color:
                vehiculo.color,

              serial:
                vehiculo.serial,

              placa:
                vehiculo.placa,

              modelo:
                vehiculo.modelo,

              cilindraje:
                vehiculo.cilindraje

            }

          : null

    });

  } catch (error) {

    console.error(
      "=============================================="
    );

    console.error(
      "ERROR ESCANEAR CARNET:",
      error
    );

    console.error(
      "=============================================="
    );

    return res.status(500).json({

      message:
        "Error al escanear el carnet",

      error:
        error.message

    });

  }

};


/* =========================================================
   EXPORTAR
========================================================= */

module.exports = {

  generarCarnet,

  obtenerMiCarnet,

  obtenerPendientes,

  obtenerReportePeticiones,

  escanearCarnet

};

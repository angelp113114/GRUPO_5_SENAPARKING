const QRCode = require("qrcode");
const Carnet = require("../models/Carnet");

/* =========================================================
   GENERAR O CREAR CARNET
========================================================= */

const generarOCrearCarnet = async (
  userId,
  solicitudId = null
) => {

  /* =========================
     VALIDAR USER ID
  ========================= */

  if (
    !Number.isInteger(Number(userId)) ||
    Number(userId) <= 0
  ) {
    throw new Error(
      "El ID del usuario no es válido"
    );
  }

  const idUsuario = Number(userId);


  /* =========================
     VALIDAR SOLICITUD
  ========================= */

  if (
    !Number.isInteger(Number(solicitudId)) ||
    Number(solicitudId) <= 0
  ) {
    throw new Error(
      "Se necesita una solicitud válida para crear el carnet"
    );
  }

  const idSolicitud = Number(solicitudId);


  /* =====================================================
     BUSCAR CARNET DE ESTA SOLICITUD
     
     IMPORTANTE:
     NO buscar solamente por userId.
     
     Un usuario puede tener varios carnets.
     
     Ejemplo:
     
     Usuario 7
       solicitud 1 → carnet 1
       solicitud 2 → carnet 2
       solicitud 3 → carnet 3
     
     Solo se considera existente el carnet
     correspondiente a ESTA solicitud.
  ===================================================== */

  const carnetExistente =
    await Carnet.findOne({
      where: {
        userId: idUsuario,
        solicitudId: idSolicitud
      }
    });


  /* =====================================================
     SI ESTA SOLICITUD YA TIENE CARNET
     
     No crear otro para la misma solicitud.
  ===================================================== */

  if (carnetExistente) {

    const qrImage =
      await QRCode.toDataURL(
        carnetExistente.codigoQr
      );

    return {
      carnet: carnetExistente,
      qrImage
    };

  }


  /* =====================================================
     GENERAR QR ÚNICO
  ===================================================== */

  const codigoQr =
    `SENA-${idUsuario}-${Date.now()}-${idSolicitud}`;


  const qrImage =
    await QRCode.toDataURL(
      codigoQr
    );


  /* =====================================================
     CREAR NUEVO CARNET
  ===================================================== */

  const carnet =
    await Carnet.create({

      userId:
        idUsuario,

      solicitudId:
        idSolicitud,

      codigoQr,

      estado:
        "activo"

    });


  /* =========================
     RESULTADO
  ========================= */

  return {
    carnet,
    qrImage
  };

};


module.exports =
  generarOCrearCarnet;
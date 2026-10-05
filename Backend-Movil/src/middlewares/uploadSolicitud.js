const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination(req, file, cb) {

    if (file.fieldname === "fotoNueva") {
      cb(null, "uploads/solicitudes");
    } else {
      cb(null, "uploads/documentos");
    }

  },

  filename(req, file, cb) {
    cb(
      null,
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000) +
      path.extname(file.originalname)
    );
  }
});

module.exports = multer({
  storage
});
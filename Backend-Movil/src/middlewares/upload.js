const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ============================================================
// CREAR CARPETA UPLOADS SI NO EXISTE
// ============================================================

const uploadPath = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

// ============================================================
// CONFIGURACIÓN DEL ALMACENAMIENTO
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    const nombreArchivo =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, nombreArchivo);
  },
});

// ============================================================
// TIPOS DE ARCHIVO PERMITIDOS
// ============================================================

const tiposPermitidos = [
  // Imágenes
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",

  // PDF
  "application/pdf",

  // Word
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  // Excel
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  // Texto
  "text/plain",
];

// ============================================================
// VALIDACIÓN DE ARCHIVOS
// ============================================================

const fileFilter = (req, file, cb) => {
  if (!tiposPermitidos.includes(file.mimetype)) {
    console.log("ARCHIVO RECHAZADO:");
    console.log("Nombre:", file.originalname);
    console.log("Tipo:", file.mimetype);

    return cb(
      new Error(
        `Tipo de archivo no permitido: ${file.mimetype}`
      ),
      false
    );
  }

  cb(null, true);
};

// ============================================================
// CONFIGURACIÓN DE MULTER
// ============================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    // Máximo 10 MB por archivo
    fileSize: 10 * 1024 * 1024,

    // Máximo 20 archivos por solicitud
    files: 20,
  },
});

module.exports = upload;
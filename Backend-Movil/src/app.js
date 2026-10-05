require("dotenv").config();


const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/database");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* MODELOS */
require("./models");

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ],
    credentials: true,
  })
);

/* COOKIES */
app.use(cookieParser());

/* BODY PARSER */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ARCHIVOS ESTÁTICOS */
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"))
);

/* RUTAS */
app.use("/auth", require("./routers/authRouter"));

app.use("/api", require("./routers/tipoDocumentoRouter"));
app.use("/api", require("./routers/entradaSalidaAprendizRouter"));
app.use("/api", require("./routers/centroFormacionRouter"));
app.use("/api", require("./routers/notificacionRouter"));
app.use("/api", require("./routers/soporteRouter"));

app.use(
  "/api/carnet",
  require("./routers/carnetRouter")
);

app.use(
  "/api/vehiculos",
  require("./routers/vehiculoRouter")
);

app.use(
  "/api",
  require("./routers/aprendiz/solicitudCarnetRouter")
);

app.use(
  "/api",
  require("./routers/aprendiz/solicitudActualizacionRouter")
);

app.use(
  "/api",
  require("./routers/aprendiz/reportesRouter")
);

app.use(
  "/api",
  require("./routers/reportesRouter")
);

/* BASE DE DATOS */
sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ DB conectada");

    // IMPORTANTE:
    // No usar alter: true porque estaba creando índices duplicados.
    await sequelize.sync();

    console.log("✅ Tablas sincronizadas");
  })
  .catch((err) => {
    console.error("❌ Error de base de datos:", err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
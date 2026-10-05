const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",

    info: {
      title: "SENAPARKING API",
      version: "1.0.0",
      description: "Documentación de la API del sistema SENAPARKING",
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: ["./src/routers/**/*.js"],
});

module.exports = swaggerSpec;
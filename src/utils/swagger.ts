import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Certix API",
      version: "1.0.0",
      description: "Certix API documentation",
    },
  },
  apis: ["./src/routes/*.ts"],
};
export const swaggerDocs = swaggerJsdoc(swaggerOptions);

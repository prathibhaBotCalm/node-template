import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { join } from "path";
import swaggerUi from "swagger-ui-express";
import { APPLICATION } from "./config/app.conf";
import { corsOptions } from "./config/cors.conf";
import { connectDb } from "./config/db.conf";
import routes from "./routes";
import { swaggerDocs } from "./utils/swagger";

const app = express();

const isProduction = APPLICATION.NODE_ENV === "production";

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: isProduction ? undefined : false,
  }),
);
app.use(cors(corsOptions));

// Logging middleware - use 'combined' format in production for more details
app.use(morgan(isProduction ? "combined" : "dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(join(__dirname, "public")));

// Welcome page route
app.get("/", (req: Request, res: Response) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// API routes
app.use("/api", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "error",
    message: "Resource not found",
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(`[ERROR] ${err.stack || err.message}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    status: "error",
    message: isProduction ? "Internal server error" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
    ...(process.env.NODE_ENV === "development" ? { path: req.path } : {}),
  });
});

// Start the server with error handling
const server = app.listen(APPLICATION.PORT, () => {
  try {
    connectDb();
    console.log(
      `🚀 Server running in ${APPLICATION.NODE_ENV} mode on http://localhost:${APPLICATION.PORT}`,
    );
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
});

// Handle shutdown gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

export default app;

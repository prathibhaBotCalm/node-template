import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const logDirPath = "./logs";

const logger = createLogger({
  defaultMeta: { service: "token-service" },
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json(),
    format.metadata(),
    format.prettyPrint(),
  ),
  transports: [
    // Info log rotation
    new transports.DailyRotateFile({
      level: "info",
      dirname: `${logDirPath}/info`, // Directory for info logs
      filename: "info-%DATE%.log", // Log filename with date pattern
      datePattern: "YYYY-MM-DD", // Rotate daily
      maxSize: "20m", // Maximum file size before rotation
      maxFiles: "14d", // Keep logs for 14 days
      zippedArchive: true, // Compress old log files
    }),
    // Warn log rotation
    new transports.DailyRotateFile({
      level: "warn",
      dirname: `${logDirPath}/warn`, // Directory for warning logs
      filename: "warn-%DATE%.log", // Log filename with date pattern
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true,
    }),
    // Error log rotation
    new transports.DailyRotateFile({
      level: "error",
      dirname: `${logDirPath}/error`, // Directory for error logs
      filename: "error-%DATE%.log", // Log filename with date pattern
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d", // Keep error logs for 30 days
      zippedArchive: true,
    }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;

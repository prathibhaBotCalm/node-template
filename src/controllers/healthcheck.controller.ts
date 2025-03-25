import { RequestHandler } from "express";
import mongoose from "mongoose";

export const healthHandler: RequestHandler = async (req, res) => {
  try {
    const dbStatus: "connected" | "disconnected" =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    res.status(200).json({
      status: "success",
      message: "API is healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: { status: dbStatus },
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: process.env.NODE_ENV === "production" ? undefined : String(error),
    });
  }
};

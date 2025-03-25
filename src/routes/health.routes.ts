import { Router } from "express";
import { healthHandler } from "../controllers/healthcheck.controller";

const router = Router();
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check API
 *     description: Check the status of the API and database connection.
 *     responses:
 *       200:
 *         description: API health is good
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: API is healthy
 *                 timestamp:
 *                   type: string
 *                   example: "2025-02-25T09:08:00Z"
 *                 environment:
 *                   type: string
 *                   example: development
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *       500:
 *         description: Health check failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Health check failed
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */
router.get("/", healthHandler);

export default router;

import { RequestHandler, Router } from "express";

const router = Router();

const pingHandler: RequestHandler = (req, res) => {
  res.json({ message: "Pong!" });
};

router.get("/ping", pingHandler);

export default router;

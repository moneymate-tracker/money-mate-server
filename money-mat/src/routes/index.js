import { Router } from "express";
import healthCheckRouter from "./healthcheck.routes.js";
import authRouter from "./auth.routes.js";

const router = Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/auth", authRouter);

export default router;

import { Router } from "express";
import healthCheckRouter from "./healthcheck.routes.js";
import authRouter from "./auth.routes.js";
import profileRouter from "./profile.routes.js";
import categoryRouter from "./category.routes.js";
import transactionRouter from "./transaction.routes.js";
import budgetRouter from "./budget.routes.js";
import analyticsRouter from "./analytics.routes.js";

const router = Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/auth", authRouter);
router.use("/profile", profileRouter);
router.use("/categories", categoryRouter);
router.use("/transactions", transactionRouter);
router.use("/budgets", budgetRouter);
router.use("/analytics", analyticsRouter);

export default router;

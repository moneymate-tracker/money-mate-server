import { Router } from "express";
import {
  getMonthlySummary,
  getMonthlyTrend,
  getCategoryBreakdown,
} from "../controllers/analytics.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.route("/summary").get(getMonthlySummary);
router.route("/monthly-trend").get(getMonthlyTrend);
router.route("/category-breakdown").get(getCategoryBreakdown);

export default router;

import { Router } from "express";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createBudgetValidator,
  updateBudgetValidator,
} from "../validators/budget.validators.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getBudgets)
  .post(createBudgetValidator(), validate, createBudget);

router
  .route("/:budgetId")
  .patch(updateBudgetValidator(), validate, updateBudget)
  .delete(deleteBudget);

export default router;

import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createTransactionValidator,
  updateTransactionValidator,
} from "../validators/transaction.validators.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getTransactions)
  .post(createTransactionValidator(), validate, createTransaction);

router
  .route("/:transactionId")
  .get(getTransactionById)
  .patch(updateTransactionValidator(), validate, updateTransaction)
  .delete(deleteTransaction);

export default router;

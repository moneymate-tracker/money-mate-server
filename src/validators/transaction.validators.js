import { body } from "express-validator";

const createTransactionValidator = () => [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["expense", "income"])
    .withMessage("Type must be 'expense' or 'income'"),
  body("categoryId")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be 200 characters or less"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("month")
    .notEmpty()
    .withMessage("Month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be between 2000 and 2100"),
];

const updateTransactionValidator = () => [
  body("categoryId")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID"),
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be greater than 0"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be 200 characters or less"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
  body("year")
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage("Year must be between 2000 and 2100"),
];

export { createTransactionValidator, updateTransactionValidator };

import { body } from "express-validator";

const createBudgetValidator = () => [
  body("categoryId")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category ID"),
  body("budget")
    .notEmpty()
    .withMessage("Budget amount is required")
    .isFloat({ min: 0 })
    .withMessage("Budget must be 0 or greater"),
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

const updateBudgetValidator = () => [
  body("budget")
    .notEmpty()
    .withMessage("Budget amount is required")
    .isFloat({ min: 0 })
    .withMessage("Budget must be 0 or greater"),
];

export { createBudgetValidator, updateBudgetValidator };

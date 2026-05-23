import { body } from "express-validator";

const createCategoryValidator = () => [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ max: 50 })
    .withMessage("Category name must be 50 characters or less"),
  body("icon")
    .trim()
    .notEmpty()
    .withMessage("Icon name is required"),
  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required")
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex code (e.g. #FF6B6B)"),
  body("bg")
    .trim()
    .notEmpty()
    .withMessage("Background color is required")
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Background must be a valid hex code"),
];

const updateCategoryValidator = () => [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Category name must be 1–50 characters"),
  body("icon").optional().trim().notEmpty().withMessage("Icon cannot be empty"),
  body("color")
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex code"),
  body("bg")
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Background must be a valid hex code"),
];

export { createCategoryValidator, updateCategoryValidator };

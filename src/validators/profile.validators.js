import { body } from "express-validator";

const ALLOWED_CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "SAR", "CAD", "AUD"];

const updateProfileValidator = () => [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Full name must be between 2 and 60 characters"),
  body("phone")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("currency")
    .optional()
    .trim()
    .toUpperCase()
    .isIn(ALLOWED_CURRENCIES)
    .withMessage(`Currency must be one of: ${ALLOWED_CURRENCIES.join(", ")}`),
];

export { updateProfileValidator };

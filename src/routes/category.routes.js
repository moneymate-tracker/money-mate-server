import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validators/category.validators.js";

const router = Router();

// Public — returns system categories; also merges user categories if token is present
router.route("/").get((req, res, next) => {
  // Optionally attach user if token present, but don't block unauthenticated requests
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    return verifyJWT(req, res, () => getCategories(req, res, next));
  }
  return getCategories(req, res, next);
});

// Protected routes
router.use(verifyJWT);

router.route("/").post(createCategoryValidator(), validate, createCategory);

router
  .route("/:categoryId")
  .patch(updateCategoryValidator(), validate, updateCategory)
  .delete(deleteCategory);

export default router;

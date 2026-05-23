import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { updateProfileValidator } from "../validators/profile.validators.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getProfile).patch(updateProfileValidator(), validate, updateProfile);

export default router;

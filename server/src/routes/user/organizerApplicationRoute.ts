import { Router } from "express";
import organizerApplicationController from "../../controllers/user/organizerApplicationController.js";
import authentication from "../../middlewares/authentication.js";
import requireCompleteProfile from "../../middlewares/requireCompleteProfile.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { applyOrganizerSchema } from "../../validations/organizerApplication.schema.js";

const router = Router();
router.use(authentication, requireCompleteProfile);

const { apply, me } = organizerApplicationController;

router.route("/").post(validateBody(applyOrganizerSchema), apply);
router.route("/me").get(me);

export default router;

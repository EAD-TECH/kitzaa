import { Router } from "express";
import institutionController from "../../controllers/user/institutionController.js";
import authentication from "../../middlewares/authentication.js";
import { isOrganizer } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { updateInstitutionSchema } from "../../validations/institution.schema.js";

const router = Router();
router.use(authentication, isOrganizer);

const { me, update } = institutionController;

router.route("/me").get(me).put(validateBody(updateInstitutionSchema), update);

export default router;

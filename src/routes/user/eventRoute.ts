import { Router } from "express";
import eventController from "../../controllers/user/eventController.js";
import authentication from "../../middlewares/authentication.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { createEventSchema, updateEventSchema } from "../../validations/event.schema.js";

const router = Router();
router.use(authentication);

const { list, read, create, update, deletee, join, leave, like, myEvents, myParticipations } = eventController;

router.route("/").get(list).post(validateBody(createEventSchema), create);
router.route("/my-events").get(myEvents);
router.route("/my-participations").get(myParticipations);
router.route("/:slug").get(read);
router.route("/:id").put(validateBody(updateEventSchema), update).delete(deletee);
router.route("/:id/join").post(join);
router.route("/:id/leave").post(leave);
router.route("/:id/like").post(like);

export default router;

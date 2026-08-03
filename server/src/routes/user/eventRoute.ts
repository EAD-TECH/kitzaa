import { Router } from "express";
import Event from "../../models/eventModel.js";
import eventController from "../../controllers/user/eventController.js";
import authentication from "../../middlewares/authentication.js";
import { isOwnerOrAdmin } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectIdParam } from "../../middlewares/validateObjectId.js";
import { cancelEventSchema, createEventSchema, nearbyQuerySchema, updateEventSchema } from "../../validations/event.schema.js";
import { validateQuery } from "../../middlewares/validateQuery.js";

const router = Router();
router.use(authentication);
router.param('id', validateObjectIdParam);

const { list, read, create, update, deletee, join, leave, toggleLike, myEvents, myParticipations, participants, nearby } = eventController;

router.route("/").get(list).post(validateBody(createEventSchema), create);
router.route("/my-events").get(myEvents);
router.route("/my-participations").get(myParticipations);
router.route("/nearby").get(validateQuery(nearbyQuerySchema), nearby);
router.route("/:slug").get(read);
router.route("/:id").put(isOwnerOrAdmin(Event), validateBody(updateEventSchema), update).delete(isOwnerOrAdmin(Event), validateBody(cancelEventSchema), deletee);
router.route("/:id/participants").get(isOwnerOrAdmin(Event), participants);
router.route("/:id/join").post(join);
router.route("/:id/leave").post(leave);
router.route("/:id/like").post(toggleLike);

export default router;

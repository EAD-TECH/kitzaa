import { Router } from "express";
import Event from "../../models/eventModel.js";
import eventController from "../../controllers/user/eventController.js";
import authentication from "../../middlewares/authentication.js";
import { isOwnerOrAdmin } from "../../middlewares/permissions.js";
import { validateBody } from "../../middlewares/validateBody.js";
import { validateObjectIdParam } from "../../middlewares/validateObjectId.js";
import { cancelEventSchema, createEventSchema, joinEventSchema, nearbyQuerySchema, updateEventSchema } from "../../validations/event.schema.js";
import { validateQuery } from "../../middlewares/validateQuery.js";

const router = Router();
router.param('id', validateObjectIdParam);

const { list, read, create, update, deletee, join, leave, toggleLike, myEvents, myParticipations, participants, nearby, toggleSave } = eventController;

// ---- Authentication istemeyen route'lar (public — sadece status:"approved" event döner) ----
router.route("/").get(list);
router.route("/nearby").get(validateQuery(nearbyQuerySchema), nearby);


router.route("/my-events").get(authentication, myEvents);
router.route("/my-participations").get(authentication, myParticipations);

router.route("/:slug").get(read);

// authentication i
router.use(authentication);

router.route("/").post(validateBody(createEventSchema), create);
router.route("/:id").put(isOwnerOrAdmin(Event), validateBody(updateEventSchema), update).delete(isOwnerOrAdmin(Event), validateBody(cancelEventSchema), deletee);
router.route("/:id/participants").get(isOwnerOrAdmin(Event), participants);
router.route("/:id/join").post(validateBody(joinEventSchema), join);
router.route("/:id/leave").post(leave);
router.route("/:id/like").post(toggleLike);
router.route("/:id/Save").post(toggleSave);

export default router;

import { Router } from "express";
import authentication from "../../middlewares/authentication.js";
import { isAdmin } from "../../middlewares/permissions.js";
import { validateObjectIdParam } from "../../middlewares/validateObjectId.js";
import adminDashboardController from "../../controllers/admin/dashboardController.js";

const router = Router();
router.use(authentication, isAdmin);
router.param("id", validateObjectIdParam);

const { summary } = adminDashboardController;

router.get("/", summary);

export default router;

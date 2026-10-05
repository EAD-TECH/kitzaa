import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import aiEventSearchController from "../../controllers/ai/ai.controller.js";

const router = Router();

const aiSearchRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many AI searches. Please try again later.",
  },
});

router.post(
  "/event-search",
  aiSearchRateLimit,
  aiEventSearchController.aiEventSearch,
);

export default router;
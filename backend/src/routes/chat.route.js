import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = Router();

router.get("/token", protectRoute, getStreamToken);
// to start chat and video call streamtoken is needed 

export default router;

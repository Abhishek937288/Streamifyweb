import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getAllFriendRequests,
  getAllSentReqs,
} from "../controllers/user.controller.js";
const router = Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getAllFriendRequests);
router.get("/outgoing-friend-requests", getAllSentReqs);

export default router;

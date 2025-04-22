import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateSocials,
  searchUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/search", verifyToken, searchUsers);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id/social/:social", verifyToken, updateSocials);

export default router;

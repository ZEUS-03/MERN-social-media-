import express from "express";
import {
  createComment,
  getCommentsByPost,
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* Comments */
router.post("/:postId/comment", verifyToken, createComment);
router.get("/:postId/comments", getCommentsByPost);

export default router;

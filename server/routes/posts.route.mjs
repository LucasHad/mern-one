import express from "express";

import {
  getFeedPosts,
  createPost,
  likePost,
  getUserPosts,
} from "../controllers/posts.controller.mjs";
import { verifyToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts);

router.get("/:userId/posts", verifyToken, getUserPosts);

router.patch("/:id/like", verifyToken, likePost);

export default router;

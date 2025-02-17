import express from "express";
import {
  addRemoveFriend,
  getUser,
  getUserFriends,
} from "../controllers/users.controller.mjs";
import { verifyToken } from "../middleware/authMiddleware.mjs";

const router = express.Router();

// READ
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

// UPDATE

router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;

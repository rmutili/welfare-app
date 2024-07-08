import express from "express";
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById
} from "../controllers/userController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(getUsers); // This will be used to register a new user
router.route("/:id").delete(deleteUser).get(getUserById).put(updateUser);
router.route("/login").post(authUser);
router.route("/profile/:id").get(protect, getUserProfile);
router.route("/profile").get(getUserProfile).put(updateUserProfile);
// router.route("/profile/:id").get(protect, getUserProfile);

export default router;

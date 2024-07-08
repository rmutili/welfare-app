import express from "express";
import {
  createEvent,
  getEvents,
  getEventById
} from "../controllers/eventController.js";
import { protect } from "../middlewares/authMiddleware.js ";

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", getEvents);
router.get("/:id", protect, getEventById);

export default router;

import express from "express";
import {
  createContribution,
  getAllContributions,
  getContributionsByEvent,
  getContributionById,
  updateContribution,
  deleteContribution
} from "../controllers/contributionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createContribution)
  .get(protect, getAllContributions);

router.route("/event/:eventId").get(protect, getContributionsByEvent);

router
  .route("/:id")
  .get(protect, getContributionById)
  .put(protect, updateContribution)
  .delete(protect, deleteContribution);

export default router;

import express from "express";
import {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration,
  getRegistrationStats,
  getAllRegistrations,
} from "../controllers/brainGames.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

// Public route - Submit registration
router.post("/", createRegistration);

// Admin routes - Protected
router.get("/", verifyToken, verifyAdmin, getRegistrations);
router.get("/all", verifyToken, verifyAdmin, getAllRegistrations);
router.get("/stats", verifyToken, verifyAdmin, getRegistrationStats);
router.get("/:id", verifyToken, verifyAdmin, getRegistrationById);
router.patch("/:id/status", verifyToken, verifyAdmin, updateRegistrationStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteRegistration);

export default router;

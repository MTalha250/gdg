import express from "express";
import {
  createRegistration,
  getRegistrations,
  getAllRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration,
  getStats,
} from "../controllers/coderush.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

// Public
router.post("/", createRegistration);

// Protected
router.get("/", verifyToken, verifyAdmin, getRegistrations);
router.get("/all", verifyToken, verifyAdmin, getAllRegistrations);
router.get("/stats", verifyToken, verifyAdmin, getStats);
router.get("/:id", verifyToken, verifyAdmin, getRegistrationById);
router.patch("/:id/status", verifyToken, verifyAdmin, updateRegistrationStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteRegistration);

export default router;

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
import verifyAdminOrMarketer from "../middlewares/verifyAdminOrMarketer.js";

const router = express.Router();

// Public
router.post("/", createRegistration);

// Admin or Marketer (read + status updates)
router.get("/", verifyToken, verifyAdminOrMarketer, getRegistrations);
router.get("/all", verifyToken, verifyAdminOrMarketer, getAllRegistrations);
router.get("/stats", verifyToken, verifyAdminOrMarketer, getStats);
router.get("/:id", verifyToken, verifyAdminOrMarketer, getRegistrationById);
router.patch("/:id/status", verifyToken, verifyAdminOrMarketer, updateRegistrationStatus);

// Admin only (destructive)
router.delete("/:id", verifyToken, verifyAdmin, deleteRegistration);

export default router;

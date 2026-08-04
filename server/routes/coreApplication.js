import express from "express";
import {
  getFormConfig,
  createApplication,
  getApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getStats,
} from "../controllers/coreApplication.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

// Public
router.get("/config", getFormConfig);
router.post("/", createApplication);

// Admin only
router.get("/", verifyToken, verifyAdmin, getApplications);
router.get("/all", verifyToken, verifyAdmin, getAllApplications);
router.get("/stats", verifyToken, verifyAdmin, getStats);
router.get("/:id", verifyToken, verifyAdmin, getApplicationById);
router.patch("/:id/status", verifyToken, verifyAdmin, updateApplicationStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteApplication);

export default router;

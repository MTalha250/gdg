import express from "express";
import {
  createRecruitment,
  getRecruitments,
  getRecruitmentById,
  updateRecruitmentStatus,
  deleteRecruitment,
  getRecruitmentStats,
  bulkUpdateRecruitments,
  getAllEmails,
  getAllRecruitments,
} from "../controllers/recruitment.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Public routes
router.post("/", createRecruitment);

// Protected routes (Admin only)
router.get("/", verifyToken, verifyAdmin, getRecruitments);
router.get("/all", verifyToken, verifyAdmin, getAllRecruitments);
router.get("/stats", verifyToken, verifyAdmin, getRecruitmentStats);
router.get("/emails", verifyToken, verifyAdmin, getAllEmails);
router.get("/:id", verifyToken, verifyAdmin, getRecruitmentById);
router.patch("/:id/status", verifyToken, verifyAdmin, updateRecruitmentStatus);
router.patch("/bulk-update", verifyToken, verifyAdmin, bulkUpdateRecruitments);
router.delete("/:id", verifyToken, verifyAdmin, deleteRecruitment);

export default router;

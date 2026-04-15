import express from "express";
import {
  createAmbassador,
  getAmbassadors,
  getAmbassadorById,
  updateAmbassadorStatus,
  deleteAmbassador,
} from "../controllers/ambassador.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyAdminOrMarketer from "../middlewares/verifyAdminOrMarketer.js";

const router = express.Router();

// Public
router.post("/", createAmbassador);

// Admin or Marketer (read + status updates)
router.get("/", verifyToken, verifyAdminOrMarketer, getAmbassadors);
router.get("/:id", verifyToken, verifyAdminOrMarketer, getAmbassadorById);
router.patch("/:id/status", verifyToken, verifyAdminOrMarketer, updateAmbassadorStatus);

// Admin only (destructive)
router.delete("/:id", verifyToken, verifyAdmin, deleteAmbassador);

export default router;

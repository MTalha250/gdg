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
// Admin only (mutations)
router.patch("/:id/status", verifyToken, verifyAdmin, updateAmbassadorStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteAmbassador);

export default router;

import express from "express";
import {
  createPartner,
  getPartners,
  getPartnerById,
  updatePartnerStatus,
  deletePartner,
} from "../controllers/partner.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyAdminOrMarketer from "../middlewares/verifyAdminOrMarketer.js";

const router = express.Router();

// Public
router.post("/", createPartner);

// Admin or Marketer (read + status updates)
router.get("/", verifyToken, verifyAdminOrMarketer, getPartners);
router.get("/:id", verifyToken, verifyAdminOrMarketer, getPartnerById);
// Admin only (mutations)
router.patch("/:id/status", verifyToken, verifyAdmin, updatePartnerStatus);
router.delete("/:id", verifyToken, verifyAdmin, deletePartner);

export default router;

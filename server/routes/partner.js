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

const router = express.Router();

// Public
router.post("/", createPartner);

// Protected
router.get("/", verifyToken, verifyAdmin, getPartners);
router.get("/:id", verifyToken, verifyAdmin, getPartnerById);
router.patch("/:id/status", verifyToken, verifyAdmin, updatePartnerStatus);
router.delete("/:id", verifyToken, verifyAdmin, deletePartner);

export default router;

import express from "express";
import {
  createSponsor,
  getSponsors,
  getSponsorById,
  updateSponsorStatus,
  deleteSponsor,
} from "../controllers/sponsor.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

// Public
router.post("/", createSponsor);

// Protected
router.get("/", verifyToken, verifyAdmin, getSponsors);
router.get("/:id", verifyToken, verifyAdmin, getSponsorById);
router.patch("/:id/status", verifyToken, verifyAdmin, updateSponsorStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteSponsor);

export default router;

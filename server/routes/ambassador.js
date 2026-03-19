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

const router = express.Router();

// Public
router.post("/", createAmbassador);

// Protected
router.get("/", verifyToken, verifyAdmin, getAmbassadors);
router.get("/:id", verifyToken, verifyAdmin, getAmbassadorById);
router.patch("/:id/status", verifyToken, verifyAdmin, updateAmbassadorStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteAmbassador);

export default router;

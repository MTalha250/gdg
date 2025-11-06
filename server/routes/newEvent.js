import express from "express";
import {
  createNewEvent,
  getAllEvents,
  getEvent,
  deleteEvent,
  acceptApplication,
  rejectApplication,
} from "../controllers/newEvent.js";

import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", createNewEvent);

router.patch("/:id/accept", verifyToken, verifyAdmin, acceptApplication);
router.patch("/:id/reject", verifyToken, verifyAdmin, rejectApplication);

router.get("/", verifyToken, verifyAdmin, getAllEvents);
router.get("/:id", verifyToken, verifyAdmin, getEvent);
router.delete("/:id", verifyToken, verifyAdmin, deleteEvent);

export default router;

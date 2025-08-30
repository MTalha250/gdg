import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getLatestEvents,
  searchEvents,
} from "../controllers/event.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/latest", getLatestEvents);
router.get("/search", searchEvents);
router.get("/:id", getEventById);

// Protected routes (Admin only)
router.post("/", verifyToken, verifyAdmin, createEvent);
router.put("/:id", verifyToken, verifyAdmin, updateEvent);
router.delete("/:id", verifyToken, verifyAdmin, deleteEvent);

export default router;

import express from "express";
import { createContact, getContacts } from "../controllers/contact.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", createContact);
router.get("/", verifyToken, verifyAdmin, getContacts);

export default router;

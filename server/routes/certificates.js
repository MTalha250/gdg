import express from "express";
import { sendCertificates } from "../controllers/certificates.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/send", verifyToken, verifyAdmin, sendCertificates);

export default router;

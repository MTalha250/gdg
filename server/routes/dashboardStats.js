import express from "express";
import { getDashboardStats } from "../controllers/dashboardStats.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getDashboardStats);

export default router;

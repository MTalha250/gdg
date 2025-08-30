import express from "express";
import {
  createAdmin,
  loginAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  updateAdminByToken,
  deleteAdmin,
  updatePassword,
  getAdminById,
} from "../controllers/admin.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/register", verifyToken, verifyAdmin, createAdmin);
router.post("/login", loginAdmin);
router.get("/", verifyToken, verifyAdmin, getAdmins);
router.get("/by-token", verifyToken, getAdmin);
router.get("/:id", verifyToken, verifyAdmin, getAdminById);
router.put("/by-token", verifyToken, updateAdminByToken);
router.put("/:id", verifyToken, verifyAdmin, updateAdmin);
router.put("/:id/change-password", verifyToken, verifyAdmin, updatePassword);
router.delete("/:id", verifyToken, verifyAdmin, deleteAdmin);

export default router;

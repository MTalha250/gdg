import express from "express";
import {
  validateVoucher,
  getVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  toggleVoucherStatus,
  deleteVoucher,
} from "../controllers/voucher.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import verifyAdminOrMarketer from "../middlewares/verifyAdminOrMarketer.js";

const router = express.Router();

// Public — called from registration form to preview discount
router.post("/validate", validateVoucher);

// Admin or Marketer (read)
router.get("/", verifyToken, verifyAdminOrMarketer, getVouchers);
router.get("/:id", verifyToken, verifyAdminOrMarketer, getVoucherById);

// Admin only (mutations)
router.post("/", verifyToken, verifyAdmin, createVoucher);
router.put("/:id", verifyToken, verifyAdmin, updateVoucher);
router.patch("/:id/toggle", verifyToken, verifyAdmin, toggleVoucherStatus);
router.delete("/:id", verifyToken, verifyAdmin, deleteVoucher);

export default router;

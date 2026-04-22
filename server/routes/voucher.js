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
import verifyAdminOrMarketer from "../middlewares/verifyAdminOrMarketer.js";

const router = express.Router();

// Public — called from registration form to preview discount
router.post("/validate", validateVoucher);

// Admin or Marketer (full access)
router.get("/", verifyToken, verifyAdminOrMarketer, getVouchers);
router.get("/:id", verifyToken, verifyAdminOrMarketer, getVoucherById);
router.post("/", verifyToken, verifyAdminOrMarketer, createVoucher);
router.put("/:id", verifyToken, verifyAdminOrMarketer, updateVoucher);
router.patch("/:id/toggle", verifyToken, verifyAdminOrMarketer, toggleVoucherStatus);
router.delete("/:id", verifyToken, verifyAdminOrMarketer, deleteVoucher);

export default router;

import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    // 'global' applies to all competitions, 'specific' applies to listed ones
    scope: {
      type: String,
      enum: ["global", "specific"],
      default: "global",
    },
    competitions: {
      type: [String],
      enum: [
        "competitive-programming",
        "web-development",
        "app-development",
        "ui-ux",
        "robotics",
        "game-jam",
        "machine-learning",
      ],
      default: [],
    },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      default: null, // null = no expiry
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

voucherSchema.index({ code: 1 });
voucherSchema.index({ isActive: 1 });

const Voucher = mongoose.model("Voucher", voucherSchema);

export default Voucher;

import Voucher from "../models/voucher.js";
import { REGULAR_FEES } from "../models/coderush.js";

// Validate & preview a voucher (public — called from registration form)
export const validateVoucher = async (req, res) => {
  try {
    const { code, competition } = req.body;

    if (!code || !competition) {
      return res
        .status(400)
        .json({ message: "Voucher code and competition are required" });
    }

    const voucher = await Voucher.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!voucher) {
      return res
        .status(404)
        .json({ message: "Invalid or inactive voucher code" });
    }

    // Check expiry
    if (voucher.expiryDate && new Date() > new Date(voucher.expiryDate)) {
      return res.status(400).json({ message: "This voucher has expired" });
    }

    // Check usage limit
    if (
      voucher.usageLimit !== null &&
      voucher.usedCount >= voucher.usageLimit
    ) {
      return res
        .status(400)
        .json({ message: "Voucher usage limit has been reached" });
    }

    // Check competition scope
    if (voucher.scope === "specific" && !voucher.competitions.includes(competition)) {
      return res
        .status(400)
        .json({ message: `This voucher is not valid for this competition` });
    }

    const originalFee = REGULAR_FEES[competition];
    let discountedFee;
    let discountAmount;

    if (voucher.discountType === "flat") {
      discountAmount = voucher.discountValue;
      discountedFee = Math.max(0, originalFee - discountAmount);
    } else {
      discountAmount = Math.round((originalFee * voucher.discountValue) / 100);
      discountedFee = Math.max(0, originalFee - discountAmount);
    }

    const discountDescription =
      voucher.discountType === "flat"
        ? `PKR ${discountAmount} off applied`
        : `${voucher.discountValue}% off applied (PKR ${discountAmount} saved)`;

    res.status(200).json({
      valid: true,
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      discountDescription,
      originalFee,
      discountAmount,
      discountedFee,
    });
  } catch (error) {
    console.error("Error validating voucher:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all vouchers (admin)
export const getVouchers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, isActive } = req.query;

    const query = {};
    if (isActive !== undefined && isActive !== "all") {
      query.isActive = isActive === "true";
    }
    if (search) {
      query.code = { $regex: search, $options: "i" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const vouchers = await Voucher.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Voucher.countDocuments(query);

    res.status(200).json({
      vouchers,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get voucher by ID (admin)
export const getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });
    res.status(200).json(voucher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create voucher (admin)
export const createVoucher = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      scope,
      competitions,
      usageLimit,
      expiryDate,
      isActive,
    } = req.body;

    // Check for duplicate code
    const existing = await Voucher.findOne({
      code: code.toUpperCase().trim(),
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "A voucher with this code already exists" });
    }

    const voucher = new Voucher({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue,
      scope: scope || "global",
      competitions: scope === "specific" ? competitions : [],
      usageLimit: usageLimit || null,
      expiryDate: expiryDate || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    await voucher.save();
    res.status(201).json({ message: "Voucher created successfully", voucher });
  } catch (error) {
    console.error("Error creating voucher:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update voucher (admin)
export const updateVoucher = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      scope,
      competitions,
      usageLimit,
      expiryDate,
      isActive,
    } = req.body;

    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });

    // Check duplicate code if changed
    if (code && code.toUpperCase().trim() !== voucher.code) {
      const existing = await Voucher.findOne({
        code: code.toUpperCase().trim(),
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "A voucher with this code already exists" });
      }
      voucher.code = code.toUpperCase().trim();
    }

    if (discountType !== undefined) voucher.discountType = discountType;
    if (discountValue !== undefined) voucher.discountValue = discountValue;
    if (scope !== undefined) {
      voucher.scope = scope;
      voucher.competitions = scope === "specific" ? (competitions || []) : [];
    }
    if (usageLimit !== undefined) voucher.usageLimit = usageLimit || null;
    if (expiryDate !== undefined) voucher.expiryDate = expiryDate || null;
    if (isActive !== undefined) voucher.isActive = isActive;

    await voucher.save();
    res.status(200).json({ message: "Voucher updated successfully", voucher });
  } catch (error) {
    console.error("Error updating voucher:", error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle voucher active status (admin)
export const toggleVoucherStatus = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });

    voucher.isActive = !voucher.isActive;
    await voucher.save();

    res.status(200).json({
      message: `Voucher ${voucher.isActive ? "activated" : "deactivated"} successfully`,
      voucher,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete voucher (admin)
export const deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) return res.status(404).json({ message: "Voucher not found" });
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Ambassador from "../models/ambassador.js";
import Voucher from "../models/voucher.js";
import { sendAmbassadorConfirmation, sendAmbassadorAdminNotification } from "../utils/emailService.js";

const randomSuffix = (len = 4) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const generateUniqueCode = async (prefix) => {
  for (let i = 0; i < 10; i++) {
    const code = `${prefix}-${randomSuffix(4)}`;
    const exists = await Voucher.findOne({ code });
    if (!exists) return code;
  }
  // fallback — longer suffix
  return `${prefix}-${randomSuffix(6)}`;
};

// Public — submit ambassador application
export const createAmbassador = async (req, res) => {
  try {
    const {
      fullName, email, phone, whatsapp, city, university, degree, yearOfStudy,
      motivation, hasExperience, experienceDetails, isAvailable,
      promotionMethods, linkedIn, instagram, agreesToResponsibilities,
    } = req.body;

    const ambassador = new Ambassador({
      fullName, email, phone, whatsapp, city, university, degree, yearOfStudy,
      motivation, hasExperience, experienceDetails, isAvailable,
      promotionMethods, linkedIn, instagram, agreesToResponsibilities,
    });

    await ambassador.save();

    // Generate 2 personal vouchers for this ambassador
    try {
      const firstName = (fullName || "").split(" ")[0].toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "AMB";
      const code10 = await generateUniqueCode(`${firstName}10`);
      const code20 = await generateUniqueCode(`${firstName}20`);

      await Voucher.create([
        { code: code10, discountType: "percentage", discountValue: 10, scope: "global", isActive: true },
        { code: code20, discountType: "percentage", discountValue: 20, scope: "global", isActive: true },
      ]);

      ambassador.voucherCode10 = code10;
      ambassador.voucherCode20 = code20;
      await ambassador.save();
    } catch (e) {
      console.error("Failed to create ambassador vouchers:", e);
    }

    try {
      await sendAmbassadorConfirmation(ambassador);
    } catch (e) {
      console.error("Failed to send ambassador confirmation email:", e);
    }

    try {
      await sendAmbassadorAdminNotification(ambassador);
    } catch (e) {
      console.error("Failed to send ambassador admin notification:", e);
    }

    res.status(201).json({ message: "Ambassador application submitted successfully", ambassador });
  } catch (error) {
    console.error("Error creating ambassador application:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin — paginated list with filters
export const getAmbassadors = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, city, search } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (city && city !== "all") query.city = { $regex: city, $options: "i" };
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { university: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const ambassadors = await Ambassador.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Ambassador.countDocuments(query);

    res.status(200).json({ ambassadors, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — single
export const getAmbassadorById = async (req, res) => {
  try {
    const ambassador = await Ambassador.findById(req.params.id);
    if (!ambassador) return res.status(404).json({ message: "Ambassador not found" });
    res.status(200).json(ambassador);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — update status
export const updateAmbassadorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "contacted", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const ambassador = await Ambassador.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ambassador) return res.status(404).json({ message: "Ambassador not found" });
    res.status(200).json({ message: "Status updated", ambassador });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — delete
export const deleteAmbassador = async (req, res) => {
  try {
    const ambassador = await Ambassador.findByIdAndDelete(req.params.id);
    if (!ambassador) return res.status(404).json({ message: "Ambassador not found" });
    res.status(200).json({ message: "Ambassador deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

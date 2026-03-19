import Ambassador from "../models/ambassador.js";
import { sendAmbassadorConfirmation, sendAmbassadorAdminNotification } from "../utils/emailService.js";

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

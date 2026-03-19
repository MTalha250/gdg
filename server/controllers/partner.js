import Partner from "../models/partner.js";
import { sendPartnerConfirmation, sendPartnerAdminNotification } from "../utils/emailService.js";

// Public — submit partnership application
export const createPartner = async (req, res) => {
  try {
    const {
      representativeName, societyName, email, phone, cnic,
      university, campusVisitDate, organizationLogo, alternativeLogo,
    } = req.body;

    const partner = new Partner({
      representativeName, societyName, email, phone, cnic,
      university, campusVisitDate, organizationLogo, alternativeLogo,
    });

    await partner.save();

    try {
      await sendPartnerConfirmation(partner);
    } catch (e) {
      console.error("Failed to send partner confirmation email:", e);
    }

    try {
      await sendPartnerAdminNotification(partner);
    } catch (e) {
      console.error("Failed to send partner admin notification:", e);
    }

    res.status(201).json({ message: "Partnership application submitted successfully", partner });
  } catch (error) {
    console.error("Error creating partner application:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin — paginated list with filters
export const getPartners = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { societyName: { $regex: search, $options: "i" } },
        { representativeName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const partners = await Partner.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Partner.countDocuments(query);

    res.status(200).json({ partners, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — single
export const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — update status
export const updatePartnerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "contacted", "confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const partner = await Partner.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.status(200).json({ message: "Status updated", partner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — delete
export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

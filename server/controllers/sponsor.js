import Sponsor from "../models/sponsor.js";
import { sendSponsorConfirmation, sendSponsorAdminNotification } from "../utils/emailService.js";

// Public — submit sponsorship application
export const createSponsor = async (req, res) => {
  try {
    const {
      companyName, industry, companyWebsite, companySize,
      fullName, jobTitle, email, phone, cnic, whatsapp,
      package: pkg, wantsStall, companyLogo, requirements, comments,
    } = req.body;

    const sponsor = new Sponsor({
      companyName, industry, companyWebsite, companySize,
      fullName, jobTitle, email, phone, cnic, whatsapp,
      package: pkg, wantsStall, companyLogo, requirements, comments,
    });

    await sponsor.save();

    try {
      await sendSponsorConfirmation(sponsor);
    } catch (e) {
      console.error("Failed to send sponsor confirmation email:", e);
    }

    try {
      await sendSponsorAdminNotification(sponsor);
    } catch (e) {
      console.error("Failed to send sponsor admin notification:", e);
    }

    res.status(201).json({ message: "Sponsorship application submitted successfully", sponsor });
  } catch (error) {
    console.error("Error creating sponsor application:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin — paginated list with filters
export const getSponsors = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, pkg, search } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (pkg && pkg !== "all") query.package = pkg;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sponsors = await Sponsor.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Sponsor.countDocuments(query);

    res.status(200).json({ sponsors, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — single
export const getSponsorById = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });
    res.status(200).json(sponsor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — update status
export const updateSponsorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["new", "contacted", "confirmed", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });
    res.status(200).json({ message: "Status updated", sponsor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — delete
export const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });
    res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

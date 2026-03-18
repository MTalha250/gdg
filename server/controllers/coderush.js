import Coderush, { REGULAR_FEES } from "../models/coderush.js";
import Voucher from "../models/voucher.js";
import {
  sendCoderushConfirmation,
  sendCoderushStatusUpdate,
  sendCoderushAdminNotification,
} from "../utils/emailService.js";

// Create a new Coderush registration
export const createRegistration = async (req, res) => {
  try {
    const { teamName, competition, members, proofOfPayment, voucherCode } =
      req.body;

    // Validate team size
    if (!members || members.length < 1 || members.length > 3) {
      return res
        .status(400)
        .json({ message: "Team must have between 1 and 3 members" });
    }

    // Mark first member as team lead
    members[0].isTeamLead = true;

    // Calculate fees
    const originalFee = REGULAR_FEES[competition];
    if (!originalFee) {
      return res.status(400).json({ message: "Invalid competition selected" });
    }

    let discountedFee = originalFee;
    let appliedVoucherCode = null;

    // Apply voucher if provided
    if (voucherCode) {
      const voucher = await Voucher.findOne({
        code: voucherCode.toUpperCase().trim(),
        isActive: true,
      });

      if (!voucher) {
        return res
          .status(400)
          .json({ message: "Invalid or inactive voucher code" });
      }

      // Check expiry
      if (voucher.expiryDate && new Date() > new Date(voucher.expiryDate)) {
        return res.status(400).json({ message: "Voucher has expired" });
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
      if (voucher.scope === "specific") {
        if (!voucher.competitions.includes(competition)) {
          return res.status(400).json({
            message: `This voucher is not valid for ${competition}`,
          });
        }
      }

      // Apply discount
      if (voucher.discountType === "flat") {
        discountedFee = Math.max(0, originalFee - voucher.discountValue);
      } else {
        discountedFee = Math.max(
          0,
          originalFee - Math.round((originalFee * voucher.discountValue) / 100)
        );
      }

      appliedVoucherCode = voucher.code;

      // Increment used count
      await Voucher.findByIdAndUpdate(voucher._id, {
        $inc: { usedCount: 1 },
      });
    }

    const registration = new Coderush({
      teamName,
      competition,
      members,
      proofOfPayment,
      voucherCode: appliedVoucherCode,
      originalFee,
      discountedFee,
      status: "submitted",
    });

    await registration.save();

    // Send emails (non-blocking)
    try {
      await sendCoderushConfirmation(registration);
    } catch (e) {
      console.error("Failed to send confirmation email:", e);
    }

    try {
      await sendCoderushAdminNotification(registration);
    } catch (e) {
      console.error("Failed to send admin notification:", e);
    }

    res.status(201).json({
      message: "Registration submitted successfully",
      registration,
    });
  } catch (error) {
    console.error("Error creating Coderush registration:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get paginated registrations with filters
export const getRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, competition, search } = req.query;

    const query = {};

    if (status && status !== "all") query.status = status;
    if (competition && competition !== "all") query.competition = competition;

    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: "i" } },
        { "members.email": { $regex: search, $options: "i" } },
        { "members.name": { $regex: search, $options: "i" } },
        { "members.rollNumber": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const registrations = await Coderush.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Coderush.countDocuments(query);

    res.status(200).json({
      registrations,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching Coderush registrations:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all registrations (for export)
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Coderush.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching all Coderush registrations:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const registration = await Coderush.findById(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });
    res.status(200).json(registration);
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update registration status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["submitted", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const registration = await Coderush.findById(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });

    const oldStatus = registration.status;
    registration.status = status;
    await registration.save();

    if (oldStatus !== status && (status === "accepted" || status === "rejected")) {
      try {
        await sendCoderushStatusUpdate(registration);
      } catch (e) {
        console.error("Failed to send status update email:", e);
      }
    }

    res.status(200).json({ message: "Status updated successfully", registration });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete registration
export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Coderush.findByIdAndDelete(req.params.id);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });
    res.status(200).json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get statistics
export const getStats = async (req, res) => {
  try {
    const total = await Coderush.countDocuments();
    const submitted = await Coderush.countDocuments({ status: "submitted" });
    const accepted = await Coderush.countDocuments({ status: "accepted" });
    const rejected = await Coderush.countDocuments({ status: "rejected" });

    // By competition
    const byCompetition = await Coderush.aggregate([
      { $group: { _id: "$competition", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // By status per competition
    const byCompetitionStatus = await Coderush.aggregate([
      {
        $group: {
          _id: { competition: "$competition", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Total revenue collected (discounted fees of accepted registrations)
    const revenueResult = await Coderush.aggregate([
      { $match: { status: "accepted" } },
      { $group: { _id: null, total: { $sum: "$discountedFee" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Voucher usage count
    const withVoucher = await Coderush.countDocuments({
      voucherCode: { $ne: null },
    });

    res.status(200).json({
      total,
      submitted,
      accepted,
      rejected,
      byCompetition,
      byCompetitionStatus,
      totalRevenue,
      withVoucher,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: error.message });
  }
};

import BrainGames from "../models/brainGames.js";
import { sendBrainGamesConfirmation, sendBrainGamesStatusUpdate } from "../utils/emailService.js";

// Create a new Brain Games registration
export const createRegistration = async (req, res) => {
  try {
    const { teamName, members, proofOfPayment } = req.body;

    // Validate team size
    if (!members || members.length < 1 || members.length > 3) {
      return res.status(400).json({
        message: "Team must have between 1 and 3 members"
      });
    }

    // Validate team lead (first member)
    const teamLead = members[0];
    if (!teamLead.email || !teamLead.email.endsWith("@itu.edu.pk")) {
      return res.status(400).json({
        message: "Team lead must have a valid ITU email address (@itu.edu.pk)"
      });
    }

    if (!teamLead.rollNumber || teamLead.rollNumber.length !== 9 || !teamLead.rollNumber.toLowerCase().startsWith("bs")) {
      return res.status(400).json({
        message: "Team lead must have a valid roll number (9 characters starting with 'bs')"
      });
    }

    // Check for duplicate email
    const existingByEmail = await BrainGames.findOne({
      "members.email": teamLead.email,
    });
    if (existingByEmail) {
      return res.status(400).json({
        message: "This email is already registered",
      });
    }

    // Check for duplicate roll number
    const existingByRoll = await BrainGames.findOne({
      "members.rollNumber": teamLead.rollNumber,
    });
    if (existingByRoll) {
      return res.status(400).json({
        message: "This roll number is already registered",
      });
    }

    // Validate other members' CNIC if provided
    for (let i = 1; i < members.length; i++) {
      const member = members[i];
      if (member.cnic) {
        // Remove hyphens for validation
        const cnicDigits = member.cnic.replace(/-/g, "");
        if (cnicDigits.length !== 13 || !/^\d+$/.test(cnicDigits)) {
          return res.status(400).json({
            message: `Invalid CNIC format for ${member.name}. Must be 13 digits.`,
          });
        }
      }
    }

    // Mark first member as team lead
    members[0].isTeamLead = true;

    // Create registration
    const registration = new BrainGames({
      teamName,
      members,
      proofOfPayment,
      status: "submitted",
    });

    await registration.save();

    // Send confirmation email
    try {
      await sendBrainGamesConfirmation(registration);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      message: "Registration submitted successfully",
      registration,
    });
  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all registrations with pagination and filters
export const getRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search by team name or team lead email
    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: "i" } },
        { "members.email": { $regex: search, $options: "i" } },
        { "members.name": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const registrations = await BrainGames.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BrainGames.countDocuments(query);

    res.status(200).json({
      registrations,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get registration by ID
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await BrainGames.findById(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(registration);
  } catch (error) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update registration status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["submitted", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'submitted', 'accepted', or 'rejected'"
      });
    }

    const registration = await BrainGames.findById(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const oldStatus = registration.status;
    registration.status = status;
    await registration.save();

    // Send status update email if status changed
    if (oldStatus !== status && (status === "accepted" || status === "rejected")) {
      try {
        await sendBrainGamesStatusUpdate(registration);
      } catch (emailError) {
        console.error("Failed to send status update email:", emailError);
        // Don't fail the update if email fails
      }
    }

    res.status(200).json({
      message: "Status updated successfully",
      registration,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete registration
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await BrainGames.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json({ message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Error deleting registration:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get registration statistics
export const getRegistrationStats = async (req, res) => {
  try {
    const total = await BrainGames.countDocuments();
    const submitted = await BrainGames.countDocuments({ status: "submitted" });
    const accepted = await BrainGames.countDocuments({ status: "accepted" });
    const rejected = await BrainGames.countDocuments({ status: "rejected" });

    res.status(200).json({
      total,
      submitted,
      accepted,
      rejected,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all registrations (for export)
export const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await BrainGames.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching all registrations:", error);
    res.status(500).json({ message: error.message });
  }
};

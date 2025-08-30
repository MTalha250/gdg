import Recruitment from "../models/recruitment.js";
import { sendRecruitmentConfirmation } from "../utils/emailService.js";

// Create new recruitment application
export const createRecruitment = async (req, res) => {
  try {
    const applicationData = req.body;

    // Check if email or roll number already exists
    const existingApplication = await Recruitment.findOne({
      $or: [
        { email: applicationData.email },
        { rollNumber: applicationData.rollNumber },
      ],
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "Application already exists with this email or roll number",
      });
    }

    const recruitment = await Recruitment.create(applicationData);

    // Send confirmation email to user
    try {
      await sendRecruitmentConfirmation(
        applicationData.email,
        applicationData.fullName,
        applicationData.selectedTeam,
        applicationData.selectedRole
      );
    } catch (emailError) {
      console.error(
        "Failed to send recruitment confirmation email:",
        emailError
      );
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application: recruitment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all recruitment applications (Admin only)
export const getRecruitments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      team,
      role,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};
    if (team) filter.selectedTeam = team;
    if (role) filter.selectedRole = role;
    if (status) filter.status = status;

    // Add search functionality
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { degreeProgram: { $regex: search, $options: "i" } },
        { selectedTeam: { $regex: search, $options: "i" } },
        { selectedRole: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const applications = await Recruitment.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Recruitment.countDocuments(filter);

    res.status(200).json({
      applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single recruitment application by ID
export const getRecruitmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Recruitment.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update recruitment application status (Admin only)
export const updateRecruitmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["submitted", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    const application = await Recruitment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete recruitment application (Admin only)
export const deleteRecruitment = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Recruitment.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get recruitment statistics (Admin only)
export const getRecruitmentStats = async (req, res) => {
  try {
    const totalApplications = await Recruitment.countDocuments();

    const statusStats = await Recruitment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const teamStats = await Recruitment.aggregate([
      {
        $group: {
          _id: "$selectedTeam",
          count: { $sum: 1 },
        },
      },
    ]);

    const roleStats = await Recruitment.aggregate([
      {
        $group: {
          _id: "$selectedRole",
          count: { $sum: 1 },
        },
      },
    ]);

    const recentApplications = await Recruitment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName email selectedTeam selectedRole status createdAt");

    res.status(200).json({
      totalApplications,
      statusStats,
      teamStats,
      roleStats,
      recentApplications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk update applications (Admin only)
export const bulkUpdateRecruitments = async (req, res) => {
  try {
    const { applicationIds, status } = req.body;

    if (
      !applicationIds ||
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0
    ) {
      return res.status(400).json({ message: "Application IDs are required" });
    }

    const validStatuses = ["submitted", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    const result = await Recruitment.updateMany(
      { _id: { $in: applicationIds } },
      { status }
    );

    res.status(200).json({
      message: `${result.modifiedCount} applications updated successfully`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all emails by status (Admin only)
export const getAllEmails = async (req, res) => {
  try {
    const { status } = req.query;

    // Build filter object
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const applications = await Recruitment.find(filter)
      .select("email fullName status")
      .sort({ createdAt: -1 });

    const emails = applications
      .map((app) => app.email)
      .filter((email) => email);

    res.status(200).json({
      emails,
      count: emails.length,
      applications: applications.map((app) => ({
        email: app.email,
        fullName: app.fullName,
        status: app.status,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all recruitment applications for CSV export (Admin only)
export const getAllRecruitments = async (req, res) => {
  try {
    const { team, role, status } = req.query;

    // Build filter object
    const filter = {};
    if (team) filter.selectedTeam = team;
    if (role) filter.selectedRole = role;
    if (status) filter.status = status;

    const applications = await Recruitment.find(filter)
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for better performance when fetching all data

    res.status(200).json({
      applications,
      count: applications.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

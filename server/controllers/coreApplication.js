import CoreApplication from "../models/coreApplication.js";
import {
  POSITIONS,
  formConfig,
  questionsFor,
  QUESTION_LABELS,
} from "../utils/coreQuestions.js";
import {
  sendCoreApplicationConfirmation,
  sendCoreApplicationAdminNotification,
  sendCoreApplicationStatusUpdate,
} from "../utils/emailService.js";

const STATUSES = ["submitted", "shortlisted", "accepted", "rejected"];

// Roll numbers arrive as "BSCS-23051", "bscs 23051", "BSCS23051" — normalise
// before validating and storing so lookups and exports stay consistent.
const normaliseRoll = (roll) => (roll || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const ROLL_PATTERN = /^BS[A-Z]{2}\d{5}$/;

// Public — the form definition, so the site and admin panel stay in sync.
export const getFormConfig = (req, res) => {
  res.status(200).json(formConfig());
};

// Public — submit an application
export const createApplication = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      alternateEmail,
      phone,
      rollNumber,
      department,
      departmentOther,
      semester,
      linkedin,
      github,
      position,
      answers,
      hoursPerWeek,
      weekendAvailability,
      declaration,
    } = req.body;

    if (!POSITIONS.includes(position)) {
      return res.status(400).json({ message: "Invalid position selected" });
    }

    const roll = normaliseRoll(rollNumber);
    if (!ROLL_PATTERN.test(roll)) {
      return res.status(400).json({
        message:
          "Roll number must be 9 characters starting with 'bs' (e.g. bscs23051)",
      });
    }

    const normalisedEmail = (email || "").toLowerCase().trim();
    if (!/^[a-zA-Z0-9._%+-]+@itu\.edu\.pk$/.test(normalisedEmail)) {
      return res
        .status(400)
        .json({ message: "Please use your ITU email address (@itu.edu.pk)" });
    }

    if (declaration !== true) {
      return res
        .status(400)
        .json({ message: "You must accept the final declaration" });
    }

    // Every question for this position must be answered.
    const required = questionsFor(position);
    const submitted = answers || {};
    const missing = required.filter((q) => !String(submitted[q.id] || "").trim());
    if (missing.length) {
      return res.status(400).json({
        message: `Please answer: ${missing[0].label}`,
        missing: missing.map((q) => q.id),
      });
    }

    // Drop anything that isn't a question for this position, so a crafted
    // payload can't stuff arbitrary keys into the answers map.
    const cleanAnswers = Object.fromEntries(
      required.map((q) => [q.id, String(submitted[q.id]).trim()])
    );

    const application = new CoreApplication({
      firstName,
      middleName,
      lastName,
      email: normalisedEmail,
      alternateEmail,
      phone,
      rollNumber: roll,
      department,
      departmentOther: department === "Other" ? departmentOther : "",
      semester,
      linkedin,
      github,
      position,
      answers: cleanAnswers,
      hoursPerWeek,
      weekendAvailability,
      declaration,
    });

    await application.save();

    try {
      await sendCoreApplicationConfirmation(application);
    } catch (e) {
      console.error("Failed to send core application confirmation:", e);
    }
    try {
      await sendCoreApplicationAdminNotification(application);
    } catch (e) {
      console.error("Failed to send core application admin notification:", e);
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "You have already applied for this position. You may apply for a different position instead.",
      });
    }
    console.error("Error creating core application:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin — paginated list with filters
export const getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, position, search } = req.query;

    const query = {};
    if (status && status !== "all") query.status = status;
    if (position && position !== "all") query.position = position;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const applications = await CoreApplication.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await CoreApplication.countDocuments(query);

    res.status(200).json({
      applications,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — everything, for CSV/email export
export const getAllApplications = async (req, res) => {
  try {
    const applications = await CoreApplication.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ applications, questionLabels: QUESTION_LABELS });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — single
export const getApplicationById = async (req, res) => {
  try {
    const application = await CoreApplication.findById(req.params.id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — update status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await CoreApplication.findById(req.params.id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    const oldStatus = application.status;
    application.status = status;
    await application.save();

    if (oldStatus !== status && (status === "accepted" || status === "rejected")) {
      try {
        await sendCoreApplicationStatusUpdate(application);
      } catch (e) {
        console.error("Failed to send core application status email:", e);
      }
    }

    res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — delete
export const deleteApplication = async (req, res) => {
  try {
    const application = await CoreApplication.findByIdAndDelete(req.params.id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin — stats
export const getStats = async (req, res) => {
  try {
    const [total, byStatus, byPosition] = await Promise.all([
      CoreApplication.countDocuments(),
      CoreApplication.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CoreApplication.aggregate([
        { $group: { _id: "$position", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({ total, byStatus, byPosition });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

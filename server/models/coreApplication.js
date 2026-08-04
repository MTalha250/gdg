import mongoose from "mongoose";
import { POSITIONS, DEPARTMENTS, SEMESTERS, HOURS_PER_WEEK } from "../utils/coreQuestions.js";

const coreApplicationSchema = new mongoose.Schema(
  {
    // Personal
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true, default: "" },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    alternateEmail: { type: String, lowercase: true, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, uppercase: true, trim: true },
    department: { type: String, required: true, enum: DEPARTMENTS },
    // Free text, only used when department is "Other"
    departmentOther: { type: String, trim: true, default: "" },
    semester: { type: String, required: true, enum: SEMESTERS },
    linkedin: { type: String, required: true, trim: true },
    github: { type: String, trim: true, default: "" },

    position: { type: String, required: true, enum: POSITIONS },

    // Answers to the common + position-specific questions, keyed by question id.
    // Free-form because the question set is position-dependent and lives in
    // utils/coreQuestions.js — the controller validates completeness on write.
    answers: {
      type: Map,
      of: String,
      required: true,
      default: () => new Map(),
    },

    // Commitment
    hoursPerWeek: { type: String, required: true, enum: HOURS_PER_WEEK },
    weekendAvailability: { type: Boolean, required: true },
    declaration: {
      type: Boolean,
      required: true,
      validate: {
        validator: (v) => v === true,
        message: "The final declaration must be accepted",
      },
    },

    status: {
      type: String,
      enum: ["submitted", "shortlisted", "accepted", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

// One application per position per applicant — the same person may apply for
// more than one position, but not submit the same one twice.
coreApplicationSchema.index({ email: 1, position: 1 }, { unique: true });
coreApplicationSchema.index({ position: 1 });
coreApplicationSchema.index({ status: 1 });
coreApplicationSchema.index({ rollNumber: 1 });
coreApplicationSchema.index({ createdAt: -1 });

const CoreApplication = mongoose.model("CoreApplication", coreApplicationSchema);

export default CoreApplication;

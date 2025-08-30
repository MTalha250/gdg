import mongoose from "mongoose";

const recruitmentSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    degreeProgram: {
      type: String,
      required: true,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },

    // About You
    whyJoin: {
      type: String,
      required: true,
    },

    // Team & Role Selection
    selectedTeam: {
      type: String,
      required: true,
      enum: [
        "Management Team",
        "Security Team",
        "Protocol & Hospitality Team",
        "Logistics Team",
        "Outreach Team",
        "On-Campus Marketing Team",
        "Digital & Social Media Team",
        "Sponsorship Acquisition Team",
        "Community Partnerships Team",
        "Media Team",
        "Graphics Team",
        "Content Creation Team",
        "Video Editing & Reel Team",
        "Technical Team",
        "Bevy Team",
        "Decor Team",
        "Event Experience & Audience Team",
        "Documentation Team",
      ],
    },
    selectedRole: {
      type: String,
      required: true,
      enum: ["member", "lead"],
    },
    whyThisTeam: {
      type: String,
      required: true,
    },

    // Skills & Ideas
    relevantSkills: {
      type: String,
      required: true,
    },
    timeCommitment: {
      type: String,
      required: true,
      enum: [
        "1-5 hours/week",
        "6-10 hours/week",
        "11-15 hours/week",
        "15+ hours/week",
      ],
    },
    improvementIdea: {
      type: String,
      required: true,
    },

    // Leadership (conditional fields for lead role)
    whyLeadTeam: {
      type: String,
      required: function () {
        return this.selectedRole === "lead";
      },
    },
    leadershipExperience: {
      type: String,
      required: function () {
        return this.selectedRole === "lead";
      },
    },
    teamOrganization: {
      type: String,
      required: function () {
        return this.selectedRole === "lead";
      },
    },
    handleUnderperformers: {
      type: String,
      required: function () {
        return this.selectedRole === "lead";
      },
    },
    teamVision: {
      type: String,
      required: function () {
        return this.selectedRole === "lead";
      },
    },

    // Agreements
    timeCommitmentAgreement: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "Time commitment agreement must be accepted",
      },
    },
    attendanceCommitment: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "Attendance commitment must be accepted",
      },
    },
    professionalismCommitment: {
      type: Boolean,
      required: true,
      validate: {
        validator: function (v) {
          return v === true;
        },
        message: "Professionalism commitment must be accepted",
      },
    },

    // Application Status
    status: {
      type: String,
      enum: ["submitted", "accepted", "rejected"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

// Index for better performance
recruitmentSchema.index({ email: 1 });
recruitmentSchema.index({ rollNumber: 1 });
recruitmentSchema.index({ selectedTeam: 1 });
recruitmentSchema.index({ selectedRole: 1 });
recruitmentSchema.index({ status: 1 });
recruitmentSchema.index({ createdAt: -1 });

const Recruitment =
  mongoose.models.recruitment_applications ||
  mongoose.model("recruitment_applications", recruitmentSchema);

export default Recruitment;

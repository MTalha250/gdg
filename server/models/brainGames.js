import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  rollNumber: {
    type: String,
    trim: true,
  },
  university: {
    type: String,
    trim: true,
  },
  cnic: {
    type: String,
    trim: true,
  },
  isTeamLead: {
    type: Boolean,
    default: false,
  },
});

const brainGamesSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    members: {
      type: [memberSchema],
      required: true,
      validate: {
        validator: function (members) {
          return members.length >= 1 && members.length <= 3;
        },
        message: "Team must have between 1 and 3 members",
      },
    },
    proofOfPayment: {
      type: String,
      required: true,
    },
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

// Indexes for better query performance
brainGamesSchema.index({ "members.email": 1 });
brainGamesSchema.index({ "members.rollNumber": 1 });
brainGamesSchema.index({ status: 1 });
brainGamesSchema.index({ createdAt: -1 });

const BrainGames = mongoose.model("BrainGames", brainGamesSchema);

export default BrainGames;

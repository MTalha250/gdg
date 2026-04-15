import mongoose from "mongoose";

const COMPETITIONS = [
  "competitive-programming",
  "web-development",
  "app-development",
  "ui-ux",
  "robotics",
  "game-jam",
  "machine-learning",
  "ctf",
];

const REGULAR_FEES = {
  "competitive-programming": 1800,
  "web-development": 2500,
  "app-development": 2500,
  "ui-ux": 2000,
  robotics: 2000,
  "game-jam": 2500,
  "machine-learning": 2500,
  ctf: 1500,
};

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
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
    required: true,
    trim: true,
  },
  university: {
    type: String,
    required: true,
    trim: true,
  },
  cnic: {
    type: String,
    required: true,
    trim: true,
  },
  isTeamLead: {
    type: Boolean,
    default: false,
  },
});

const coderushSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    competition: {
      type: String,
      enum: COMPETITIONS,
      required: true,
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
    roboticsModule: {
      type: String,
      enum: ["rc-car-race", "line-following-robot", "robo-soccer", ""],
      default: "",
    },
    proofOfPayment: {
      type: String,
      required: true,
    },
    // Voucher info
    voucherCode: {
      type: String,
      default: null,
    },
    originalFee: {
      type: Number,
      required: true,
    },
    discountedFee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "accepted", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

coderushSchema.index({ "members.email": 1 });
coderushSchema.index({ "members.rollNumber": 1 });
coderushSchema.index({ competition: 1 });
coderushSchema.index({ status: 1 });
coderushSchema.index({ createdAt: -1 });

const Coderush = mongoose.model("Coderush", coderushSchema);

export { COMPETITIONS, REGULAR_FEES };
export default Coderush;

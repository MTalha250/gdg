import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: false },
  phone: { type: String, required: true },
  cnic: { type: String, required: true },
});

const leaderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  roll: { type: String, required: true },
  university: { type: String, required: true, default: "ITU" },
  phone: { type: String, required: true },
});

const newEventSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },
    leader: leaderSchema,
    members: [memberSchema],
    receipt: { type: String, required: true }, 
    // Application Status
    status: {
      type: String,
      enum: ["registered", "accepted", "rejected"],
      default: "registered",
    },
  },
  { timestamps: true }
);

export default mongoose.models.NewEvent ||
  mongoose.model("NewEvent", newEventSchema);

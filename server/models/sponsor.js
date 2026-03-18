import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    // Company info
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, trim: true, default: "" },
    companyWebsite: { type: String, trim: true, default: "" },
    companySize: {
      type: String,
      enum: ["Startup", "Small", "Medium", "Large", "Enterprise", ""],
      default: "",
    },
    // Contact person
    fullName: { type: String, required: true, trim: true },
    jobTitle: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    cnic: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    // Sponsorship details
    package: {
      type: String,
      enum: ["platinum", "gold", "silver", "bronze", "custom"],
      required: true,
    },
    wantsStall: { type: Boolean, required: true },
    companyLogo: { type: String, required: true },
    requirements: { type: String, trim: true, default: "" },
    comments: { type: String, trim: true, default: "" },
    // Admin
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

sponsorSchema.index({ email: 1 });
sponsorSchema.index({ package: 1 });
sponsorSchema.index({ status: 1 });
sponsorSchema.index({ createdAt: -1 });

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
export default Sponsor;

import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    representativeName: { type: String, required: true, trim: true },
    societyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    cnic: { type: String, required: true, trim: true },
    university: { type: String, required: true, trim: true },
    campusVisitDate: { type: String, required: true, trim: true },
    organizationLogo: { type: String, required: true },
    alternativeLogo: { type: String, trim: true, default: "" },
    // Admin
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

partnerSchema.index({ email: 1 });
partnerSchema.index({ status: 1 });
partnerSchema.index({ createdAt: -1 });

const Partner = mongoose.model("Partner", partnerSchema);
export default Partner;

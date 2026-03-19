import mongoose from "mongoose";

const ambassadorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    university: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    yearOfStudy: { type: String, required: true, trim: true },
    motivation: { type: String, required: true, trim: true },
    hasExperience: { type: Boolean, required: true },
    experienceDetails: { type: String, trim: true, default: "" },
    isAvailable: { type: Boolean, required: true },
    promotionMethods: [{ type: String }],
    linkedIn: { type: String, required: true, trim: true },
    instagram: { type: String, trim: true, default: "" },
    agreesToResponsibilities: { type: Boolean, required: true },
    // Admin
    status: {
      type: String,
      enum: ["new", "contacted", "approved", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

ambassadorSchema.index({ email: 1 });
ambassadorSchema.index({ status: 1 });
ambassadorSchema.index({ city: 1 });
ambassadorSchema.index({ createdAt: -1 });

const Ambassador = mongoose.model("Ambassador", ambassadorSchema);
export default Ambassador;

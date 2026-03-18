"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Upload,
  CheckCircle,
  Building2,
  User,
  Globe,
  ChevronDown,
} from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const PACKAGES = [
  {
    value: "platinum",
    label: "Platinum",
    desc: "Premier visibility — logo on all materials, stall, stage mention",
  },
  {
    value: "gold",
    label: "Gold",
    desc: "High visibility — logo on banners, digital presence, stall option",
  },
  {
    value: "silver",
    label: "Silver",
    desc: "Strong presence — logo on event materials and digital",
  },
  {
    value: "bronze",
    label: "Bronze",
    desc: "Community presence — logo on website and social media",
  },
  {
    value: "custom",
    label: "Custom",
    desc: "Let's discuss a tailored sponsorship arrangement",
  },
];

const COMPANY_SIZES = ["Startup", "Small", "Medium", "Large", "Enterprise"];

const inputCls =
  "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cr-green/40 focus:bg-cr-green/[0.03] transition-all text-sm";

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-white/[0.05] bg-white/[0.01]">
        <span className="text-cr-green">{icon}</span>
        <h2 className="text-white font-semibold text-sm">{title}</h2>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

export default function SponsorPage() {
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    companyWebsite: "",
    companySize: "",
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    cnic: "",
    whatsapp: "",
    package: "",
    wantsStall: "",
    requirements: "",
    comments: "",
  });
  const [companyLogo, setCompanyLogo] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
        withCredentials: false,
      });
      setCompanyLogo(res.data.secure_url);
      toast.success("Logo uploaded!");
    } catch {
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.package) {
      toast.error("Please select a sponsorship package");
      return;
    }
    if (!companyLogo) {
      toast.error("Please upload your company logo");
      return;
    }
    if (form.wantsStall === "") {
      toast.error("Please indicate if you want a stall");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/sponsors`, {
        ...form,
        wantsStall: form.wantsStall === "yes",
        companyLogo,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Submission failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── SUCCESS ──
  if (submitted) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cr-green/[0.07] blur-[120px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-lg w-full"
        >
          <div className="rounded-3xl border border-cr-green/20 bg-white/[0.02] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cr-green/50 to-transparent" />
            <div className="p-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-cr-green/10 border border-cr-green/30 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-cr-green" />
              </motion.div>
              <h1 className="text-3xl font-space-grotesk font-black text-white mb-2">
                Application Received!
              </h1>
              <p className="text-white/50 mb-1 text-sm">
                Thank you,{" "}
                <span className="text-white font-semibold">
                  {form.fullName}
                </span>
                .
              </p>
              <p className="text-white/35 text-xs mb-8">
                Our team will review your application and get back to you soon.
              </p>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-8 text-left space-y-3">
                <p className="text-xs text-cr-green/60 uppercase tracking-widest font-medium mb-2">
                  What happens next
                </p>
                {[
                  "Check your inbox for a confirmation email",
                  "Our sponsorship team will review your application",
                  "We'll reach out soon to discuss details",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 text-white/50 text-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-cr-green/10 border border-cr-green/25 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-cr-green text-[10px] font-bold">
                        {i + 1}
                      </span>
                    </div>
                    {step}
                  </div>
                ))}
              </div>

              <Link href="/coderush">
                <InteractiveHoverButton className="w-full bg-black border-cr-green/40 text-white">
                  Back to CodeRush
                </InteractiveHoverButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cr-green/[0.05] blur-[110px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-cr-green/[0.03] blur-[90px] rounded-full" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-24 pt-24 sm:pt-28 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/coderush"
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-cr-green transition-colors text-sm mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to CodeRush
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cr-green/20 bg-cr-green/[0.06] mb-5">
            <img
              src="/images/coderush/logo.jpg"
              alt="CodeRush"
              className="h-4 w-auto rounded"
            />
            <span className="text-xs text-cr-green/70 uppercase tracking-widest">
              2026 · Sponsorship
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-space-grotesk font-black text-white mb-2 leading-tight">
            Sponsor
            <br />
            CodeRush 2026
          </h1>
          <p className="text-white/35 text-sm max-w-lg">
            Partner with Pakistan's premier multi-discipline tech competition.
            Reach hundreds of top students from universities across Pakistan.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <SectionCard
              title="Company / Organization"
              icon={<Building2 className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={form.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                    placeholder="Company / Organization Name *"
                    required
                    className={inputCls}
                  />
                </div>
                <input
                  type="text"
                  value={form.industry}
                  onChange={(e) => set("industry", e.target.value)}
                  placeholder="Industry / Sector"
                  className={inputCls}
                />
                <input
                  type="url"
                  value={form.companyWebsite}
                  onChange={(e) => set("companyWebsite", e.target.value)}
                  placeholder="Company Website"
                  className={inputCls}
                />
                <div className="relative sm:col-span-2">
                  <select
                    value={form.companySize}
                    onChange={(e) => set("companySize", e.target.value)}
                    className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-cr-green/40 focus:bg-cr-green/[0.03] transition-all text-sm cursor-pointer"
                  >
                    <option value="" className="bg-[#0a0a0a]">
                      Company Size (optional)
                    </option>
                    {COMPANY_SIZES.map((s) => (
                      <option key={s} value={s} className="bg-[#0a0a0a]">
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Contact Person */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <SectionCard
              title="Contact Person"
              icon={<User className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Full Name *"
                  required
                  className={inputCls}
                />
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) => set("jobTitle", e.target.value)}
                  placeholder="Job Title / Position *"
                  required
                  className={inputCls}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="Email Address *"
                  required
                  className={inputCls}
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="Phone Number *"
                  required
                  className={inputCls}
                />
                <input
                  type="text"
                  value={form.cnic}
                  onChange={(e) => set("cnic", e.target.value)}
                  placeholder="CNIC (for entry purposes)"
                  className={inputCls}
                />
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="WhatsApp Number (optional)"
                  className={inputCls}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* Package */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <SectionCard
              title="Sponsorship Package *"
              icon={<Globe className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PACKAGES.map((pkg) => (
                  <button
                    key={pkg.value}
                    type="button"
                    onClick={() => set("package", pkg.value)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      form.package === pkg.value
                        ? "border-cr-green/50 bg-cr-green/[0.08]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.15]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${form.package === pkg.value ? "border-cr-green bg-cr-green" : "border-white/20"}`}
                      />
                      <span
                        className={`font-bold text-sm ${form.package === pkg.value ? "text-cr-green" : "text-white"}`}
                      >
                        {pkg.label}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs pl-5">{pkg.desc}</p>
                  </button>
                ))}
              </div>
            </SectionCard>
          </motion.div>

          {/* Stall + Logo */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionCard
              title="Additional Details"
              icon={<Building2 className="w-4 h-4" />}
            >
              {/* Stall */}
              <div className="mb-5">
                <p className="text-white/50 text-sm font-medium mb-3">
                  Do you want to set up a company stall at the event? *
                </p>
                <div className="flex gap-3">
                  {["yes", "no"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set("wantsStall", val)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all capitalize ${
                        form.wantsStall === val
                          ? "border-cr-green/50 bg-cr-green/[0.08] text-cr-green"
                          : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.15] hover:text-white/60"
                      }`}
                    >
                      {val === "yes" ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo upload */}
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Company Logo *
                </p>
                <label
                  htmlFor="logo-upload"
                  className={`block rounded-xl border-2 border-dashed transition-all cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : ""} ${companyLogo ? "border-cr-green/30 bg-cr-green/[0.04]" : "border-white/[0.08] hover:border-cr-green/25 hover:bg-cr-green/[0.02]"}`}
                >
                  {companyLogo ? (
                    <div className="p-4 flex flex-col items-center gap-3">
                      <img
                        src={companyLogo}
                        alt="Company logo"
                        className="max-h-24 rounded-lg object-contain"
                      />
                      <span className="inline-flex items-center gap-2 text-cr-green text-xs font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Uploaded · click
                        to change
                      </span>
                    </div>
                  ) : (
                    <div className="p-8 flex flex-col items-center gap-3">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-cr-green/40 animate-spin" />
                          <p className="text-white/30 text-sm">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-xl border border-cr-green/20 bg-cr-green/[0.06] flex items-center justify-center">
                            <Upload className="w-5 h-5 text-cr-green/60" />
                          </div>
                          <div className="text-center">
                            <p className="text-white/50 text-sm">
                              Click to upload company logo
                            </p>
                            <p className="text-white/20 text-xs mt-1">
                              PNG, JPG · max 10MB
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadLogo}
                  disabled={isUploading}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <SectionCard
              title="Additional Notes (optional)"
              icon={<Globe className="w-4 h-4" />}
            >
              <div className="space-y-3">
                <textarea
                  value={form.requirements}
                  onChange={(e) => set("requirements", e.target.value)}
                  placeholder="Any specific requirements or requests?"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
                <textarea
                  value={form.comments}
                  onChange={(e) => set("comments", e.target.value)}
                  placeholder="Any questions or comments?"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="relative w-full py-4 rounded-2xl bg-cr-green text-black font-black text-base hover:bg-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Sponsorship Application{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-white/20 text-xs mt-3">
              Our team will review your application and reach out soon.
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

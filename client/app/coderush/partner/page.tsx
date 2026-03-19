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
} from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

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

export default function PartnerPage() {
  const [form, setForm] = useState({
    representativeName: "",
    societyName: "",
    email: "",
    phone: "",
    cnic: "",
    university: "",
    campusVisitDate: "",
  });
  const [organizationLogo, setOrganizationLogo] = useState("");
  const [alternativeLogo, setAlternativeLogo] = useState("");
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingAlt, setIsUploadingAlt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setLoading: (loading: boolean) => void,
  ) => {
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
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, data, {
        withCredentials: false,
      });
      setUrl(res.data.secure_url);
      toast.success("Logo uploaded!");
    } catch {
      toast.error("Failed to upload logo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationLogo) {
      toast.error("Please upload your organization logo");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/partners`, {
        ...form,
        organizationLogo,
        alternativeLogo,
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
        <AnimatePresence>
          <motion.div
            key="success"
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
                    {form.representativeName}
                  </span>
                  .
                </p>
                <p className="text-white/35 text-xs mb-8">
                  Our team will review your partnership application for{" "}
                  <span className="text-white/60">{form.societyName}</span> and
                  get back to you soon.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-8 text-left space-y-3">
                  <p className="text-xs text-cr-green/60 uppercase tracking-widest font-medium mb-2">
                    What happens next
                  </p>
                  {[
                    "Check your inbox for a confirmation email",
                    "Our partnerships team will review your application",
                    "We'll reach out soon to discuss collaboration details",
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
        </AnimatePresence>
      </div>
    );
  }

  const renderLogoUpload = (
    id: string,
    label: string,
    required: boolean,
    url: string,
    isUploading: boolean,
    setUrl: (url: string) => void,
    setLoading: (loading: boolean) => void,
  ) => (
    <div>
      <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
        {label} {required && "*"}
      </p>
      <label
        htmlFor={id}
        className={`block rounded-xl border-2 border-dashed transition-all cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : ""} ${url ? "border-cr-green/30 bg-cr-green/[0.04]" : "border-white/[0.08] hover:border-cr-green/25 hover:bg-cr-green/[0.02]"}`}
      >
        {url ? (
          <div className="p-4 flex flex-col items-center gap-3">
            <img
              src={url}
              alt="Logo"
              className="max-h-24 rounded-lg object-contain"
            />
            <span className="inline-flex items-center gap-2 text-cr-green text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Uploaded · click to
              change
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
                  <p className="text-white/50 text-sm">Click to upload</p>
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
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => uploadImage(e, setUrl, setLoading)}
        disabled={isUploading}
      />
    </div>
  );

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
              2026 · Community Partnership
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-space-grotesk font-black text-white mb-2 leading-tight">
            Community
            <br />
            Partnership
          </h1>
          <p className="text-white/35 text-sm max-w-lg">
            Partner your society or community with CodeRush 2026. Collaborate
            with us to bring Pakistan's premier tech competition to your campus.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Representative Info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <SectionCard
              title="Representative Information"
              icon={<User className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.representativeName}
                  onChange={(e) => set("representativeName", e.target.value)}
                  placeholder="Representative Name *"
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
                  placeholder="CNIC *"
                  required
                  className={inputCls}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* Organization Info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <SectionCard
              title="Organization Details"
              icon={<Building2 className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.societyName}
                  onChange={(e) => set("societyName", e.target.value)}
                  placeholder="Society / Community Name *"
                  required
                  className={inputCls}
                />
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) => set("university", e.target.value)}
                  placeholder="University / Organization Name *"
                  required
                  className={inputCls}
                />
                <div className="sm:col-span-2">
                  <p className="text-white/50 text-sm font-medium mb-2">
                    When can you arrange a campus visit for our team to market
                    the event? *
                  </p>
                  <input
                    type="text"
                    value={form.campusVisitDate}
                    onChange={(e) => set("campusVisitDate", e.target.value)}
                    placeholder="e.g. Any weekday after March 25"
                    required
                    className={inputCls}
                  />
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Logos */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <SectionCard
              title="Organization Logos"
              icon={<Building2 className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderLogoUpload(
                  "org-logo",
                  "Organization Logo",
                  true,
                  organizationLogo,
                  isUploadingMain,
                  setOrganizationLogo,
                  setIsUploadingMain,
                )}
                {renderLogoUpload(
                  "alt-logo",
                  "Alternative Logo (optional)",
                  false,
                  alternativeLogo,
                  isUploadingAlt,
                  setAlternativeLogo,
                  setIsUploadingAlt,
                )}
              </div>
            </SectionCard>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              type="submit"
              disabled={isSubmitting || isUploadingMain || isUploadingAlt}
              className="relative w-full py-4 rounded-2xl bg-cr-green text-black font-black text-base hover:bg-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Partnership Application{" "}
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

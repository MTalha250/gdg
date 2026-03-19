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
  CheckCircle,
  User,
  GraduationCap,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const PROMOTION_METHODS = [
  "Social Media",
  "WhatsApp Groups",
  "University Networks",
  "Friends",
  "Other",
];

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year",
  "Graduate",
];

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

export default function AmbassadorPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    city: "",
    university: "",
    degree: "",
    yearOfStudy: "",
    motivation: "",
    hasExperience: "",
    experienceDetails: "",
    isAvailable: "",
    promotionMethods: [] as string[],
    linkedIn: "",
    instagram: "",
    agreesToResponsibilities: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const togglePromotion = (method: string) => {
    setForm((p) => ({
      ...p,
      promotionMethods: p.promotionMethods.includes(method)
        ? p.promotionMethods.filter((m) => m !== method)
        : [...p.promotionMethods, method],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.hasExperience === "") {
      toast.error("Please indicate if you have prior experience");
      return;
    }
    if (form.isAvailable === "") {
      toast.error("Please indicate your availability");
      return;
    }
    if (form.promotionMethods.length === 0) {
      toast.error("Please select at least one promotion method");
      return;
    }
    if (form.agreesToResponsibilities === "") {
      toast.error("Please confirm you agree to ambassador responsibilities");
      return;
    }
    if (form.agreesToResponsibilities === "no") {
      toast.error(
        "You must agree to ambassador responsibilities to submit",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/ambassadors`, {
        ...form,
        hasExperience: form.hasExperience === "yes",
        isAvailable: form.isAvailable === "yes",
        agreesToResponsibilities: form.agreesToResponsibilities === "yes",
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
                    {form.fullName}
                  </span>
                  .
                </p>
                <p className="text-white/35 text-xs mb-8">
                  Our team will review your ambassador application and get back
                  to you soon.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-8 text-left space-y-3">
                  <p className="text-xs text-cr-green/60 uppercase tracking-widest font-medium mb-2">
                    What happens next
                  </p>
                  {[
                    "Check your inbox for a confirmation email",
                    "Our team will review your application",
                    "We'll reach out soon with next steps",
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
              2026 · Ambassador Program
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-space-grotesk font-black text-white mb-2 leading-tight">
            Become an
            <br />
            Ambassador
          </h1>
          <p className="text-white/35 text-sm max-w-lg">
            Represent CodeRush 2026 at your university. Help us spread the word
            and build the biggest multi-discipline tech competition in Pakistan.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <SectionCard
              title="Personal Information"
              icon={<User className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="Full Name *"
                    required
                    className={inputCls}
                  />
                </div>
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
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="WhatsApp Number *"
                  required
                  className={inputCls}
                />
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="City *"
                  required
                  className={inputCls}
                />
              </div>
            </SectionCard>
          </motion.div>

          {/* Academic Info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <SectionCard
              title="Academic Information"
              icon={<GraduationCap className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={form.university}
                    onChange={(e) => set("university", e.target.value)}
                    placeholder="University / Organization Name *"
                    required
                    className={inputCls}
                  />
                </div>
                <input
                  type="text"
                  value={form.degree}
                  onChange={(e) => set("degree", e.target.value)}
                  placeholder="Degree / Program *"
                  required
                  className={inputCls}
                />
                <div className="relative">
                  <select
                    value={form.yearOfStudy}
                    onChange={(e) => set("yearOfStudy", e.target.value)}
                    required
                    className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-cr-green/40 focus:bg-cr-green/[0.03] transition-all text-sm cursor-pointer"
                  >
                    <option value="" className="bg-[#0a0a0a]">
                      Year of Study *
                    </option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y} className="bg-[#0a0a0a]">
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                </div>
              </div>
            </SectionCard>
          </motion.div>

          {/* Ambassador Details */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <SectionCard
              title="Ambassador Details"
              icon={<Megaphone className="w-4 h-4" />}
            >
              <div className="space-y-5">
                {/* Motivation */}
                <div>
                  <p className="text-white/50 text-sm font-medium mb-2">
                    Why do you want to become an ambassador? *
                  </p>
                  <textarea
                    value={form.motivation}
                    onChange={(e) => set("motivation", e.target.value)}
                    placeholder="Tell us why you'd be a great ambassador..."
                    rows={3}
                    required
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {/* Prior experience */}
                <div>
                  <p className="text-white/50 text-sm font-medium mb-3">
                    Do you have prior ambassador / leadership experience? *
                  </p>
                  <div className="flex gap-3 mb-3">
                    {["yes", "no"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => set("hasExperience", val)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all capitalize ${
                          form.hasExperience === val
                            ? "border-cr-green/50 bg-cr-green/[0.08] text-cr-green"
                            : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.15] hover:text-white/60"
                        }`}
                      >
                        {val === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                  {form.hasExperience === "yes" && (
                    <input
                      type="text"
                      value={form.experienceDetails}
                      onChange={(e) =>
                        set("experienceDetails", e.target.value)
                      }
                      placeholder="Specify your experience (optional)"
                      className={inputCls}
                    />
                  )}
                </div>

                {/* Availability */}
                <div>
                  <p className="text-white/50 text-sm font-medium mb-3">
                    Are you available to promote the event actively? *
                  </p>
                  <div className="flex gap-3">
                    {["yes", "no"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => set("isAvailable", val)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all capitalize ${
                          form.isAvailable === val
                            ? "border-cr-green/50 bg-cr-green/[0.08] text-cr-green"
                            : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.15] hover:text-white/60"
                        }`}
                      >
                        {val === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promotion methods */}
                <div>
                  <p className="text-white/50 text-sm font-medium mb-3">
                    How will you promote the event? *
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PROMOTION_METHODS.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => togglePromotion(method)}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          form.promotionMethods.includes(method)
                            ? "border-cr-green/50 bg-cr-green/[0.08] text-cr-green"
                            : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.15] hover:text-white/60"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Social profiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={form.linkedIn}
                    onChange={(e) => set("linkedIn", e.target.value)}
                    placeholder="LinkedIn Profile URL *"
                    required
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={form.instagram}
                    onChange={(e) => set("instagram", e.target.value)}
                    placeholder="Instagram Profile (optional)"
                    className={inputCls}
                  />
                </div>

                {/* Agree */}
                <div>
                  <p className="text-white/50 text-sm font-medium mb-3">
                    Do you agree to fulfill ambassador responsibilities? *
                  </p>
                  <div className="flex gap-3">
                    {["yes", "no"].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => set("agreesToResponsibilities", val)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all capitalize ${
                          form.agreesToResponsibilities === val
                            ? val === "yes"
                              ? "border-cr-green/50 bg-cr-green/[0.08] text-cr-green"
                              : "border-red-500/50 bg-red-500/[0.08] text-red-400"
                            : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.15] hover:text-white/60"
                        }`}
                      >
                        {val === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
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
              disabled={isSubmitting}
              className="relative w-full py-4 rounded-2xl bg-cr-green text-black font-black text-base hover:bg-green transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Ambassador Application{" "}
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

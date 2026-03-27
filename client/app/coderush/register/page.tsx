"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Tag,
  CheckCircle,
  XCircle,
  Loader2,
  Upload,
  ChevronDown,
  Users,
  Trophy,
  CreditCard,
} from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const COMPETITIONS = [
  {
    id: "competitive-programming",
    name: "Competitive Programming",
    fee: 1800,
    earlyBird: 1500,
  },
  {
    id: "web-development",
    name: "Web Development",
    fee: 2500,
    earlyBird: 2200,
  },
  {
    id: "app-development",
    name: "App Development",
    fee: 2500,
    earlyBird: 2200,
  },
  { id: "ui-ux", name: "UI/UX Design", fee: 2000, earlyBird: 1700 },
  { id: "robotics", name: "Robotics", fee: 1500, earlyBird: 1200 },
  { id: "game-jam", name: "Game Jam", fee: 3000, earlyBird: 2700 },
  {
    id: "machine-learning",
    name: "Machine Learning",
    fee: 2500,
    earlyBird: 2200,
  },
  { id: "ctf", name: "Capture The Flag", fee: 2500, earlyBird: 2200 },
];

const ROBOTICS_MODULES = [
  { id: "rc-car-race", name: "RC Car Race", desc: "Build or modify an RC robot/car to race through a designed track." },
  { id: "line-following-robot", name: "Line Following Robot (LFR)", desc: "Autonomous robot that follows a predefined line using sensors." },
  { id: "robo-soccer", name: "Robo Soccer", desc: "RC-based robots compete in a football-style arena to score goals." },
];

interface Member {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  university: string;
  cnic: string;
}

const emptyMember = (): Member => ({
  name: "",
  email: "",
  phone: "",
  rollNumber: "",
  university: "",
  cnic: "",
});

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

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialComp = searchParams.get("competition") || "";

  const [competition, setCompetition] = useState(initialComp);
  const [roboticsModule, setRoboticsModule] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<Member[]>([emptyMember()]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherStatus, setVoucherStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [voucherData, setVoucherData] = useState<{
    discountedFee: number;
    discountDescription: string;
  } | null>(null);
  const [proofOfPayment, setProofOfPayment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedComp = COMPETITIONS.find((c) => c.id === competition);
  const regularFee = selectedComp?.fee || 0;
  const finalFee = voucherData ? voucherData.discountedFee : regularFee;

  const validateVoucher = useCallback(async () => {
    if (!voucherCode.trim() || !competition) return;
    setVoucherStatus("checking");
    setVoucherData(null);
    try {
      const res = await axios.post(`${API_URL}/vouchers/validate`, {
        code: voucherCode.trim().toUpperCase(),
        competition,
        fee: regularFee,
      });
      setVoucherStatus("valid");
      setVoucherData({
        discountedFee: res.data.discountedFee,
        discountDescription: res.data.discountDescription,
      });
      toast.success("Voucher applied!");
    } catch (err: any) {
      setVoucherStatus("invalid");
      toast.error(err.response?.data?.message || "Invalid voucher code");
    }
  }, [voucherCode, competition, regularFee]);

  useEffect(() => {
    setVoucherStatus("idle");
    setVoucherData(null);
    setRoboticsModule("");
  }, [competition]);

  const addMember = () => {
    if (members.length < 3) setMembers([...members, emptyMember()]);
  };
  const removeMember = (idx: number) => {
    if (members.length > 1) setMembers(members.filter((_, i) => i !== idx));
  };
  const updateMember = (idx: number, field: keyof Member, value: string) =>
    setMembers(
      members.map((m, i) => (i === idx ? { ...m, [field]: value } : m)),
    );

  const uploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setProofOfPayment(res.data.secure_url);
      toast.success("Payment proof uploaded!");
    } catch {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competition) {
      toast.error("Please select a competition");
      return;
    }
    if (competition === "robotics" && !roboticsModule) {
      toast.error("Please select a robotics module");
      return;
    }
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }
    if (!proofOfPayment) {
      toast.error("Please upload payment proof");
      return;
    }
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (
        !m.name ||
        !m.email ||
        !m.phone ||
        !m.rollNumber ||
        !m.university ||
        !m.cnic
      ) {
        toast.error(`Please fill in all fields for Member ${i + 1}`);
        return;
      }
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/coderush`, {
        competition,
        teamName: teamName.trim(),
        members: members.map((m, i) => ({ ...m, isTeamLead: i === 0 })),
        proofOfPayment,
        roboticsModule: competition === "robotics" ? roboticsModule : undefined,
        voucherCode:
          voucherStatus === "valid"
            ? voucherCode.trim().toUpperCase()
            : undefined,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── SUCCESS STATE ──
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
                  You're In!
                </h1>
                <p className="text-white/50 mb-1 text-sm">
                  Registration submitted for{" "}
                  <span className="text-white font-semibold">
                    CodeRush 2026
                  </span>
                  .
                </p>
                <p className="text-white/35 text-xs mb-8">
                  Confirmation sent to your team lead's email.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-8 text-left space-y-3">
                  <p className="text-xs text-cr-green/60 uppercase tracking-widest font-medium mb-2">
                    What happens next
                  </p>
                  {[
                    "Check your team lead's inbox for the confirmation email",
                    "Our team will verify your payment proof",
                    "You'll receive an acceptance email soon",
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

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/coderush"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06] transition-all text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to CodeRush
                  </Link>
                  <InteractiveHoverButton
                    onClick={() => {
                      setSubmitted(false);
                      setTeamName("");
                      setMembers([emptyMember()]);
                      setVoucherCode("");
                      setVoucherStatus("idle");
                      setVoucherData(null);
                      setProofOfPayment("");
                    }}
                    className="flex-1 bg-black border-cr-green/40 text-white"
                  >
                    Register Again
                  </InteractiveHoverButton>
                </div>
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
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cr-green/[0.05] blur-[110px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[300px] h-[300px] bg-cr-green/[0.03] blur-[90px] rounded-full" />
      </div>
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 pb-24 pt-24 sm:pt-28 max-w-4xl mx-auto">
        {/* Back */}
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

        {/* Header */}
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
              2026 · Team Registration
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-space-grotesk font-black text-white mb-2 leading-tight">
            Register Your Team
          </h1>
          <p className="text-white/35 text-sm">
            Member 1 is automatically the team lead. All fields required.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Competition */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <SectionCard
              title="Select Competition"
              icon={<Trophy className="w-4 h-4" />}
            >
              <div className="relative mb-4">
                <select
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  required
                  className="w-full appearance-none bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-cr-green/40 focus:bg-cr-green/[0.03] transition-all text-sm cursor-pointer"
                >
                  <option value="" className="bg-[#0a0a0a]">
                    — Select a competition —
                  </option>
                  {COMPETITIONS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0a0a0a]">
                      {c.name} — PKR {c.fee.toLocaleString()} regular
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>

              <AnimatePresence>
                {selectedComp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
                        <div className="text-white/30 text-xs mb-1">
                          Regular Fee
                        </div>
                        <div className="text-white font-bold">
                          PKR {selectedComp.fee.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-cr-green/[0.06] border border-cr-green/20 rounded-xl p-3 text-center">
                        <div className="text-cr-green/70 text-xs mb-1">
                          Early Bird
                        </div>
                        <div className="text-cr-green font-bold">
                          PKR {selectedComp.earlyBird.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-cr-green/25 bg-cr-green/[0.07] text-cr-green">
                      {selectedComp.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>
          </motion.div>

          {/* Robotics Module */}
          <AnimatePresence>
            {competition === "robotics" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SectionCard title="Select Module *" icon={<Trophy className="w-4 h-4" />}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ROBOTICS_MODULES.map((mod) => (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setRoboticsModule(mod.id)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          roboticsModule === mod.id
                            ? "border-cr-green/50 bg-cr-green/[0.08]"
                            : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.15]"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${roboticsModule === mod.id ? "border-cr-green bg-cr-green" : "border-white/20"}`} />
                          <span className={`font-bold text-sm ${roboticsModule === mod.id ? "text-cr-green" : "text-white"}`}>{mod.name}</span>
                        </div>
                        <p className="text-white/35 text-xs pl-5">{mod.desc}</p>
                      </button>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Team Name */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <SectionCard title="Team Name" icon={<Users className="w-4 h-4" />}>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. The Debug Squad"
                required
                className={inputCls}
              />
            </SectionCard>
          </motion.div>

          {/* Members */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/[0.05] bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <span className="text-cr-green">
                    <Users className="w-4 h-4" />
                  </span>
                  <h2 className="text-white font-semibold text-sm">
                    Team Members
                    <span className="ml-2 text-white/30 font-normal">
                      {members.length}/3
                    </span>
                  </h2>
                </div>
                {members.length < 3 && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cr-green/20 bg-cr-green/[0.06] text-cr-green text-xs font-medium hover:bg-cr-green/[0.12] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Member
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                <AnimatePresence>
                  {members.map((member, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Member header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? "bg-cr-green text-black" : "bg-white/[0.06] border border-white/[0.1] text-white/50"}`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white/70">
                            Member {idx + 1}
                          </span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-cr-green/10 border border-cr-green/20 text-cr-green text-xs font-medium">
                              Team Lead
                            </span>
                          )}
                        </div>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => removeMember(idx)}
                            className="ml-auto p-1.5 rounded-lg text-white/20 hover:text-red/70 hover:bg-red/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-11">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            updateMember(idx, "name", e.target.value)
                          }
                          placeholder="Full Name"
                          required
                          className={inputCls}
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            updateMember(idx, "email", e.target.value)
                          }
                          placeholder="Email Address"
                          required
                          className={inputCls}
                        />
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) =>
                            updateMember(idx, "phone", e.target.value)
                          }
                          placeholder="Phone Number"
                          required
                          className={inputCls}
                        />
                        <input
                          type="text"
                          value={member.university}
                          onChange={(e) =>
                            updateMember(idx, "university", e.target.value)
                          }
                          placeholder="University Name"
                          required
                          className={inputCls}
                        />
                        <input
                          type="text"
                          value={member.rollNumber}
                          onChange={(e) =>
                            updateMember(idx, "rollNumber", e.target.value)
                          }
                          placeholder="Roll Number / Student ID"
                          required
                          className={inputCls}
                        />
                        <input
                          type="text"
                          value={member.cnic}
                          onChange={(e) =>
                            updateMember(idx, "cnic", e.target.value)
                          }
                          placeholder="CNIC / B-Form Number"
                          required
                          className={inputCls}
                        />
                      </div>

                      {idx < members.length - 1 && (
                        <div className="mt-6 border-b border-white/[0.05]" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Voucher */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionCard
              title="Voucher Code (optional)"
              icon={<Tag className="w-4 h-4" />}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value.toUpperCase());
                    if (voucherStatus !== "idle") {
                      setVoucherStatus("idle");
                      setVoucherData(null);
                    }
                  }}
                  placeholder="EARLYBIRD2026"
                  className={`${inputCls} flex-1 uppercase tracking-widest font-mono`}
                />
                <button
                  type="button"
                  onClick={validateVoucher}
                  disabled={
                    !voucherCode.trim() ||
                    !competition ||
                    voucherStatus === "checking"
                  }
                  className="px-5 py-3 rounded-xl border border-cr-green/20 bg-cr-green/[0.07] text-cr-green text-sm font-semibold hover:bg-cr-green/[0.14] transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {voucherStatus === "checking" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {voucherStatus === "valid" && voucherData && (
                  <motion.div
                    key="valid"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-cr-green/[0.08] border border-cr-green/20"
                  >
                    <CheckCircle className="w-4 h-4 text-cr-green shrink-0" />
                    <div>
                      <p className="text-cr-green text-sm font-semibold">
                        {voucherData.discountDescription}
                      </p>
                      <p className="text-white/50 text-xs">
                        Final fee:{" "}
                        <span className="text-white font-bold">
                          PKR {voucherData.discountedFee.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
                {voucherStatus === "invalid" && (
                  <motion.div
                    key="invalid"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-red/[0.08] border border-red/20"
                  >
                    <XCircle className="w-4 h-4 text-red shrink-0" />
                    <p className="text-red text-sm">
                      Invalid or expired voucher code.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </SectionCard>
          </motion.div>

          {/* Payment */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <SectionCard
              title="Payment"
              icon={<CreditCard className="w-4 h-4" />}
            >
              {/* Amount due */}
              {selectedComp && (
                <div className="flex items-center justify-between px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-5">
                  <div>
                    <span className="text-white/40 text-xs uppercase tracking-wider">
                      Amount Due
                    </span>
                    {voucherStatus === "valid" && voucherData && (
                      <p className="text-white/25 text-xs line-through">
                        PKR {regularFee.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-2xl font-black font-space-grotesk ${voucherStatus === "valid" ? "text-cr-green" : "text-white"}`}
                  >
                    PKR {finalFee.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Bank details */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mb-5">
                <div className="px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.01]">
                  <p className="text-xs text-white/30 uppercase tracking-widest">
                    Transfer To
                  </p>
                </div>
                <div className="px-4 py-4 space-y-2.5 text-sm">
                  {[
                    { label: "Bank", value: "Meezan Bank" },
                    { label: "Account Title", value: "Muhammad Fasih Uddin" },
                    { label: "Account Number", value: "02860110211843" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-white/30 shrink-0">{label}</span>
                      <span className="text-white font-medium font-mono text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-white/25 text-xs mb-4 leading-relaxed">
                Transfer the exact amount shown above and upload a screenshot of
                the payment confirmation.
              </p>

              {/* Upload */}
              <div>
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Payment Proof *
                </p>
                <label
                  htmlFor="proof-upload"
                  className={`block rounded-xl border-2 border-dashed transition-all cursor-pointer ${isUploading ? "opacity-50 pointer-events-none" : ""} ${proofOfPayment ? "border-cr-green/30 bg-cr-green/[0.04]" : "border-white/[0.08] hover:border-cr-green/25 hover:bg-cr-green/[0.02]"}`}
                >
                  {proofOfPayment ? (
                    <div className="p-4 flex flex-col items-center gap-3">
                      <img
                        src={proofOfPayment}
                        alt="Payment proof"
                        className="max-h-48 rounded-lg object-contain"
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
                              Click to upload payment screenshot
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
                  id="proof-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadProof}
                  disabled={isUploading}
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
                  Complete Registration
                  {selectedComp && (
                    <span className="font-normal text-black/60 text-sm">
                      · PKR {finalFee.toLocaleString()}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-white/20 text-xs mt-3">
              By registering you agree to abide by all CodeRush 2026 competition
              rules.
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

export default function CoderushRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cr-green/30 animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

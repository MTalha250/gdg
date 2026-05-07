"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  Tag,
  Users,
} from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useAuthStore from "@/store/authStore";
import {
  COMPETITION_LABELS,
  ROBOTICS_MODULE_LABELS,
} from "@/types/coderush";

const COMPETITIONS = Object.entries(COMPETITION_LABELS).map(([value, label]) => ({ value, label }));
const ROBOTICS_MODULES = Object.entries(ROBOTICS_MODULE_LABELS).map(([value, label]) => ({ value, label }));

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
  "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white";

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const CoderushCreatePage = () => {
  const router = useRouter();
  const { token } = useAuthStore();

  const [competition, setCompetition] = useState("");
  const [roboticsModule, setRoboticsModule] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<Member[]>([emptyMember()]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherStatus, setVoucherStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [voucherData, setVoucherData] = useState<{ discountedFee: number; discountDescription: string } | null>(null);
  const [proofOfPayment, setProofOfPayment] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [initialStatus, setInitialStatus] = useState<"submitted" | "accepted">("submitted");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [regularFee, setRegularFee] = useState(0);

  // Fetch baseline fees from competition selection (we hardcode here since we know server values)
  const FEES: Record<string, number> = {
    "competitive-programming": 1800,
    "web-development": 2500,
    "app-development": 2500,
    "ui-ux": 2000,
    robotics: 2000,
    "game-jam": 2500,
    "machine-learning": 2500,
    ctf: 2500,
  };

  useEffect(() => {
    setRegularFee(FEES[competition] || 0);
    setVoucherStatus("idle");
    setVoucherData(null);
  }, [competition]);

  const finalFee = voucherData ? voucherData.discountedFee : regularFee;

  const updateMember = (i: number, field: keyof Member, value: string) => {
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  };

  const addMember = () => {
    if (members.length >= 3) return;
    setMembers([...members, emptyMember()]);
  };

  const removeMember = (i: number) => {
    if (members.length === 1) return;
    setMembers(members.filter((_, idx) => idx !== i));
  };

  const validateVoucher = async () => {
    if (!voucherCode.trim() || !competition) {
      toast.error("Select a competition first");
      return;
    }
    setVoucherStatus("checking");
    setVoucherData(null);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/validate`, {
        code: voucherCode.trim().toUpperCase(),
        competition,
        fee: regularFee,
      });
      setVoucherStatus("valid");
      setVoucherData({
        discountedFee: res.data.discountedFee,
        discountDescription: res.data.discountDescription,
      });
      toast.success("Voucher applied");
    } catch (err: any) {
      setVoucherStatus("invalid");
      toast.error(err.response?.data?.message || "Invalid voucher");
    }
  };

  const clearVoucher = () => {
    setVoucherCode("");
    setVoucherStatus("idle");
    setVoucherData(null);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      setProofOfPayment(res.data.secure_url);
      toast.success("Proof uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const validate = (): string | null => {
    if (!teamName.trim()) return "Team name is required";
    if (!competition) return "Select a competition";
    if (competition === "robotics" && !roboticsModule) return "Select a robotics module";
    if (members.length < 1) return "Add at least one member";
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      if (!m.name.trim()) return `Member ${i + 1}: name required`;
      if (!m.email.trim()) return `Member ${i + 1}: email required`;
      if (!m.phone.trim()) return `Member ${i + 1}: phone required`;
      if (!m.rollNumber.trim()) return `Member ${i + 1}: roll number required`;
      if (!m.university.trim()) return `Member ${i + 1}: university required`;
      if (!m.cnic.trim()) return `Member ${i + 1}: CNIC required`;
    }
    if (!proofOfPayment) return "Upload proof of payment";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        teamName: teamName.trim(),
        competition,
        roboticsModule: competition === "robotics" ? roboticsModule : undefined,
        members: members.map((m) => ({
          ...m,
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          phone: m.phone.trim(),
          rollNumber: m.rollNumber.trim(),
          university: m.university.trim(),
          cnic: m.cnic.trim(),
        })),
        proofOfPayment,
        voucherCode: voucherStatus === "valid" ? voucherCode.trim().toUpperCase() : undefined,
        status: initialStatus,
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/coderush/admin`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Registration created (${initialStatus})`);
      router.push("/coderush");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="New Registration" />
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Registration</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manually add a team after the public form has closed.
            </p>
          </div>
          <Link
            href="/coderush"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Competition + Team Name */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Team & Competition</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Team Name *</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className={inputCls}
                  placeholder="e.g. Code Crusaders"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Competition *</label>
                <select
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select a competition</option>
                  {COMPETITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              {competition === "robotics" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Robotics Module *</label>
                  <select
                    value={roboticsModule}
                    onChange={(e) => setRoboticsModule(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select a module</option>
                    {ROBOTICS_MODULES.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Members */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <Users className="w-4 h-4" /> Members ({members.length}/3) — first member is the team lead
              </h3>
              {members.length < 3 && (
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Member
                </button>
              )}
            </div>
            <div className="space-y-4">
              {members.map((m, i) => (
                <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-600 p-4 bg-gray-50 dark:bg-gray-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {i === 0 ? "Team Lead" : `Member ${i + 1}`}
                    </span>
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => removeMember(i)}
                        className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input className={inputCls} placeholder="Full Name" value={m.name} onChange={(e) => updateMember(i, "name", e.target.value)} />
                    <input className={inputCls} placeholder="Email" type="email" value={m.email} onChange={(e) => updateMember(i, "email", e.target.value)} />
                    <input className={inputCls} placeholder="Phone" value={m.phone} onChange={(e) => updateMember(i, "phone", e.target.value)} />
                    <input className={inputCls} placeholder="Roll Number" value={m.rollNumber} onChange={(e) => updateMember(i, "rollNumber", e.target.value)} />
                    <input className={inputCls} placeholder="University" value={m.university} onChange={(e) => updateMember(i, "university", e.target.value)} />
                    <input className={inputCls} placeholder="CNIC" value={m.cnic} onChange={(e) => updateMember(i, "cnic", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voucher */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Voucher (optional)
            </h3>
            <div className="flex gap-2">
              <input
                className={inputCls + " flex-1"}
                placeholder="VOUCHER CODE"
                value={voucherCode}
                onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherStatus("idle"); setVoucherData(null); }}
                disabled={!competition}
              />
              {voucherStatus === "valid" ? (
                <button type="button" onClick={clearVoucher} className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white whitespace-nowrap">
                  Clear
                </button>
              ) : (
                <button
                  type="button"
                  onClick={validateVoucher}
                  disabled={!voucherCode.trim() || !competition || voucherStatus === "checking"}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap disabled:opacity-50"
                >
                  {voucherStatus === "checking" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                </button>
              )}
            </div>
            {voucherStatus === "valid" && voucherData && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" /> {voucherData.discountDescription}
              </div>
            )}
            {voucherStatus === "invalid" && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <XCircle className="w-4 h-4" /> Invalid or inactive voucher
              </div>
            )}
          </div>

          {/* Proof of Payment */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Proof of Payment</h3>
            {proofOfPayment ? (
              <div className="space-y-2">
                <img src={proofOfPayment} alt="Proof" className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600" />
                <button type="button" onClick={() => setProofOfPayment("")} className="text-xs text-red-500 hover:underline">
                  Remove and re-upload
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400" />}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isUploading ? "Uploading..." : "Click to upload payment screenshot"}
                </span>
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={isUploading} />
              </label>
            )}
          </div>

          {/* Status + Fee summary */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Initial Status & Fee</h3>
            <div className="flex flex-wrap gap-3 items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={initialStatus === "submitted"}
                  onChange={() => setInitialStatus("submitted")}
                />
                <span className="text-gray-700 dark:text-gray-300">Submitted (review later)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={initialStatus === "accepted"}
                  onChange={() => setInitialStatus("accepted")}
                />
                <span className="text-green-600 dark:text-green-400 font-medium">Accepted (payment verified)</span>
              </label>
            </div>
            {regularFee > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-sm">
                <div className="rounded p-2 bg-gray-50 dark:bg-gray-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Regular</div>
                  <div className="font-semibold text-gray-800 dark:text-white">PKR {regularFee.toLocaleString()}</div>
                </div>
                <div className="rounded p-2 bg-green-50 dark:bg-green-900/20">
                  <div className="text-xs text-green-600 dark:text-green-400">Final Fee</div>
                  <div className="font-semibold text-green-700 dark:text-green-300">PKR {finalFee.toLocaleString()}</div>
                </div>
                {voucherData && (
                  <div className="rounded p-2 bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-xs text-blue-600 dark:text-blue-400">Discount</div>
                    <div className="font-semibold text-blue-700 dark:text-blue-300">PKR {(regularFee - finalFee).toLocaleString()}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/coderush"
              className="px-5 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Create Registration"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CoderushCreatePage;

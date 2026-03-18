"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { COMPETITION_LABELS, Competition } from "@/types/coderush";

const COMPETITIONS = Object.entries(COMPETITION_LABELS) as [Competition, string][];

const CreateVoucherPage = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "flat" as "flat" | "percentage",
    discountValue: "",
    scope: "global" as "global" | "specific",
    competitions: [] as Competition[],
    usageLimit: "",
    expiryDate: "",
    isActive: true,
  });

  const handleCompetitionToggle = (comp: Competition) => {
    setForm((prev) => ({
      ...prev,
      competitions: prev.competitions.includes(comp)
        ? prev.competitions.filter((c) => c !== comp)
        : [...prev.competitions, comp],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return toast.error("Voucher code is required");
    if (!form.discountValue || parseFloat(form.discountValue) <= 0)
      return toast.error("Discount value must be greater than 0");
    if (form.discountType === "percentage" && parseFloat(form.discountValue) > 100)
      return toast.error("Percentage discount cannot exceed 100%");
    if (form.scope === "specific" && form.competitions.length === 0)
      return toast.error("Select at least one competition for specific scope");

    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/vouchers`,
        {
          code: form.code,
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          scope: form.scope,
          competitions: form.scope === "specific" ? form.competitions : [],
          usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
          expiryDate: form.expiryDate || null,
          isActive: form.isActive,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Voucher created successfully");
      router.push("/vouchers");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create voucher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Create Voucher" />
      <ComponentCard title="New Discount Voucher">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Voucher Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g. EARLYBIRD"
              className="w-full px-4 py-2 border rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Discount Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="flat">Flat Amount (PKR)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max={form.discountType === "percentage" ? 100 : undefined}
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder={form.discountType === "flat" ? "e.g. 300" : "e.g. 20"}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Scope</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  value="global"
                  checked={form.scope === "global"}
                  onChange={() => setForm({ ...form, scope: "global", competitions: [] })}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Global (all competitions)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  value="specific"
                  checked={form.scope === "specific"}
                  onChange={() => setForm({ ...form, scope: "specific" })}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Specific competitions</span>
              </label>
            </div>
          </div>

          {/* Competition selector */}
          {form.scope === "specific" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Competitions <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {COMPETITIONS.map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input
                      type="checkbox"
                      checked={form.competitions.includes(value)}
                      onChange={() => handleCompetitionToggle(value)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Usage Limit + Expiry */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Usage Limit <span className="text-gray-400 font-normal">(leave blank for unlimited)</span>
              </label>
              <input
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="e.g. 100"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiry Date <span className="text-gray-400 font-normal">(leave blank for no expiry)</span>
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:bg-gray-700"></div>
            </label>
            <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push("/vouchers")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Voucher
            </button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
};

export default CreateVoucherPage;

"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Plus,
  Pencil,
  Tag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import Link from "next/link";
import { Voucher, COMPETITION_LABELS, Competition } from "@/types/coderush";

const VouchersPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const itemsPerPage = 20;
  const { token, user } = useAuthStore();
  const isMarketer = user?.role === "marketer";

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (activeFilter !== "all") params.append("isActive", activeFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/vouchers?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVouchers(response.data.vouchers);
      setTotalEntries(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch vouchers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchVouchers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeFilter, token]);

  useEffect(() => {
    if (!token) return;
    const id = setTimeout(() => { setCurrentPage(1); fetchVouchers(); }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleToggle = async (id: string) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/vouchers/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      fetchVouchers();
    } catch {
      toast.error("Failed to toggle voucher");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete voucher "${code}"?`)) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Voucher deleted");
      fetchVouchers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

  const isExpired = (v: Voucher) =>
    v.expiryDate ? new Date() > new Date(v.expiryDate) : false;

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const renderPagination = () => {
    const buttons = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`flex items-center justify-center w-10 h-10 rounded-md border ${
            currentPage === i
              ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Vouchers" />
      <div className="space-y-6">
        <ComponentCard title="Discount Vouchers">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <select
                  value={activeFilter}
                  onChange={(e) => { setActiveFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              {!isMarketer && (
                <Link
                  href="/vouchers/create"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" /> Create Voucher
                </Link>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <>
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        {["Code", "Discount", "Scope", "Usage", "Expiry", "Status", ...(isMarketer ? [] : ["Actions"])].map((h) => (
                          <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {vouchers.length > 0 ? (
                        vouchers.map((v) => (
                          <TableRow key={v._id}>
                            <TableCell className="px-5 py-4 text-start">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center shrink-0">
                                  <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="font-mono font-semibold text-gray-800 dark:text-white">{v.code}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <span className="font-medium text-gray-800 dark:text-white">
                                {v.discountType === "flat"
                                  ? `PKR ${v.discountValue.toLocaleString()} off`
                                  : `${v.discountValue}% off`}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              {v.scope === "global" ? (
                                <Badge color="info">Global</Badge>
                              ) : (
                                <div>
                                  <Badge color="warning">Specific</Badge>
                                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {v.competitions.map((c) => COMPETITION_LABELS[c] || c).join(", ")}
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm text-gray-600 dark:text-gray-300">
                              {v.usedCount} / {v.usageLimit ?? "∞"}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start text-sm">
                              {v.expiryDate ? (
                                <span className={isExpired(v) ? "text-red-500" : "text-gray-600 dark:text-gray-300"}>
                                  {formatDate(v.expiryDate)}
                                  {isExpired(v) && " (expired)"}
                                </span>
                              ) : (
                                <span className="text-gray-400">No expiry</span>
                              )}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              {v.isActive && !isExpired(v) ? (
                                <Badge color="success">Active</Badge>
                              ) : (
                                <Badge color="error">{isExpired(v) ? "Expired" : "Inactive"}</Badge>
                              )}
                            </TableCell>
                            {!isMarketer && (
                              <TableCell className="px-4 py-3 text-start">
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/vouchers/edit/${v._id}`}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    title="Edit"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => handleToggle(v._id)}
                                    className={`p-1.5 rounded-full transition-colors ${
                                      v.isActive
                                        ? "text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                                        : "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                                    }`}
                                    title={v.isActive ? "Deactivate" : "Activate"}
                                  >
                                    {v.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => handleDelete(v._id, v.code)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full dark:text-red-400 dark:hover:bg-red-900/20"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isMarketer ? 6 : 7} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No vouchers found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex gap-3 flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {totalEntries > 0
                      ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalEntries)} of ${totalEntries}`
                      : "No vouchers"}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    {totalPages > 0 && renderPagination()}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default VouchersPage;

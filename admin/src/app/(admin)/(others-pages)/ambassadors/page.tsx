"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Table, TableBody, TableCell, TableHeader, TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import {
  ChevronLeft, ChevronRight, Trash2, Loader2, Eye,
  User, Mail, Phone, MapPin, GraduationCap, ExternalLink, Download, Copy,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import {
  AmbassadorApplication, AmbassadorStatus, STATUS_COLORS,
} from "@/types/ambassador";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const AmbassadorsPage = () => {
  const [ambassadors, setAmbassadors] = useState<AmbassadorApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAmbassador, setSelectedAmbassador] = useState<AmbassadorApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token, user } = useAuthStore();
  const isMarketer = user?.role === "marketer";
  const itemsPerPage = 10;

  const fetchAmbassadors = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await axios.get(`${API_URL}/ambassadors?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAmbassadors(res.data.ambassadors);
      setTotalEntries(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to fetch ambassadors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAmbassadors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, token]);

  // Debounced search
  useEffect(() => {
    if (!token) return;
    const id = setTimeout(() => {
      setCurrentPage(1);
      fetchAmbassadors();
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleStatusUpdate = async (id: string, status: AmbassadorStatus) => {
    try {
      await axios.patch(`${API_URL}/ambassadors/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Status updated");
      if (selectedAmbassador?._id === id) setSelectedAmbassador((p) => p ? { ...p, status } : p);
      fetchAmbassadors();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ambassador application from "${name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/ambassadors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      if (selectedAmbassador?._id === id) { setIsModalOpen(false); setSelectedAmbassador(null); }
      fetchAmbassadors();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await axios.get(`${API_URL}/ambassadors?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all: AmbassadorApplication[] = res.data.ambassadors;
      const headers = ["Name", "Email", "Phone", "WhatsApp", "City", "University", "Degree", "Year", "Experience", "Available", "Promotion", "LinkedIn", "Instagram", "Status", "Date"];
      const rows = all.map((a) => [
        `"${a.fullName}"`, `"${a.email}"`, `"${a.phone}"`, `"${a.whatsapp}"`,
        `"${a.city}"`, `"${a.university}"`, `"${a.degree}"`, `"${a.yearOfStudy}"`,
        a.hasExperience ? "Yes" : "No", a.isAvailable ? "Yes" : "No",
        `"${a.promotionMethods.join("; ")}"`, `"${a.linkedIn}"`, `"${a.instagram}"`,
        a.status, new Date(a.createdAt).toLocaleDateString(),
      ].join(","));
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `ambassadors-${new Date().toISOString().split("T")[0]}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleCopyEmails = async () => {
    try {
      const res = await axios.get(`${API_URL}/ambassadors?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all: AmbassadorApplication[] = res.data.ambassadors;
      const emails = [...new Set(all.map((a) => a.email).filter(Boolean))];
      const text = emails.join(", ");
      navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      });
      toast.success(`Copied ${emails.length} emails`);
    } catch {
      toast.error("Failed to copy emails");
    }
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  const renderPagination = () => {
    const buttons = [];
    const max = 5;
    const start = Math.max(1, currentPage - Math.floor(max / 2));
    const end = Math.min(totalPages, start + max - 1);
    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`flex items-center justify-center w-10 h-10 rounded-md border ${
            currentPage === i
              ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return (
    <>
      <PageBreadcrumb pageTitle="Ambassadors" />
      <div className="space-y-6">
        <ComponentCard title="Ambassador Applications">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search name, email, university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-56 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button onClick={handleCopyEmails} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                  <Copy className="w-4 h-4" /> Copy Emails
                </button>
              </div>
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
                        {["Name", "University", "City", "Available", "Status", "Date", "Actions"].map((h) => (
                          <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {ambassadors.length > 0 ? ambassadors.map((a) => (
                        <TableRow key={a._id}>
                          <TableCell className="px-5 py-4 text-start">
                            <div
                              onClick={() => { setSelectedAmbassador(a); setIsModalOpen(true); }}
                              className="cursor-pointer"
                            >
                              <p className="font-medium text-gray-800 dark:text-white text-theme-sm hover:text-primary-600 dark:hover:text-primary-400">{a.fullName}</p>
                              <p className="text-xs text-gray-400">{a.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <div className="text-gray-800 text-theme-sm dark:text-white/90">{a.university}</div>
                            <div className="text-gray-500 text-theme-xs dark:text-gray-400">{a.degree} · {a.yearOfStudy}</div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-700 text-theme-sm dark:text-gray-300">
                            {a.city}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <span className={`text-xs font-medium ${a.isAvailable ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                              {a.isAvailable ? "Yes" : "No"}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[a.status]}`}>
                              {a.status}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {formatDate(a.createdAt)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setSelectedAmbassador(a); setIsModalOpen(true); }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {!isMarketer && (
                                <button
                                  onClick={() => handleDelete(a._id, a.fullName)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-full dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No ambassador applications found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex gap-3 flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {totalEntries > 0
                      ? `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, totalEntries)} of ${totalEntries} entries`
                      : "No entries"}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1 || totalPages === 0} className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    {totalPages > 0 && renderPagination()}
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0} className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ComponentCard>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedAmbassador(null); }} className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
          {selectedAmbassador && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedAmbassador.fullName}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[selectedAmbassador.status]}`}>
                    {selectedAmbassador.status}
                  </span>
                  <span className="text-xs text-gray-400">{selectedAmbassador.city}</span>
                </div>
              </div>

              {/* Contact + Academic grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</p>
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400 shrink-0" /><a href={`mailto:${selectedAmbassador.email}`} className="text-blue-600 hover:underline">{selectedAmbassador.email}</a></div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{selectedAmbassador.phone}</span></div>
                  <div className="flex items-center gap-2 text-sm"><span className="text-gray-400 text-xs shrink-0">WhatsApp:</span><span className="text-gray-700 dark:text-gray-300">{selectedAmbassador.whatsapp}</span></div>
                  <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{selectedAmbassador.city}</span></div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Academic</p>
                  <div className="flex items-center gap-2 text-sm"><GraduationCap className="w-4 h-4 text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{selectedAmbassador.university}</span></div>
                  <div className="flex items-center gap-2 text-sm"><span className="text-gray-400 text-xs shrink-0">Program:</span><span className="text-gray-700 dark:text-gray-300">{selectedAmbassador.degree} · {selectedAmbassador.yearOfStudy}</span></div>
                </div>
              </div>

              {/* Ambassador details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ambassador Details</p>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Prior Experience</span><span className="font-semibold text-gray-800 dark:text-white">{selectedAmbassador.hasExperience ? "Yes" : "No"}{selectedAmbassador.experienceDetails ? ` — ${selectedAmbassador.experienceDetails}` : ""}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Available</span><span className={`font-semibold ${selectedAmbassador.isAvailable ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>{selectedAmbassador.isAvailable ? "Yes" : "No"}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Promotion</span><span className="font-semibold text-gray-800 dark:text-white">{selectedAmbassador.promotionMethods.join(", ")}</span></div>
              </div>

              {/* Social */}
              <div className="flex flex-wrap gap-3">
                <a href={selectedAmbassador.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm dark:bg-blue-900/20 dark:text-blue-400 hover:underline">
                  LinkedIn <ExternalLink className="w-3 h-3" />
                </a>
                {selectedAmbassador.instagram && (
                  <span className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm dark:bg-pink-900/20 dark:text-pink-400">
                    IG: {selectedAmbassador.instagram}
                  </span>
                )}
              </div>

              {/* Motivation */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Motivation</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">{selectedAmbassador.motivation}</p>
              </div>

              {/* Status update */}
              {!isMarketer && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-3">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {(["new", "contacted", "approved", "rejected"] as AmbassadorStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(selectedAmbassador._id, s)}
                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                          selectedAmbassador.status === s
                            ? s === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : s === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : s === "contacted" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                {!isMarketer ? (
                  <button
                    onClick={() => handleDelete(selectedAmbassador._id, selectedAmbassador.fullName)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                ) : <span />}
                <button
                  onClick={() => { setIsModalOpen(false); setSelectedAmbassador(null); }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AmbassadorsPage;

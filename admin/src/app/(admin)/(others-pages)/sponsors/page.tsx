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
  Building2, User, Mail, Phone, Globe, ExternalLink, Download, Copy,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import {
  SponsorApplication, SponsorStatus,
  PACKAGE_LABELS, PACKAGE_COLORS, STATUS_COLORS,
} from "@/types/sponsor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const PACKAGES = [
  { value: "all", label: "All Packages" },
  { value: "platinum", label: "Platinum" },
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "bronze", label: "Bronze" },
  { value: "custom", label: "Custom" },
];

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "confirmed", label: "Confirmed" },
  { value: "rejected", label: "Rejected" },
];

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState<SponsorApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token } = useAuthStore();
  const itemsPerPage = 10;

  const fetchSponsors = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (packageFilter !== "all") params.append("pkg", packageFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await axios.get(`${API_URL}/sponsors?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSponsors(res.data.sponsors);
      setTotalEntries(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to fetch sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSponsors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, packageFilter, token]);

  // Debounced search
  useEffect(() => {
    if (!token) return;
    const id = setTimeout(() => {
      setCurrentPage(1);
      fetchSponsors();
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleStatusUpdate = async (id: string, status: SponsorStatus) => {
    try {
      await axios.patch(`${API_URL}/sponsors/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Status updated");
      if (selectedSponsor?._id === id) setSelectedSponsor((p) => p ? { ...p, status } : p);
      fetchSponsors();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string, companyName: string) => {
    if (!confirm(`Delete sponsor application from "${companyName}"?`)) return;
    try {
      await axios.delete(`${API_URL}/sponsors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      if (selectedSponsor?._id === id) { setIsModalOpen(false); setSelectedSponsor(null); }
      fetchSponsors();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await axios.get(`${API_URL}/sponsors?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all: SponsorApplication[] = res.data.sponsors;
      const headers = ["Company", "Industry", "Size", "Website", "Contact", "Job Title", "Email", "Phone", "WhatsApp", "CNIC", "Package", "Stall", "Status", "Date"];
      const rows = all.map((s) => [
        `"${s.companyName}"`, `"${s.industry}"`, `"${s.companySize}"`, `"${s.companyWebsite}"`,
        `"${s.fullName}"`, `"${s.jobTitle}"`, `"${s.email}"`, `"${s.phone}"`,
        `"${s.whatsapp}"`, `"${s.cnic}"`, s.package,
        s.wantsStall ? "Yes" : "No", s.status,
        new Date(s.createdAt).toLocaleDateString(),
      ].join(","));
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sponsors-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleCopyEmails = async () => {
    try {
      const res = await axios.get(`${API_URL}/sponsors?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all: SponsorApplication[] = res.data.sponsors;
      const emails = [...new Set(all.map((s) => s.email).filter(Boolean))];
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
      <PageBreadcrumb pageTitle="Sponsors" />
      <div className="space-y-6">
        <ComponentCard title="Sponsor Applications">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search company, name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-56 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <select
                  value={packageFilter}
                  onChange={(e) => { setPackageFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {PACKAGES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
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
                        {["Company", "Contact", "Package", "Stall", "Status", "Date", "Actions"].map((h) => (
                          <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {sponsors.length > 0 ? sponsors.map((s) => (
                        <TableRow key={s._id}>
                          <TableCell className="px-5 py-4 text-start">
                            <div
                              onClick={() => { setSelectedSponsor(s); setIsModalOpen(true); }}
                              className="cursor-pointer flex items-center gap-3"
                            >
                              {s.companyLogo ? (
                                <img src={s.companyLogo} alt={s.companyName} className="w-9 h-9 rounded object-contain bg-gray-100 dark:bg-gray-800 p-0.5 shrink-0" />
                              ) : (
                                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center shrink-0">
                                  <Building2 className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-800 dark:text-white text-theme-sm hover:text-primary-600 dark:hover:text-primary-400">{s.companyName}</p>
                                {s.industry && <p className="text-xs text-gray-400">{s.industry}</p>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{s.fullName}</div>
                            <div className="text-gray-500 text-theme-xs dark:text-gray-400">{s.email}</div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PACKAGE_COLORS[s.package]}`}>
                              {PACKAGE_LABELS[s.package]}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <span className={`text-xs font-medium ${s.wantsStall ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                              {s.wantsStall ? "Yes" : "No"}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[s.status]}`}>
                              {s.status}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                            {formatDate(s.createdAt)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-start">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => { setSelectedSponsor(s); setIsModalOpen(true); }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(s._id, s.companyName)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-full dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No sponsor applications found.
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
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedSponsor(null); }} className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
          {selectedSponsor && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {selectedSponsor.companyLogo ? (
                    <img src={selectedSponsor.companyLogo} alt={selectedSponsor.companyName} className="w-16 h-16 rounded-xl object-contain bg-gray-100 dark:bg-gray-700 p-1" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedSponsor.companyName}</h2>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PACKAGE_COLORS[selectedSponsor.package]}`}>
                        {PACKAGE_LABELS[selectedSponsor.package]}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[selectedSponsor.status]}`}>
                        {selectedSponsor.status}
                      </span>
                      {selectedSponsor.companySize && (
                        <span className="text-xs text-gray-400">{selectedSponsor.companySize}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company + Contact grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company Info</p>
                  {selectedSponsor.industry && (
                    <div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{selectedSponsor.industry}</span></div>
                  )}
                  {selectedSponsor.companyWebsite && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                      <a href={selectedSponsor.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        Visit Website <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact Person</p>
                  <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{selectedSponsor.fullName} · {selectedSponsor.jobTitle}</span></div>
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400 shrink-0" /><a href={`mailto:${selectedSponsor.email}`} className="text-blue-600 hover:underline">{selectedSponsor.email}</a></div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400 shrink-0" /><span className="text-gray-700 dark:text-gray-300">{selectedSponsor.phone}</span></div>
                  {selectedSponsor.whatsapp && (
                    <div className="flex items-center gap-2 text-sm"><span className="text-gray-400 text-xs shrink-0">WhatsApp:</span><span className="text-gray-700 dark:text-gray-300">{selectedSponsor.whatsapp}</span></div>
                  )}
                  {selectedSponsor.cnic && (
                    <div className="flex items-center gap-2 text-sm"><span className="text-gray-400 text-xs shrink-0">CNIC:</span><span className="text-gray-700 dark:text-gray-300">{selectedSponsor.cnic}</span></div>
                  )}
                </div>
              </div>

              {/* Sponsorship details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sponsorship Details</p>
                <div className="flex justify-between text-sm mb-2"><span className="text-gray-500 dark:text-gray-400">Package</span><span className="font-semibold text-gray-800 dark:text-white">{PACKAGE_LABELS[selectedSponsor.package]}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Company Stall</span><span className={`font-semibold ${selectedSponsor.wantsStall ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>{selectedSponsor.wantsStall ? "Yes" : "No"}</span></div>
              </div>

              {/* Requirements / Comments */}
              {(selectedSponsor.requirements || selectedSponsor.comments) && (
                <div className="space-y-3">
                  {selectedSponsor.requirements && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Requirements</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">{selectedSponsor.requirements}</p>
                    </div>
                  )}
                  {selectedSponsor.comments && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Comments</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">{selectedSponsor.comments}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Status update */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {(["new", "contacted", "confirmed", "rejected"] as SponsorStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(selectedSponsor._id, s)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                        selectedSponsor.status === s
                          ? s === "confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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

              {/* Footer */}
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleDelete(selectedSponsor._id, selectedSponsor.companyName)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => { setIsModalOpen(false); setSelectedSponsor(null); }}
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

export default SponsorsPage;

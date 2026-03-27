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
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Eye,
  Users,
  User,
  Mail,
  Phone,
  IdCard,
  Building2,
  CreditCard,
  Download,
  Copy,
  Tag,
  Zap,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import {
  CoderushRegistration,
  Competition,
  COMPETITION_LABELS,
  COMPETITION_COLORS,
} from "@/types/coderush";

const COMPETITIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Competitions" },
  { value: "competitive-programming", label: "Competitive Programming" },
  { value: "web-development", label: "Web Development" },
  { value: "app-development", label: "App Development" },
  { value: "ui-ux", label: "UI/UX Design" },
  { value: "robotics", label: "Robotics" },
  { value: "game-jam", label: "Game Jam" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "ctf", label: "Capture The Flag" },
];

const CoderushPage = () => {
  const [registrations, setRegistrations] = useState<CoderushRegistration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [competitionFilter, setCompetitionFilter] = useState("all");
  const [selectedRegistration, setSelectedRegistration] = useState<CoderushRegistration | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const itemsPerPage = 10;
  const { token } = useAuthStore();

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (competitionFilter !== "all") params.append("competition", competitionFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/coderush?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegistrations(response.data.registrations);
      setTotalEntries(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, competitionFilter, token]);

  useEffect(() => {
    if (!token) return;
    const id = setTimeout(() => {
      setCurrentPage(1);
      fetchRegistrations();
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleDelete = async (id: string, teamName: string) => {
    if (!confirm(`Delete registration for team "${teamName}"?`)) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/coderush/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Registration deleted");
      fetchRegistrations();
      if (selectedRegistration?._id === id) setModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/coderush/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchRegistrations();
      if (selectedRegistration?._id === id) {
        setSelectedRegistration({ ...selectedRegistration, status } as any);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/coderush/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const all: CoderushRegistration[] = response.data;
      const headers = ["Team Name", "Competition", "Team Lead", "Email", "University", "Members", "Original Fee", "Discounted Fee", "Voucher", "Status", "Date"];
      const rows = all.map((r) => {
        const lead = r.members.find((m) => m.isTeamLead);
        return [
          `"${r.teamName}"`,
          `"${COMPETITION_LABELS[r.competition] || r.competition}"`,
          `"${lead?.name || ""}"`,
          `"${lead?.email || ""}"`,
          `"${lead?.university || ""}"`,
          r.members.length,
          r.originalFee,
          r.discountedFee,
          r.voucherCode || "",
          r.status,
          new Date(r.createdAt).toLocaleDateString(),
        ].join(",");
      });
      const csv = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `coderush-registrations-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleCopyEmails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/coderush/all`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const all: CoderushRegistration[] = response.data;
      const emails = all.flatMap((r) => r.members.map((m) => m.email)).filter(Boolean);
      const text = [...new Set(emails)].join(", ");
      navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      });
      toast.success(`Copied ${[...new Set(emails)].length} emails`);
    } catch {
      toast.error("Failed to copy emails");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "accepted") return <Badge color="success">Accepted</Badge>;
    if (status === "rejected") return <Badge color="error">Rejected</Badge>;
    return <Badge color="warning">Submitted</Badge>;
  };

  const getCompetitionBadge = (competition: Competition) => {
    const label = COMPETITION_LABELS[competition] || competition;
    const color = COMPETITION_COLORS[competition] || "bg-gray-100 text-gray-700";
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

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

  return (
    <>
      <PageBreadcrumb pageTitle="Coderush 2026" />
      <div className="space-y-6">
        <ComponentCard title="Team Registrations">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-56 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <select
                  value={competitionFilter}
                  onChange={(e) => { setCompetitionFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {COMPETITIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" /> Export CSV
                </button>
                <button
                  onClick={handleCopyEmails}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                >
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
                        {["Team", "Competition", "Team Lead", "Members", "Fee", "Status", "Date", "Actions"].map((h) => (
                          <TableCell key={h} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {registrations.length > 0 ? (
                        registrations.map((reg) => {
                          const lead = reg.members.find((m) => m.isTeamLead);
                          return (
                            <TableRow key={reg._id}>
                              <TableCell className="px-5 py-4 text-start">
                                <div
                                  onClick={() => { setSelectedRegistration(reg); setModalOpen(true); }}
                                  className="cursor-pointer flex items-center gap-3"
                                >
                                  <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center shrink-0">
                                    <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90 hover:text-primary-600 dark:hover:text-primary-400 truncate max-w-[120px]">
                                    {reg.teamName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                {getCompetitionBadge(reg.competition)}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{lead?.name}</div>
                                <div className="text-gray-500 text-theme-xs dark:text-gray-400 truncate max-w-[140px]">{lead?.email}</div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <div className="flex items-center gap-1 text-gray-600 text-theme-sm dark:text-gray-300">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  {reg.members.length}
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <div className="text-gray-800 dark:text-white/90 text-theme-sm font-medium">
                                  PKR {reg.discountedFee.toLocaleString()}
                                </div>
                                {reg.voucherCode && (
                                  <div className="flex items-center gap-1 text-green-600 text-theme-xs">
                                    <Tag className="w-3 h-3" /> {reg.voucherCode}
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                {getStatusBadge(reg.status)}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                {formatDate(reg.createdAt)}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => { setSelectedRegistration(reg); setModalOpen(true); }}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    title="View"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(reg._id, reg.teamName)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full dark:text-red-400 dark:hover:bg-red-900/20"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No registrations found.
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
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1 || totalPages === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    {totalPages > 0 && renderPagination()}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
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

      {/* Detail Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
          {selectedRegistration && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{selectedRegistration.teamName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getCompetitionBadge(selectedRegistration.competition)}
                      <span className="text-gray-500 text-sm dark:text-gray-400">
                        {formatDate(selectedRegistration.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee + Voucher */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Original Fee</div>
                  <div className="font-semibold text-gray-800 dark:text-white">PKR {selectedRegistration.originalFee.toLocaleString()}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                  <div className="text-xs text-green-600 dark:text-green-400">Paid Fee</div>
                  <div className="font-semibold text-green-700 dark:text-green-300">PKR {selectedRegistration.discountedFee.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Voucher</div>
                  <div className="font-semibold text-gray-800 dark:text-white">{selectedRegistration.voucherCode || "—"}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Discount</div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    PKR {(selectedRegistration.originalFee - selectedRegistration.discountedFee).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status controls */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800 dark:text-white">Status</h4>
                  {getStatusBadge(selectedRegistration.status)}
                </div>
                <div className="flex gap-2">
                  {["submitted", "accepted", "rejected"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(selectedRegistration._id, s)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                        selectedRegistration.status === s
                          ? s === "accepted" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : s === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                  Team Members ({selectedRegistration.members.length})
                </h4>
                <div className="space-y-3">
                  {selectedRegistration.members.map((member, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900 dark:text-white">{member.name}</span>
                        </div>
                        {member.isTeamLead && <Badge color="info">Team Lead</Badge>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" />{member.email}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" />{member.phone}</div>
                        <div className="flex items-center gap-2"><IdCard className="w-4 h-4 shrink-0" />Roll: {member.rollNumber}</div>
                        <div className="flex items-center gap-2"><Building2 className="w-4 h-4 shrink-0" />{member.university}</div>
                        <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 shrink-0" />CNIC: {member.cnic}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Proof */}
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">Payment Proof</h4>
                <div className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img
                    src={selectedRegistration.proofOfPayment}
                    alt="Payment Proof"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                    <button
                      onClick={() => window.open(selectedRegistration.proofOfPayment, "_blank")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white px-3 py-1 rounded"
                    >
                      View Full
                    </button>
                  </div>
                </div>
              </div>

              {/* Payment ref */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Payment Reference</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-blue-800 dark:text-blue-200">
                  <div><span className="font-semibold">Expected Amount:</span> PKR {selectedRegistration.discountedFee.toLocaleString()}</div>
                  <div><span className="font-semibold">Bank:</span> MEEZAN BANK</div>
                  <div className="md:col-span-2"><span className="font-semibold">Account Name:</span> MUHAMMAD FASIH UDDIN</div>
                  <div><span className="font-semibold">Account:</span> 02860110211843</div>
                  <div><span className="font-semibold">IBAN:</span> PK39MEZN0002860110211843</div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleDelete(selectedRegistration._id, selectedRegistration.teamName)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => setModalOpen(false)}
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

export default CoderushPage;

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
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  Loader2,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  ExternalLink,
  Download,
  Copy,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import {
  CoreApplication,
  CoreFormConfig,
  CoreStatus,
  CORE_STATUSES,
  CORE_STATUS_COLORS,
  coreFullName,
} from "@/types/coreTeam";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

const csvCell = (v: string | number | boolean | null | undefined) =>
  `"${String(v ?? "").replace(/"/g, '""')}"`;

const CoreTeamPage = () => {
  const [applications, setApplications] = useState<CoreApplication[]>([]);
  const [config, setConfig] = useState<CoreFormConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [selected, setSelected] = useState<CoreApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { token } = useAuthStore();
  const itemsPerPage = 10;

  // Question labels come from the server so the form and this panel can't drift.
  const questionLabels: Record<string, string> = config
    ? Object.fromEntries(
        [
          ...config.commonQuestions,
          ...Object.values(config.positionQuestions).flat(),
        ].map((q) => [q.id, q.label])
      )
    : {};

  useEffect(() => {
    axios
      .get(`${API_URL}/core-team/config`)
      .then((res) => setConfig(res.data))
      .catch(() => toast.error("Failed to load form config"));
  }, []);

  const fetchApplications = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (positionFilter !== "all") params.append("position", positionFilter);
      if (searchTerm) params.append("search", searchTerm);

      const res = await axios.get(`${API_URL}/core-team?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
      setTotalEntries(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, positionFilter, token]);

  // Debounced search
  useEffect(() => {
    if (!token) return;
    const id = setTimeout(() => {
      setCurrentPage(1);
      fetchApplications();
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleStatusUpdate = async (id: string, status: CoreStatus) => {
    try {
      await axios.patch(
        `${API_URL}/core-team/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      if (selected?._id === id)
        setSelected((p) => (p ? { ...p, status } : p));
      fetchApplications();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete the application from "${name}"?`)) return;
    try {
      await axios.delete(`${API_URL}/core-team/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      if (selected?._id === id) {
        setIsModalOpen(false);
        setSelected(null);
      }
      fetchApplications();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const fetchAll = async (): Promise<CoreApplication[]> => {
    const res = await axios.get(`${API_URL}/core-team/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.applications;
  };

  // One CSV per position: the question columns differ between positions, so a
  // single flat sheet would be mostly empty cells.
  const handleExportCSV = async () => {
    try {
      const all = await fetchAll();
      if (all.length === 0) {
        toast.error("No applications to export");
        return;
      }

      const base = [
        "Name",
        "Position",
        "Email",
        "Alternate Email",
        "Phone",
        "Roll Number",
        "Department",
        "Semester",
        "LinkedIn",
        "GitHub",
        "Hours/Week",
        "Weekends",
        "Status",
        "Date",
      ];

      const positions = [...new Set(all.map((a) => a.position))];
      const sections: string[] = [];

      for (const position of positions) {
        const rows = all.filter((a) => a.position === position);
        const questions = config
          ? [
              ...config.commonQuestions,
              ...(config.positionQuestions[position] || []),
            ]
          : [];

        sections.push(`"${position}"`);
        sections.push(
          [...base, ...questions.map((q) => q.label)].map(csvCell).join(",")
        );
        for (const a of rows) {
          sections.push(
            [
              coreFullName(a),
              a.position,
              a.email,
              a.alternateEmail,
              a.phone,
              a.rollNumber,
              a.department === "Other" ? a.departmentOther : a.department,
              a.semester,
              a.linkedin,
              a.github,
              a.hoursPerWeek,
              a.weekendAvailability ? "Yes" : "No",
              a.status,
              new Date(a.createdAt).toLocaleDateString(),
              ...questions.map((q) => a.answers?.[q.id] || ""),
            ]
              .map(csvCell)
              .join(",")
          );
        }
        sections.push("");
      }

      const blob = new Blob([sections.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `core-team-applications-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${all.length} application(s)`);
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  const handleCopyEmails = async () => {
    try {
      const all = await fetchAll();
      const filtered = all.filter(
        (a) =>
          (statusFilter === "all" || a.status === statusFilter) &&
          (positionFilter === "all" || a.position === positionFilter)
      );
      const emails = [...new Set(filtered.map((a) => a.email).filter(Boolean))];
      if (emails.length === 0) {
        toast.error("No emails to copy");
        return;
      }
      const text = emails.join(", ");
      navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      });
      toast.success(`Copied ${emails.length} email(s)`);
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
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const selectedQuestions =
    selected && config
      ? [
          ...config.commonQuestions,
          ...(config.positionQuestions[selected.position] || []),
        ]
      : [];

  return (
    <>
      <PageBreadcrumb pageTitle="Core Team" />
      <div className="space-y-6">
        <ComponentCard title="Core Leadership Applications">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05] gap-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search name, email, roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-56 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <select
                  value={positionFilter}
                  onChange={(e) => {
                    setPositionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Positions</option>
                  {(config?.positions || []).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  {CORE_STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
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
                        {[
                          "Applicant",
                          "Position",
                          "Department",
                          "Commitment",
                          "Status",
                          "Date",
                          "Actions",
                        ].map((h) => (
                          <TableCell
                            key={h}
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {applications.length > 0 ? (
                        applications.map((a) => (
                          <TableRow key={a._id}>
                            <TableCell className="px-5 py-4 text-start">
                              <div
                                onClick={() => {
                                  setSelected(a);
                                  setIsModalOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <p className="font-medium text-gray-800 dark:text-white text-theme-sm hover:text-primary-600 dark:hover:text-primary-400">
                                  {coreFullName(a)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {a.email} · {a.rollNumber}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                              {a.position}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="text-gray-800 text-theme-sm dark:text-white/90">
                                {a.department === "Other"
                                  ? a.departmentOther
                                  : a.department}
                              </div>
                              <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                                {a.semester} semester
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="text-gray-700 text-theme-sm dark:text-gray-300">
                                {a.hoursPerWeek}
                              </div>
                              <div
                                className={`text-theme-xs ${
                                  a.weekendAvailability
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-500 dark:text-red-400"
                                }`}
                              >
                                Weekends: {a.weekendAvailability ? "Yes" : "No"}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                  CORE_STATUS_COLORS[a.status]
                                }`}
                              >
                                {a.status}
                              </span>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                              {formatDate(a.createdAt)}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelected(a);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full dark:text-blue-400 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(a._id, coreFullName(a))
                                  }
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-full dark:text-red-400 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                          >
                            No core team applications found.
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
                      ? `Showing ${
                          (currentPage - 1) * itemsPerPage + 1
                        } to ${Math.min(
                          currentPage * itemsPerPage,
                          totalEntries
                        )} of ${totalEntries} entries`
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelected(null);
        }}
        className="max-w-3xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
          {selected && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {coreFullName(selected)}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    {selected.position}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      CORE_STATUS_COLORS[selected.status]
                    }`}
                  >
                    {selected.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    Applied {formatDate(selected.createdAt)}
                  </span>
                </div>
              </div>

              {/* Contact + Academic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Contact
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <a
                      href={`mailto:${selected.email}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {selected.email}
                    </a>
                  </div>
                  {selected.alternateEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 text-xs shrink-0">Alt:</span>
                      <a
                        href={`mailto:${selected.alternateEmail}`}
                        className="text-blue-600 hover:underline break-all"
                      >
                        {selected.alternateEmail}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selected.phone}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Academic
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selected.department === "Other"
                        ? selected.departmentOther
                        : selected.department}{" "}
                      · {selected.semester} semester
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 text-xs shrink-0">Roll:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selected.rollNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {selected.linkedin && (
                  <a
                    href={selected.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm dark:bg-blue-900/20 dark:text-blue-400 hover:underline"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selected.github && (
                  <a
                    href={selected.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm dark:bg-gray-700 dark:text-gray-300 hover:underline"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Commitment */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Commitment
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Hours per week
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {selected.hoursPerWeek}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Weekends / evenings
                  </span>
                  <span
                    className={`font-semibold ${
                      selected.weekendAvailability
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-500"
                    }`}
                  >
                    {selected.weekendAvailability ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Declaration accepted
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {selected.declaration ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Answers
                </p>
                {(selectedQuestions.length > 0
                  ? selectedQuestions.map((q) => ({
                      id: q.id,
                      label: q.label,
                    }))
                  : Object.keys(selected.answers || {}).map((id) => ({
                      id,
                      label: questionLabels[id] || id,
                    }))
                ).map((q) => (
                  <div key={q.id}>
                    <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                      {q.label}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 whitespace-pre-wrap">
                      {selected.answers?.[q.id] || "—"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Status update */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {CORE_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusUpdate(selected._id, s)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                        selected.status === s
                          ? CORE_STATUS_COLORS[s]
                          : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Accepted and rejected send an email to the applicant.
                  Shortlisted does not.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() =>
                    handleDelete(selected._id, coreFullName(selected))
                  }
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelected(null);
                  }}
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

export default CoreTeamPage;

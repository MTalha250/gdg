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
  User, 
  Download,
  Copy,
  CheckCircle,
  XCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { Recruitment } from "@/types";

const Recruitments = () => {
  const [applications, setApplications] = useState<Recruitment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const itemsPerPage = 15;
  
  const { token } = useAuthStore();
  
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (teamFilter !== "all") params.append("team", teamFilter);
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (searchTerm) params.append("search", searchTerm);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/recruitment?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setApplications(response.data.applications);
      setTotalEntries(response.data.pagination.totalApplications);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      console.log("Error fetching applications:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch recruitment applications";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [currentPage, statusFilter, teamFilter, roleFilter, token]);

  // Debounced search effect
  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1); // Reset to first page when searching
        fetchApplications();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, token]);

  const handleDeleteApplication = async (id: string, fullName: string) => {
    if (confirm(`Are you sure you want to delete the application from ${fullName}?`)) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/recruitment/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Application deleted successfully");
        fetchApplications();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to delete application";
        toast.error(errorMessage);
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/recruitment/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status updated successfully");
      fetchApplications();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const exportToCSV = async () => {
    try {
      // Fetch ALL recruitment data (not paginated)
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (teamFilter !== "all") params.append("team", teamFilter);
      if (roleFilter !== "all") params.append("role", roleFilter);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/recruitment/all?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const allApplications = response.data.applications;
      
      const headers = [
        "Full Name", 
        "Email", 
        "Phone",
        "Roll Number",
        "Degree Program",
        "LinkedIn",
        "Selected Team",
        "Selected Role",
        "Why Join GDG",
        "Why This Team",
        "Relevant Skills",
        "Time Commitment",
        "Improvement Ideas",
        "Why Lead Team",
        "Leadership Experience",
        "Team Organization",
        "Handle Underperformers",
        "Team Vision",
        "Time Commitment Agreement",
        "Attendance Commitment",
        "Professionalism Commitment",
        "Status",
        "Applied Date"
      ];
      
      const csvData = allApplications.map((app: any) => [
        app.fullName || "",
        app.email || "",
        app.phone || "",
        app.rollNumber || "",
        app.degreeProgram || "",
        app.linkedin || "",
        app.selectedTeam || "",
        app.selectedRole ? app.selectedRole.charAt(0).toUpperCase() + app.selectedRole.slice(1) : "",
        app.whyJoin || "",
        app.whyThisTeam || "",
        app.relevantSkills || "",
        app.timeCommitment || "",
        app.improvementIdea || "",
        app.whyLeadTeam || "",
        app.leadershipExperience || "",
        app.teamOrganization || "",
        app.handleUnderperformers || "",
        app.teamVision || "",
        app.timeCommitmentAgreement ? "Yes" : "No",
        app.attendanceCommitment ? "Yes" : "No",
        app.professionalismCommitment ? "Yes" : "No",
        app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : "",
        app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 
        app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : ""
      ]);
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map((field: any) => `"${String(field).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recruitment-applications-full-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`CSV exported successfully with ${allApplications.length} records`);
    } catch (error: any) {
      console.error("Error exporting CSV:", error);
      const errorMessage = error.response?.data?.message || "Failed to export CSV";
      toast.error(errorMessage);
    }
  };

  // Simple clipboard copy function
  const copyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const copyEmails = async (statusType: "all" | "accepted" | "rejected") => {
    try {
      const params = new URLSearchParams();
      if (statusType !== "all") {
        params.append("status", statusType);
      }
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/recruitment/emails?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const emails = response.data.emails.join(", ");
      
      if (emails) {
        copyToClipboard(emails);
        toast.success(`${response.data.count} emails copied to clipboard`);
      } else {
        toast.error("No emails found for the selected criteria");
      }
    } catch (error: any) {
      console.log("Error in copyEmails:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch emails";
      toast.error(errorMessage);
    }
  };

  const copyVisibleEmails = () => {
    const visibleEmails = applications
      .map((app) => app.email)
      .filter((email): email is string => Boolean(email));

    if (visibleEmails.length > 0) {
      copyToClipboard(visibleEmails.join(", "));
      toast.success(`${visibleEmails.length} emails copied to clipboard`);
    } else {
      toast.error("No emails found on this page");
    }
  };

  const getStatusBadge = (status: string) => {
    // Handle undefined or null status
    if (!status) {
      return <Badge color="info">Unknown</Badge>;
    }

    // Normalize status to handle old data
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case "submitted":
        return <Badge color="warning">Submitted</Badge>;
      case "accepted":
        return <Badge color="success">Accepted</Badge>;
      case "rejected":
        return <Badge color="error">Rejected</Badge>;
      default:
        // Capitalize first letter for display
        const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
        return <Badge color="info">{displayStatus}</Badge>;
    }
  };

  const teams = [
    "Management Team",
    "Security Team", 
    "Protocol & Hospitality Team",
    "Logistics Team",
    "Outreach Team",
    "On-Campus Marketing Team",
    "Digital & Social Media Team",
    "Sponsorship Acquisition Team",
    "Community Partnerships Team",
    "Media Team",
    "Graphics Team",
    "Content Creation Team",
    "Video Editing & Reel Team",
    "Technical Team",
    "Bevy Team",
    "Decor Team",
    "Event Experience & Audience Team",
    "Documentation Team"
  ];

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    for (let i = startPage; i <= endPage; i++) {
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
      <PageBreadcrumb pageTitle="Recruitment Applications" />
      <div className="space-y-6">
        <ComponentCard title="Recruitment Management">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            {/* Filters and Actions */}
            <div className="p-4 border-b border-gray-100 dark:border-white/[0.05] space-y-4">
              {/* Search */}
              <div className="relative w-full lg:w-64">
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <select
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="appearance-none px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Teams</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="member">Member</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                
                <button
                  onClick={copyVisibleEmails}
                  className="inline-flex items-center px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Visible Emails
                </button>

                <button
                  onClick={() => copyEmails("all")}
                  className="inline-flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All Emails
                </button>
                
                <button
                  onClick={() => copyEmails("accepted")}
                  className="inline-flex items-center px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copy Accepted Emails
                </button>
                
                <button
                  onClick={() => copyEmails("rejected")}
                  className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Copy Rejected Emails
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
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Applicant
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Team & Role
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Status
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Applied Date
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {applications.length > 0 ? (
                        applications.map((application) => (
                          <TableRow key={application._id}>
                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center shrink-0">
                                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {application.fullName || 'Unknown Name'}
                                  </span>
                                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {application.email || 'No email'}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              <div>
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {application.selectedTeam || 'No team selected'}
                                </span>
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                  {application.selectedRole[0].toUpperCase() + application.selectedRole.slice(1) || 'No role selected'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-start">
                              {getStatusBadge(application.status)}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() :
                               'Unknown date'}
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/recruitments/${application._id}`}
                                  className="p-1.5 rounded-md text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20"
                                  title="View Details"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDeleteApplication(application._id, application.fullName)}
                                  className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                  title="Delete Application"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            No applications found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex gap-3 flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-white/[0.05]">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {totalEntries > 0 ? (
                      <>
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                        {Math.min(currentPage * itemsPerPage, totalEntries)} of{" "}
                        {totalEntries} entries
                      </>
                    ) : (
                      "No entries to show"
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1 || totalPages === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    {totalPages > 0 && renderPaginationButtons()}
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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

export default Recruitments;

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
import { ChevronLeft, ChevronRight, Trash2, Loader2, Eye, Gamepad2, Users } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { BrainGamesRegistration } from "@/types/brainGames";
import BrainGamesDetailModal from "@/components/brain-games/DetailModal";

const BrainGames = () => {
  const [registrations, setRegistrations] = useState<BrainGamesRegistration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRegistration, setSelectedRegistration] = useState<BrainGamesRegistration | null>(null);
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
      if (searchTerm) params.append("search", searchTerm);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/brain-games?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRegistrations(response.data.registrations);
      setTotalEntries(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      console.log("Error fetching registrations:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to fetch registrations";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRegistrations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, token]);

  useEffect(() => {
    if (token) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1);
        fetchRegistrations();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, token]);

  const handleDeleteRegistration = async (id: string, teamName: string) => {
    if (confirm(`Are you sure you want to delete the registration for team "${teamName}"?`)) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/brain-games/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Registration deleted successfully");
        fetchRegistrations();
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete registration";
        toast.error(errorMessage);
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/brain-games/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status updated successfully");
      fetchRegistrations();
      if (selectedRegistration && selectedRegistration._id === id) {
        setSelectedRegistration({ ...selectedRegistration, status } as any);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const openModal = (registration: BrainGamesRegistration) => {
    setSelectedRegistration(registration);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRegistration(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge color="success">Accepted</Badge>;
      case "rejected":
        return <Badge color="error">Rejected</Badge>;
      default:
        return <Badge color="warning">Submitted</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
      <PageBreadcrumb pageTitle="Brain Games 2025" />
      <div className="space-y-6">
        <ComponentCard title="Team Registrations">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-100 dark:border-white/[0.05]">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
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
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Team
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Team Lead
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Members
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Status
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Submitted Date
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {registrations.length > 0 ? (
                        registrations.map((registration) => {
                          const teamLead = registration.members.find((m) => m.isTeamLead);
                          return (
                            <TableRow key={registration._id}>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center shrink-0">
                                    <Gamepad2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                  </div>
                                  <div className="min-w-0">
                                    <div
                                      onClick={() => openModal(registration)}
                                      className="cursor-pointer block font-medium text-gray-800 text-theme-sm dark:text-white/90 truncate hover:text-primary-600 dark:hover:text-primary-400"
                                    >
                                      {registration.teamName}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <div
                                  onClick={() => openModal(registration)}
                                  className="cursor-pointer"
                                >
                                  <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {teamLead?.name || "N/A"}
                                  </div>
                                  <div className="text-gray-500 text-theme-xs dark:text-gray-400">
                                    {teamLead?.email || "N/A"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <div
                                  onClick={() => openModal(registration)}
                                  className="cursor-pointer flex items-center gap-1.5"
                                >
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600 text-theme-sm dark:text-gray-300">
                                    {registration.members.length} member{registration.members.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-start">
                                <div onClick={() => openModal(registration)} className="cursor-pointer">
                                  {getStatusBadge(registration.status)}
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                <div onClick={() => openModal(registration)} className="cursor-pointer">
                                  {formatDate(registration.createdAt)}
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => openModal(registration)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors dark:text-blue-400 dark:hover:bg-blue-900/20"
                                    title="View details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteRegistration(registration._id, registration.teamName)
                                    }
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                                    title="Delete registration"
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
                          <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                            {searchTerm || statusFilter !== "all"
                              ? "No registrations found matching your filters."
                              : "No registrations found."}
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

      {/* Detail Modal */}
      {selectedRegistration && (
        <BrainGamesDetailModal
          isOpen={modalOpen}
          onClose={closeModal}
          registration={selectedRegistration}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteRegistration}
        />
      )}
    </>
  );
};

export default BrainGames;

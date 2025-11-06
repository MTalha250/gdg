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
import { ChevronLeft, ChevronRight, Trash2, Loader2, Eye } from "lucide-react";
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

  const itemsPerPage = 15;
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Brain Games 2025" />

      <ComponentCard title="Brain Games Registrations">
        <div className="mb-6 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by team name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {registrations.length} of {totalEntries} registrations
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            No registrations found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Team Name</TableCell>
                    <TableCell>Team Lead</TableCell>
                    <TableCell>Members</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => {
                    const teamLead = registration.members.find((m) => m.isTeamLead);
                    return (
                      <TableRow
                        key={registration._id}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <TableCell>
                            {registration.teamName}
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{teamLead?.name || "N/A"}</div>
                            <div className="text-sm text-gray-500">{teamLead?.email || "N/A"}</div>
                        </TableCell>
                        <TableCell>
                            {registration.members.length}
                        </TableCell>
                        <TableCell>
                            {getStatusBadge(registration.status)}
                        </TableCell>
                        <TableCell>
                            {formatDate(registration.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(registration)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteRegistration(registration._id, registration.teamName)
                              }
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </ComponentCard>

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

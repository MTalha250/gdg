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
  Gamepad2,
  Users,
  User,
  Mail,
  Phone,
  IdCard,
  Building2,
  CreditCard
} from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { BrainGamesRegistration } from "@/types/brainGames";

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

      {/* Registration Detail Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-h-[90vh] overflow-y-auto">
          {selectedRegistration && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {selectedRegistration.teamName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Registered on {new Date(selectedRegistration.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                    Registration Status
                  </h4>
                  {getStatusBadge(selectedRegistration.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedRegistration._id, "submitted")}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedRegistration.status === "submitted"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                    }`}
                  >
                    Submitted
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRegistration._id, "accepted")}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedRegistration.status === "accepted"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedRegistration._id, "rejected")}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedRegistration.status === "rejected"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                  Team Members ({selectedRegistration.members.length})
                </h4>
                <div className="space-y-3">
                  {selectedRegistration.members.map((member, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {member.name}
                          </span>
                        </div>
                        {member.isTeamLead && (
                          <Badge color="info">Team Lead</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {member.email && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Mail className="w-4 h-4" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </div>
                        {member.rollNumber && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <IdCard className="w-4 h-4" />
                            <span>Roll: {member.rollNumber}</span>
                          </div>
                        )}
                        {member.university && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <Building2 className="w-4 h-4" />
                            <span>{member.university}</span>
                          </div>
                        )}
                        {member.cnic && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <CreditCard className="w-4 h-4" />
                            <span>CNIC: {member.cnic}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Proof */}
              <div>
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                  Payment Proof
                </h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="relative group">
                    <img
                      src={selectedRegistration.proofOfPayment}
                      alt="Payment Proof"
                      className="w-full h-auto object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => window.open(selectedRegistration.proofOfPayment, '_blank')}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white bg-black bg-opacity-50 px-3 py-1 rounded"
                      >
                        View Full
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
                  Payment Details Reference
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800 dark:text-blue-200">
                  <div>
                    <span className="font-semibold">Amount:</span> Rs 900
                  </div>
                  <div>
                    <span className="font-semibold">Bank:</span> MEEZAN BANK
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-semibold">Account Name:</span> MUHAMMAD FASIH UDDIN
                  </div>
                  <div>
                    <span className="font-semibold">Account:</span> 02860110211843
                  </div>
                  <div>
                    <span className="font-semibold">IBAN:</span> PK39MEZN0002860110211843
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    handleDeleteRegistration(selectedRegistration._id, selectedRegistration.teamName);
                    closeModal();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Registration
                </button>
                <button
                  onClick={closeModal}
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

export default BrainGames;

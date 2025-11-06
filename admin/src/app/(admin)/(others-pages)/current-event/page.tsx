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
import { Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

const CurrentEvent = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { token } = useAuthStore();

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/new-event`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions(response.data.data || response.data);
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSubmissions();
  }, [token]);

  const handleAccept = async (id: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/new-event/${id}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application Approved ✅");
      fetchSubmissions();
    } catch {
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Reject this application?")) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/new-event/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Application Rejected ❌");
      fetchSubmissions();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge color="success">Accepted</Badge>;
      case "rejected":
        return <Badge color="error">Rejected</Badge>;
      default:
        return <Badge color="warning">Pending</Badge>;
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Current Event Applications" />

      <div className="space-y-6">
        <ComponentCard
          title={
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-lg font-semibold">Event Registrations</h2>

              <div className="flex items-center gap-3">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search by team or leader..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-sm dark:text-gray-100 outline-none focus:ring focus:ring-primary-500/40"
                />

                {/* Filter Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20
                            bg-white dark:bg-gray-800 text-sm 
                            text-gray-800 dark:text-gray-100
                            outline-none focus:ring focus:ring-primary-500/40"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>

              </div>
            </div>
          }
          >
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-white/[0.08] dark:bg-white/[0.03]">

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-primary-500" size={32} />
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No applications found</div>
            ) : (
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-white/[0.08]">
                    <TableCell isHeader className="px-5 py-3 text-left">Team Name</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left">Leader</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left">Members</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left">Receipt</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left">Status</TableCell>
                    <TableCell isHeader className="px-5 py-3 text-left">Actions</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {submissions
                  .filter((app) =>
                    app.teamName.toLowerCase().includes(search.toLowerCase()) ||
                    app.leader.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .filter((app) =>
                    statusFilter === "all" ? true : app.status === statusFilter
                  )
                  .map((app) => (
                    <TableRow key={app._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.06] transition">
                      <TableCell className="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">
                        {app.teamName}
                      </TableCell>

                      <TableCell className="px-5 py-3 text-gray-800 dark:text-gray-100">
                        {app.leader.name}
                      </TableCell>

                      <TableCell className="px-5 py-3 text-gray-800 dark:text-gray-100">
                        {app.members.length + 1} total
                      </TableCell>

                      <TableCell className="px-5 py-3">
                        <a
                          href={app.receipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-600 hover:underline"
                        >
                          <ExternalLink size={16} /> View Receipt
                        </a>
                      </TableCell>

                      <TableCell className="px-5 py-3">{getStatusBadge(app.status)}</TableCell>

                      <TableCell className="px-5 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(app._id)}
                            className="p-1.5 rounded-md text-green-600 hover:bg-green-500/10"
                          >
                            <CheckCircle size={20} />
                          </button>

                          <button
                            onClick={() => handleReject(app._id)}
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-500/10"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default CurrentEvent;

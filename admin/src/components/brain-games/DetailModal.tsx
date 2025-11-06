"use client";
import { X, User, Mail, Phone, IdCard, Building2, CreditCard, Trash2 } from "lucide-react";
import { BrainGamesRegistration } from "@/types/brainGames";
import Badge from "@/components/ui/badge/Badge";

interface BrainGamesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: BrainGamesRegistration;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string, teamName: string) => void;
}

const BrainGamesDetailModal: React.FC<BrainGamesDetailModalProps> = ({
  isOpen,
  onClose,
  registration,
  onStatusUpdate,
  onDelete,
}) => {
  if (!isOpen) return null;

  const teamLead = registration.members.find((m) => m.isTeamLead);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge color="success">Accepted</Badge>;
      case "rejected":
        return <Badge color="danger">Rejected</Badge>;
      default:
        return <Badge color="warning">Submitted</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {registration.teamName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Registered on {formatDate(registration.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Registration Status
              </h3>
              {getStatusBadge(registration.status)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onStatusUpdate(registration._id, "submitted")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  registration.status === "submitted"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Submitted
              </button>
              <button
                onClick={() => onStatusUpdate(registration._id, "accepted")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  registration.status === "accepted"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Accept
              </button>
              <button
                onClick={() => onStatusUpdate(registration._id, "rejected")}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  registration.status === "rejected"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Reject
              </button>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Team Members ({registration.members.length})
            </h3>
            <div className="space-y-4">
              {registration.members.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </span>
                    </div>
                    {member.isTeamLead && (
                      <Badge color="primary">Team Lead</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {member.email && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span>{member.phone}</span>
                    </div>
                    {member.rollNumber && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <IdCard className="w-4 h-4" />
                        <span>Roll: {member.rollNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Building2 className="w-4 h-4" />
                      <span>{member.university}</span>
                    </div>
                    {member.cnic && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Payment Proof
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <a
                href={registration.proofOfPayment}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={registration.proofOfPayment}
                  alt="Payment Proof"
                  className="w-full max-h-96 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </a>
              <a
                href={registration.proofOfPayment}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open in new tab →
              </a>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Payment Details Reference
            </h3>
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(registration._id, registration.teamName);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Registration
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrainGamesDetailModal;

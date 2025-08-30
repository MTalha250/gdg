"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  UserCheck, 
  Clock,
  Calendar,
  Loader2,
  CheckCircle,
  XCircle,
  Linkedin
} from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import { Recruitment } from "@/types";

const RecruitmentDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuthStore();
  const applicationId = params.id as string;
  
  const [application, setApplication] = useState<Recruitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/recruitment/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setApplication(response.data);
    } catch (error: any) {
      console.error("Error fetching application:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch application details";
      toast.error(errorMessage);
      router.push("/recruitments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId && token) {
      fetchApplication();
    }
  }, [applicationId, token]);

  const handleStatusUpdate = async (status: string) => {
    try {
      setUpdateLoading(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/recruitment/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status updated successfully");
      fetchApplication(); // Refresh data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update status";
      toast.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge color="info">Unknown</Badge>;
    }

    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case "submitted":
        return <Badge color="warning">Submitted</Badge>;
      case "accepted":
        return <Badge color="success">Accepted</Badge>;
      case "rejected":
        return <Badge color="error">Rejected</Badge>;
      default:
        const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
        return <Badge color="info">{displayStatus}</Badge>;
    }
  };

  if (loading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Recruitment Details" />
        <div className="space-y-6">
          <ComponentCard title="Loading Application...">
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  if (!application) {
    return (
      <>
        <PageBreadcrumb pageTitle="Recruitment Details" />
        <div className="space-y-6">
          <ComponentCard title="Application Not Found">
            <div className="text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">
                The application you're looking for doesn't exist or has been removed.
              </p>
              <button
                onClick={() => router.push("/recruitments")}
                className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recruitments
              </button>
            </div>
          </ComponentCard>
        </div>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Recruitment Details" />
      <div className="space-y-6">
        {/* Header Card */}
        <ComponentCard title="Application Overview">
          <div className="space-y-6">
            {/* Back Button & Status */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push("/recruitments")}
                className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Recruitments
              </button>
              {getStatusBadge(application.status)}
            </div>

            {/* Applicant Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {application.fullName || 'Unknown Name'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {application.selectedTeam || 'No team selected'} • {application.selectedRole || 'No role selected'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              {application.status !== "accepted" && (
                <button
                  onClick={() => handleStatusUpdate("accepted")}
                  disabled={updateLoading}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept
                </button>
              )}
              
              {application.status !== "rejected" && (
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  disabled={updateLoading}
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </button>
              )}
            </div>
          </div>
        </ComponentCard>

        {/* Personal Information */}
        <ComponentCard title="Personal Information">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Email</label>
                  <p className="text-gray-800 dark:text-white">{application.email || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Phone</label>
                  <p className="text-gray-800 dark:text-white">{application.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Roll Number</label>
                  <p className="text-gray-800 dark:text-white">{application.rollNumber || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Degree Program</label>
                  <p className="text-gray-800 dark:text-white">{application.degreeProgram || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {application.linkedin && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-gray-400" />
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">LinkedIn Profile</label>
                  <a 
                    href={application.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {application.linkedin}
                  </a>
                </div>
              </div>
            </div>
          )}
        </ComponentCard>

        {/* Application Details */}
        <ComponentCard title="Application Details">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Why do you want to join GDG?</label>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                  {application.whyJoin || 'Not provided'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Why this team?</label>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                  {application.whyThisTeam || 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Relevant Skills</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                    {application.relevantSkills || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Time Commitment</label>
                <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-800 dark:text-white">
                    {application.timeCommitment || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Ideas for Improvement</label>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                  {application.improvementIdea || 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Leadership Questions (if Lead) */}
        {application.selectedRole === "lead" && (
          <ComponentCard title="Leadership Questions">
            <div className="space-y-6">
              {application.whyLeadTeam && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Why do you want to lead this team?</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                      {application.whyLeadTeam}
                    </p>
                  </div>
                </div>
              )}
              
              {application.leadershipExperience && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Leadership Experience</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                      {application.leadershipExperience}
                    </p>
                  </div>
                </div>
              )}
              
              {application.teamOrganization && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">How would you organize your team?</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                      {application.teamOrganization}
                    </p>
                  </div>
                </div>
              )}
              
              {application.handleUnderperformers && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">How would you handle underperformers?</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                      {application.handleUnderperformers}
                    </p>
                  </div>
                </div>
              )}
              
              {application.teamVision && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Team Vision</label>
                  <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                      {application.teamVision}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ComponentCard>
        )}

        {/* Application Meta */}
        <ComponentCard title="Application Information">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Applied Date</label>
                <p className="text-gray-800 dark:text-white">
                  {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Updated</label>
                <p className="text-gray-800 dark:text-white">
                  {application.updatedAt ? new Date(application.updatedAt).toLocaleDateString() : application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Application ID</label>
                <p className="text-gray-800 dark:text-white font-mono text-sm">
                  {application._id}
                </p>
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default RecruitmentDetails;

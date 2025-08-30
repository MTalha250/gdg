"use client";
import React, { useEffect, useState } from "react";
import { Clock, ExternalLink } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { DashboardStats } from "@/types";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";

export const RecentApplications = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
    }
  }, [token]);

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
      case "submitted":
        return <Badge color="warning">Submitted</Badge>;
      case "accepted":
        return <Badge color="success">Accepted</Badge>;
      case "rejected":
        return <Badge color="error">Rejected</Badge>;
      default:
        return <Badge color="info">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Applications
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
                    <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
                  </div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Applications
        </h3>
        <Link 
          href="/recruitments"
          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
        >
          View all
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {stats?.latestApplications && stats.latestApplications.length > 0 ? (
          stats.latestApplications.map((application) => (
            <div key={application._id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                  <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                    {application.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {application.fullName}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{application.selectedTeam}</span>
                    <span>•</span>
                    <span>{application.selectedRole[0].toUpperCase() + application.selectedRole.slice(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(application.status)}
                <Link 
                  href={`/recruitments/${application._id}`}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No recent applications</p>
          </div>
        )}
      </div>
    </div>
  );
};

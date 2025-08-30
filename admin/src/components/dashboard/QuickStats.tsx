"use client";
import React, { useEffect, useState } from "react";
import { Crown, TrendingUp, Calendar } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { DashboardStats } from "@/types";

export const QuickStats = () => {
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

  const getLeadApplications = () => {
    if (!stats?.roleStats) return 0;
    const leadStat = stats.roleStats.find(stat => stat._id === "lead");
    return leadStat?.count || 0;
  };

  const getAcceptanceRate = () => {
    if (!stats?.recruitmentStats || stats.recruitmentCount === 0) return 0;
    const acceptedStat = stats.recruitmentStats.find(stat => stat._id === "accepted");
    const acceptedCount = acceptedStat?.count || 0;
    return Math.round((acceptedCount / stats.recruitmentCount) * 100);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-24 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-8"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Stats
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Lead Applications</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {getLeadApplications()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Events</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {stats?.eventCount || 0}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {getAcceptanceRate()}%
          </span>
        </div>

        {/* Recent Activity Summary */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last 7 Days</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">New Applications</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {stats?.recentActivity?.recruitments || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">New Enquiries</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {stats?.recentActivity?.contacts || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">New Events</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {stats?.recentActivity?.events || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

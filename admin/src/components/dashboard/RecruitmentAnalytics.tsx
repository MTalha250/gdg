"use client";
import React, { useEffect, useState } from "react";
import { Users, Award, Target } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { DashboardStats } from "@/types";

export const RecruitmentAnalytics = () => {
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

  const getStatusPercentage = (status: string) => {
    if (!stats?.recruitmentStats || stats.recruitmentCount === 0) return 0;
    const statusStat = stats.recruitmentStats.find(stat => stat._id === status);
    return statusStat ? Math.round((statusStat.count / stats.recruitmentCount) * 100) : 0;
  };

  const getStatusCount = (status: string) => {
    if (!stats?.recruitmentStats) return 0;
    const statusStat = stats.recruitmentStats.find(stat => stat._id === status);
    return statusStat?.count || 0;
  };

  const getTopTeams = () => {
    if (!stats?.teamStats) return [];
    return stats.teamStats
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32"></div>
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Application Status Breakdown */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Application Status
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Submitted</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {getStatusCount("submitted")}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({getStatusPercentage("submitted")}%)
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Accepted</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {getStatusCount("accepted")}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({getStatusPercentage("accepted")}%)
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-error-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rejected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {getStatusCount("rejected")}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({getStatusPercentage("rejected")}%)
              </span>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-2 pt-2">
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-warning-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getStatusPercentage("submitted")}%` }}
              ></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-success-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getStatusPercentage("accepted")}%` }}
              ></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-error-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getStatusPercentage("rejected")}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Teams */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Popular Teams
        </h3>
        
        <div className="space-y-3">
          {getTopTeams().map((team, index) => {
            const maxCount = Math.max(...getTopTeams().map(t => t.count));
            const percentage = maxCount > 0 ? (team.count / maxCount) * 100 : 0;
            
            return (
              <div key={team._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900/20 rounded text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {team._id}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-8 text-right">
                    {team.count}
                  </span>
                </div>
              </div>
            );
          })}
          
          {getTopTeams().length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No team data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

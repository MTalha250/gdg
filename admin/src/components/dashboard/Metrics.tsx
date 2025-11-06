"use client";
import React, { useEffect, useState } from "react";
import { Users, Calendar, UserCheck, MessageSquare, Activity, TrendingUp, Gamepad2 } from "lucide-react";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import { DashboardStats } from "@/types";

export const Metrics = () => {
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

  const getRecentActivityTotal = () => {
    if (!stats?.recentActivity) return 0;
    return stats.recentActivity.contacts + stats.recentActivity.recruitments + stats.recentActivity.events + (stats.recentActivity.brainGames || 0);
  };

  const getAcceptedApplications = () => {
    if (!stats?.recruitmentStats) return 0;
    const acceptedStat = stats.recruitmentStats.find(stat => stat._id === "accepted");
    return acceptedStat?.count || 0;
  };

  const metrics = [
    {
      title: "Total Enquiries",
      value: stats?.contactCount || 0,
      icon: MessageSquare,
      color: "blue",
      bgColor: "bg-primary-100 dark:bg-primary-900/20",
      iconColor: "text-primary-600 dark:text-primary-400",
      description: "Contact form submissions",
    },
    {
      title: "Total Events",
      value: stats?.eventCount || 0,
      icon: Calendar,
      color: "green",
      bgColor: "bg-success-100 dark:bg-success-900/20",
      iconColor: "text-success-600 dark:text-success-400",
      description: "Published events",
    },
    {
      title: "Applications",
      value: stats?.recruitmentCount || 0,
      icon: UserCheck,
      color: "purple",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Recruitment applications",
    },
    {
      title: "Brain Games",
      value: stats?.brainGamesCount || 0,
      icon: Gamepad2,
      color: "pink",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      iconColor: "text-pink-600 dark:text-pink-400",
      description: "Team registrations",
    },
    {
      title: "Accepted Members",
      value: getAcceptedApplications(),
      icon: Users,
      color: "emerald",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description: "Approved applications",
    },
    {
      title: "Recent Activity",
      value: getRecentActivityTotal(),
      icon: Activity,
      color: "orange",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      description: "Last 7 days",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-2xl space-y-4 border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
              <div className="w-4 h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
              <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        
        return (
          <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${metric.bgColor}`}>
                <Icon className={`${metric.iconColor}`} size={20} />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.title}
              </h3>
              <div className="flex items-baseline space-x-1">
                <h4 className="font-bold text-gray-800 dark:text-white/90 text-2xl">
                  {metric.value}
                </h4>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

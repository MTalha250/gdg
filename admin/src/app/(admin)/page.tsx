import { Metrics } from "@/components/dashboard/Metrics";
import { RecentApplications } from "@/components/dashboard/RecentApplications";
import { RecruitmentAnalytics } from "@/components/dashboard/RecruitmentAnalytics";
import { QuickStats } from "@/components/dashboard/QuickStats";
import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening at GDG.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="col-span-12">
        <Metrics />
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <RecruitmentAnalytics />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentApplications />
          </div>
          
          <QuickStats />
        </div>
      </div>
    </div>
  );
}

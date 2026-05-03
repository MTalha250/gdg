"use client";
import React from "react";
import {
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Tag,
  Trophy,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  COMPETITION_LABELS,
  COMPETITION_COLORS,
  Competition,
} from "@/types/coderush";

const formatPKR = (amount: number) =>
  `PKR ${(amount || 0).toLocaleString("en-PK")}`;

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  bgColor,
  iconColor,
  accent,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  accent?: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-xl ${bgColor}`}
      >
        <Icon className={iconColor} size={20} />
      </div>
      {accent && (
        <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
          {accent}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <h4 className="font-bold text-gray-800 dark:text-white/90 text-2xl break-all">
        {value}
      </h4>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  </div>
);

export const CoderushSection = () => {
  const { stats, loading } = useDashboardStats();

  const getStat = (status: "submitted" | "accepted" | "rejected") => {
    const stat = stats?.coderushStats?.find((s) => s._id === status);
    return {
      count: stat?.count || 0,
      totalAmount: stat?.totalAmount || 0,
      originalAmount: stat?.originalAmount || 0,
    };
  };

  const submitted = getStat("submitted");
  const accepted = getStat("accepted");
  const rejected = getStat("rejected");

  const totalRegs = stats?.coderushCount || 0;
  const recentRegs = stats?.recentActivity?.coderush || 0;
  const voucherStats = stats?.coderushVoucherStats || {
    count: 0,
    totalDiscount: 0,
  };

  const expectedRevenue =
    submitted.totalAmount + accepted.totalAmount; // confirmed + still-pending

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse h-36"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20">
            <Zap className="text-emerald-600 dark:text-emerald-400" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              CodeRush 2026
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Registrations, revenue, and competition breakdown
            </p>
          </div>
        </div>
        <Link
          href="/coderush"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          View all registrations →
        </Link>
      </div>

      {/* Top-line metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <StatCard
          title="Total Registrations"
          value={totalRegs}
          description={`${recentRegs} in the last 7 days`}
          icon={Activity}
          bgColor="bg-emerald-100 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Pending Amount"
          value={formatPKR(submitted.totalAmount)}
          description={`${submitted.count} registration${submitted.count === 1 ? "" : "s"} awaiting review`}
          icon={Clock}
          bgColor="bg-yellow-100 dark:bg-yellow-900/20"
          iconColor="text-yellow-600 dark:text-yellow-400"
          accent="Submitted"
        />
        <StatCard
          title="Verified Amount"
          value={formatPKR(accepted.totalAmount)}
          description={`${accepted.count} accepted registration${accepted.count === 1 ? "" : "s"}`}
          icon={CheckCircle2}
          bgColor="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
          accent="Accepted"
        />
        <StatCard
          title="Rejected Amount"
          value={formatPKR(rejected.totalAmount)}
          description={`${rejected.count} rejected registration${rejected.count === 1 ? "" : "s"}`}
          icon={XCircle}
          bgColor="bg-red-100 dark:bg-red-900/20"
          iconColor="text-red-600 dark:text-red-400"
          accent="Rejected"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        <StatCard
          title="Expected Revenue"
          value={formatPKR(expectedRevenue)}
          description="Pending + verified amounts"
          icon={TrendingUp}
          bgColor="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Vouchers Used"
          value={voucherStats.count}
          description={`${formatPKR(voucherStats.totalDiscount)} total discount given`}
          icon={Tag}
          bgColor="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Avg. Fee per Reg"
          value={
            totalRegs > 0
              ? formatPKR(
                  Math.round(
                    (submitted.totalAmount +
                      accepted.totalAmount +
                      rejected.totalAmount) /
                      totalRegs
                  )
                )
              : formatPKR(0)
          }
          description="Across all registrations"
          icon={Trophy}
          bgColor="bg-indigo-100 dark:bg-indigo-900/20"
          iconColor="text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {/* Per-competition breakdown */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            By Competition
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Registration count and revenue per competition track
          </p>
        </div>

        {stats?.coderushByCompetition?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-white/[0.02] text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">
                    Competition
                  </th>
                  <th className="px-6 py-3 text-right font-medium">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-right font-medium">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-right font-medium">
                    Verified Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {stats.coderushByCompetition.map((row) => {
                  const id = row._id as Competition;
                  const label = COMPETITION_LABELS[id] || row._id;
                  const colorCls =
                    COMPETITION_COLORS[id] ||
                    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
                  return (
                    <tr
                      key={row._id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorCls}`}
                        >
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300 font-medium">
                        {row.count}
                      </td>
                      <td className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">
                        {formatPKR(row.totalAmount)}
                      </td>
                      <td className="px-6 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                        {formatPKR(row.acceptedAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            No registrations yet.
          </div>
        )}
      </div>
    </div>
  );
};

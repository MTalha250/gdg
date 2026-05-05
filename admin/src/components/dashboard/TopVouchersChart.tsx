"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Tag } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const formatPKR = (amount: number) =>
  `PKR ${(amount || 0).toLocaleString("en-PK")}`;

export const TopVouchersChart = () => {
  const { stats, loading } = useDashboardStats();

  const top = stats?.topVouchers || [];

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
        <div className="h-72 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (!top.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20">
            <Tag className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Top Vouchers Used
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Most-used voucher codes across registrations
            </p>
          </div>
        </div>
        <div className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
          No vouchers used yet.
        </div>
      </div>
    );
  }

  const categories = top.map((v) => v._id);
  const counts = top.map((v) => v.usedCount);
  const discounts = top.map((v) => v.totalDiscount);

  const series = [{ name: "Times Used", data: counts }];

  const options = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      fontFamily: "inherit",
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "70%",
        distributed: true,
        dataLabels: { position: "top" as const },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 30,
      style: {
        fontSize: "12px",
        colors: ["#6b7280"],
        fontWeight: 600,
      },
      formatter: (val: number) => `${val}`,
    },
    colors: [
      "#22c55e",
      "#3b82f6",
      "#a855f7",
      "#f59e0b",
      "#ef4444",
      "#06b6d4",
      "#ec4899",
      "#14b8a6",
      "#f97316",
      "#8b5cf6",
    ],
    legend: { show: false },
    xaxis: {
      categories,
      labels: { style: { colors: "#9ca3af", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number, opts: { dataPointIndex: number }) => {
          const discount = discounts[opts.dataPointIndex] || 0;
          return `${val} use${val === 1 ? "" : "s"} · ${formatPKR(discount)} total discount`;
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20">
          <Tag className="text-purple-600 dark:text-purple-400" size={20} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Top Vouchers Used
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Most-used voucher codes across registrations · Hover for total discount
          </p>
        </div>
      </div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={Math.max(280, top.length * 38 + 60)}
      />
    </div>
  );
};

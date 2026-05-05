"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import useAuthStore from "@/store/authStore";
import { CoderushRegistration } from "@/types/coderush";
import { ExportBuilder } from "@/components/coderush/ExportBuilder";

const CoderushExportPage = () => {
  const [data, setData] = useState<CoderushRegistration[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/coderush/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!cancelled) setData(res.data as CoderushRegistration[]);
      } catch {
        if (!cancelled) toast.error("Failed to load registrations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <>
      <PageBreadcrumb pageTitle="Export Builder" />
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Custom Export</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Build CSV exports or email lists with custom filters and columns.
            </p>
          </div>
          <Link
            href="/coderush"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.06]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to registrations
          </Link>
        </div>

        {loading || !data ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03] px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-white">{data.length}</span> total registrations loaded.
              Adjust the options below — the preview count updates live, and the file downloads with your current selection.
            </div>
            <ExportBuilder data={data} />
          </>
        )}
      </div>
    </>
  );
};

export default CoderushExportPage;

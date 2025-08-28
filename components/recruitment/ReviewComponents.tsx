"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ReviewSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-sm p-4"
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center justify-center size-6 rounded-full bg-blue/20 text-blue">
          {icon}
        </div>
        <h4 className="font-medium text-white">{title}</h4>
      </div>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}

export function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
      <span className="text-white/60 text-sm font-medium">{label}</span>
      <span className="max-w-[70%] text-right text-white text-sm leading-relaxed">
        {value || "-"}
      </span>
    </div>
  );
}

export function AgreementItem({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.05] bg-white/[0.02] p-3">
      <span className="text-white/60 text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "size-5 rounded-full flex items-center justify-center text-xs font-bold",
            value
              ? "bg-green text-white"
              : "bg-red/20 text-red border border-red/30"
          )}
        >
          {value ? "✓" : "✗"}
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            value ? "text-green" : "text-red"
          )}
        >
          {value ? "Yes" : "No"}
        </span>
      </div>
    </div>
  );
}

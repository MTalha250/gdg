"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function FieldShell({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("group grid gap-2", className)}
    >
      <label className="text-sm font-medium text-white/80">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </motion.div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <FieldShell label={label} required={required} className={className}>
      <div className="relative group">
        <input
          className="w-full rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-blue/50 focus:bg-black/30 focus:ring-2 focus:ring-blue/20 hover:border-white/20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
        />
        {/* Focus Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-blue/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </FieldShell>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  required,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <FieldShell label={label} required={required} className={className}>
      <div className="relative group">
        <textarea
          className="min-h-32 w-full resize-y rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-200 focus:border-blue/50 focus:bg-black/30 focus:ring-2 focus:ring-blue/20 hover:border-white/20"
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {/* Focus Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-blue/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </FieldShell>
  );
}

export function SelectField({
  label,
  options,
  value,
  onChange,
  required,
  className,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <FieldShell label={label} required={required} className={className}>
      <div className="relative group">
        <select
          className="w-full rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-sm px-4 py-3 text-white outline-none transition-all duration-200 focus:border-blue/50 focus:bg-black/30 focus:ring-2 focus:ring-blue/20 hover:border-white/20 cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" className="bg-black text-white/60">
            Select an option...
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-black text-white">
              {opt}
            </option>
          ))}
        </select>
        {/* Focus Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-blue/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input
        type="checkbox"
        className="mt-0.5 size-4 rounded border bg-background accent-foreground/80"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-muted-foreground">{label}</span>
    </label>
  );
}

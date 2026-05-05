"use client";
import React, { useMemo, useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  CoderushRegistration,
  Competition,
  COMPETITION_LABELS,
  ROBOTICS_MODULE_LABELS,
} from "@/types/coderush";

type OutputType = "csv" | "emails";
type Granularity = "team" | "member";
type Status = "submitted" | "accepted" | "rejected";
type EmailFormat = "comma" | "newline" | "semicolon";

interface ColumnDef {
  id: string;
  label: string;
  default: boolean;
}

const TEAM_COLUMNS: ColumnDef[] = [
  { id: "teamName", label: "Team Name", default: true },
  { id: "competition", label: "Competition", default: true },
  { id: "roboticsModule", label: "Robotics Module", default: true },
  { id: "status", label: "Status", default: true },
  { id: "leadName", label: "Team Lead Name", default: true },
  { id: "leadEmail", label: "Team Lead Email", default: true },
  { id: "leadPhone", label: "Team Lead Phone", default: false },
  { id: "leadUniversity", label: "Team Lead University", default: true },
  { id: "leadRoll", label: "Team Lead Roll No.", default: false },
  { id: "leadCnic", label: "Team Lead CNIC", default: false },
  { id: "memberCount", label: "Members Count", default: true },
  { id: "originalFee", label: "Original Fee", default: false },
  { id: "discountedFee", label: "Paid Fee", default: true },
  { id: "discount", label: "Discount Amount", default: false },
  { id: "voucherCode", label: "Voucher Code", default: true },
  { id: "date", label: "Registered Date", default: true },
];

const MEMBER_COLUMNS: ColumnDef[] = [
  { id: "teamName", label: "Team Name", default: true },
  { id: "competition", label: "Competition", default: true },
  { id: "roboticsModule", label: "Robotics Module", default: true },
  { id: "status", label: "Team Status", default: true },
  { id: "memberName", label: "Member Name", default: true },
  { id: "role", label: "Role (Lead/Member)", default: true },
  { id: "email", label: "Email", default: true },
  { id: "phone", label: "Phone", default: true },
  { id: "rollNumber", label: "Roll Number", default: true },
  { id: "university", label: "University", default: true },
  { id: "cnic", label: "CNIC", default: false },
  { id: "originalFee", label: "Original Fee", default: false },
  { id: "discountedFee", label: "Paid Fee", default: false },
  { id: "discount", label: "Discount Amount", default: false },
  { id: "voucherCode", label: "Voucher Code", default: false },
  { id: "date", label: "Registered Date", default: false },
];

const ALL_COMPETITIONS: Competition[] = [
  "competitive-programming",
  "web-development",
  "app-development",
  "ui-ux",
  "robotics",
  "game-jam",
  "machine-learning",
  "ctf",
];

const ALL_STATUSES: Status[] = ["submitted", "accepted", "rejected"];

const csvCell = (value: string | number | null | undefined) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

const moduleLabel = (r: CoderushRegistration) =>
  r.competition === "robotics" && r.roboticsModule
    ? ROBOTICS_MODULE_LABELS[r.roboticsModule as keyof typeof ROBOTICS_MODULE_LABELS] || r.roboticsModule
    : "";

const teamValue = (r: CoderushRegistration, columnId: string): string | number => {
  const lead = r.members.find((m) => m.isTeamLead);
  switch (columnId) {
    case "teamName": return r.teamName;
    case "competition": return COMPETITION_LABELS[r.competition] || r.competition;
    case "roboticsModule": return moduleLabel(r);
    case "status": return r.status;
    case "leadName": return lead?.name || "";
    case "leadEmail": return lead?.email || "";
    case "leadPhone": return lead?.phone || "";
    case "leadUniversity": return lead?.university || "";
    case "leadRoll": return lead?.rollNumber || "";
    case "leadCnic": return lead?.cnic || "";
    case "memberCount": return r.members.length;
    case "originalFee": return r.originalFee;
    case "discountedFee": return r.discountedFee;
    case "discount": return Math.max(0, (r.originalFee || 0) - (r.discountedFee || 0));
    case "voucherCode": return r.voucherCode || "";
    case "date": return new Date(r.createdAt).toLocaleDateString();
    default: return "";
  }
};

const memberValue = (
  r: CoderushRegistration,
  m: CoderushRegistration["members"][number],
  columnId: string
): string | number => {
  switch (columnId) {
    case "teamName": return r.teamName;
    case "competition": return COMPETITION_LABELS[r.competition] || r.competition;
    case "roboticsModule": return moduleLabel(r);
    case "status": return r.status;
    case "memberName": return m.name;
    case "role": return m.isTeamLead ? "Team Lead" : "Member";
    case "email": return m.email;
    case "phone": return m.phone;
    case "rollNumber": return m.rollNumber;
    case "university": return m.university;
    case "cnic": return m.cnic;
    case "originalFee": return r.originalFee;
    case "discountedFee": return r.discountedFee;
    case "discount": return Math.max(0, (r.originalFee || 0) - (r.discountedFee || 0));
    case "voucherCode": return r.voucherCode || "";
    case "date": return new Date(r.createdAt).toLocaleDateString();
    default: return "";
  }
};

interface ExportBuilderProps {
  data: CoderushRegistration[];
}

export const ExportBuilder: React.FC<ExportBuilderProps> = ({ data }) => {
  const [outputType, setOutputType] = useState<OutputType>("csv");
  const [granularity, setGranularity] = useState<Granularity>("member");
  const [competitions, setCompetitions] = useState<Set<Competition>>(new Set(ALL_COMPETITIONS));
  const [statuses, setStatuses] = useState<Set<Status>>(new Set(ALL_STATUSES));
  const [teamColumns, setTeamColumns] = useState<Set<string>>(
    new Set(TEAM_COLUMNS.filter((c) => c.default).map((c) => c.id))
  );
  const [memberColumns, setMemberColumns] = useState<Set<string>>(
    new Set(MEMBER_COLUMNS.filter((c) => c.default).map((c) => c.id))
  );
  const [emailDedup, setEmailDedup] = useState(true);
  const [emailFormat, setEmailFormat] = useState<EmailFormat>("comma");
  const [leadOnly, setLeadOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [voucherFilter, setVoucherFilter] = useState<"any" | "with" | "without" | "specific">("any");
  const [voucherCodeFilter, setVoucherCodeFilter] = useState("");

  const availableVoucherCodes = useMemo(() => {
    const codes = new Set<string>();
    data.forEach((r) => {
      if (r.voucherCode) codes.add(r.voucherCode);
    });
    return Array.from(codes).sort();
  }, [data]);

  const activeColumnDefs = granularity === "team" ? TEAM_COLUMNS : MEMBER_COLUMNS;
  const activeColumns = granularity === "team" ? teamColumns : memberColumns;
  const setActiveColumns = granularity === "team" ? setTeamColumns : setMemberColumns;

  const filtered = useMemo(() => {
    const fromTs = dateFrom ? new Date(dateFrom + "T00:00:00").getTime() : null;
    const toTs = dateTo ? new Date(dateTo + "T23:59:59").getTime() : null;
    const codeNeedle = voucherCodeFilter.trim().toUpperCase();

    return data.filter((r) => {
      if (!competitions.has(r.competition)) return false;
      if (!statuses.has(r.status as Status)) return false;

      const ts = new Date(r.createdAt).getTime();
      if (fromTs !== null && ts < fromTs) return false;
      if (toTs !== null && ts > toTs) return false;

      if (voucherFilter === "with" && !r.voucherCode) return false;
      if (voucherFilter === "without" && r.voucherCode) return false;
      if (voucherFilter === "specific") {
        if (!r.voucherCode) return false;
        if (codeNeedle && (r.voucherCode || "").toUpperCase() !== codeNeedle) return false;
      }
      return true;
    });
  }, [data, competitions, statuses, dateFrom, dateTo, voucherFilter, voucherCodeFilter]);

  const previewCount = useMemo(() => {
    if (outputType === "csv") {
      return granularity === "team"
        ? filtered.length
        : filtered.reduce((acc, r) => acc + r.members.length, 0);
    }
    const list: string[] = [];
    filtered.forEach((r) => {
      if (leadOnly) {
        const lead = r.members.find((m) => m.isTeamLead);
        if (lead?.email) list.push(lead.email.toLowerCase().trim());
      } else {
        r.members.forEach((m) => {
          if (m.email) list.push(m.email.toLowerCase().trim());
        });
      }
    });
    return emailDedup ? new Set(list).size : list.length;
  }, [filtered, outputType, granularity, leadOnly, emailDedup]);

  const toggleCol = (id: string) => {
    const next = new Set(activeColumns);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setActiveColumns(next);
  };

  const toggleSet = <T,>(set: Set<T>, setter: (s: Set<T>) => void, value: T) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error("No registrations match the filters");
      return;
    }
    const cols = activeColumnDefs.filter((c) => activeColumns.has(c.id));
    if (cols.length === 0) {
      toast.error("Select at least one column");
      return;
    }
    const headers = cols.map((c) => c.label);
    const rows: string[] = [];
    if (granularity === "team") {
      filtered.forEach((r) => {
        rows.push(cols.map((c) => csvCell(teamValue(r, c.id))).join(","));
      });
    } else {
      filtered.forEach((r) => {
        r.members.forEach((m) => {
          rows.push(cols.map((c) => csvCell(memberValue(r, m, c.id))).join(","));
        });
      });
    }
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fname = `coderush-${granularity}s-${new Date().toISOString().split("T")[0]}.csv`;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} ${granularity === "team" ? "teams" : "members"}`);
  };

  const collectEmails = (): string[] => {
    const list: string[] = [];
    filtered.forEach((r) => {
      if (leadOnly) {
        const lead = r.members.find((m) => m.isTeamLead);
        if (lead?.email) list.push(lead.email.trim());
      } else {
        r.members.forEach((m) => {
          if (m.email) list.push(m.email.trim());
        });
      }
    });
    if (emailDedup) {
      const seen = new Set<string>();
      return list.filter((e) => {
        const key = e.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    return list;
  };

  const handleCopyEmails = async () => {
    const emails = collectEmails();
    if (emails.length === 0) {
      toast.error("No emails match the filters");
      return;
    }
    const sep = emailFormat === "comma" ? ", " : emailFormat === "newline" ? "\n" : "; ";
    const text = emails.join(sep);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    toast.success(`Copied ${emails.length} email${emails.length === 1 ? "" : "s"}`);
  };

  const handleDownloadEmails = () => {
    const emails = collectEmails();
    if (emails.length === 0) {
      toast.error("No emails match the filters");
      return;
    }
    const text = emails.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coderush-emails-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${emails.length} email${emails.length === 1 ? "" : "s"}`);
  };

  const Section: React.FC<{ title: string; children: React.ReactNode; right?: React.ReactNode }> = ({ title, children, right }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h4>
        {right}
      </div>
      {children}
    </div>
  );

  const Pill: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Output type */}
      <Section title="Output Type">
        <div className="flex gap-2">
          <Pill active={outputType === "csv"} onClick={() => setOutputType("csv")}>CSV File</Pill>
          <Pill active={outputType === "emails"} onClick={() => setOutputType("emails")}>Email List</Pill>
        </div>
      </Section>

      {outputType === "csv" && (
        <Section title="Granularity">
          <div className="flex gap-2 flex-wrap">
            <Pill active={granularity === "team"} onClick={() => setGranularity("team")}>One row per team</Pill>
            <Pill active={granularity === "member"} onClick={() => setGranularity("member")}>One row per member</Pill>
          </div>
        </Section>
      )}

      {outputType === "emails" && (
        <Section title="Email Options">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" checked={leadOnly} onChange={(e) => setLeadOnly(e.target.checked)} className="rounded" />
              Team leads only (one email per team)
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input type="checkbox" checked={emailDedup} onChange={(e) => setEmailDedup(e.target.checked)} className="rounded" />
              Remove duplicates (case-insensitive)
            </label>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">Separator:</span>
              <Pill active={emailFormat === "comma"} onClick={() => setEmailFormat("comma")}>Comma</Pill>
              <Pill active={emailFormat === "newline"} onClick={() => setEmailFormat("newline")}>Newline</Pill>
              <Pill active={emailFormat === "semicolon"} onClick={() => setEmailFormat("semicolon")}>Semicolon</Pill>
            </div>
          </div>
        </Section>
      )}

      <Section
        title="Competitions"
        right={
          <div className="flex gap-1">
            <button onClick={() => setCompetitions(new Set(ALL_COMPETITIONS))} className="text-xs text-blue-600 hover:underline">All</button>
            <span className="text-gray-300">·</span>
            <button onClick={() => setCompetitions(new Set())} className="text-xs text-gray-500 hover:underline">None</button>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          {ALL_COMPETITIONS.map((c) => (
            <Pill key={c} active={competitions.has(c)} onClick={() => toggleSet(competitions, setCompetitions, c)}>
              {COMPETITION_LABELS[c]}
            </Pill>
          ))}
        </div>
      </Section>

      <Section
        title="Statuses"
        right={
          <div className="flex gap-1">
            <button onClick={() => setStatuses(new Set(ALL_STATUSES))} className="text-xs text-blue-600 hover:underline">All</button>
            <span className="text-gray-300">·</span>
            <button onClick={() => setStatuses(new Set())} className="text-xs text-gray-500 hover:underline">None</button>
          </div>
        }
      >
        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map((s) => (
            <Pill key={s} active={statuses.has(s)} onClick={() => toggleSet(statuses, setStatuses, s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Pill>
          ))}
        </div>
      </Section>

      <Section
        title="Date Range"
        right={
          (dateFrom || dateTo) ? (
            <button
              onClick={() => { setDateFrom(""); setDateTo(""); }}
              className="text-xs text-gray-500 hover:underline"
            >
              Clear
            </button>
          ) : null
        }
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">Leave blank for no limit</span>
        </div>
      </Section>

      <Section title="Voucher">
        <div className="flex flex-wrap gap-2 items-center">
          <Pill active={voucherFilter === "any"} onClick={() => setVoucherFilter("any")}>Any</Pill>
          <Pill active={voucherFilter === "with"} onClick={() => setVoucherFilter("with")}>Used a voucher</Pill>
          <Pill active={voucherFilter === "without"} onClick={() => setVoucherFilter("without")}>No voucher</Pill>
          <Pill active={voucherFilter === "specific"} onClick={() => setVoucherFilter("specific")}>Specific code</Pill>
          {voucherFilter === "specific" && (
            <select
              value={voucherCodeFilter}
              onChange={(e) => setVoucherCodeFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Any code</option>
              {availableVoucherCodes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}
        </div>
      </Section>

      {outputType === "csv" && (
        <Section
          title="Columns"
          right={
            <div className="flex gap-1">
              <button onClick={() => setActiveColumns(new Set(activeColumnDefs.map((c) => c.id)))} className="text-xs text-blue-600 hover:underline">All</button>
              <span className="text-gray-300">·</span>
              <button onClick={() => setActiveColumns(new Set(activeColumnDefs.filter((c) => c.default).map((c) => c.id)))} className="text-xs text-gray-500 hover:underline">Defaults</button>
              <span className="text-gray-300">·</span>
              <button onClick={() => setActiveColumns(new Set())} className="text-xs text-gray-500 hover:underline">None</button>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5">
            {activeColumnDefs.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer py-0.5">
                <input type="checkbox" checked={activeColumns.has(c.id)} onChange={() => toggleCol(c.id)} className="rounded" />
                {c.label}
              </label>
            ))}
          </div>
        </Section>
      )}

      <div className="sticky bottom-0 z-10 -mx-2 px-2 py-3 bg-gradient-to-t from-white via-white dark:from-gray-900 dark:via-gray-900">
        <div className="flex items-center justify-between gap-3 flex-wrap rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] px-5 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>
              Will export <span className="font-semibold text-gray-800 dark:text-white">{previewCount}</span>{" "}
              {outputType === "csv" ? (granularity === "team" ? "team rows" : "member rows") : "emails"}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {outputType === "csv" ? (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopyEmails}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button
                  onClick={handleDownloadEmails}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  <Download className="w-4 h-4" /> Download .txt
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

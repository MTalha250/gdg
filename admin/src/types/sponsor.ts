export type SponsorPackage = "platinum" | "gold" | "silver" | "bronze" | "custom";
export type SponsorStatus = "new" | "contacted" | "confirmed" | "rejected";

export const PACKAGE_LABELS: Record<SponsorPackage, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  custom: "Custom",
};

export const PACKAGE_COLORS: Record<SponsorPackage, string> = {
  platinum: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  gold: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  silver: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  bronze: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  custom: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
};

export const STATUS_COLORS: Record<SponsorStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export interface SponsorApplication {
  _id: string;
  companyName: string;
  industry: string;
  companyWebsite: string;
  companySize: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  cnic: string;
  whatsapp: string;
  package: SponsorPackage;
  wantsStall: boolean;
  companyLogo: string;
  requirements: string;
  comments: string;
  status: SponsorStatus;
  createdAt: string;
  updatedAt: string;
}

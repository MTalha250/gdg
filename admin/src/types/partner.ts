export type PartnerStatus = "new" | "contacted" | "confirmed" | "rejected";

export const STATUS_COLORS: Record<PartnerStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export interface PartnerApplication {
  _id: string;
  representativeName: string;
  societyName: string;
  email: string;
  phone: string;
  cnic: string;
  university: string;
  campusVisitDate: string;
  organizationLogo: string;
  alternativeLogo: string;
  status: PartnerStatus;
  createdAt: string;
  updatedAt: string;
}

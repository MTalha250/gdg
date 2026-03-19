export type AmbassadorStatus = "new" | "contacted" | "approved" | "rejected";

export const STATUS_COLORS: Record<AmbassadorStatus, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  contacted: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export interface AmbassadorApplication {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  university: string;
  degree: string;
  yearOfStudy: string;
  motivation: string;
  hasExperience: boolean;
  experienceDetails: string;
  isAvailable: boolean;
  promotionMethods: string[];
  linkedIn: string;
  instagram: string;
  agreesToResponsibilities: boolean;
  status: AmbassadorStatus;
  createdAt: string;
  updatedAt: string;
}

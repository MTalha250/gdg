export type CoreStatus = "submitted" | "shortlisted" | "accepted" | "rejected";

export interface CoreQuestion {
  id: string;
  label: string;
  type: "textarea" | "choice";
  options?: string[];
}

export interface CoreFormConfig {
  positions: string[];
  membersOnlyPositions: string[];
  departments: string[];
  semesters: string[];
  hoursPerWeek: string[];
  declarationText: string;
  commonQuestions: CoreQuestion[];
  positionQuestions: Record<string, CoreQuestion[]>;
}

export interface CoreApplication {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  alternateEmail: string;
  phone: string;
  rollNumber: string;
  department: string;
  departmentOther: string;
  semester: string;
  linkedin: string;
  github: string;
  position: string;
  answers: Record<string, string>;
  hoursPerWeek: string;
  weekendAvailability: boolean;
  declaration: boolean;
  status: CoreStatus;
  createdAt: string;
  updatedAt: string;
}

export const CORE_STATUS_COLORS: Record<CoreStatus, string> = {
  submitted:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  shortlisted:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  accepted:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const CORE_STATUSES: CoreStatus[] = [
  "submitted",
  "shortlisted",
  "accepted",
  "rejected",
];

export const coreFullName = (a: CoreApplication) =>
  [a.firstName, a.middleName, a.lastName].filter(Boolean).join(" ");

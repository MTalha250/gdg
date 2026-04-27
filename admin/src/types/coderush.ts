export type Competition =
  | "competitive-programming"
  | "web-development"
  | "app-development"
  | "ui-ux"
  | "robotics"
  | "game-jam"
  | "machine-learning"
  | "ctf";

export const COMPETITION_LABELS: Record<Competition, string> = {
  "competitive-programming": "Competitive Programming",
  "web-development": "Web Development",
  "app-development": "App Development",
  "ui-ux": "UI/UX Design",
  robotics: "Robotics",
  "game-jam": "Game Jam",
  "machine-learning": "Machine Learning",
  ctf: "Capture The Flag",
};

export const COMPETITION_COLORS: Record<Competition, string> = {
  "competitive-programming": "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  "web-development": "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  "app-development": "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  "ui-ux": "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400",
  robotics: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  "game-jam": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  "machine-learning": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
  ctf: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export interface CoderushMember {
  name: string;
  email: string;
  phone: string;
  rollNumber: string;
  university: string;
  cnic: string;
  isTeamLead: boolean;
}

export type RoboticsModule = "rc-car-race" | "line-following-robot" | "robo-soccer" | "";

export const ROBOTICS_MODULE_LABELS: Record<Exclude<RoboticsModule, "">, string> = {
  "rc-car-race": "RC Car Race",
  "line-following-robot": "Line Following Robot",
  "robo-soccer": "Robo Soccer",
};

export interface CoderushRegistration {
  _id: string;
  teamName: string;
  competition: Competition;
  roboticsModule?: RoboticsModule;
  members: CoderushMember[];
  proofOfPayment: string;
  voucherCode: string | null;
  originalFee: number;
  discountedFee: number;
  status: "submitted" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface Voucher {
  _id: string;
  code: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  scope: "global" | "specific";
  competitions: Competition[];
  usageLimit: number | null;
  usedCount: number;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

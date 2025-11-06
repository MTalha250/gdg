export interface BrainGamesMember {
  name: string;
  email?: string;
  phone: string;
  rollNumber?: string;
  university: string;
  cnic?: string;
  isTeamLead: boolean;
}

export interface BrainGamesRegistration {
  _id: string;
  teamName: string;
  members: BrainGamesMember[];
  proofOfPayment: string;
  status: "submitted" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

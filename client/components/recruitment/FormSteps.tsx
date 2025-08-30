"use client";
import { TextField, TextArea, SelectField, CheckboxField } from "./FormFields";
import { ReviewSection, ReviewItem, AgreementItem } from "./ReviewComponents";
import {
  User,
  Info,
  Users as UsersIcon,
  Wrench,
  Crown,
  ShieldCheck,
} from "lucide-react";

type BaseFields = {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  degreeProgram: string;
  linkedin: string;
  whyJoin: string;
  selectedTeam: string;
  selectedRole: string;
  whyThisTeam: string;
  relevantSkills: string;
  timeCommitment: string;
  improvementIdea: string;
  whyLeadTeam: string;
  leadershipExperience: string;
  teamOrganization: string;
  handleUnderperformers: string;
  teamVision: string;
  timeCommitmentAgreement: boolean;
  attendanceCommitment: boolean;
  professionalismCommitment: boolean;
};

interface StepProps {
  values: BaseFields;
  update: <K extends keyof BaseFields>(key: K, val: BaseFields[K]) => void;
}

const TEAMS = [
  "Management Team",
  "Security Team",
  "Protocol & Hospitality Team",
  "Logistics Team",
  "Outreach Team",
  "On-Campus Marketing Team",
  "Digital & Social Media Team",
  "Sponsorship Acquisition Team",
  "Community Partnerships Team",
  "Media Team",
  "Graphics Team",
  "Content Creation Team",
  "Video Editing & Reel Team",
  "Technical Team",
  "Bevy Team",
  "Decor Team",
  "Event Experience & Audience Team",
  "Documentation Team",
];

const ROLES = ["member", "lead"];

const TIME_COMMITMENTS = [
  "1-5 hours/week",
  "6-10 hours/week",
  "11-15 hours/week",
  "15+ hours/week",
];

export function BasicInfoStep({ values, update }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <TextField
        label="Full Name"
        placeholder="Enter your full name"
        value={values.fullName}
        onChange={(v) => update("fullName", v)}
        required
      />
      <TextField
        label="Email"
        type="email"
        placeholder="yourroll@itu.edu.pk"
        value={values.email}
        onChange={(v) => update("email", v)}
        required
      />
      <TextField
        label="Phone"
        placeholder="+92 324 4264800"
        value={values.phone}
        onChange={(v) => update("phone", v)}
        required
      />
      <TextField
        label="Roll Number"
        placeholder="e.g., bscs23051"
        value={values.rollNumber}
        onChange={(v) => update("rollNumber", v)}
        required
      />
      <TextField
        label="Degree Program"
        placeholder="e.g., BS Computer Science"
        value={values.degreeProgram}
        onChange={(v) => update("degreeProgram", v)}
        required
        className="sm:col-span-2"
      />
    </div>
  );
}

export function AboutYouStep({ values, update }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <TextField
        label="LinkedIn"
        placeholder="https://linkedin.com/in/username (optional)"
        value={values.linkedin}
        onChange={(v) => update("linkedin", v)}
      />
      <TextArea
        label="Why do you want to join?"
        placeholder="Share your motivation for joining GDG on Campus ITU. What excites you about technology and community building?"
        value={values.whyJoin}
        onChange={(v) => update("whyJoin", v)}
        required
        rows={4}
      />
    </div>
  );
}

export function TeamRoleStep({ values, update }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SelectField
        label="Team"
        options={TEAMS}
        value={values.selectedTeam}
        onChange={(v) => update("selectedTeam", v)}
        required
      />
      <SelectField
        label="Role"
        options={ROLES}
        value={values.selectedRole}
        onChange={(v) => update("selectedRole", v)}
        required
      />
      <TextArea
        label="Why this team?"
        placeholder="Explain why you're interested in this specific team and how you can contribute to their goals."
        value={values.whyThisTeam}
        onChange={(v) => update("whyThisTeam", v)}
        required
        rows={4}
        className="sm:col-span-2"
      />
    </div>
  );
}

export function SkillsIdeasStep({ values, update }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <TextArea
        label="Relevant skills (comma separated)"
        placeholder="e.g., JavaScript, React, Python, UI/UX Design, Content Writing, Event Management, Marketing"
        value={values.relevantSkills}
        onChange={(v) => update("relevantSkills", v)}
        required
        rows={3}
      />
      <SelectField
        label="Weekly time commitment"
        options={TIME_COMMITMENTS}
        value={values.timeCommitment}
        onChange={(v) => update("timeCommitment", v)}
        required
      />
      <TextArea
        label="One idea to improve GDG@ITU"
        placeholder="Share a creative idea for events, workshops, community engagement, or any innovation that could benefit our GDG chapter."
        value={values.improvementIdea}
        onChange={(v) => update("improvementIdea", v)}
        required
        rows={4}
      />
    </div>
  );
}

export function LeadershipStep({ values, update }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <p className="text-sm text-muted-foreground">
        Only required if you choose lead role.
      </p>
      <TextArea
        label="Why do you want to lead this team?"
        placeholder="Describe your motivation for taking on a leadership role and what you hope to achieve."
        value={values.whyLeadTeam}
        onChange={(v) => update("whyLeadTeam", v)}
        rows={3}
      />
      <TextArea
        label="Leadership experience"
        placeholder="Share any previous leadership roles, team management experience, or projects you've led."
        value={values.leadershipExperience}
        onChange={(v) => update("leadershipExperience", v)}
        rows={3}
      />
      <TextArea
        label="How would you organize the team?"
        placeholder="Outline your approach to team structure, task delegation, communication, and coordination."
        value={values.teamOrganization}
        onChange={(v) => update("teamOrganization", v)}
        rows={3}
      />
      <TextArea
        label="How would you handle underperformers?"
        placeholder="Describe your strategy for motivating team members and addressing performance issues constructively."
        value={values.handleUnderperformers}
        onChange={(v) => update("handleUnderperformers", v)}
        rows={3}
      />
      <TextArea
        label="Vision for the team"
        placeholder="Share your long-term vision for the team's goals, growth, and impact within GDG on Campus ITU."
        value={values.teamVision}
        onChange={(v) => update("teamVision", v)}
        rows={3}
      />
    </div>
  );
}

export function AgreementsStep({ values, update }: StepProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      <CheckboxField
        label="I can commit the required weekly time"
        checked={values.timeCommitmentAgreement}
        onChange={(v) => update("timeCommitmentAgreement", v)}
      />
      <CheckboxField
        label="I will attend mandatory meetings/events"
        checked={values.attendanceCommitment}
        onChange={(v) => update("attendanceCommitment", v)}
      />
      <CheckboxField
        label="I agree to act professionally and respectfully"
        checked={values.professionalismCommitment}
        onChange={(v) => update("professionalismCommitment", v)}
      />
    </div>
  );
}

export function ReviewStep({ values }: { values: BaseFields }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Review Your Application
        </h3>
        <p className="text-white/60 text-sm">
          Please review all information before submitting
        </p>
      </div>

      {/* Basic Information */}
      <ReviewSection
        title="Basic Information"
        icon={<User className="size-4" />}
      >
        <ReviewItem label="Name" value={values.fullName} />
        <ReviewItem label="Email" value={values.email} />
        <ReviewItem label="Phone" value={values.phone} />
        <ReviewItem label="Roll Number" value={values.rollNumber} />
        <ReviewItem label="Degree Program" value={values.degreeProgram} />
        <ReviewItem label="LinkedIn" value={values.linkedin} />
      </ReviewSection>

      {/* About You */}
      <ReviewSection title="About You" icon={<Info className="size-4" />}>
        <ReviewItem label="Why Join" value={values.whyJoin} />
      </ReviewSection>

      {/* Team & Role */}
      <ReviewSection
        title="Team & Role"
        icon={<UsersIcon className="size-4" />}
      >
        <ReviewItem label="Team" value={values.selectedTeam} />
        <ReviewItem label="Role" value={values.selectedRole} />
        <ReviewItem label="Why This Team" value={values.whyThisTeam} />
      </ReviewSection>

      {/* Skills & Ideas */}
      <ReviewSection
        title="Skills & Ideas"
        icon={<Wrench className="size-4" />}
      >
        <ReviewItem label="Skills" value={values.relevantSkills} />
        <ReviewItem label="Time Commitment" value={values.timeCommitment} />
        <ReviewItem label="Improvement Idea" value={values.improvementIdea} />
      </ReviewSection>

      {/* Leadership (conditional) */}
      {values.selectedRole === "lead" && (
        <ReviewSection title="Leadership" icon={<Crown className="size-4" />}>
          <ReviewItem label="Why Lead Team" value={values.whyLeadTeam} />
          <ReviewItem
            label="Leadership Experience"
            value={values.leadershipExperience}
          />
          <ReviewItem
            label="Team Organization"
            value={values.teamOrganization}
          />
          <ReviewItem
            label="Handle Underperformers"
            value={values.handleUnderperformers}
          />
          <ReviewItem label="Team Vision" value={values.teamVision} />
        </ReviewSection>
      )}

      {/* Agreements */}
      <ReviewSection
        title="Agreements"
        icon={<ShieldCheck className="size-4" />}
      >
        <div className="grid grid-cols-1 gap-3">
          <AgreementItem
            label="Time commitment agreement"
            value={values.timeCommitmentAgreement}
          />
          <AgreementItem
            label="Attendance commitment"
            value={values.attendanceCommitment}
          />
          <AgreementItem
            label="Professionalism agreement"
            value={values.professionalismCommitment}
          />
        </div>
      </ReviewSection>
    </div>
  );
}

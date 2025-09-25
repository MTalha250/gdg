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

interface TeamRoleStepProps extends StepProps {
  onRoleChange: (newRole: string) => void;
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

const teamDescriptions = {
  "Management Team": {
    purpose:
      "To serve as the operational backbone of all GDG events, ensuring volunteers and team members execute their duties efficiently.",
    memberDuties:
      "Assist in assigning and monitoring volunteer tasks, maintain the event schedule, and act as on-the-ground problem-solvers.",
    leadDuties:
      "Coordinate the event workflow, manage the volunteer team, and ensure smooth on-the-day operations.",
  },
  "Security Team": {
    purpose:
      "To ensure safety, security, and controlled access during all GDG ITU events.",
    memberDuties:
      "Check entries, manage crowd control, prevent unauthorized access, and assist with emergency protocols.",
    leadDuties:
      "Develop and implement security protocols, train the team, and oversee event safety.",
  },
  "Protocol & Hospitality Team": {
    purpose:
      "To handle VIPs, guest speakers, sponsors, and faculty with professionalism, representing GDG ITU's hospitality, and managing all guest comforts and food services.",
    memberDuties:
      "Receive and escort VIPs, arrange refreshments, ensure their comfort, and serve guests on time.",
    leadDuties:
      "Manage all VIP interactions, create a hospitality plan for each event, oversee catering, and train the team on professional etiquette.",
  },
  "Logistics Team": {
    purpose:
      "To handle event setup, equipment, and material movement, ensuring all physical requirements are met.",
    memberDuties:
      "Set up stages, tables, chairs, AV equipment, lights, and screens; ensure power and sound are ready; and manage resource transportation.",
    leadDuties:
      "Plan and oversee all physical logistics, manage the inventory of event materials, and coordinate with other circles to ensure timely setup.",
  },
  "Outreach Team": {
    purpose:
      "To extend GDG ITU's reach beyond our campus by promoting events and the community at other universities in Lahore and across Pakistan.",
    memberDuties:
      "Visit other university campuses, set up booths, distribute flyers, and engage with students and faculty to spread awareness about GDG ITU.",
    leadDuties:
      "Develop an inter-university outreach strategy, coordinate travel and promotional materials for visits, and build relationships with student societies at other universities.",
  },
  "On-Campus Marketing Team": {
    purpose:
      "To physically promote events on campus to ensure strong participation.",
    memberDuties:
      "Place posters and banners, set up promotional booths, and distribute flyers.",
    leadDuties:
      "Develop a campus-wide marketing strategy, manage the budget for promotional materials, and oversee the team's activities.",
  },
  "Digital & Social Media Team": {
    purpose:
      "To digitally promote GDG events through multi-channel campaigns, from messaging and email newsletters to engaging social media content.",
    memberDuties:
      "Share event details in group chats, manage email newsletters, create reels and stories on platforms like Instagram and LinkedIn, and respond to online queries.",
    leadDuties:
      "Plan and execute a comprehensive digital marketing strategy, manage the team's content calendar, analyze engagement metrics, and oversee the community's communication channels.",
  },
  "Sponsorship Acquisition Team": {
    purpose:
      "To secure financial and in-kind sponsorships to support GDG operations.",
    memberDuties:
      "Identify potential sponsors, research their values, and assist in preparing pitch decks.",
    leadDuties:
      "Lead the sponsorship strategy, manage relationships with potential partners, and negotiate deals.",
  },
  "Community Partnerships Team": {
    purpose:
      "To build alliances with other societies and GDG chapters to enhance events.",
    memberDuties:
      "Identify potential partners and assist in communication and collaboration.",
    leadDuties:
      "Manage all external society and GDG collaborations, negotiate partnership terms, and coordinate joint events.",
  },
  "Media Team": {
    purpose: "To capture high-quality event photos and videos.",
    memberDuties:
      "Ensure live coverage for social media and document events thoroughly through photography and videography.",
    leadDuties:
      "Lead the media team, create a shot list for each event, and manage the photo/video archives.",
  },
  "Graphics Team": {
    purpose:
      "To design all visual assets for GDG events, including posters, event screens, and sponsor decks.",
    memberDuties:
      "Create designs for social media and print materials, ensuring they adhere to brand guidelines.",
    leadDuties:
      "Oversee the team's creative output, manage design requests from other circles, and ensure brand consistency.",
  },
  "Content Creation Team": {
    purpose: "To write engaging captions, blogs, and post-event stories.",
    memberDuties:
      "Craft compelling narratives about GDG ITU events and initiatives, and write all social media captions and blog posts.",
    leadDuties:
      "Develop a content strategy, edit and approve all written material, and ensure GDG's storytelling is consistent and impactful.",
  },
  "Video Editing & Reel Team": {
    purpose: "To produce event highlights, reels, and teasers.",
    memberDuties:
      "Edit video footage from events, and create short, engaging clips optimized for social media.",
    leadDuties:
      "Manage the video editing workflow, oversee the creative direction of all video content, and ensure timely delivery of assets.",
  },
  "Technical Team": {
    purpose:
      "To serve as experts in various tech domains (Web, Mobile, AI/ML, etc.) and lead technical events.",
    memberDuties:
      "Assist in organizing workshops and hackathons, and help with speaker coordination.",
    leadDuties:
      "Plan and execute all technical events, coordinate with speakers and mentors, and ensure the quality of all technical programs.",
  },
  "Bevy Team": {
    purpose:
      "To manage GDG's official event platform (Bevy), including event creation, registration, and post-event content. This team will also manage event analytics and collaborate with multiple teams to ensure a seamless digital experience.",
    memberDuties:
      "Assist with creating and publishing event pages on Bevy, managing attendee registrations, uploading post-event photos, and coordinating with the Graphics and Media teams.",
    leadDuties:
      "Oversee all Bevy platform operations, ensure event data accuracy, manage analytics, and coordinate with other teams to integrate digital and on-ground efforts effectively.",
  },
  "Decor Team": {
    purpose: "To create event aesthetics, banners, and stage designs.",
    memberDuties:
      "Assist in the creative design and physical setup of event decor, banners, and stage designs.",
    leadDuties:
      "Develop a decor theme for each event, manage the budget for decorations, and lead the team in all setup and teardown tasks.",
  },
  "Event Experience & Audience Team": {
    purpose:
      "To enhance the overall attendee journey, grow the community, and manage the flow of events. This team focuses on attendee satisfaction, engagement, and tracking key metrics.",
    memberDuties:
      "Organize games and networking activities, assist in collecting feedback, help coordinate speaker transitions to keep the event on schedule, and maintain attendance records.",
    leadDuties:
      "Design the attendee experience for each event, create and analyze feedback forms, create the master event schedule, and develop strategies to grow and retain the community.",
  },
  "Documentation Team": {
    purpose: "To publish official updates and event documentation.",
    memberDuties:
      "Assist in publishing newsletters and press releases, and document events for the organization's portfolio.",
    leadDuties:
      "Manage all official documentation, coordinate with other circles to gather information, and ensure the GDG ITU portfolio is always up-to-date.",
  },
};

const ROLES = ["member"];

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

export function TeamRoleStep({
  values,
  update,
  onRoleChange,
}: TeamRoleStepProps) {
  const selectedTeamInfo = values.selectedTeam
    ? teamDescriptions[values.selectedTeam as keyof typeof teamDescriptions]
    : null;
  const isLead = values.selectedRole === "lead";

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
        onChange={(v) => onRoleChange(v)}
        required
      />

      {/* Team Description Card */}
      {selectedTeamInfo && (
        <div className="sm:col-span-2 p-4 rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-white mb-3">
            {values.selectedTeam}
          </h4>

          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-blue mb-1">Purpose</h5>
              <p className="text-sm text-white/70 leading-relaxed">
                {selectedTeamInfo.purpose}
              </p>
            </div>

            <div>
              <h5 className="text-sm font-medium text-green mb-1">
                {isLead ? "Lead Duties" : "Member Duties"}
              </h5>
              <p className="text-sm text-white/70 leading-relaxed">
                {isLead
                  ? selectedTeamInfo.leadDuties
                  : selectedTeamInfo.memberDuties}
              </p>
            </div>
          </div>
        </div>
      )}

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

// Single source of truth for the Core Leadership recruitment form.
// Served to the public site (renders the form) and the admin panel (labels the
// answers), and used here to validate submissions. Question ids are stored as
// keys in CoreApplication.answers — renaming an id orphans existing answers.

export const POSITIONS = [
  "General Secretary",
  "Event Director",
  "Treasurer",
  "Marketing Director",
  "Media Director",
  "Technical Director",
];

// Positions that require the applicant to already be a GDGoC member.
export const MEMBERS_ONLY_POSITIONS = ["General Secretary"];

export const DEPARTMENTS = [
  "Computer Science",
  "Software Engineering",
  "Computer Engineering",
  "Electrical Engineering",
  "Artificial Intelligence",
  "Other",
];

export const SEMESTERS = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
];

export const HOURS_PER_WEEK = ["3–5 hours", "5–8 hours", "8–12 hours", "12+ hours"];

export const DECLARATION_TEXT =
  "I understand that being a Core Member of GDG ITU requires commitment, responsibility, and active participation in all major events.";

// type: "textarea" | "choice"
export const COMMON_QUESTIONS = [
  {
    id: "bestSuited",
    label: "Why do you think you are best suited for this position?",
    type: "textarea",
  },
  {
    id: "pastExperience",
    label: "Describe your past experience relevant to this position",
    type: "textarea",
  },
  {
    id: "vision",
    label: "What is your vision for GDG ITU in the next year?",
    type: "textarea",
  },
  {
    id: "improvements",
    label: "What improvements would you bring to GDG ITU if selected?",
    type: "textarea",
  },
  {
    id: "teamManagement",
    label: "How will you build and manage your team effectively?",
    type: "textarea",
  },
  {
    id: "expectations",
    label: "What are your expectations from this role?",
    type: "textarea",
  },
];

export const POSITION_QUESTIONS = {
  "General Secretary": [
    {
      id: "secComms",
      label:
        "Share an example of a time you managed communication between multiple teams successfully.",
      type: "textarea",
    },
    {
      id: "secApprovals",
      label:
        "How would you handle urgent university approval requests under tight deadlines?",
      type: "textarea",
    },
    {
      id: "secRecords",
      label:
        "How will you keep records, meeting notes, and decisions organized for easy access?",
      type: "textarea",
    },
    {
      id: "secFollowUp",
      label:
        "Describe your process for following up on assigned tasks to ensure completion.",
      type: "textarea",
    },
    {
      id: "secMiscommunication",
      label:
        "How would you handle a situation where two team members are miscommunicating?",
      type: "textarea",
    },
  ],

  "Event Director": [
    {
      id: "eventExperience",
      label: "Describe an event you planned or contributed to — what was your role?",
      type: "textarea",
    },
    {
      id: "eventExecution",
      label:
        "What strategies will you use to ensure smooth event execution from start to finish?",
      type: "textarea",
    },
    {
      id: "eventEmergencies",
      label: "How would you handle last-minute event changes or emergencies?",
      type: "textarea",
    },
    {
      id: "eventTimelines",
      label:
        "Describe your approach to creating event timelines and assigning responsibilities.",
      type: "textarea",
    },
  ],

  Treasurer: [
    {
      id: "treasuryExperience",
      label: "Describe any experience you have with budgeting or managing finances",
      type: "textarea",
    },
    {
      id: "treasuryTransparency",
      label: "How will you ensure transparency and fairness in financial decisions?",
      type: "textarea",
    },
    {
      id: "treasuryPrioritization",
      label: "How would you prioritize expenses if the budget is limited?",
      type: "textarea",
    },
    {
      id: "treasuryTools",
      label: "What tools or methods would you use to track financial records?",
      type: "textarea",
    },
    {
      id: "treasuryCompliance",
      label:
        "How would you ensure financial compliance with both GDG and university policies?",
      type: "textarea",
    },
  ],

  "Marketing Director": [
    {
      id: "marketingCampaign",
      label: "Share a campaign idea you would run for a GDG event.",
      type: "textarea",
    },
    {
      id: "marketingGrowth",
      label: "How will you balance community growth with quality engagement?",
      type: "textarea",
    },
    {
      id: "marketingMediaCollab",
      label:
        "How would you collaborate with the Media team to ensure impactful visuals?",
      type: "textarea",
    },
    {
      id: "marketingAnalytics",
      label: "How would you use social media analytics to improve future campaigns?",
      type: "textarea",
    },
    {
      id: "marketingAttendance",
      label:
        "Describe a time when your marketing approach significantly boosted attendance.",
      type: "textarea",
    },
  ],

  "Media Director": [
    {
      id: "mediaPortfolio",
      label: "Share examples of past design, photography, or media work",
      type: "textarea",
    },
    {
      id: "mediaBrandConsistency",
      label:
        "How will you maintain brand consistency across different types of content?",
      type: "textarea",
    },
    {
      id: "mediaTools",
      label: "Which tools and software are you most comfortable using for creative work?",
      type: "textarea",
    },
    {
      id: "mediaUrgentRequests",
      label:
        "How will you handle urgent design or content requests without sacrificing quality?",
      type: "textarea",
    },
    {
      id: "mediaVisualTheme",
      label: "Describe how you would create a unified visual theme for a multi-day event.",
      type: "textarea",
    },
    {
      id: "mediaSubTeams",
      label:
        "How will you coordinate and delegate tasks between sub-teams (Media Team, Graphics Team, Content Creation, Video Editing, Branding & Visual Identity) to avoid overlaps or delays?",
      type: "textarea",
    },
    {
      id: "mediaCrossCircle",
      label:
        "How will you ensure smooth collaboration between creative teams and other event circles (e.g. Logistics, Marketing, Speakers)?",
      type: "textarea",
    },
    {
      id: "mediaUnderperformance",
      label:
        "If one of your sub-teams is underperforming or missing deadlines, how will you address it?",
      type: "textarea",
    },
  ],

  "Technical Director": [
    {
      id: "techDomains",
      label: "Which technical domains (e.g. AI, Web, Mobile) are you most confident in?",
      type: "textarea",
    },
    {
      id: "techWorkshopPlan",
      label: "Describe how you would plan a technical workshop or hackathon.",
      type: "textarea",
    },
    {
      id: "techBeginnerFriendly",
      label:
        "How would you ensure technical content is beginner-friendly yet engaging for advanced members?",
      type: "textarea",
    },
    {
      id: "techProject",
      label: "Share an example of a technical project you've worked on.",
      type: "textarea",
    },
    {
      id: "techMentoring",
      label: "How would you mentor team members in learning new technologies?",
      type: "textarea",
    },
    {
      id: "techPcSetup",
      label:
        "What steps would you take to ensure all PCs are pre-configured for hackathon participants before the event day?",
      type: "textarea",
    },
    {
      id: "techMultitasking",
      label:
        "Share an example where you had to manage multiple technical tasks at once — how did you prioritize them?",
      type: "textarea",
    },
    {
      id: "techVendors",
      label:
        "How comfortable are you with coordinating with vendors for technical equipment or internet setup?",
      type: "textarea",
    },
    {
      id: "techVolunteers",
      label:
        "How would you train and delegate tasks to technical volunteers/team members for smooth event execution?",
      type: "textarea",
    },
  ],
};

/** Every question an applicant for `position` must answer, in display order. */
export const questionsFor = (position) => [
  ...COMMON_QUESTIONS,
  ...(POSITION_QUESTIONS[position] || []),
];

/** Flat id → label map, for labelling stored answers in the admin panel. */
export const QUESTION_LABELS = Object.fromEntries(
  [...COMMON_QUESTIONS, ...Object.values(POSITION_QUESTIONS).flat()].map((q) => [
    q.id,
    q.label,
  ])
);

/** The whole config, as served to the frontends. */
export const formConfig = () => ({
  positions: POSITIONS,
  membersOnlyPositions: MEMBERS_ONLY_POSITIONS,
  departments: DEPARTMENTS,
  semesters: SEMESTERS,
  hoursPerWeek: HOURS_PER_WEEK,
  declarationText: DECLARATION_TEXT,
  commonQuestions: COMMON_QUESTIONS,
  positionQuestions: POSITION_QUESTIONS,
});

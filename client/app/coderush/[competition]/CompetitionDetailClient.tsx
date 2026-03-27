"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Trophy, Users, Clock, ArrowRight, ExternalLink, ChevronRight } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Reveal from "@/components/ui/reveal";

const COMPETITION_DATA: Record<string, any> = {
  "competitive-programming": {
    name: "Competitive Programming",
    logo: "/images/coderush/cp.png",
    logoHover: "/images/coderush/cp-hover.png",
    tagline: "ICPC format. Solve or go home.",
    fee: 1800, earlyBird: 1500,
    prizes: ["PKR 30,000", "PKR 20,000", "PKR 10,000"],
    teamSize: "Up to 3 members", duration: "3 hours per round", format: "2-day tournament",
    overview: "Code Rush's premier algorithmic challenge. This module follows the ICPC format, testing teams on their ability to solve complex logic and mathematical problems under extreme time pressure and resource constraints.",
    sections: [
      { title: "Tournament Structure", items: ["Day 1 (Qualifiers): Two slots with 4–5 problems each. Focus on speed and accuracy.", "Day 2 (Grand Finale): Top teams compete in a final round featuring 9–10 problems."] },
      { title: "Logistics & Environment", items: ["Venue: On-Campus (University Computer Labs). No remote participation.", "Duration: 3-hour sessions per round.", "Languages Allowed: C++, Java, Python (C++ is highly recommended).", "Software: Standard IDEs (VS Code, Code::Blocks). No pre-written code snippets."] },
      { title: "⚠️ AI Policy — Strict Enforcement", highlight: true, items: ["AI Tools: Use of ChatGPT, GitHub Copilot, or any LLM is STRICTLY PROHIBITED.", "Connectivity: No access to external websites (except the contest portal).", "Communication: No Zoom, Google Meet, or Discord. Mobile phones must be submitted."] },
      { title: "Submission & Tracking", items: ["All submissions are handled via the Contest Portal.", "Rankings are updated on a live real-time leaderboard."] },
    ],
  },
  "web-development": {
    name: "Web Development",
    logo: "/images/coderush/web.png", logoHover: "/images/coderush/web-hover.png",
    tagline: "8-hour full-stack hackathon.",
    fee: 2500, earlyBird: 2200,
    prizes: ["PKR 30,000", "PKR 15,000"],
    teamSize: "Up to 3 members", duration: "8 hours (Continuous Sprint)", format: "On-campus hackathon",
    overview: "A high-intensity, Full-Stack Web Development hackathon. Teams will be presented with a specific Problem Statement at the start of the event. The goal is to build a functional, responsive, and dynamic web application that solves the given problem.",
    warning: "This module mimics real-world software engineering. Be prepared for changing requirements.",
    sections: [
      { title: "Technical Stack & Tools", items: ["Allowed Stacks: Open Stack — MERN, MEAN, Django, Laravel, Next.js, etc.", 'Prohibited: "No-Code" / "Low-Code" platforms are BANNED (WordPress, Wix, Webflow, Bubble.io).', "All projects must start from scratch. No pre-built templates stored on drives.", "Standard CLI initializers (create-react-app, npm init) are allowed."] },
      { title: "AI & Internet Policy", items: ["Generative AI: ALLOWED (ChatGPT, Gemini, GitHub Copilot).", "Internet Access: ALLOWED (documentation, StackOverflow, forums).", "Human assistance is STRICTLY PROHIBITED.", "Communication tools (WhatsApp, Discord, Telegram, Slack) are BANNED."] },
      { title: "🌀 Mid-Sprint Twist", highlight: true, items: ["A surprise feature requirement drops at the 4-hour mark.", "Must be integrated into the final solution.", "Teams with clean, modular code will adapt easily."] },
      { title: "Submission & Deployment", items: ['Platform: GitHub Classroom (private repo per team).', '"It works on localhost" is NOT accepted — a LIVE URL is mandatory.', "Deploy via Vercel, Netlify, Heroku, GitHub Pages, or AWS.", "Regular incremental commits required — one massive commit will be flagged."] },
      { title: "Evaluation Criteria", items: ["Functionality & Completeness: Did you solve the main problem?", "Adaptability: Did you successfully implement the Twist feature?", "Deployment: Is the live link working?", "UI/UX: Is the interface polished and responsive?"] },
    ],
  },
  "app-development": {
    name: "App Development",
    logo: "/images/coderush/app.png", logoHover: "/images/coderush/app-hover.png",
    tagline: "Build. Ship. Win.",
    fee: 2500, earlyBird: 2200,
    prizes: ["PKR 15,000", "PKR 10,000"],
    teamSize: "Up to 3 members", duration: "8 hours (Continuous Sprint)", format: "On-campus hackathon",
    overview: "This module focuses on building a functional, user-friendly mobile application. Teams receive a Problem Statement at the start and must develop a working mobile solution that addresses the user needs defined in the brief.",
    warning: 'This is a "Build & Ship" event. A working app on a simulator is good, but a working app on a real device is better.',
    sections: [
      { title: "Technical Stack & Tools", items: ["Cross-Platform (Recommended): Flutter, React Native, Kotlin Multiplatform.", "Native: Kotlin/Java (Android), Swift (iOS).", "Development Environments: Android Studio, VS Code, Xcode.", 'No-Code app builders (Thunkable, AppSheet, Adalo) are STRICTLY BANNED.', "All projects must start from a clean slate."] },
      { title: "AI & Internet Policy", items: ["Generative AI: ALLOWED (ChatGPT, Gemini, Copilot).", "Internet Access: ALLOWED.", "Human assistance (mentors, remote help) is STRICTLY PROHIBITED.", "Communication apps (WhatsApp, Discord) are BANNED."] },
      { title: "🌀 Mid-Sprint Twist", highlight: true, items: ["A surprise feature drops at the 4-hour mark.", "Teams must adapt architecture to include this new feature.", "Tests code modularity: a poorly structured app will break."] },
      { title: "Submission — Two Required Deliverables", items: ["A. Source Code: GitHub Classroom. Regular commits required.", "B. The Build: A functional .APK (Android) or testable Build (iOS).", "Upload APK to Google Classroom or specified Drive link before deadline.", 'Constraint: If the APK crashes on launch, submission is marked "Failed Build".'] },
      { title: "Evaluation Criteria", items: ["Functionality: Does the app solve the problem statement?", "Stability: Crashes = heavy penalty.", "UI/UX: Intuitive and visually appealing on mobile?", "Feature Completeness: Did you implement the Twist?"] },
    ],
  },
  "ui-ux": {
    name: "UI/UX Design",
    logo: "/images/coderush/ui.png", logoHover: "/images/coderush/ui-hover.png",
    tagline: "Design thinking meets Figma.",
    fee: 2000, earlyBird: 1700,
    prizes: ["PKR 15,000", "PKR 10,000"],
    teamSize: "Up to 3 members", duration: "8 hours", format: "On-campus design sprint",
    overview: "This module focuses on the complete product design cycle: Research, Strategy, and Interface Design. Teams will be given a design brief and must justify their design decisions with solid UX research before creating the final high-fidelity prototype.",
    sections: [
      { title: "Tools & Software", items: ["Mandatory Tool: Figma. All research and designs must be in Figma for judging.", "You may use free icon packs (FontAwesome, Material Icons) and stock photos (Unsplash, Pexels).", 'Prohibited: Full "UI Kits" or pre-made templates that do 90% of the work for you.'] },
      { title: "AI & Internet Policy", items: ["Generative AI: ALLOWED for dummy text, user persona data, or specific image assets.", "Warning: AI-generated full layouts are generic — judges reward originality.", "Internet Access: ALLOWED for inspiration, assets, and icons."] },
      { title: "Scope of Work (Deliverables)", items: ["Part A — UX Research: User Persona, User Journey Map, Information Architecture.", "Part B — UI Design & Prototype: High-fidelity screens + clickable prototype in Figma.", "Submit: Figma link (set to 'Anyone can view') + exported .fig file.", "Judges may check Figma Version History to confirm work was done during the event."] },
      { title: "Evaluation Criteria", items: ["UX Research (30%): Did they understand the user?", "Usability & Architecture (20%): Is navigation logical?", "Visual Design (30%): Typography, Color Theory, Spacing, Consistency.", "Prototyping (20%): Quality of interactions and transitions."] },
    ],
  },
  robotics: {
    name: "Robotics",
    logo: "/images/coderush/robo.png", logoHover: "/images/coderush/robo-hover.png",
    tagline: "RC Race · LFR · Robo Soccer.",
    fee: 1500, earlyBird: 1200,
    prizes: ["PKR 15,000", "PKR 10,000"],
    teamSize: "Up to 3 members", duration: "Event day competition", format: "On-campus arena",
    overview: "CodeRush 2026 hosts three proven robotics competition formats designed to attract participants of all skill levels — from beginners to advanced builders.",
    sections: [
      { title: "Module 1 — RC Car Race", items: ["Teams build or modify a remote-controlled robot/car to race through a designed track.", "Skills Tested: Motor control, chassis design, speed vs. stability optimization.", "Most beginner-friendly format with high participation rate."] },
      { title: "Module 2 — Line Following Robot (LFR)", items: ["An autonomous robot that follows a predefined line on the track using sensors.", "Skills Tested: Sensor calibration, control algorithms, embedded programming.", "Classic university competition format suitable for both beginners and advanced teams."] },
      { title: "Module 3 — Robo Soccer", items: ["Two or more RC-based robots compete in a football-style arena to score goals.", "Skills Tested: Robot maneuverability, team coordination, mechanical robustness.", "More entertaining for spectators; RC-based for reliability."] },
      { title: "Infrastructure", items: ["Arena/Track setup for each module.", "Power supply points and safety barriers provided.", "Stopwatch / timing system and judges on-site."] },
    ],
  },
  "game-jam": {
    name: "Game Jam",
    logo: "/images/coderush/game.png", logoHover: "/images/coderush/game-hover.png",
    tagline: "1 week. 1 game. 1 winner.",
    fee: 3000, earlyBird: 2700,
    prizes: ["PKR 20,000", "PKR 10,000"],
    teamSize: "Up to 3 members", duration: "1 week (7 days)", format: "Hybrid — remote dev + on-campus finale",
    overview: "A creative challenge where teams must conceptualize, build, and polish a playable game over the course of one week. A specific theme is announced at the start; teams build remotely and present on-campus at the Grand Finale.",
    warning: "Registrations open almost 2 months prior — plenty of time to learn the skills needed.",
    sections: [
      { title: "Format & Timeline", items: ["Development Phase (Days 1–7): Remote. Work from home/dorms.", "Grand Finale (Day 7): On-Campus Presentation & Showcase.", "Theme announced online at start (e.g., History, Futuristic, Dystopian, Mythical).", "Genre: Completely free — FPS, survival, co-op, horror, open-world, fighting, etc."] },
      { title: "Technical Stack", items: ["Allowed Engines: Unity, Godot, GameMaker Studio ONLY.", "Games can be 2D or 3D.", 'Pre-made Assets: Free/open-source asset packs allowed IF declared.', 'Prohibited: Full "Game Kits" with pre-coded movement/enemies are BANNED.'] },
      { title: "AI & Internet Policy", items: ["Generative AI: ALLOWED for textures, background music, or dialogue lines.", "Core game loop must be understood by the team (mandatory).", "Internet Access: ALLOWED."] },
      { title: "Submission", items: ["A. The Build: .exe (Windows), .app (Mac), or Web Link via Google Classroom or Itch.io.", "Late submissions are NOT qualified for Best Game prize.", "B. Source Code: GitHub. Regular commits required throughout the week.", "Warning: An empty repo with a massive upload on Day 7 will be flagged as Suspicious Activity."] },
      { title: "Evaluation Criteria", items: ["Fun Factor: Is the game enjoyable to play?", "Theme Adherence: Does the game creatively interpret the assigned theme?", "Polish: Menus, sound effects, no game-breaking bugs.", "Mechanics: Quality and originality of the game logic.", "Replay-ability: How likely is the player to come back?", "Bonus: Original art/animations made by the team earns extra points."] },
    ],
  },
  "machine-learning": {
    name: "Machine Learning",
    logo: "/images/coderush/ml.png", logoHover: "/images/coderush/ml-hover.png",
    tagline: "Data → Model → Podium.",
    fee: 2500, earlyBird: 2200,
    prizes: ["PKR 15,000", "PKR 10,000"],
    teamSize: "2–3 members", duration: "8-hour sprint + follow-up phases", format: "Hybrid (on-campus sprint + Kaggle + presentation)",
    overview: "An end-to-end hackathon challenge where teams act as Data Scientists to solve a real-world problem using Classification, Regression, or NLP. Teams must move from raw data to a deployable model.",
    sections: [
      { title: "Tournament Workflow", items: ["Phase 1 — The Sprint: 8-hour on-campus development. Teams receive a dataset and test inputs.", "Phase 2 — Kaggle Submission: Teams upload predictions to a private Kaggle leaderboard.", "Phase 3 — Shortlisting: Top teams advance based on metrics (Accuracy, F1, RMSE).", "Phase 4 — Final Pitch: Shortlisted teams present their approach and code to a jury."] },
      { title: "Logistics & Environment", items: ["Venue: On-Campus (Hybrid format for Phase 1; Presentations must be in-person).", "Languages Allowed: Python (Primary), R.", "Software: Jupyter Notebooks, Google Colab, Kaggle Kernels."] },
      { title: "AI Policy & Submission", items: ["AI: ALLOWED for boilerplate/debugging, but logic and analysis must be original.", "Restrictions: No plagiarism from public GitHub repos. No external consultation.", "Submission: Code pushed to GitHub + final report via Google/GitHub Classroom."] },
      { title: "Marking Criteria", items: ["Algorithm Logic: Preference for elegant, simple solutions.", "Data Analysis: Quality of EDA, visualizations, and correlation insights.", "Presentation: Technical defense, clarity, and handling of the Hidden Test Set."] },
    ],
  },
  ctf: {
    name: "Capture The Flag",
    logo: "/images/coderush/ctf.png", logoHover: "/images/coderush/ctf-hover.png",
    tagline: "Hack. Exploit. Capture.",
    fee: 2500, earlyBird: 2200,
    prizes: ["PKR 15,000", "PKR 10,000"],
    teamSize: "Up to 3 members", duration: "6–8 hours", format: "On-campus Jeopardy-style CTF",
    overview: "A cybersecurity challenge where teams solve a series of increasingly difficult security puzzles across multiple domains. Flags are hidden in vulnerable systems, encrypted messages, and obfuscated code — find them before time runs out.",
    sections: [
      { title: "Challenge Categories", items: ["Web Exploitation: SQL injection, XSS, CSRF, authentication bypasses.", "Cryptography: Classical ciphers, RSA, AES, hashing challenges.", "Reverse Engineering: Binary analysis, decompilation, and patching.", "Forensics: Disk images, packet captures, steganography.", "Miscellaneous: OSINT, scripting, logic puzzles."] },
      { title: "Rules & Environment", items: ["All challenges hosted on an isolated CTF platform.", "No attacking the infrastructure or other teams.", "No sharing flags or solutions between teams.", "Internet access: ALLOWED for research and tools."] },
      { title: "Tools & Resources", items: ["Bring your own laptop with preferred tools pre-installed.", "Recommended: Kali Linux, Burp Suite, Wireshark, Ghidra, CyberChef.", "VMs and containers allowed for sandboxed testing."] },
      { title: "Scoring", items: ["Dynamic scoring: Points decrease as more teams solve a challenge.", "First blood bonus for the first team to solve each challenge.", "Hints available at a point cost.", "Final rankings based on total points and tie-broken by solve time."] },
    ],
  },
};

export default function CompetitionDetailClient({ competition }: { competition: string }) {
  const comp = COMPETITION_DATA[competition];
  const [logoHovered, setLogoHovered] = useState(false);

  if (!comp) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/40">Competition not found.</p>
          <Link href="/coderush" className="inline-flex items-center gap-2 text-cr-green text-sm hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to CodeRush
          </Link>
        </div>
      </div>
    );
  }

  const pdfFile =
    competition === "competitive-programming" || competition === "machine-learning" ? "ML_CP_DOC.pdf"
    : competition === "web-development" ? "Web Development.pdf"
    : competition === "app-development" ? "App Development.pdf"
    : competition === "ui-ux" ? "UIUX Design.pdf"
    : competition === "robotics" ? "Robotics_Proposal.pdf"
    : competition === "ctf" ? "Capture The Flag (CTF).pdf"
    : "Game Development (2).pdf";

  const prizeColors = ["text-yellow font-bold", "text-white/70 font-semibold", "text-white/40 font-medium"];
  const prizeLabels = ["1st Place", "2nd Place", "3rd Place"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 right-1/4 w-[500px] h-[400px] bg-cr-green/[0.06] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/3 -left-20 w-[300px] h-[300px] bg-cr-green/[0.04] blur-[80px] rounded-full" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{ backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Hero banner */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-cr-green/[0.05] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cr-green/20 to-transparent" />

        <div className="relative z-10 px-6 md:px-16 lg:px-24 pt-28 pb-12">
          {/* Back */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="mb-10">
            <Link href="/coderush" className="inline-flex items-center gap-1.5 text-white/30 hover:text-cr-green transition-colors text-sm group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to CodeRush
            </Link>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8"
            >
              {/* Logo */}
              <div
                className="relative shrink-0 cursor-pointer"
                onMouseEnter={() => setLogoHovered(true)}
                onMouseLeave={() => setLogoHovered(false)}
              >
                <div className="absolute inset-0 bg-cr-green/20 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ opacity: logoHovered ? 1 : 0 }} />
                <div className="w-36 h-36 rounded-2xl border border-cr-green/20 bg-cr-green/[0.05] flex items-center justify-center p-4 relative">
                  <img
                    src={logoHovered ? comp.logoHover : comp.logo}
                    alt={comp.name}
                    className="w-full h-full object-contain transition-all duration-300"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {/* Breadcrumb badge */}
                <div className="inline-flex items-center gap-1.5 mb-4 text-xs text-white/30">
                  <img src="/images/coderush/logo.jpg" alt="" className="h-4 w-auto rounded" />
                  <span>CodeRush 2026</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-cr-green/60">{comp.name}</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-space-grotesk font-black text-white mb-3 leading-none">
                  {comp.name}
                </h1>
                <p className="text-cr-green text-lg font-medium mb-6">{comp.tagline}</p>

                {/* Meta pills */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {[
                    { icon: <Users className="w-3.5 h-3.5" />, text: comp.teamSize },
                    { icon: <Clock className="w-3.5 h-3.5" />, text: comp.duration },
                    { icon: <Trophy className="w-3.5 h-3.5" />, text: comp.format },
                  ].map((s) => (
                    <div key={s.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-white/50">
                      <span className="text-cr-green">{s.icon}</span>
                      {s.text}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 md:px-16 lg:px-24 pb-24">
        <div className="max-w-5xl mx-auto">

          {/* Fee + Prize cards */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-10">
              {/* Regular fee */}
              <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center overflow-hidden">
                <div className="text-white/25 text-xs uppercase tracking-wider mb-3">Regular Fee</div>
                <div className="text-3xl font-black text-white font-space-grotesk">PKR {comp.fee.toLocaleString()}</div>
                <div className="text-white/25 text-xs mt-1">per team</div>
              </div>

              {/* Early bird — featured */}
              <div className="relative rounded-2xl border border-cr-green/30 bg-cr-green/[0.06] p-6 text-center overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cr-green/50 to-transparent" />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-12 bg-cr-green/20 blur-2xl" />
                <div className="text-cr-green text-xs uppercase tracking-wider font-semibold mb-3">Early Bird</div>
                <div className="text-3xl font-black text-cr-green font-space-grotesk">PKR {comp.earlyBird.toLocaleString()}</div>
                <div className="text-cr-green/40 text-xs mt-1">save PKR {(comp.fee - comp.earlyBird).toLocaleString()}</div>
              </div>

              {/* Prizes */}
              <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-4 justify-center">
                  <Trophy className="w-3.5 h-3.5 text-cr-green" />
                  <div className="text-white/25 text-xs uppercase tracking-wider">Prizes</div>
                </div>
                <div className="space-y-2">
                  {comp.prizes.map((prize: string, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-white/30 text-xs">{prizeLabels[i]}</span>
                      <span className={prizeColors[i]}>{prize}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Overview */}
          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mb-4">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.04]">
                <div className="w-1 h-5 bg-cr-green rounded-full" />
                <h2 className="text-white font-bold">Overview</h2>
              </div>
              <div className="px-6 py-5">
                <p className="text-white/55 leading-relaxed">{comp.overview}</p>
                {comp.warning && (
                  <div className="mt-4 flex items-start gap-3 p-4 rounded-xl border border-cr-green/20 bg-cr-green/[0.04]">
                    <span className="text-cr-green mt-0.5 shrink-0">⚠️</span>
                    <p className="text-cr-green/80 text-sm">{comp.warning}</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>

          {/* Sections */}
          <div className="space-y-4 mb-8">
            {comp.sections.map((section: any, i: number) => (
              <Reveal key={i} delay={0.05 * (i + 1)}>
                <div className={`rounded-2xl border overflow-hidden ${section.highlight ? "border-cr-green/25 bg-cr-green/[0.03]" : "border-white/[0.06] bg-white/[0.02]"}`}>
                  <div className={`flex items-center gap-3 px-6 py-4 border-b ${section.highlight ? "border-cr-green/15" : "border-white/[0.04]"}`}>
                    {section.highlight && <div className="w-1 h-5 bg-cr-green rounded-full" />}
                    <h2 className={`font-bold text-sm ${section.highlight ? "text-cr-green" : "text-white"}`}>
                      {section.title}
                    </h2>
                  </div>
                  <ul className="px-6 py-4 space-y-2.5">
                    {section.items.map((item: string, j: number) => (
                      <li key={j} className="flex items-start gap-3 text-white/50 text-sm">
                        <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0 bg-cr-green/40" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* PDF + Register row */}
          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 gap-4">
              {/* PDF — hidden until documents are ready
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl border border-cr-green/20 bg-cr-green/[0.06] flex items-center justify-center shrink-0">
                  <ExternalLink className="w-4 h-4 text-cr-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Competition Document</p>
                  <p className="text-white/30 text-xs mt-0.5">Full rules, rubrics & guidelines</p>
                </div>
                <a
                  href={`/modules/${encodeURIComponent(pdfFile)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-cr-green/25 bg-cr-green/[0.07] text-cr-green text-xs font-semibold hover:bg-cr-green/[0.14] transition-colors shrink-0"
                >
                  View PDF
                </a>
              </div>
              */}

              {/* Register CTA */}
              <div className="relative rounded-2xl border border-cr-green/25 bg-cr-green/[0.05] p-6 overflow-hidden flex items-center gap-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cr-green/40 to-transparent" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cr-green/10 blur-2xl rounded-full" />
                <div className="flex-1 min-w-0 relative z-10">
                  <p className="text-white font-bold">Ready to compete?</p>
                  <p className="text-white/35 text-xs mt-0.5">PKR {comp.earlyBird.toLocaleString()} early bird · {comp.teamSize}</p>
                </div>
                <Link href={`/coderush/register?competition=${competition}`} className="relative z-10 shrink-0">
                  <InteractiveHoverButton className="bg-black border-cr-green/40 text-white">Register</InteractiveHoverButton>
                </Link>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </div>
  );
}

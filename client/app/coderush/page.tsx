"use client";
import { motion, useAnimationFrame } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  ArrowRight,
  Zap,
} from "lucide-react";
import Reveal from "@/components/ui/reveal";
import ShiftingCountdown from "@/components/ui/countdown";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const COMPETITIONS = [
  {
    id: "competitive-programming",
    name: "Competitive Programming",
    logo: "/images/coderush/cp.png",
    logoHover: "/images/coderush/cp-hover.png",
    fee: 1800,
    earlyBird: 1500,
    prizes: ["30k", "20k", "10k"],
    tagline: "ICPC format. Solve or go home.",
  },
  {
    id: "web-development",
    name: "Web Development",
    logo: "/images/coderush/web.png",
    logoHover: "/images/coderush/web-hover.png",
    fee: 2500,
    earlyBird: 2200,
    prizes: ["30k", "15k"],
    tagline: "8-hour full-stack hackathon.",
  },
  {
    id: "app-development",
    name: "App Development",
    logo: "/images/coderush/app.png",
    logoHover: "/images/coderush/app-hover.png",
    fee: 2500,
    earlyBird: 2200,
    prizes: ["15k", "10k"],
    tagline: "Build. Ship. Win.",
  },
  {
    id: "ui-ux",
    name: "UI/UX Design",
    logo: "/images/coderush/ui.png",
    logoHover: "/images/coderush/ui-hover.png",
    fee: 2000,
    earlyBird: 1700,
    prizes: ["15k", "10k"],
    tagline: "Design thinking meets Figma.",
  },
  {
    id: "robotics",
    name: "Robotics",
    logo: "/images/coderush/robo.png",
    logoHover: "/images/coderush/robo-hover.png",
    fee: 1500,
    earlyBird: 1200,
    prizes: ["15k", "10k"],
    tagline: "RC Race · LFR · Robo Soccer.",
  },
  {
    id: "game-jam",
    name: "Game Jam",
    logo: "/images/coderush/game.png",
    logoHover: "/images/coderush/game-hover.png",
    fee: 3000,
    earlyBird: 2700,
    prizes: ["20k", "10k"],
    tagline: "1 week. 1 game. 1 winner.",
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    logo: "/images/coderush/ml.png",
    logoHover: "/images/coderush/ml-hover.png",
    fee: 2500,
    earlyBird: 2200,
    prizes: ["15k", "10k"],
    tagline: "Data → Model → Podium.",
  },
];

// Marquee ticker
const TICKER_ITEMS = [
  "Competitive Programming",
  "Web Development",
  "App Development",
  "UI/UX Design",
  "Robotics",
  "Game Jam",
  "Machine Learning",
];

function Marquee() {
  const x = useRef(0);
  const divRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((_, delta) => {
    x.current -= delta * 0.04;
    if (divRef.current) {
      const w = divRef.current.scrollWidth / 2;
      if (Math.abs(x.current) >= w) x.current = 0;
      divRef.current.style.transform = `translateX(${x.current}px)`;
    }
  });

  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="overflow-hidden border-y border-cr-green/10 py-3 my-12 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
      <div
        ref={divRef}
        className="flex whitespace-nowrap will-change-transform"
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-sm text-white/30 uppercase tracking-widest font-medium"
          >
            {item}
            <span className="text-cr-green/50 text-base">›</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const CompetitionCard = ({ comp }: { comp: (typeof COMPETITIONS)[0] }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/coderush/${comp.id}`}>
      <motion.div
        className="relative group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 transition-all duration-300 hover:border-cr-green/40 h-full flex flex-col"
        whileHover={{ y: -4 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0 rounded-2xl bg-cr-green/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-20 h-20 mb-4 mx-auto">
            <img
              src={hovered ? comp.logoHover : comp.logo}
              alt={comp.name}
              className="w-full h-full object-contain transition-all duration-300 rounded-xl border border-white/[0.08] group-hover:border-cr-green/20"
            />
          </div>
          <h3 className="text-lg font-bold text-white text-center mb-1">
            {comp.name}
          </h3>
          <p className="text-white/40 text-sm text-center mb-4">
            {comp.tagline}
          </p>
          <div className="flex justify-between items-center bg-white/[0.05] rounded-lg px-3 py-2 mb-3">
            <div className="text-center">
              <div className="text-xs text-white/30">Regular</div>
              <div className="text-white font-semibold text-sm">
                PKR {comp.fee.toLocaleString()}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xs text-cr-green font-medium">
                Early Bird
              </div>
              <div className="text-cr-green font-semibold text-sm">
                PKR {comp.earlyBird.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center mb-4">
            <Trophy className="w-3.5 h-3.5 text-cr-green shrink-0" />
            <span className="text-cr-green text-sm font-medium">
              {comp.prizes.join(" · ")}
            </span>
          </div>
          <div className="mt-auto flex items-center justify-center gap-1 text-white/40 group-hover:text-cr-green transition-colors text-sm">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default function CoderushPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Layered green atmospheric glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cr-green/[0.07] blur-[140px] rounded-full" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-cr-green/[0.04] blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-cr-green/[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 px-6 md:px-16 lg:px-24 pb-24 pt-32">
        {/* ── HERO ── */}
        <div className="text-center mb-4">
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cr-green/25 bg-cr-green/[0.07] mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cr-green animate-pulse" />
            <span className="text-xs text-cr-green/80 tracking-widest uppercase font-medium">
              GDG on Campus ITU · Flagship Event
            </span>
          </motion.div>

          {/* Logo with glow ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-3xl bg-cr-green/20 blur-2xl scale-110" />
              {/* Ring */}
              <div className="absolute -inset-1 rounded-3xl border border-cr-green/20" />
              <img
                src="/images/coderush/logo.jpg"
                alt="CodeRush"
                className="relative w-52 sm:w-64 md:w-72 object-contain rounded-2xl"
              />
            </div>
          </motion.div>

          {/* Year tag */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex items-center justify-center gap-4 mb-5"
          >
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-cr-green/30" />
            <span className="text-cr-green/60 text-xs uppercase tracking-[0.3em] font-medium">
              2026
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-cr-green/30" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-xl md:text-2xl font-space-grotesk font-bold text-white/80 max-w-2xl mx-auto leading-snug mb-2"
          >
            Pakistan's premier multi-discipline tech competition.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="text-white/35 text-base mb-8"
          >
            7 competitions · 3 days · one chance to prove yourself
          </motion.p>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-4"
          >
            {[
              {
                icon: <Calendar className="w-3.5 h-3.5" />,
                label: "Date",
                value: "May 8–10, 2026",
              },
              {
                icon: <Users className="w-3.5 h-3.5" />,
                label: "Open to",
                value: "All Universities",
              },
              {
                icon: <Trophy className="w-3.5 h-3.5" />,
                label: "Prize Pool",
                value: "150,000+ PKR",
              },
              {
                icon: <Zap className="w-3.5 h-3.5" />,
                label: "Competitions",
                value: "7 Tracks",
              },
            ].map((s) => (
              <div
                key={s.value}
                className="flex items-center gap-2.5 border border-cr-green/20 bg-cr-green/[0.05] rounded-full px-4 py-2"
              >
                <span className="text-cr-green">{s.icon}</span>
                <span className="text-white/40 text-xs">{s.label}:</span>
                <span className="text-white/80 text-xs font-semibold">
                  {s.value}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Link href="/coderush/register">
              <InteractiveHoverButton className="bg-cr-green/20 border-cr-green/40 text-white">
                Register Now
              </InteractiveHoverButton>
            </Link>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/coderush/sponsor"
                className="inline-flex items-center gap-2 px-7 py-3 border border-white/[0.1] bg-white/[0.03] text-white/50 rounded-full font-medium hover:text-white hover:border-white/[0.2] transition-colors text-sm"
              >
                Become a Sponsor
              </Link>
              <Link
                href="/coderush/ambassador"
                className="inline-flex items-center gap-2 px-7 py-3 border border-white/[0.1] bg-white/[0.03] text-white/50 rounded-full font-medium hover:text-white hover:border-white/[0.2] transition-colors text-sm"
              >
                Become an Ambassador
              </Link>
              <Link
                href="/coderush/partner"
                className="inline-flex items-center gap-2 px-7 py-3 border border-white/[0.1] bg-white/[0.03] text-white/50 rounded-full font-medium hover:text-white hover:border-white/[0.2] transition-colors text-sm"
              >
                Community Partnership
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ── MARQUEE ── */}
        <Marquee />

        {/* ── COUNTDOWN ── */}
        <Reveal delay={0.2}>
          <div className="max-w-2xl mx-auto mb-24">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px flex-1 bg-cr-green/10" />
              <span className="text-cr-green/50 text-xs uppercase tracking-[0.25em] font-medium">
                Event Starts In
              </span>
              <div className="h-px flex-1 bg-cr-green/10" />
            </div>
            <div className="relative">
              {/* Corner accents */}
              <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-cr-green/50 rounded-tl-xl" />
              <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-cr-green/50 rounded-tr-xl" />
              <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-cr-green/50 rounded-bl-xl" />
              <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-cr-green/50 rounded-br-xl" />
              <div className="rounded-xl p-[1px] bg-gradient-to-br from-cr-green/30 via-cr-green/10 to-cr-green/30">
                <div className="rounded-[0.65rem] overflow-hidden bg-black/90">
                  <ShiftingCountdown />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── COMPETITIONS ── */}
        <Reveal delay={0.15}>
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 bg-cr-green rounded-full" />
                  <span className="text-cr-green text-xs uppercase tracking-widest font-medium">
                    Choose Your Battlefield
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-space-grotesk font-black text-white">
                  7 Competitions
                </h2>
                <p className="text-white/35 text-sm mt-2">
                  Teams of up to 3 · Multiple entries allowed · All universities
                  welcome
                </p>
              </div>
              <Link href="/coderush/register" className="shrink-0">
                <InteractiveHoverButton className="bg-black border-cr-green/40 text-white !text-sm">
                  Register Now
                </InteractiveHoverButton>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {COMPETITIONS.map((comp) => (
                <CompetitionCard key={comp.id} comp={comp} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── SCHEDULE ── */}
        <Reveal delay={0.2}>
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cr-green/[0.06] via-black to-black" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cr-green/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cr-green/20 to-transparent" />

              <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cr-green/20 bg-cr-green/[0.08] mb-4">
                    <Calendar className="w-3.5 h-3.5 text-cr-green" />
                    <span className="text-xs text-cr-green/80 uppercase tracking-wider">
                      May 8 – 10, 2026
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-space-grotesk font-black text-white mb-2">
                    Full Schedule
                    <br />
                    <span className="text-cr-green">Coming Soon</span>
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    The detailed 3-day competition timeline is being finalised.
                    Stay tuned.
                  </p>
                  <p className="text-white/25 text-xs mt-3">
                    Follow{" "}
                    <a
                      href="https://www.instagram.com/coderush_itu/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cr-green/50 hover:text-cr-green transition-colors"
                    >
                      @coderush_itu
                    </a>{" "}
                    for updates
                  </p>
                </div>

                {/* Day blocks */}
                <div className="flex gap-3 shrink-0">
                  {["Day 1", "Day 2", "Day 3"].map((d, i) => (
                    <div key={d} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-16 h-20 rounded-xl border flex items-center justify-center ${i === 0 ? "border-cr-green/40 bg-cr-green/[0.08]" : "border-white/[0.06] bg-white/[0.02]"}`}
                      >
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${i === 0 ? "text-cr-green" : "text-white/20"}`}
                        >
                          {d.split(" ")[0]}
                          <br />
                          {d.split(" ")[1]}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/20 uppercase tracking-wider">
                        {["May 8", "May 9", "May 10"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

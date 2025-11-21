"use client";
import Reveal, { RevealGroup } from "@/components/ui/reveal";
import { motion } from "motion/react";
import { Circle } from "lucide-react";
import ElegantShape from "@/components/recruitment/ElegantShape";

export default function BrainGamesPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.08] via-transparent to-red/[0.08] blur-3xl" />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={400}
          height={100}
          rotate={8}
          gradient="from-blue/[0.12]"
          className="left-[-5%] top-[10%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-12}
          gradient="from-red/[0.12]"
          className="right-[-3%] top-[60%]"
        />
        <ElegantShape
          delay={0.6}
          width={250}
          height={70}
          rotate={15}
          gradient="from-yellow/[0.12]"
          className="left-[10%] bottom-[15%]"
        />
      </div>

      <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-20 pt-32">
        <RevealGroup startDelay={0.1}>
          <div className="mb-12 text-center">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6"
            >
              <Circle className="h-2 w-2 fill-red animate-pulse" />
              <span className="text-xs text-white/60 tracking-wide whitespace-nowrap">
                Brain Games 2025 • Registrations Closed
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl font-space-grotesk font-bold mb-6"
            >
              <span className="text-blue">B</span>rain{" "}
              <span className="text-red">G</span>ames
              <br />
              <span className="text-yellow">2</span>0
              <span className="text-green">2</span>5
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-white/50 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto"
            >
              Register your team for the ultimate brain challenge. Teams of 1-3
              members compete for glory!
            </motion.p>
          </div>
        </RevealGroup>

        {/* Event Information Section */}
        <Reveal delay={0.7}>
          <div className="max-w-4xl mx-auto mb-8 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-4 md:p-8 space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6">
                📋 Event Information
              </h2>
              {/* Event Details */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-yellow mb-3">
                  Event Overview
                </h3>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow">•</span>
                    <span>
                      <strong>Date:</strong> 23rd November 2025 (Sunday) at ASTP
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow">•</span>
                    <span>
                      <strong>Duration:</strong> One-day event (approx. 5–6
                      hours)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow">•</span>
                    <span>
                      <strong>Reporting Time:</strong> Will be communicated via
                      email
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow">•</span>
                    <span>
                      <strong>Difficulty Level:</strong> Mostly moderate
                    </span>
                  </li>
                </ul>
              </div>

              {/* Competition Format */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-red mb-3">
                  Competition Format
                </h3>
                <p className="text-white/70 mb-3">
                  Multiple eliminatory rounds, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="bg-white/5 border border-red/30 rounded-lg p-3 text-center">
                    <span className="text-red font-semibold">
                      🧩 Puzzle Round
                    </span>
                  </div>
                  <div className="bg-white/5 border border-red/30 rounded-lg p-3 text-center">
                    <span className="text-red font-semibold">
                      ⚡ Rapid Fire Round
                    </span>
                  </div>
                  <div className="bg-white/5 border border-red/30 rounded-lg p-3 text-center">
                    <span className="text-red font-semibold">
                      🔔 Buzzer Round
                    </span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-green mb-3">
                  Categories Covered
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="text-green">✓</span>
                    <span>Problem Solving</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green">✓</span>
                    <span>Logical & Analytical Thinking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green">✓</span>
                    <span>Mathematics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green">✓</span>
                    <span>Science</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green">✓</span>
                    <span>General Knowledge</span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="space-y-3">
                <div className="bg-blue/10 border border-blue/30 rounded-lg p-4">
                  <p className="text-white/80 text-sm">
                    <strong className="text-blue">📢 Important:</strong> Updates
                    and announcements will be shared via email and on our
                    official GDG page story. Please ensure your team is ready
                    and punctual for all rounds.
                  </p>
                </div>
                <div className="bg-yellow/10 border border-yellow/30 rounded-lg p-4">
                  <p className="text-white/80 text-sm">
                    <strong className="text-yellow">
                      🪪 Entry Requirement:
                    </strong>{" "}
                    All non-ITU participants must bring their original CNIC or
                    B-Form for entry verification at ASTP on the event day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.9}>
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-4 md:p-8 space-y-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                🔒 Registrations Closed
              </h2>

              {/* Closed Message */}
              <div className="bg-red/10 border border-red/20 rounded-lg p-12 text-center space-y-6">
                <div className="text-6xl">⏰</div>
                <h3 className="text-2xl font-bold text-white">
                  Registration Period Has Ended
                </h3>
                <p className="text-white/70 text-lg max-w-xl mx-auto">
                  Thank you for your interest in Brain Games 2025! The
                  registration deadline has passed and we are no longer
                  accepting new registrations.
                </p>
                <div className="bg-yellow/10 border border-yellow/30 rounded-lg p-4 mt-6">
                  <p className="text-white/80">
                    <strong className="text-yellow">📅 Event Date:</strong> 23rd
                    November 2025 (Sunday) at ASTP
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    Registered teams will receive further details via email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </section>
  );
}

"use client";
import React from "react";
import { Users, Rocket, Calendar, Sparkles } from "lucide-react";
import { BGPattern } from "@/components/ui/bg-pattern";
import Reveal from "../ui/reveal";

const About = () => {
  return (
    <section
      id="about"
      className="relative px-8 md:px-16 lg:px-24 xl:px-32 py-20"
    >
      <BGPattern variant="dots" />
      <Reveal>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-background-secondary mb-4">
                <Sparkles className="h-4 w-4 text-yellow" />
                <span className="text-xs tracking-wide text-white/60">
                  About GDG on Campus ITU
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-space-grotesk font-bold mb-4">
                Learn. Build. Lead.
              </h2>

              <p className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed">
                We’re a campus community helping students explore Google
                technologies through hands-on workshops, projects, and
                mentorship. Our focus is practical learning and collaboration.
              </p>

              {/* Stats strip */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Stat label="Members" value="1k+" />
                <Stat label="Events/Year" value="20+" />
                <Stat label="Project Tracks" value="4" />
              </div>
            </div>
            <div className="space-y-4">
              <FeatureCard
                icon={<Users className="h-5 w-5" />}
                title="Community & Mentorship"
                desc="Peer learning circles and mentor support to keep you moving forward."
              />
              <FeatureCard
                icon={<Calendar className="h-5 w-5" />}
                title="Workshops & Talks"
                desc="Regular, practical sessions covering Android, Web, Cloud, and ML."
              />
              <FeatureCard
                icon={<Rocket className="h-5 w-5" />}
                title="Projects & Hackathons"
                desc="Build real projects, contribute to open source, and ship together."
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background-secondary px-4 py-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-wider text-white/50">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className={`relative rounded-xl border border-border bg-background-secondary p-5 flex items-start gap-3`}
    >
      <div className="p-2 rounded-md bg-background-secondary border border-border text-white/80">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-base mb-1">{title}</h3>
        <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default About;

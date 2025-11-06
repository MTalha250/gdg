"use client";
import React from "react";
import ShiftingCountdown from "@/components/ui/countdown";
import WrapButton from "@/components/ui/wrap-button";
import { BGPattern } from "@/components/ui/bg-pattern";
import Reveal from "../ui/reveal";

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative px-8 md:px-16 lg:px-24 xl:px-32 py-20 overflow-hidden"
    >
      <BGPattern variant="grid" mask="fade-center" />
      <div className="pointer-events-none absolute -inset-x-20 -top-16 h-56 bg-gradient-to-r from-indigo-500/20 via-transparent to-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-10 -bottom-10 h-40 bg-gradient-to-r from-rose-500/10 via-transparent to-amber-400/10 blur-3xl" />

      <Reveal>
        <div className="max-w-7xl mx-auto space-y-5 flex flex-col items-center">
          {/* <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background-secondary px-2.5 py-1 text-sm uppercase tracking-wider text-white/60">
            Barki Campus Only
          </div> */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-space-grotesk font-bold text-center">
            Registrations close in
          </h2>
          <div className="rounded-xl p-[1px] bg-gradient-to-br from-indigo-500/50 via-rose-500/40 to-amber-400/40 w-full max-w-2xl mx-auto">
            <div className="rounded-[0.7rem] overflow-hidden border border-border bg-black/40">
              <ShiftingCountdown />
            </div>
          </div>
          <p className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed">
            Don’t miss your chance to be a part of this exciting event.
          </p>
          <WrapButton href="/events" className="mt-1 w-fit">
            Register Now
          </WrapButton>
          <p className="text-xs text-white/40">
            It takes just a minute.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

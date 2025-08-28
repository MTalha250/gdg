"use client";
import React from "react";
import EventCard from "@/components/ui/event-card";
import Reveal, { RevealGroup } from "../ui/reveal";

type EventItem = {
  title: string;
  description: string;
  images: string[];
};

const defaultEvents: EventItem[] = [
  {
    title: "Prize Distribution Ceremony'25",
    description:
      "Shields were given to the core team of GDG and certificates to all members, followed by our annual dinner. A perfect way to celebrate another successful year of innovation and community building.",
    images: [
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
    ],
  },
  {
    title: "Prize Distribution Ceremony'25",
    description:
      "Shields were given to the core team of GDG and certificates to all members, followed by our annual dinner. A perfect way to celebrate another successful year of innovation and community building.",
    images: [
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
    ],
  },
  {
    title: "Prize Distribution Ceremony'25",
    description:
      "Shields were given to the core team of GDG and certificates to all members, followed by our annual dinner. A perfect way to celebrate another successful year of innovation and community building.",
    images: [
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
      "https://gdg-itu.netlify.app/_app/immutable/assets/IMG_0001.ec981779.webp",
    ],
  },
];

export default function EventsSection({}) {
  return (
    <section id="events" className="px-8 md:px-16 lg:px-24 xl:px-32 py-20">
      <Reveal>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-space-grotesk font-bold mb-2">
              Our Events
            </h2>
            <p className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed">
              Check out our past events and stay updated with our upcoming ones.
            </p>
          </div>

          <div className="overflow-hidden">
            <RevealGroup startDelay={0.1} interval={0.12} y={20}>
              {defaultEvents.map((ev, idx) => (
                <EventCard
                  key={`${ev.title}-${idx}`}
                  title={ev.title}
                  description={ev.description}
                  images={ev.images}
                  reverse={idx % 2 === 1}
                />
              ))}
            </RevealGroup>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

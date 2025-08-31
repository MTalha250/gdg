"use client";
import React, { useEffect, useState } from "react";
import EventCard from "@/components/ui/event-card";
import Reveal, { RevealGroup } from "../ui/reveal";
import axios from "axios";
import toast from "react-hot-toast";

type EventItem = {
  _id: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export default function EventsSection({}) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/event/latest`
        );

        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

          <div>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-white/50 mt-4">Loading events...</p>
              </div>
            ) : (
              <RevealGroup startDelay={0.1} interval={0.12} y={20}>
                {events.map((ev, idx) => (
                  <EventCard
                    key={ev._id}
                    title={ev.title}
                    description={ev.description}
                    images={ev.images}
                    reverse={idx % 2 === 1}
                  />
                ))}
              </RevealGroup>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

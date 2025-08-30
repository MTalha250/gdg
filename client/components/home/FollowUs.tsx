"use client";
import Image from "next/image";
import FlipLink from "@/components/ui/text-effect-flipper";
import { QrCode } from "lucide-react";
import { BGPattern } from "../ui/bg-pattern";
import { CometCard } from "@/components/ui/comet-card";
import Reveal from "../ui/reveal";

export default function FollowUs() {
  const Icons = {
    linkedin: (props: any) => (
      <svg
        width="60"
        height="60"
        viewBox="0 0 86 86"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="80"
          height="80"
          rx="14"
          fill="#D9D9D9"
          className="fill-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:fill-[#0B66C2]"
        />
        <path
          fillRule="evenodd"
          className="fill-black transition-all duration-500 ease-in-out group-hover:fill-white"
          clipRule="evenodd"
          d="M27.7128 69.5277V33.4109H15.7096V69.5276H27.7128V69.5277ZM21.7125 28.4816C25.8969 28.4816 28.5035 25.7059 28.5035 22.2401C28.4244 18.6973 25.8969 16 21.7909 16C17.6843 16.0001 15 18.6974 15 22.2402C15 25.706 17.6052 28.4817 21.6334 28.4817L21.7125 28.4816ZM34.3561 69.5277C34.3561 69.5277 34.5136 36.7996 34.3561 33.411H46.3612V38.6487H46.2815C47.86 36.184 50.7038 32.5629 57.179 32.5629C65.0788 32.5629 71 37.7249 71 48.8186V69.5278H58.9969V50.2063C58.9969 45.3514 57.2601 42.0385 52.915 42.0385C49.5995 42.0385 47.6236 44.2719 46.7559 46.4309C46.4384 47.1993 46.3612 48.2786 46.3612 49.3581V69.5277H34.3561Z"
          fill="black"
        />
      </svg>
    ),
    instagram: () => (
      <svg
        width="60"
        height="60"
        viewBox="0 0 86 86"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="80"
          height="80"
          rx="14"
          className="fill-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:fill-[#FD0AC1]"
        />
        {/* Camera body */}
        <rect
          x="13"
          y="13"
          width="55"
          height="55"
          rx="12"
          className="fill-black transition-all duration-500 ease-in-out group-hover:fill-white"
        />
        {/* Lens */}
        <circle
          cx="40"
          cy="40"
          r="12"
          className="fill-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:fill-[#FF4645]"
        />
        {/* Small dot */}
        <circle
          cx="56"
          cy="25"
          r="3"
          className="fill-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:fill-[#FF4645]"
        />
      </svg>
    ),
    google: () => (
      <svg
        width="60"
        height="60"
        viewBox="0 0 86 86"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="80"
          height="80"
          rx="14"
          className="fill-[#D9D9D9] transition-all duration-500 ease-in-out group-hover:fill-[#FF4645]"
        />
        {/* Stylized G using text for simplicity */}
        <text
          x="42"
          y="65"
          textAnchor="middle"
          className="fill-black transition-all duration-500 ease-in-out group-hover:fill-white"
          fontSize="75"
          fontWeight="900"
          fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial"
        >
          G
        </text>
      </svg>
    ),
  };
  return (
    <section
      id="follow-us"
      className="relative px-8 md:px-16 lg:px-24 xl:px-32 py-20"
    >
      <BGPattern variant="grid" mask="fade-center" />
      <Reveal>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 md:mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-space-grotesk font-bold mb-2 flex items-center justify-center gap-2">
              <QrCode className="h-10 w-10" /> Follow Us
            </h2>
            <p className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed">
              Scan the QR or use the links to stay updated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <CometCard>
              <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-border bg-background-secondary p-4">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                  <Image
                    src="/images/qr.png"
                    alt="Scan to follow"
                    loading="lazy"
                    fill
                    sizes="(min-width: 768px) 360px, 90vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
                <div className="mt-4 text-center text-sm text-white/60">
                  Scan with your camera
                </div>
              </div>
            </CometCard>
            <div className="space-y-4">
              <div className="group flex items-center justify-center gap-3">
                <Icons.instagram />
                <FlipLink href="#" color="text-[#FD0AC1]">
                  Instagram
                </FlipLink>
              </div>
              <div className="group flex items-center justify-center gap-3">
                <FlipLink href="#" color="text-[#0B66C2]">
                  LinkedIn
                </FlipLink>
                <Icons.linkedin />
              </div>
              <div className="group flex items-center justify-center gap-3">
                <Icons.google />
                <FlipLink href="#" color="text-[#FF4645]">
                  Community
                </FlipLink>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

import React from "react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] px-4 rounded-full bg-transparent border border-border z-50 backdrop-blur-lg flex items-center justify-between gap-10">
      <img src="/images/logo.png" alt="logo" className="w-16" />
      <ul className="hidden md:flex items-center gap-4">
        <li>
          <Link href="#hero" className="overflow-hidden block h-6 group">
            <div className="flex flex-col h-full group-hover:-translate-y-full transition duration-500 ease-in-out">
              <span>Home</span>
              <span>Home</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="#about" className="overflow-hidden block h-6 group">
            <div className="flex flex-col h-full group-hover:-translate-y-full transition duration-500 ease-in-out">
              <span>About</span>
              <span>About</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="#events" className="overflow-hidden block h-6 group">
            <div className="flex flex-col h-full group-hover:-translate-y-full transition duration-500 ease-in-out">
              <span>Events</span>
              <span>Events</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="#contact" className="overflow-hidden block h-6 group">
            <div className="flex flex-col h-full group-hover:-translate-y-full transition duration-500 ease-in-out">
              <span>Contact</span>
              <span>Contact</span>
            </div>
          </Link>
        </li>
      </ul>
      <InteractiveHoverButton className="shrink-0">
        Join Us
      </InteractiveHoverButton>
    </div>
  );
};

export default Navbar;

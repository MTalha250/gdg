import React from "react";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Events from "@/components/home/Events";
import FollowUs from "@/components/home/FollowUs";
import CTASection from "@/components/home/CTA";
import ContactSection from "@/components/home/Contact";

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Events />
      <CTASection />
      <ContactSection />
      <FollowUs />
    </div>
  );
};

export default Home;

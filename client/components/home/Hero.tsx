"use client";
import { motion } from "motion/react";
import { Circle, Users } from "lucide-react";
import WrapButton from "@/components/ui/wrap-button";
import { cn } from "@/lib/utils";
import { BackgroundLines } from "@/components/ui/background-lines";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
          // Safari optimization
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

const Hero = () => {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]"
      style={{
        // Safari performance optimization
        willChange: "transform",
        transform: "translate3d(0, 0, 0)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
      <BackgroundLines
        className="absolute inset-0 !h-full !bg-transparent dark:!bg-transparent pointer-events-none"
        density="half"
        responsive={false}
        strokeWidth={1.6}
        intensity="low"
      />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-cyan-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-28">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants as any}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-green animate-pulse" />
            <span className="text-xs sm:text-sm text-white/60 tracking-wide whitespace-nowrap">
              Brain Games • Registration Ends Nov 20
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants as any}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-space-grotesk font-bold mb-6 md:mb-8">
              <span className="text-blue">G</span>oogle{" "}
              <span className="text-red">D</span>eveloper{" "}
              <span className="text-yellow">G</span>roup <br /> on{" "}
              <span className="text-green">C</span>ampus ITU
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants as any}
            initial="hidden"
            animate="visible"
          >
            <p className="text-sm sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-3xl mx-auto px-4">
              Unleash innovation with the exceptional Google Developer Group on
              Campus at{" "}
              <span className="text-green">
                Information Technology University
              </span>
              . Join our expert core team on a journey of tech exploration and
              empowerment.
            </p>
          </motion.div>
          <motion.div
            custom={3}
            variants={fadeUpVariants as any}
            initial="hidden"
            animate="visible"
          >
            <WrapButton href="/brain-games">
              <Users className="mx-1 animate-pulse" />
              Brain Games 2025
            </WrapButton>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  );
};

export default Hero;

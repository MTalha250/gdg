"use client";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import React, { useMemo } from "react";

export const BackgroundLines = ({
  children,
  className,
  density = "half",
  responsive = true,
  strokeWidth = 1.8,
  intensity = "low", // new prop for performance control
}: {
  children?: React.ReactNode;
  className?: string;
  density?: "full" | "half" | "quarter";
  responsive?: boolean;
  strokeWidth?: number;
  intensity?: "low" | "medium" | "high"; // controls animation complexity
}) => {
  const reduceMotion = !!useReducedMotion();
  const shouldAnimate = !reduceMotion && intensity !== "low";

  return (
    <div
      className={cn(
        "h-[20rem] md:h-screen w-full bg-white dark:bg-black",
        responsive ? "hidden lg:block" : undefined,
        className
      )}
    >
      <OptimizedSVG
        density={density}
        strokeWidth={strokeWidth}
        shouldAnimate={shouldAnimate}
        intensity={intensity}
      />
      {children}
    </div>
  );
};

// Simplified path variants with better Safari performance
const simplePathVariants = {
  initial: {
    pathLength: 0,
    opacity: 0.3,
  },
  animate: {
    pathLength: 1,
    opacity: [0.3, 0.8, 0.3],
  },
};

const OptimizedSVG = ({
  density = "half",
  strokeWidth = 1.8,
  shouldAnimate = true,
  intensity = "low",
}: {
  density?: "full" | "half" | "quarter";
  strokeWidth?: number;
  shouldAnimate?: boolean;
  intensity?: "low" | "medium" | "high";
}) => {
  // Simplified, more performant paths for Safari
  const simplifiedPaths = useMemo(
    () => [
      "M100 450 Q300 300 500 450 T900 450",
      "M200 200 Q400 50 600 200 T1000 200",
      "M150 700 Q350 550 550 700 T950 700",
      "M50 350 Q250 200 450 350 T850 350",
      "M300 100 Q500 -50 700 100 T1100 100",
      "M250 800 Q450 650 650 800 T1050 800",
      "M400 300 Q600 150 800 300 T1200 300",
      "M350 600 Q550 450 750 600 T1150 600",
      "M500 50 Q700 -100 900 50 T1300 50",
      "M0 500 Q200 350 400 500 T800 500",
      "M600 250 Q800 100 1000 250 T1400 250",
      "M550 750 Q750 600 950 750 T1350 750",
    ],
    []
  );

  const colors = useMemo(
    () => [
      "rgb(28, 78, 216)", // blue
      "rgb(220, 38, 37)", // red
      "rgb(22, 128, 60)", // green
      "rgb(234, 179, 5)", // yellow
    ],
    []
  );

  const filteredPaths = useMemo(() => {
    const step = density === "quarter" ? 4 : density === "half" ? 2 : 1;
    return simplifiedPaths.filter((_, idx) => idx % step === 0);
  }, [density, simplifiedPaths]);

  const animationDuration = useMemo(() => {
    switch (intensity) {
      case "high":
        return 8;
      case "medium":
        return 12;
      case "low":
      default:
        return 20;
    }
  }, [intensity]);

  return (
    <motion.svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        // Safari optimization
        willChange: shouldAnimate ? "auto" : "transform",
        transform: "translate3d(0, 0, 0)", // Force hardware acceleration
      }}
    >
      {filteredPaths.map((path, idx) => {
        const colorIndex = idx % colors.length;
        const baseDelay = idx * 0.3;

        return (
          <g key={`path-group-${idx}`}>
            {/* Static path for immediate visibility */}
            <path
              d={path}
              stroke={colors[colorIndex]}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeOpacity={0.2}
              fill="none"
              style={{
                filter: "blur(0.5px)", // Subtle blur for glow effect
              }}
            />

            {/* Animated path for Safari-friendly animation */}
            {shouldAnimate && (
              <motion.path
                d={path}
                stroke={colors[colorIndex]}
                strokeWidth={strokeWidth * 0.8}
                strokeLinecap="round"
                fill="none"
                variants={simplePathVariants}
                initial="initial"
                animate="animate"
                transition={{
                  duration: animationDuration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: baseDelay,
                }}
                style={{
                  filter: `drop-shadow(0 0 4px ${colors[colorIndex]}40)`,
                  // Safari-specific optimizations
                  vectorEffect: "non-scaling-stroke",
                }}
              />
            )}
          </g>
        );
      })}

      {/* Subtle animated gradient overlay for additional visual interest */}
      {shouldAnimate && (
        <motion.defs>
          <motion.radialGradient
            id="backgroundGlow"
            cx="50%"
            cy="50%"
            r="50%"
            animate={{
              cx: ["40%", "60%", "40%"],
              cy: ["40%", "60%", "40%"],
            }}
            transition={{
              duration: 25,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <stop offset="0%" stopColor="rgba(28, 78, 216, 0.02)" />
            <stop offset="50%" stopColor="rgba(220, 38, 37, 0.01)" />
            <stop offset="100%" stopColor="transparent" />
          </motion.radialGradient>
        </motion.defs>
      )}

      {shouldAnimate && (
        <motion.rect
          width="100%"
          height="100%"
          fill="url(#backgroundGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 1 }}
        />
      )}
    </motion.svg>
  );
};

"use client";
import { motion, useInView, useReducedMotion } from "framer-motion";
import React, { useRef, Children } from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  duration?: number;
  blur?: number;
  once?: boolean;
};

const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  y = 16,
  x = 0,
  duration = 0.6,
  blur = 0,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });
  const reduce = useReducedMotion();

  const initial = reduce
    ? { opacity: 0 }
    : { opacity: 0, y, x, filter: blur ? `blur(${blur}px)` : undefined };
  const animate = reduce
    ? isInView
      ? { opacity: 1 }
      : {}
    : isInView
    ? { opacity: 1, y: 0, x: 0, filter: "blur(0px)" }
    : {};

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

type RevealGroupProps = {
  children: React.ReactNode;
  startDelay?: number;
  interval?: number;
  y?: number;
};

export const RevealGroup: React.FC<RevealGroupProps> = ({
  children,
  startDelay = 0,
  interval = 0.12,
  y = 16,
}) => {
  const items = Children.toArray(children);
  return (
    <div>
      {items.map((child, idx) => (
        <Reveal key={idx} delay={startDelay + idx * interval} y={y}>
          {child as React.ReactNode}
        </Reveal>
      ))}
    </div>
  );
};

export default Reveal;

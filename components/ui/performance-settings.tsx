"use client";
import { createContext, useContext, useEffect, useState } from "react";

type PerformanceMode = "auto" | "high" | "medium" | "low";

interface PerformanceContextType {
  mode: PerformanceMode;
  isSafari: boolean;
  setMode: (mode: PerformanceMode) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

export function PerformanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<PerformanceMode>("auto");
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect Safari browser
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafariBrowser =
      /safari/.test(userAgent) && !/chrome/.test(userAgent);
    setIsSafari(isSafariBrowser);

    // Auto-adjust performance based on browser
    if (mode === "auto") {
      if (isSafariBrowser) {
        setMode("low"); // Safari gets low performance mode by default
      } else {
        setMode("medium"); // Other browsers get medium performance
      }
    }
  }, [mode]);

  return (
    <PerformanceContext.Provider value={{ mode, isSafari, setMode }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}

// Helper hook for background lines specifically
export function useBackgroundLinesSettings() {
  const { mode, isSafari } = usePerformance();

  return {
    intensity: mode as "low" | "medium" | "high",
    density: isSafari ? "quarter" : mode === "low" ? "half" : "full",
    strokeWidth: isSafari ? 1.2 : 1.6,
    shouldAnimate: mode !== "low" || !isSafari,
  };
}

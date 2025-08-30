"use client";
import { motion } from "motion/react";
import {
  User,
  Info,
  Users as UsersIcon,
  Wrench,
  Crown,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  key: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  const iconFor = (key: string) => {
    switch (key) {
      case "basic":
        return <User className="size-4" />;
      case "about":
        return <Info className="size-4" />;
      case "team":
        return <UsersIcon className="size-4" />;
      case "skills":
        return <Wrench className="size-4" />;
      case "lead":
        return <Crown className="size-4" />;
      case "agreements":
        return <ShieldCheck className="size-4" />;
      case "review":
        return <FileText className="size-4" />;
      default:
        return <User className="size-4" />;
    }
  };

  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Mobile: Compact Card Layout */}
      <div className="block lg:hidden">
        <div className="rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-sm p-4">
          <div className="flex items-center gap-4">
            {/* Current Step Icon */}
            <div className="flex size-10 items-center justify-center rounded-full bg-blue text-white shadow-lg">
              {iconFor(steps[currentStep].key)}
            </div>

            {/* Step Info */}
            <div className="flex-1">
              <div className="text-white font-medium">
                {steps[currentStep].label}
              </div>
              <div className="text-white/50 text-sm">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            {/* Progress Circle */}
            <div className="text-right">
              <div className="text-xs text-white/40 mb-1">
                {Math.round(progress)}%
              </div>
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal Step Layout */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-white/[0.08] bg-black/20 backdrop-blur-sm p-6">
          {/* Progress Track */}
          <div className="relative">
            <div className="absolute top-6 left-6 right-6 h-[2px] bg-white/10 rounded-full" />
            <motion.div
              className="absolute top-6 h-[2px] bg-green rounded-full"
              style={{ left: "24px", right: "24px" }}
              initial={{ width: 0 }}
              animate={{
                width:
                  currentStep === 0
                    ? "0%"
                    : `calc((100% - 48px) * ${currentStep} / ${
                        steps.length - 1
                      })`,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex flex-col items-center"
                  >
                    {/* Step Circle */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={cn(
                        "relative flex size-12 items-center justify-center rounded-full border-2 transition-all duration-300 mb-3",
                        isCompleted
                          ? "bg-green border-green/50 text-white shadow-lg shadow-green/20"
                          : isActive
                          ? "bg-blue border-blue/50 text-white shadow-lg shadow-blue/20"
                          : "bg-background border-border text-white/40 hover:border-white/30"
                      )}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                          className="text-base font-bold"
                        >
                          ✓
                        </motion.div>
                      ) : (
                        iconFor(step.key)
                      )}

                      {/* Active Step Pulse */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-blue/30"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 0, 0.7],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </motion.div>

                    {/* Step Label */}
                    <div className="text-center max-w-[100px]">
                      <div
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isActive
                            ? "text-white"
                            : isCompleted
                            ? "text-green"
                            : "text-white/50"
                        )}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-white/30 mt-1">
                        Step {index + 1}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

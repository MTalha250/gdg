"use client";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Reveal, { RevealGroup } from "@/components/ui/reveal";
import { AnimatePresence, motion } from "motion/react";
import WrapButton from "@/components/ui/wrap-button";
import { Circle, Sparkles, ArrowRight } from "lucide-react";
import Stepper from "@/components/recruitment/Stepper";
import ElegantShape from "@/components/recruitment/ElegantShape";
import {
  BasicInfoStep,
  AboutYouStep,
  TeamRoleStep,
  SkillsIdeasStep,
  LeadershipStep,
  AgreementsStep,
  ReviewStep,
} from "@/components/recruitment/FormSteps";

type BaseFields = {
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  degreeProgram: string;
  linkedin: string;
  whyJoin: string;
  selectedTeam: string;
  selectedRole: string;
  whyThisTeam: string;
  relevantSkills: string;
  timeCommitment: string;
  improvementIdea: string;
  // Lead-specific
  whyLeadTeam: string;
  leadershipExperience: string;
  teamOrganization: string;
  handleUnderperformers: string;
  teamVision: string;
  // Agreements
  timeCommitmentAgreement: boolean;
  attendanceCommitment: boolean;
  professionalismCommitment: boolean;
};

const initialValues: BaseFields = {
  fullName: "",
  email: "",
  phone: "",
  rollNumber: "",
  degreeProgram: "",
  linkedin: "",
  whyJoin: "",
  selectedTeam: "",
  selectedRole: "",
  whyThisTeam: "",
  relevantSkills: "",
  timeCommitment: "",
  improvementIdea: "",
  whyLeadTeam: "",
  leadershipExperience: "",
  teamOrganization: "",
  handleUnderperformers: "",
  teamVision: "",
  timeCommitmentAgreement: false,
  attendanceCommitment: false,
  professionalismCommitment: false,
};

export default function RecruitmentPage() {
  const [values, setValues] = useState<BaseFields>(initialValues);
  const [step, setStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const steps = useMemo(
    () => [
      { key: "basic", label: "Basic Info" },
      { key: "about", label: "About You" },
      { key: "team", label: "Team & Role" },
      { key: "skills", label: "Skills & Ideas" },
      { key: "lead", label: "Leadership" },
      { key: "agreements", label: "Agreements" },
      { key: "review", label: "Review" },
    ],
    []
  );

  function update<K extends keyof BaseFields>(key: K, val: BaseFields[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function validateCurrentStep(): string[] {
    const errors: string[] = [];
    if (steps[step].key === "basic") {
      if (!values.fullName.trim()) errors.push("Full name is required");
      if (!values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
        errors.push("Valid email is required");
      if (!values.phone.trim()) errors.push("Phone is required");
      if (!values.rollNumber.trim()) errors.push("Roll number is required");
      if (!values.degreeProgram.trim())
        errors.push("Degree program is required");
    }
    if (steps[step].key === "about") {
      if (!values.linkedin.trim()) errors.push("LinkedIn URL is required");
      if (!values.whyJoin.trim()) errors.push("Tell us why you want to join");
    }
    if (steps[step].key === "team") {
      if (!values.selectedTeam.trim()) errors.push("Select a team");
      if (!values.selectedRole.trim()) errors.push("Select a role");
      if (!values.whyThisTeam.trim()) errors.push("Tell us why this team");
    }
    if (steps[step].key === "skills") {
      if (!values.relevantSkills.trim()) errors.push("List relevant skills");
      if (!values.timeCommitment.trim())
        errors.push("Time commitment required");
      if (!values.improvementIdea.trim())
        errors.push("Share an improvement idea");
    }
    if (
      steps[step].key === "lead" &&
      (values.selectedRole === "Lead" || values.selectedRole === "Co-Lead")
    ) {
      if (!values.whyLeadTeam.trim()) errors.push("Why lead the team?");
      if (!values.leadershipExperience.trim())
        errors.push("Leadership experience?");
      if (!values.teamOrganization.trim())
        errors.push("How will you organize the team?");
      if (!values.handleUnderperformers.trim())
        errors.push("Handling underperformers?");
      if (!values.teamVision.trim()) errors.push("Share your team vision");
    }
    if (steps[step].key === "agreements") {
      if (!values.timeCommitmentAgreement)
        errors.push("Agree to time commitment");
      if (!values.attendanceCommitment)
        errors.push("Agree to attendance policy");
      if (!values.professionalismCommitment)
        errors.push("Agree to professionalism policy");
    }
    return errors;
  }

  function next() {
    const errors = validateCurrentStep();
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    const allErrors: string[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const prevStep = step;
      const savedStep = step;
      setStep(i);
      const errs = validateCurrentStep();
      setStep(savedStep);
      allErrors.push(...errs);
      setStep(prevStep);
    }
    if (allErrors.length) {
      toast.error(allErrors[0]);
      return;
    }
    try {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Application submitted. We'll get back to you soon!");
      setValues(initialValues);
      setStep(0);
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.08] via-transparent to-red/[0.08] blur-3xl" />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.2}
          width={400}
          height={100}
          rotate={8}
          gradient="from-blue/[0.12]"
          className="left-[-5%] top-[10%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-12}
          gradient="from-red/[0.12]"
          className="right-[-3%] top-[60%]"
        />
        <ElegantShape
          delay={0.6}
          width={250}
          height={70}
          rotate={15}
          gradient="from-yellow/[0.12]"
          className="left-[10%] bottom-[15%]"
        />
        <ElegantShape
          delay={0.8}
          width={180}
          height={50}
          rotate={-20}
          gradient="from-green/[0.12]"
          className="right-[15%] top-[20%]"
        />
      </div>
      <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-20 pt-32">
        <RevealGroup startDelay={0.1}>
          <div className="mb-12 text-center">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-6"
            >
              <Circle className="h-2 w-2 fill-green animate-pulse" />
              <span className="text-xs text-white/60 tracking-wide whitespace-nowrap">
                Applications Open • Join GDG on Campus ITU
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl font-space-grotesk font-bold mb-6"
            >
              <span className="text-blue">J</span>oin Our{" "}
              <span className="text-red">T</span>eam
              <br />
              <span className="text-yellow">B</span>uild the{" "}
              <span className="text-green">F</span>uture
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-white/50 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto"
            >
              Ready to innovate with Google technologies? Complete your
              application in{" "}
              <span className="text-green font-medium">7 simple steps</span> and
              become part of our extraordinary community.
            </motion.p>
          </div>
        </RevealGroup>
        <Reveal delay={0.7}>
          <Stepper steps={steps} currentStep={step} />
        </Reveal>
        <Reveal delay={0.9}>
          <div className="mt-12 rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="relative p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[step].key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {steps[step].key === "basic" && (
                    <BasicInfoStep values={values} update={update} />
                  )}

                  {steps[step].key === "about" && (
                    <AboutYouStep values={values} update={update} />
                  )}

                  {steps[step].key === "team" && (
                    <TeamRoleStep values={values} update={update} />
                  )}

                  {steps[step].key === "skills" && (
                    <SkillsIdeasStep values={values} update={update} />
                  )}

                  {steps[step].key === "lead" && (
                    <LeadershipStep values={values} update={update} />
                  )}

                  {steps[step].key === "agreements" && (
                    <AgreementsStep values={values} update={update} />
                  )}

                  {steps[step].key === "review" && (
                    <ReviewStep values={values} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Enhanced Navigation */}
              <div className="mt-10 flex items-center justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={back}
                  disabled={step === 0 || isSubmitting}
                  className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                  Back
                </motion.button>

                {steps[step].key !== "review" ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={next}
                    disabled={isSubmitting}
                    className="group flex items-center gap-2 px-8 py-3 rounded-full bg-red text-white font-medium transition-all duration-200"
                  >
                    Next
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submit}
                    disabled={isSubmitting}
                    className="group flex items-center gap-2 px-8 py-3 rounded-full bg-green text-white font-medium transition-all duration-200 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Submit
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </Reveal>
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <p className="text-white/40 text-sm mb-4">
            Questions about the application process?
          </p>
          <WrapButton href="/#contact">Contact Us</WrapButton>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </section>
  );
}

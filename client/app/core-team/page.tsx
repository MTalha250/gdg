"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import { Circle, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Reveal, { RevealGroup } from "@/components/ui/reveal";
import WrapButton from "@/components/ui/wrap-button";
import Stepper from "@/components/recruitment/Stepper";
import ElegantShape from "@/components/recruitment/ElegantShape";
import {
  TextField,
  TextArea,
  SelectField,
  CheckboxField,
} from "@/components/recruitment/FormFields";
import {
  ReviewSection,
  ReviewItem,
  AgreementItem,
} from "@/components/recruitment/ReviewComponents";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type Question = {
  id: string;
  label: string;
  type: "textarea" | "choice";
  options?: string[];
};

type FormConfig = {
  positions: string[];
  membersOnlyPositions: string[];
  departments: string[];
  semesters: string[];
  hoursPerWeek: string[];
  declarationText: string;
  commonQuestions: Question[];
  positionQuestions: Record<string, Question[]>;
};

type Personal = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  alternateEmail: string;
  phone: string;
  rollNumber: string;
  department: string;
  departmentOther: string;
  semester: string;
  linkedin: string;
  github: string;
};

const emptyPersonal: Personal = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  alternateEmail: "",
  phone: "",
  rollNumber: "",
  department: "",
  departmentOther: "",
  semester: "",
  linkedin: "",
  github: "",
};

const STEPS = [
  { key: "position", label: "Position" },
  { key: "personal", label: "Your Details" },
  { key: "common", label: "About You" },
  { key: "role", label: "Role Questions" },
  { key: "commitment", label: "Commitment" },
  { key: "review", label: "Review" },
];

/** Renders a question as a textarea or a select, depending on its type. */
function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  if (question.type === "choice") {
    return (
      <SelectField
        label={question.label}
        options={question.options || []}
        value={value}
        onChange={onChange}
        required
      />
    );
  }
  return (
    <TextArea
      label={question.label}
      value={value}
      onChange={onChange}
      required
      placeholder="Take your time — specific answers stand out."
    />
  );
}

export default function CoreTeamPage() {
  const [config, setConfig] = useState<FormConfig | null>(null);
  const [configError, setConfigError] = useState(false);

  const [step, setStep] = useState(0);
  const [position, setPosition] = useState("");
  const [personal, setPersonal] = useState<Personal>(emptyPersonal);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [weekendAvailability, setWeekendAvailability] = useState("");
  const [declaration, setDeclaration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/core-team/config`)
      .then((res) => setConfig(res.data))
      .catch(() => setConfigError(true));
  }, []);

  const roleQuestions = useMemo(
    () => (config && position ? config.positionQuestions[position] || [] : []),
    [config, position]
  );
  const commonQuestions = config?.commonQuestions || [];

  const updatePersonal = <K extends keyof Personal>(key: K, val: Personal[K]) =>
    setPersonal((prev) => ({ ...prev, [key]: val }));

  const setAnswer = (id: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [id]: val }));

  // Switching position invalidates the previous role's answers.
  const handlePositionChange = (next: string) => {
    if (next === position) return;
    const keep: Record<string, string> = {};
    for (const q of commonQuestions) {
      if (answers[q.id]) keep[q.id] = answers[q.id];
    }
    setAnswers(keep);
    setPosition(next);
  };

  function validateStep(stepKey: string): string[] {
    const errors: string[] = [];

    if (stepKey === "position" && !position) {
      errors.push("Select the position you're applying for");
    }

    if (stepKey === "personal") {
      if (!personal.firstName.trim()) errors.push("First name is required");
      if (!personal.lastName.trim()) errors.push("Last name is required");
      if (!/^[a-zA-Z0-9._%+-]+@itu\.edu\.pk$/.test(personal.email.trim()))
        errors.push("Please use your ITU email address (@itu.edu.pk)");
      if (!personal.phone.trim()) errors.push("Contact number is required");

      const roll = personal.rollNumber.replace(/[^a-zA-Z0-9]/g, "");
      if (!roll) {
        errors.push("Roll number is required");
      } else if (!/^bs[a-z]{2}\d{5}$/i.test(roll)) {
        errors.push(
          "Roll number must be 9 characters starting with 'bs' (e.g. bscs23051)"
        );
      }

      if (!personal.department) errors.push("Select your department");
      if (personal.department === "Other" && !personal.departmentOther.trim())
        errors.push("Please name your department");
      if (!personal.semester) errors.push("Select your semester");
      if (!personal.linkedin.trim())
        errors.push("LinkedIn / portfolio link is required");
    }

    if (stepKey === "common") {
      for (const q of commonQuestions) {
        if (!String(answers[q.id] || "").trim()) {
          errors.push(`Please answer: ${q.label}`);
          break;
        }
      }
    }

    if (stepKey === "role") {
      for (const q of roleQuestions) {
        if (!String(answers[q.id] || "").trim()) {
          errors.push(`Please answer: ${q.label}`);
          break;
        }
      }
    }

    if (stepKey === "commitment") {
      if (!hoursPerWeek) errors.push("Select your weekly time commitment");
      if (!weekendAvailability)
        errors.push("Let us know about weekend / evening availability");
      if (!declaration) errors.push("You must accept the final declaration");
    }

    return errors;
  }

  function next() {
    const errors = validateStep(STEPS[step].key);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function submit() {
    for (const s of STEPS) {
      if (s.key === "review") continue;
      const errors = validateStep(s.key);
      if (errors.length) {
        toast.error(errors[0]);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/core-team`, {
        ...personal,
        rollNumber: personal.rollNumber.replace(/[^a-zA-Z0-9]/g, ""),
        departmentOther:
          personal.department === "Other" ? personal.departmentOther : "",
        position,
        answers,
        hoursPerWeek,
        weekendAvailability: weekendAvailability === "Yes",
        declaration,
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function applyAgain() {
    // Keep their details — most repeat applicants are applying for a second
    // position, not re-entering the same form from scratch.
    setSubmitted(false);
    setPosition("");
    setAnswers({});
    setHoursPerWeek("");
    setWeekendAvailability("");
    setDeclaration(false);
    setStep(0);
  }

  const fullName = [personal.firstName, personal.middleName, personal.lastName]
    .filter(Boolean)
    .join(" ");

  const isMembersOnly =
    position && config?.membersOnlyPositions?.includes(position);

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

      <div className="relative z-10 px-6 md:px-16 lg:px-24 pb-20 pt-32">
        {submitted ? (
          <Reveal>
            <div className="mx-auto max-w-xl rounded-2xl border border-green/20 bg-black/40 backdrop-blur-xl p-10 text-center">
              <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-green/30 bg-green/10 text-3xl">
                ✓
              </div>
              <h1 className="mb-3 font-space-grotesk text-3xl font-bold text-white">
                Application Submitted
              </h1>
              <p className="mb-2 text-white/50">
                Your application for{" "}
                <span className="font-medium text-white">{position}</span> is in.
              </p>
              <p className="mb-8 text-sm text-white/35">
                A confirmation has been sent to {personal.email}. Shortlisted
                applicants will be contacted for an interview.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={applyAgain}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                >
                  Apply for another position
                </button>
                <WrapButton href="/">Back to Home</WrapButton>
              </div>
            </div>
          </Reveal>
        ) : (
          <>
            <RevealGroup startDelay={0.1}>
              <div className="mb-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1"
                >
                  <Circle className="h-2 w-2 animate-pulse fill-green" />
                  <span className="whitespace-nowrap text-xs tracking-wide text-white/60">
                    Applications Open • Core Leadership 2026
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-6 font-space-grotesk text-5xl font-bold sm:text-6xl md:text-7xl"
                >
                  <span className="text-blue">L</span>ead the{" "}
                  <span className="text-red">C</span>ommunity
                  <br />
                  <span className="text-yellow">S</span>hape the{" "}
                  <span className="text-green">Y</span>ear
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mx-auto mb-8 max-w-2xl text-lg font-light leading-relaxed tracking-wide text-white/50 md:text-xl"
                >
                  Applications are open for the{" "}
                  <span className="font-medium text-green">
                    GDG on Campus ITU core team
                  </span>
                  . Pick a position and tell us how you'd run it.
                </motion.p>
              </div>
            </RevealGroup>

            {configError ? (
              <div className="mx-auto max-w-xl rounded-2xl border border-red/20 bg-black/40 p-8 text-center backdrop-blur-xl">
                <p className="text-white/70">
                  We couldn't load the application form right now. Please refresh
                  the page or try again in a few minutes.
                </p>
              </div>
            ) : !config ? (
              <div className="flex items-center justify-center gap-3 py-20 text-white/50">
                <Loader2 className="size-5 animate-spin" />
                Loading application form…
              </div>
            ) : (
              <>
                <Reveal delay={0.7}>
                  <Stepper steps={STEPS} currentStep={step} />
                </Reveal>

                <Reveal delay={0.9}>
                  <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/40 shadow-2xl backdrop-blur-xl">
                    <div className="relative p-4 md:p-8">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={STEPS[step].key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                        >
                          {/* ── POSITION ── */}
                          {STEPS[step].key === "position" && (
                            <div className="grid gap-4">
                              <p className="text-white/60">
                                Which position are you applying for? The questions
                                that follow depend on your choice.
                              </p>
                              <div className="grid gap-3 sm:grid-cols-2">
                                {config.positions.map((p) => {
                                  const active = position === p;
                                  const membersOnly =
                                    config.membersOnlyPositions.includes(p);
                                  return (
                                    <button
                                      key={p}
                                      type="button"
                                      onClick={() => handlePositionChange(p)}
                                      className={`cursor-pointer rounded-xl border p-4 text-left transition-all ${
                                        active
                                          ? "border-green/50 bg-green/[0.08]"
                                          : "border-white/[0.08] bg-black/20 hover:border-white/20"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`size-3 shrink-0 rounded-full border-2 ${
                                            active
                                              ? "border-green bg-green"
                                              : "border-white/20"
                                          }`}
                                        />
                                        <span
                                          className={`font-medium ${
                                            active ? "text-green" : "text-white"
                                          }`}
                                        >
                                          {p}
                                        </span>
                                      </div>
                                      <p className="mt-1 pl-5 text-xs text-white/40">
                                        {
                                          (config.positionQuestions[p] || [])
                                            .length
                                        }{" "}
                                        role-specific questions
                                        {membersOnly
                                          ? " · GDGoC members only"
                                          : ""}
                                      </p>
                                    </button>
                                  );
                                })}
                              </div>
                              {isMembersOnly && (
                                <div className="rounded-xl border border-yellow/20 bg-yellow/[0.06] p-4 text-sm text-white/70">
                                  Note: to apply for{" "}
                                  <strong className="text-white">
                                    {position}
                                  </strong>{" "}
                                  you must already be a member of GDG on Campus
                                  ITU.
                                </div>
                              )}
                            </div>
                          )}

                          {/* ── PERSONAL ── */}
                          {STEPS[step].key === "personal" && (
                            <div className="grid gap-5">
                              <div className="grid gap-5 md:grid-cols-3">
                                <TextField
                                  label="First Name"
                                  value={personal.firstName}
                                  onChange={(v) => updatePersonal("firstName", v)}
                                  required
                                />
                                <TextField
                                  label="Middle Name"
                                  value={personal.middleName}
                                  onChange={(v) =>
                                    updatePersonal("middleName", v)
                                  }
                                />
                                <TextField
                                  label="Last Name"
                                  value={personal.lastName}
                                  onChange={(v) => updatePersonal("lastName", v)}
                                  required
                                />
                              </div>

                              <div className="grid gap-5 md:grid-cols-2">
                                <TextField
                                  label="ITU Email"
                                  type="email"
                                  value={personal.email}
                                  onChange={(v) => updatePersonal("email", v)}
                                  placeholder="bscs23051@itu.edu.pk"
                                  required
                                />
                                <TextField
                                  label="Alternate Email"
                                  type="email"
                                  value={personal.alternateEmail}
                                  onChange={(v) =>
                                    updatePersonal("alternateEmail", v)
                                  }
                                  placeholder="Optional"
                                />
                              </div>

                              <div className="grid gap-5 md:grid-cols-2">
                                <TextField
                                  label="Contact Number"
                                  value={personal.phone}
                                  onChange={(v) => updatePersonal("phone", v)}
                                  placeholder="03XXXXXXXXX"
                                  required
                                />
                                <TextField
                                  label="Roll Number"
                                  value={personal.rollNumber}
                                  onChange={(v) =>
                                    updatePersonal("rollNumber", v)
                                  }
                                  placeholder="bscs23051"
                                  required
                                />
                              </div>

                              <div className="grid gap-5 md:grid-cols-2">
                                <SelectField
                                  label="Department"
                                  options={config.departments}
                                  value={personal.department}
                                  onChange={(v) =>
                                    updatePersonal("department", v)
                                  }
                                  required
                                />
                                <SelectField
                                  label="Semester"
                                  options={config.semesters}
                                  value={personal.semester}
                                  onChange={(v) => updatePersonal("semester", v)}
                                  required
                                />
                              </div>

                              {personal.department === "Other" && (
                                <TextField
                                  label="Which department?"
                                  value={personal.departmentOther}
                                  onChange={(v) =>
                                    updatePersonal("departmentOther", v)
                                  }
                                  required
                                />
                              )}

                              <div className="grid gap-5 md:grid-cols-2">
                                <TextField
                                  label="LinkedIn / Portfolio"
                                  value={personal.linkedin}
                                  onChange={(v) => updatePersonal("linkedin", v)}
                                  placeholder="https://linkedin.com/in/…"
                                  required
                                />
                                <TextField
                                  label="GitHub"
                                  value={personal.github}
                                  onChange={(v) => updatePersonal("github", v)}
                                  placeholder="Optional"
                                />
                              </div>
                            </div>
                          )}

                          {/* ── COMMON QUESTIONS ── */}
                          {STEPS[step].key === "common" && (
                            <div className="grid gap-6">
                              {commonQuestions.map((q) => (
                                <QuestionField
                                  key={q.id}
                                  question={q}
                                  value={answers[q.id] || ""}
                                  onChange={(v) => setAnswer(q.id, v)}
                                />
                              ))}
                            </div>
                          )}

                          {/* ── ROLE QUESTIONS ── */}
                          {STEPS[step].key === "role" && (
                            <div className="grid gap-6">
                              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                                <p className="text-sm text-white/60">
                                  Questions for{" "}
                                  <span className="font-medium text-white">
                                    {position}
                                  </span>
                                </p>
                              </div>
                              {roleQuestions.map((q) => (
                                <QuestionField
                                  key={q.id}
                                  question={q}
                                  value={answers[q.id] || ""}
                                  onChange={(v) => setAnswer(q.id, v)}
                                />
                              ))}
                            </div>
                          )}

                          {/* ── COMMITMENT ── */}
                          {STEPS[step].key === "commitment" && (
                            <div className="grid gap-6">
                              <SelectField
                                label="How many hours per week can you commit to GDG ITU activities?"
                                options={config.hoursPerWeek}
                                value={hoursPerWeek}
                                onChange={setHoursPerWeek}
                                required
                              />
                              <SelectField
                                label="Are you willing to work during weekends or evenings for events if needed?"
                                options={["Yes", "No"]}
                                value={weekendAvailability}
                                onChange={setWeekendAvailability}
                                required
                              />
                              <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                                <CheckboxField
                                  label={config.declarationText}
                                  checked={declaration}
                                  onChange={setDeclaration}
                                />
                              </div>
                            </div>
                          )}

                          {/* ── REVIEW ── */}
                          {STEPS[step].key === "review" && (
                            <div className="grid gap-4">
                              <ReviewSection
                                title="Position"
                                icon={<Sparkles className="size-3" />}
                              >
                                <ReviewItem label="Applying for" value={position} />
                              </ReviewSection>

                              <ReviewSection
                                title="Your Details"
                                icon={<Sparkles className="size-3" />}
                              >
                                <ReviewItem label="Name" value={fullName} />
                                <ReviewItem label="Email" value={personal.email} />
                                {personal.alternateEmail && (
                                  <ReviewItem
                                    label="Alternate Email"
                                    value={personal.alternateEmail}
                                  />
                                )}
                                <ReviewItem label="Phone" value={personal.phone} />
                                <ReviewItem
                                  label="Roll Number"
                                  value={personal.rollNumber}
                                />
                                <ReviewItem
                                  label="Department"
                                  value={
                                    personal.department === "Other"
                                      ? personal.departmentOther
                                      : personal.department
                                  }
                                />
                                <ReviewItem
                                  label="Semester"
                                  value={personal.semester}
                                />
                                <ReviewItem
                                  label="LinkedIn"
                                  value={personal.linkedin}
                                />
                                {personal.github && (
                                  <ReviewItem
                                    label="GitHub"
                                    value={personal.github}
                                  />
                                )}
                              </ReviewSection>

                              <ReviewSection
                                title="Your Answers"
                                icon={<Sparkles className="size-3" />}
                              >
                                {[...commonQuestions, ...roleQuestions].map(
                                  (q) => (
                                    <ReviewItem
                                      key={q.id}
                                      label={q.label}
                                      value={answers[q.id] || ""}
                                    />
                                  )
                                )}
                              </ReviewSection>

                              <ReviewSection
                                title="Commitment"
                                icon={<Sparkles className="size-3" />}
                              >
                                <ReviewItem
                                  label="Hours per week"
                                  value={hoursPerWeek}
                                />
                                <ReviewItem
                                  label="Weekends / evenings"
                                  value={weekendAvailability}
                                />
                                <AgreementItem
                                  label="Final declaration accepted"
                                  value={declaration}
                                />
                              </ReviewSection>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Navigation */}
                      <div className="mt-10 flex items-center justify-between gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={back}
                          disabled={step === 0 || isSubmitting}
                          className="group flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                          Back
                        </motion.button>

                        {STEPS[step].key !== "review" ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={next}
                            disabled={isSubmitting}
                            className="group flex cursor-pointer items-center gap-2 rounded-full bg-red px-8 py-3 font-medium text-white transition-all duration-200"
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
                            className="group flex cursor-pointer items-center gap-2 rounded-full bg-green px-8 py-3 font-medium text-white transition-all duration-200 disabled:opacity-70"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Submitting…
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

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="mt-16 text-center"
                >
                  <p className="mb-4 text-sm text-white/40">
                    Questions about the application process?
                  </p>
                  <WrapButton href="/#contact">Contact Us</WrapButton>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
    </section>
  );
}

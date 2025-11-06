"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Reveal, { RevealGroup } from "@/components/ui/reveal";
import { motion } from "motion/react";
import { Circle, Sparkles, Plus, Trash2 } from "lucide-react";
import ElegantShape from "@/components/recruitment/ElegantShape";
import PhotoUploader from "@/components/ui/photo-uploader";
import axios from "axios";

type Member = {
  name: string;
  email?: string;
  phone: string;
  rollNumber?: string;
  university: string;
  cnic?: string;
  isTeamLead: boolean;
};

type FormData = {
  teamName: string;
  members: Member[];
  proofOfPayment: string;
};

const initialFormData: FormData = {
  teamName: "",
  members: [
    {
      name: "",
      email: "",
      phone: "",
      rollNumber: "",
      university: "Information Technology University",
      isTeamLead: true,
    },
  ],
  proofOfPayment: "",
};

export default function BrainGamesPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateTeamName = (value: string) => {
    setFormData((prev) => ({ ...prev, teamName: value }));
  };

  const updateMember = (index: number, field: keyof Member, value: any) => {
    setFormData((prev) => {
      const newMembers = [...prev.members];
      newMembers[index] = { ...newMembers[index], [field]: value };
      return { ...prev, members: newMembers };
    });
  };

  const addMember = () => {
    if (formData.members.length >= 3) {
      toast.error("Maximum 3 members allowed per team");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          name: "",
          phone: "",
          university: "",
          cnic: "",
          isTeamLead: false,
        },
      ],
    }));
  };

  const removeMember = (index: number) => {
    if (index === 0) {
      toast.error("Cannot remove team lead");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Team name
    if (!formData.teamName.trim()) {
      errors.push("Team name is required");
    }

    // Team lead (first member) validation
    const teamLead = formData.members[0];
    if (!teamLead.name.trim()) {
      errors.push("Team lead name is required");
    }
    if (!/^[a-zA-Z0-9._%+-]+@itu\.edu\.pk$/.test(teamLead.email || "")) {
      errors.push("Team lead must have a valid ITU email (@itu.edu.pk)");
    }
    if (!teamLead.phone.trim()) {
      errors.push("Team lead phone is required");
    }
    if (!teamLead.rollNumber?.trim()) {
      errors.push("Team lead roll number is required");
    } else if (!/^bs[a-zA-Z0-9]{7}$/i.test(teamLead.rollNumber)) {
      errors.push("Roll number must be 9 characters starting with 'bs'");
    }

    // Other members validation
    formData.members.slice(1).forEach((member, idx) => {
      const memberNum = idx + 2;
      if (!member.name.trim()) {
        errors.push(`Member ${memberNum} name is required`);
      }
      if (!member.phone.trim()) {
        errors.push(`Member ${memberNum} phone is required`);
      }
      if (!member.university.trim()) {
        errors.push(`Member ${memberNum} university is required`);
      }
      if (member.cnic && !/^\d{5}-?\d{7}-?\d{1}$/.test(member.cnic)) {
        errors.push(`Member ${memberNum} CNIC format is invalid (13 digits)`);
      }
    });

    // Payment proof
    if (!formData.proofOfPayment) {
      errors.push("Payment proof is required");
    }

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setIsSubmitting(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/brain-games`,
        formData
      );

      toast.success(
        "Registration submitted successfully! Check your email for confirmation."
      );
      setFormData(initialFormData);
    } catch (err: any) {
      console.error("Error submitting registration:", err);
      const errorMessage =
        err.response?.data?.message || "Submission failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Brain Games 2025 • Registration Ends Nov 22
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl font-space-grotesk font-bold mb-6"
            >
              <span className="text-blue">B</span>rain{" "}
              <span className="text-red">G</span>ames
              <br />
              <span className="text-yellow">2</span>0
              <span className="text-green">2</span>5
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-white/50 mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto"
            >
              Register your team for the ultimate brain challenge. Teams of 1-3
              members compete for glory!
            </motion.p>
          </div>
        </RevealGroup>

        <Reveal delay={0.7}>
          <div className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="p-4 md:p-8 space-y-8">
              {/* Payment Information */}
              <div className="bg-blue/10 border border-blue/20 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue mb-4">
                  💳 Payment Details
                </h3>
                <div className="space-y-2 text-white/70">
                  <p>
                    <span className="font-semibold">Amount:</span> Rs 900
                  </p>
                  <p>
                    <span className="font-semibold">Account Title:</span>{" "}
                    MUHAMMAD FASIH UDDIN
                  </p>
                  <p>
                    <span className="font-semibold">Account Number:</span>{" "}
                    02860110211843
                  </p>
                  <p>
                    <span className="font-semibold">IBAN:</span>{" "}
                    PK39MEZN0002860110211843
                  </p>
                  <p>
                    <span className="font-semibold">Bank:</span> MEEZAN BANK
                  </p>
                </div>
                <p className="mt-4 text-yellow text-sm">
                  ⚠️ Please complete payment before filling the form and upload
                  proof below
                </p>
              </div>

              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => updateTeamName(e.target.value)}
                  placeholder="Enter your team name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
                />
              </div>

              {/* Team Members */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Team Members</h3>
                  {formData.members.length < 3 && (
                    <button
                      onClick={addMember}
                      className="cursor-pointer flex items-center gap-2 text-sm p-2 bg-green/20 border border-green/30 text-green rounded-lg hover:bg-green/30 transition-colors"
                    >
                      Add Member
                    </button>
                  )}
                </div>

                {formData.members.map((member, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white">
                        {index === 0
                          ? "👑 Team Lead (ITU Student)"
                          : `Member ${index + 1}`}
                      </h4>
                      {index > 0 && (
                        <button
                          onClick={() => removeMember(index)}
                          className="cursor-pointer text-red hover:text-red/80 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            updateMember(index, "name", e.target.value)
                          }
                          placeholder="Full name"
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
                        />
                      </div>

                      {index === 0 && (
                        <>
                          <div>
                            <label className="block text-sm text-white/60 mb-1">
                              Email * (@itu.edu.pk)
                            </label>
                            <input
                              type="email"
                              value={member.email}
                              onChange={(e) =>
                                updateMember(index, "email", e.target.value)
                              }
                              placeholder="your.email@itu.edu.pk"
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-white/60 mb-1">
                              Roll Number * (9 chars, starts with bs)
                            </label>
                            <input
                              type="text"
                              value={member.rollNumber}
                              onChange={(e) =>
                                updateMember(
                                  index,
                                  "rollNumber",
                                  e.target.value
                                )
                              }
                              placeholder="bscs23051"
                              maxLength={9}
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) =>
                            updateMember(index, "phone", e.target.value)
                          }
                          placeholder="03001234567"
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/60 mb-1">
                          University *
                        </label>
                        <input
                          type="text"
                          value={member.university}
                          onChange={(e) =>
                            updateMember(index, "university", e.target.value)
                          }
                          placeholder="University name"
                          disabled={index === 0}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>

                      {index > 0 && (
                        <div>
                          <label className="block text-sm text-white/60 mb-1">
                            CNIC (13 digits)
                          </label>
                          <input
                            type="text"
                            value={member.cnic}
                            onChange={(e) =>
                              updateMember(index, "cnic", e.target.value)
                            }
                            placeholder="12345-1234567-1"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-blue/50 transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Proof Upload */}
              <div>
                <PhotoUploader
                  photoUrl={formData.proofOfPayment}
                  onChange={(url) =>
                    setFormData((prev) => ({ ...prev, proofOfPayment: url }))
                  }
                  label="Payment Proof *"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="cursor-pointer w-full flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-green text-white font-bold text-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    Submit Registration
                  </>
                )}
              </motion.button>

              <p className="text-center text-white/40 text-sm">
                By submitting, you confirm that all information is accurate and
                payment has been completed.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </section>
  );
}

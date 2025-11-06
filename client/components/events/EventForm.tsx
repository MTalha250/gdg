"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { TextField } from "../recruitment/FormFields";
import ReceiptUploader from "./ReceiptUploader";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import axios from "axios";


export default function EventForm() {
  const [teamName, setTeamName] = useState("");
  const [leader, setLeader] = useState({
    name: "",
    email: "",
    roll: "",
    university: "ITU",
    phone: "",
  });
  const [members, setMembers] = useState<
  { name: string; university: string; phone: string; cnic: string }[]
>([]);

  const [receipt, setReceipt] = useState<string | null>(null);

  const addMember = () => {
    if (members.length < 2) {
      setMembers([...members, { name: "", university: "", phone: "", cnic: "" }]);
    }
  };

  const removeMember = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };


  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Team Name
    if (!teamName.trim()) errors.push("Team name is required.");

    // Leader validation
    if (!leader.name.trim()) errors.push("Leader name is required.");
    if (!leader.email.trim())
      errors.push("Leader email is required.");
    else if (!/^[a-zA-Z0-9._%+-]+@itu\.edu\.pk$/.test(leader.email))
      errors.push("Leader email must be a valid ITU email (ending with itu.edu.pk).");

    if (!leader.roll.trim()) {
      errors.push("Leader roll number is required.");
    } else if (!/^bs[a-zA-Z0-9]{7}$/.test(leader.roll.toLowerCase())) {
      errors.push("Roll number must be 9 characters.");
    }

    if (!leader.phone.trim()) errors.push("Leader phone number is required.");

    // Team Members (if any)
    for (let i = 0; i < members.length; i++) {
      if (!members[i].name.trim()) errors.push(`Member ${i + 2} name is required.`);
      if (!members[i].phone.trim()) errors.push(`Member ${i + 2} phone number is required.`);
    }

    // Receipt
    if (!receipt) errors.push("Payment receipt must be uploaded.");

    return errors;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/new-event`, {
        teamName,
        leader,
        members,
        receipt, 
      });

      toast.success("Registration Submitted Successfully!");
      setTeamName("");
      setLeader({ name: "", email: "", roll: "", university: "ITU", phone: "" });
      setMembers([]);
      setReceipt(null);
    } catch (err) {
      toast.error("Submission failed. Try again.");
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-12"
      >
        <h1 className="text-5xl font-bold mb-2">
          Register Your <span className="text-[#34A853]">Team</span>
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          <span className="text-red-400">*</span> At least one team member must
          be from <b>ITU</b>.
        </p>
        <p className="text-gray-500 mb-10">
          Fill out your team details below to participate in the upcoming event.
        </p>
      </motion.div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] rounded-2xl shadow-lg p-8 w-full max-w-3xl space-y-6"
      >
        {/* Team Info */}
        <TextField
          label="Team Name"
          value={teamName}
          onChange={setTeamName}
          required
          placeholder="Enter your team name"
        />

        {/* Leader Info */}
        <h2 className="text-xl font-semibold mt-6 text-[#34A853]">
          Team Leader Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-5 mt-4">
          <TextField
            label="Leader Name"
            value={leader.name}
            onChange={(v) => setLeader({ ...leader, name: v })}
            required
            placeholder="Full name"
          />
          <TextField
            label="ITU Email"
            type="email"
            value={leader.email}
            onChange={(v) => setLeader({ ...leader, email: v })}
            required
            placeholder="example@itu.edu.pk"
          />
          <TextField
            label="Roll Number"
            value={leader.roll}
            onChange={(v) => setLeader({ ...leader, roll: v })}
            required
            placeholder="bscs23043"
          />
          <TextField
            label="University"
            value="ITU"
            onChange={() => {}}
            required
            className="opacity-60 cursor-not-allowed"
          />
          <TextField
            label="Phone Number"
            value={leader.phone}
            onChange={(v) => setLeader({ ...leader, phone: v })}
            required
            placeholder="03XX-XXXXXXX"
          />
        </div>

        {/* Team Members */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-[#34A853]">
            Other Team Members
          </h2>
          {members.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mt-4 bg-[#1b1b1b] p-4 rounded-xl border border-white/10"
            >
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeMember(i)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-500 text-lg font-bold"
              >
                ×
              </button>

              <p className="text-gray-400 mb-3">Member {i + 2}</p>
              <div className="grid sm:grid-cols-4 gap-4">
                <TextField
                  label="Name"
                  value={m.name}
                  onChange={(v) => {
                    const newMembers = [...members];
                    newMembers[i].name = v;
                    setMembers(newMembers);
                  }}
                  required
                />

                <TextField
                  label="University"
                  value={m.university}
                  onChange={(v) => {
                    const newMembers = [...members];
                    newMembers[i].university = v;
                    setMembers(newMembers);
                  }}
                  placeholder="e.g. UET"
                />

                <TextField
                  label="CNIC"
                  value={m.cnic}
                  onChange={(v) => {
                    const newMembers = [...members];
                    newMembers[i].cnic = v;
                    setMembers(newMembers);
                  }}
                  required
                  placeholder="XXXXX-XXXXXXX-X"
                />

                <TextField
                  label="Phone Number"
                  value={m.phone}
                  onChange={(v) => {
                    const newMembers = [...members];
                    newMembers[i].phone = v;
                    setMembers(newMembers);
                  }}
                  required
                />
              </div>
            </motion.div>
          ))}


          {members.length < 2 && (
            <button
              type="button"
              onClick={addMember}
              className="text-[#34A853] mt-3 cursor-pointer hover:underline"
            >
              + Add Member
            </button>
          )}
        </div>

        {/* Payment Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3 text-[#34A853]">
            Payment Details
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-[#1b1b1b] to-[#101010] p-5 rounded-xl border border-white/10 mb-4 shadow-[0_0_15px_rgba(52,168,83,0.15)]"
          >
            <p className="text-gray-300">
              Send <b>Rs. 900</b> to:
            </p>
            <p className="text-gray-400 mt-1 leading-relaxed">
              <b>Bank:</b> Meezan Bank <br />
              <b>Account Title:</b> MUHAMMAD FASIH UDDIN <br />
              <b>Account No:</b> 02860110211843 <br />
              <b>IBAN:</b> PK39MEZN0002860110211843
            </p>
          </motion.div>

          {/* File Upload */}
          <label className="text-sm font-medium text-white/80 mb-2 block">
            Upload Payment Receipt <span className="text-red-400">*</span>
          </label>
          <div className="relative group">
            <ReceiptUploader receipt={receipt} setReceipt={setReceipt} />
            <div className="absolute inset-0 rounded-xl bg-[#34A853]/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={cn(
            "w-full mt-10 bg-[#34A853] text-black font-semibold py-3 rounded-xl",
            "hover:bg-[#2b8f43] transition-all duration-200 focus:ring-2 focus:ring-[#34A853]/30"
          )}
        >
          Submit Registration
        </button>
      </form>
    </div>
  );
}

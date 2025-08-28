"use client";
import React, { useState } from "react";
import WrapButton from "@/components/ui/wrap-button";
import { User, Mail, IdCard, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

type FormState = {
  name: string;
  email: string;
  roll: string;
  message: string;
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    roll: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.roll.trim()) next.roll = "Roll number is required";
    if (form.message.trim().length < 10)
      next.message = "Message must be at least 10 characters";
    toast.error(next.name || next.email || next.roll || next.message || "");
    return Object.keys(next).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: integrate with your API or service (e.g., form endpoint)
    setSubmitted(true);
  };

  return (
    <section id="contact" className="px-8 md:px-16 lg:px-24 xl:px-32 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-space-grotesk font-bold mb-3">
              Get in touch
            </h2>
            <p className="text-white/65 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl">
              Have a question or idea? We’d love to hear from you.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-md border border-border bg-background-secondary/60 px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/70">
                Be our sponsor
              </span>
              <a
                href="mailto:developerstudentsclub-itu@itu.edu.pk"
                className="text-sm sm:text-base text-blue underline break-all"
              >
                developerstudentsclub-itu@itu.edu.pk
              </a>
            </div>
          </div>

          {/* Form - underline inputs with icons, no card */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <label
                  htmlFor="name"
                  className="block text-[11px] uppercase tracking-wider text-white/60 mb-1"
                >
                  Name
                </label>
                <User className="pointer-events-none absolute left-0 bottom-3 h-5 w-5 text-white/40 group-focus-within:text-blue" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-blue outline-none pl-7 py-3 text-sm placeholder-white/40"
                  placeholder="Your name"
                />
              </div>

              <div className="group relative">
                <label
                  htmlFor="email"
                  className="block text-[11px] uppercase tracking-wider text-white/60 mb-1"
                >
                  Email
                </label>
                <Mail className="pointer-events-none absolute left-0 bottom-3 h-5 w-5 text-white/40 group-focus-within:text-red" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-red outline-none pl-7 py-3 text-sm placeholder-white/40"
                  placeholder="you@example.com"
                />
              </div>

              <div className="group relative">
                <label
                  htmlFor="roll"
                  className="block text-[11px] uppercase tracking-wider text-white/60 mb-1"
                >
                  Roll Number
                </label>
                <IdCard className="pointer-events-none absolute left-0 bottom-3 h-5 w-5 text-white/40 group-focus-within:text-yellow" />
                <input
                  id="roll"
                  name="roll"
                  type="text"
                  value={form.roll}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-yellow outline-none pl-7 py-3 text-sm placeholder-white/40"
                  placeholder="e.g., 22-ABC-123"
                />
              </div>

              <div className="group relative md:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-[11px] uppercase tracking-wider text-white/60 mb-1"
                >
                  Message
                </label>
                <MessageSquare className="pointer-events-none absolute left-0 top-8 h-5 w-5 text-white/40 group-focus-within:text-green" />
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-green outline-none pl-7 py-3 text-sm placeholder-white/40 resize-y"
                  placeholder="How can we help?"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {submitted ? (
                <p className="text-sm text-emerald-400">
                  Thanks! We received your message.
                </p>
              ) : (
                <span />
              )}
              <button type="submit">
                <WrapButton className="w-fit">Send Message</WrapButton>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "@/contexts/TranslationContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactForm() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL!;
  const t = useTranslations("contact");
  const [activeTab, setActiveTab] = useState<"email" | "form">("email");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy email");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitFeedback("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData({ name: "", email: "", message: "" });
        setSubmitFeedback("success");
      } else {
        console.error("Failed to send email via API:", result.error);
        setSubmitFeedback("error");
      }

      setTimeout(() => setSubmitFeedback("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSubmitFeedback("error");
      setTimeout(() => setSubmitFeedback("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 sm:gap-4 mb-8 justify-center">
        <button
          onClick={() => setActiveTab("email")}
          className={`relative px-6 sm:px-8 py-3 font-display text-base sm:text-lg transition-all cursor-pointer ${
            activeTab === "email"
              ? "text-white"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          {activeTab === "email" && (
            <motion.div
              layoutId="contact-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-orange-600 to-orange-400"
            />
          )}
          <span className="flex items-center gap-2 relative z-10">
            📧
            {t.directEmail}
          </span>
        </button>

        <div className="w-px bg-linear-to-b from-transparent via-orange-600/50 to-transparent" />

        <button
          onClick={() => setActiveTab("form")}
          className={`relative px-6 sm:px-8 py-3 font-display text-base sm:text-lg transition-all cursor-pointer ${
            activeTab === "form"
              ? "text-white"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          {activeTab === "form" && (
            <motion.div
              layoutId="contact-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-orange-600 to-orange-400"
            />
          )}
          <span className="flex items-center gap-2 relative z-10">
            ✉️
            {t.sendButton}
          </span>
        </button>
      </div>

      <div className="relative overflow-hidden w-full min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "email" && (
            <motion.div
              key="email-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center w-full"
            >
              <div className="w-full max-w-md relative p-6 sm:p-8 bg-orange-600/10 backdrop-blur-sm border-2 border-orange-600/30 hover:border-orange-600/60 rounded-2xl transition-all duration-300">
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-3 bg-orange-600/20 rounded-full text-4xl">
                      📧
                    </div>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-white text-center mb-2">
                    {t.directEmail}
                  </h3>

                  <p className="font-ui text-zinc-400 text-xs sm:text-sm text-center mb-6">
                    Copy our contact email
                  </p>

                  <div className="p-4 bg-zinc-900/50 border border-orange-600/30 rounded-lg mb-6 text-center">
                    <p className="font-ui text-orange-400 text-sm sm:text-base break-all">
                      {contactEmail}
                    </p>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className={`w-full py-3 px-4 rounded-xl font-display font-semibold transition-all border-2 flex items-center justify-center gap-2 cursor-pointer ${
                      copied
                        ? "bg-green-600/90 border-green-600 text-white shadow-lg shadow-green-600/50"
                        : "bg-orange-600 border-orange-600 text-white hover:shadow-lg hover:shadow-orange-600/50 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {copied ? (
                      <>
                        <span>✓</span>
                        <span>{t.copiedFeedback}</span>
                      </>
                    ) : (
                      <>
                        <span>📋</span>
                        <span>{t.copyButton}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "form" && (
            <motion.form
              key="form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="w-full max-w-2xl mx-auto"
            >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5 justify-center">
              <div className="sm:col-span-1">
                <label
                  htmlFor="name"
                  className="font-ui font-semibold text-white text-xs sm:text-sm block mb-2"
                >
                  {t.nameLabel}
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-orange-600/30 hover:border-orange-600/60 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/50 transition-all duration-200"
                />
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="email"
                  className="font-ui font-semibold text-white text-xs sm:text-sm block mb-2"
                >
                  {t.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-orange-600/30 hover:border-orange-600/60 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/50 transition-all duration-200"
                />
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="message"
                className="font-ui font-semibold text-white text-xs sm:text-sm block mb-2"
              >
                {t.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                placeholder={t.messagePlaceholder}
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-zinc-900/50 border border-orange-600/30 hover:border-orange-600/60 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600/50 transition-all duration-200 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mx-auto max-w-96 w-full py-3 px-4 rounded-xl font-display font-semibold text-white bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 border-2 border-orange-600 hover:border-orange-400 shadow-lg shadow-orange-600/50 hover:shadow-orange-600/75 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>✉️</span>
              <span>{isSubmitting ? "..." : t.sendButton}</span>
            </button>

            <AnimatePresence>
              {submitFeedback === "success" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="p-3 bg-green-600/20 border border-green-600/50 rounded-lg text-center overflow-hidden"
                >
                  <p className="text-green-400 font-ui text-sm">
                    {t.submitSuccess}
                  </p>
                </motion.div>
              )}
              {submitFeedback === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-center overflow-hidden"
                >
                  <p className="text-red-400 font-ui text-sm">
                    {t.submitError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}

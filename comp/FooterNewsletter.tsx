"use client";
import { apiSubscribeNewsletter } from "@/apis/page_optimization";
import { faPaperPlane, FontAwesomeIcon } from "@/constants/icons";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  companyId: string;
}

const FooterNewsletter = ({ companyId }: Props) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleRate = async (e: React.FormEvent, p_email: string) => {
    e.preventDefault();

    if (!validateEmail(p_email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }
    setEmail(p_email);
    setError("");
    await handleSubmit();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiSubscribeNewsletter(companyId, email);
      if (response.message == "Subscribed successfully") {
        toast.success("Thank you for your feedback!", { autoClose: 2000 });
        setEmail("");
      } else {
        toast.error("You have already subscribed to our newsletter.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("There was an error subscribing. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header with Luxury Dark Style */}
      <h3 className="text-white font-black uppercase tracking-[0.2em] text-[11px] mb-6 italic">
        Get Exclusive Deals
      </h3>

      <p className="text-slate-400 text-[13px] mb-8 leading-relaxed font-medium italic">
        Join our elite list to receive verified updates and{" "}
        <span className="text-orange-500">exclusive codes</span> directly to
        your terminal.
      </p>

      <form
        className="relative w-full"
        onSubmit={(e) => {
          handleRate(e, email);
        }}
        autoComplete="off"
      >
        {/* Input Container with Deep Dark & Orange Focus */}
        <div className="group relative flex items-center w-full bg-black/40 rounded-2xl p-1.5 border border-white/5 focus-within:border-orange-500/50 transition-all duration-500 shadow-2xl">
          {/* Subtle Inner Glow on focus */}
          <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

          <input
            type="email"
            placeholder="ACCESS@DEALS.COM"
            className="flex-1 bg-transparent border-none outline-none px-5 py-3 text-[11px] font-black uppercase tracking-widest text-slate-100 placeholder-slate-600 focus:ring-0 z-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="relative z-10 flex justify-center items-center rounded-xl w-12 h-12 bg-orange-600 hover:bg-orange-500 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-95"
            aria-label="Subscribe"
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="w-4 h-4 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500 ease-out"
            />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-orange-600 text-[10px] font-black uppercase tracking-tighter mt-3 ml-2 italic animate-pulse">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default FooterNewsletter;

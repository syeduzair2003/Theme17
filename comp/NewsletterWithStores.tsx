"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { apiSubscribeNewsletter } from "@/apis/page_optimization";
import { getBaseImageUrl } from "@/constants/hooks";
import { faArrowRight, FontAwesomeIcon } from "@/constants/icons";

interface Props {
  companyId: string;
  companyDomain: string;
  promoMerchants: any[];
  slug_type: string;
  store_slug: string;
}

const NewsletterWithStores = ({
  companyId,
  companyDomain,
  promoMerchants,
  slug_type,
  store_slug,
}: Props) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await apiSubscribeNewsletter(companyId, email);
      if (response.message === "Subscribed successfully") {
        toast.success("Thank you for your feedback!", { autoClose: 2000 });
        setEmail("");
      } else {
        toast.error("You have already subscribed to our newsletter.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasMerchants = promoMerchants && promoMerchants.length > 0;

  // Autoplay ke liye items ko triple kar rahe hain taake seamless loop bane
  const duplicatedMerchants = hasMerchants
    ? [...promoMerchants, ...promoMerchants, ...promoMerchants]
    : [];

  return (
    <section className="py-16 md:py-28 relative overflow-hidden bg-white">
      {/* ── Soft Gradient Background Accents ── */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-slate-100/80 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── LEFT COLUMN: Newsletter ── */}
          <div className="w-full">
            {/* Sub-heading Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[2px] w-8 bg-orange-500 rounded-full" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600">
                Exclusive Access
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-[0.95] italic tracking-tighter uppercase mb-8">
              Never Miss a <br />
              <span className="text-orange-500 not-italic">Golden Deal</span>
            </h2>

            {/* Description */}
            <p className="text-slate-500 text-sm md:text-base max-w-md font-medium mb-10 leading-relaxed italic">
              Stop hunting for expired codes. Join{" "}
              <span className="text-black font-bold">50,000+</span> smart
              shoppers and get the internet's best hand-picked deals delivered
              to your inbox.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-2xl p-2 border border-slate-200 group focus-within:border-orange-500/50 focus-within:shadow-[0_20px_50px_-15px_rgba(249,115,22,0.15)] transition-all duration-500 gap-3 max-w-lg"
            >
              <div className="flex-1 flex items-center px-4 gap-3">
                {/* Small Email Icon for detail */}
                <svg
                  className="w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your best email"
                  className="w-full bg-transparent py-4 text-black text-sm outline-none placeholder:text-slate-400 font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2 italic shadow-lg shadow-black/10"
              >
                {loading ? "..." : "Get Access"}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-[9px] -rotate-45"
                />
              </button>
            </form>

            {/* Trust Badge */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                  >
                    <div className="w-full h-full bg-slate-300 animate-pulse" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                * Trusted by over 50k users. No spam, ever.
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Recently Updated Stores Autoplay Carousel ── */}
          {hasMerchants && (
            <div className="w-full relative group/container lg:pl-10 overflow-hidden">
              {/* Header */}
              <div className="flex flex-col mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                    Featured Partners
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-800 leading-none uppercase italic tracking-tighter">
                  Fresh <span className="text-orange-500">Deal Drops.</span>
                </h2>
              </div>

              {/* The Carousel Container */}
              <div className="relative">
                {/* Side Gradients for Premium Look */}
                <div className="absolute left-0 top-0 bottom-0 w-20 z-20 bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 z-20 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none"></div>

                <motion.div
                  className="flex gap-6 w-max"
                  animate={{
                    x: [0, -1800], // Adjust this based on your merchant count
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 40, // Increase for slower speed
                      ease: "linear",
                    },
                  }}
                >
                  {duplicatedMerchants.map((mer: any, m: number) => {
                    const href =
                      slug_type === "1"
                        ? `/${store_slug}/${mer?.slug}`
                        : `/${mer?.slug}`;

                    return (
                      <div key={m} className="w-[280px] shrink-0 py-4">
                        <Link href={href} className="group block relative">
                          <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-8 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:border-orange-500/20">
                            {/* Merchant Logo & Offers Badge */}
                            <div className="flex justify-between items-start mb-6">
                              <div className="w-16 h-16 relative rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden p-3 shadow-sm group-hover:border-orange-500/50 transition-colors">
                                {mer?.merchant_logo ? (
                                  <Image
                                    src={getBaseImageUrl(
                                      companyDomain,
                                      mer.merchant_logo,
                                      "",
                                    )}
                                    alt={mer?.merchant_name || "Store"}
                                    fill
                                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                    sizes="64px"
                                  />
                                ) : (
                                  <span className="text-2xl font-black text-black uppercase">
                                    {mer?.merchant_name?.[0]}
                                  </span>
                                )}
                              </div>

                              <div className="bg-black text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter italic group-hover:bg-orange-500 transition-colors">
                                {mer?.total_offers || "0"} DEALS
                              </div>
                            </div>

                            {/* Content */}
                            <h4 className="text-lg font-black text-black uppercase italic tracking-tight mb-1 truncate group-hover:text-orange-600 transition-colors">
                              {mer?.merchant_name}
                            </h4>
                            <div className="flex items-center gap-2 mb-6">
                              <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Verified & Active
                              </span>
                            </div>

                            {/* Action Link */}
                            <div className="flex items-center justify-between text-black">
                              <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:text-orange-600 transition-colors">
                                Grab Voucher
                              </span>
                              <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="text-[9px] -rotate-45"
                                />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* View All Button below carousel */}
              <div className="mt-4 px-4">
                <Link
                  href={`/${store_slug}`}
                  className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors italic group"
                >
                  Browse All Stores
                  <span className="w-8 h-[1px] bg-slate-200 group-hover:w-12 group-hover:bg-orange-500 transition-all"></span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterWithStores;

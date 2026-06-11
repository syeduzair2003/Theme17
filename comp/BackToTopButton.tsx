"use client";
import React, { useState, useEffect } from "react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius; // ~150.8
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 group transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-90 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <div className="absolute inset-0 rounded-full bg-[#FF5F1F]/0 group-hover:bg-[#FF5F1F]/5 blur-md transition-all duration-300" />

      <div className="relative flex items-center justify-center w-14 h-14 bg-[#1A1A1A] border border-white/10 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:border-[#FF5F1F]/30 group-hover:bg-[#222222] group-hover:scale-105">
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
          viewBox="0 0 56 56"
        >
          {/* Outer Track */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-white/[0.04]"
            strokeWidth="1.5"
            fill="transparent"
          />
          {/* Active Progress */}
          <circle
            cx="28"
            cy="28"
            r={radius}
            className="stroke-[#FF5F1F] transition-all duration-150 ease-out"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <svg
          className="w-5 h-5 text-white group-hover:text-[#FF5F1F] group-hover:-translate-y-0.5 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={3}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 19V5M5 12l7-7 7 7"
          />
        </svg>
      </div>
    </button>
  );
};

export default BackToTopButton;

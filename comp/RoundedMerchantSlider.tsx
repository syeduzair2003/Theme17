"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBaseImageUrl, getMerchantHref } from "@/constants/hooks";

interface Props {
  merchants: any[];
  companyDomain: string;
  mer_slug: string;
  mer_slug_type: string;
}

const RoundedMerchantSlider: React.FC<Props> = ({
  merchants,
  companyDomain,
  mer_slug,
  mer_slug_type,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showSliders, setShowSliders] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowSliders(scrollWidth > clientWidth);
      }
    };

    checkScroll();
    const timeout = setTimeout(checkScroll, 500);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkScroll);
    };
  }, [merchants]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!merchants || merchants.length === 0) return null;

  return (
    <div className="relative group/slider w-full px-4 sm:px-6">
      <style jsx>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {showSliders && (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 flex justify-between pointer-events-none px-2">
          <button
            onClick={() => scroll("left")}
            className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 text-[#1a1612] hover:bg-[#FF5F1F] hover:text-white hover:border-[#FF5F1F] transition-all duration-500 opacity-0 group-hover/slider:opacity-100 -translate-x-4 group-hover/slider:translate-x-0"
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="pointer-events-auto w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 text-[#1a1612] hover:bg-[#FF5F1F] hover:text-white hover:border-[#FF5F1F] transition-all duration-500 opacity-0 group-hover/slider:opacity-100 translate-x-4 group-hover/slider:translate-x-0"
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 md:gap-10 pb-8 pt-4 hide-scroll scroll-smooth snap-x snap-mandatory"
      >
        {merchants.map((merchant, i) => {
          const merchantName = merchant.merchant_name;
          const merchantLogo = merchant.merchant_logo;
          const href = getMerchantHref(merchant, mer_slug, mer_slug_type);

          return (
            <Link
              key={i}
              href={href}
              className="group flex flex-col items-center w-[110px] sm:w-[130px] md:w-[150px] shrink-0 snap-start no-underline"
            >
              {/* Merchant  */}
              <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] md:w-[130px] md:h-[130px] mb-5">
                <div className="absolute inset-0 rounded-tr-[1.5rem] rounded-bl-[1.5rem] border border-dashed border-[#FF5F1F]/0 group-hover:border-[#FF5F1F]/40 group-hover:rotate-180 transition-all duration-1000"></div>

                {/* Inner Card Container */}
                <div className="absolute inset-1 rounded-tr-[1.5rem] rounded-bl-[1.5rem] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 group-hover:shadow-[0_15px_45px_rgba(255,95,31,0.15)] group-hover:border-[#FF5F1F]/20 group-hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-white to-[#fcfcfc]">
                  {merchantLogo ? (
                    <Image
                      src={getBaseImageUrl(companyDomain, merchantLogo, "")}
                      alt={merchantName || "Merchant"}
                      fill
                      className="object-contain p-5 transition-all duration-500 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                      sizes="(max-width: 768px) 110px, 130px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#FF5F1F] font-black text-3xl transition-transform duration-500 group-hover:scale-110">
                      {merchantName?.[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* Merchant Name */}
              <div className="text-center px-1">
                <span className="block text-[13px] md:text-[14px] font-bold text-gray-400 group-hover:text-[#1a1612] transition-colors duration-300 line-clamp-1 tracking-tight">
                  {merchantName}
                </span>
                <div className="mt-1.5 h-0.5 w-0 bg-[#FF5F1F] mx-auto group-hover:w-8 transition-all duration-500 rounded-full"></div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RoundedMerchantSlider;

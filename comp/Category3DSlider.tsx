"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBaseImageUrl } from "@/constants/hooks";

interface SliderProps {
  categories: any[];
  companyDomain: string;
}

const Category3DSlider = ({ categories, companyDomain }: SliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = categories.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!categories || total === 0) return null;

  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden perspective-1000">
      {categories.map((category, index) => {
        let diff = index - activeIndex;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const isCenter = diff === 0;
        const isFirstAdjacent = Math.abs(diff) === 1;
        const isSecondAdjacent = Math.abs(diff) === 2;

        let translateX = 0;
        let scale = 1;
        let zIndex = 0;
        let opacity = 0;
        let pointerEvents: "auto" | "none" = "none";

        if (isCenter) {
          translateX = 0;
          scale = 1;
          zIndex = 30;
          opacity = 1;
          pointerEvents = "auto";
        } else if (isFirstAdjacent) {
          translateX = diff > 0 ? 120 : -120;
          scale = 0.8;
          zIndex = 20;
          opacity = 0.6;
          pointerEvents = "auto";
        } else if (isSecondAdjacent) {
          translateX = diff > 0 ? 220 : -220;
          scale = 0.6;
          zIndex = 10;
          opacity = 0.3;
        } else {
          translateX = diff > 0 ? 300 : -300;
          scale = 0.4;
          zIndex = 0;
          opacity = 0;
        }

        return (
          <div
            key={index}
            onClick={() => Math.abs(diff) > 0 && setActiveIndex(index)}
            className="absolute transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(${translateX}%) scale(${scale})`,
              zIndex,
              opacity,
              pointerEvents,
            }}
          >
            <div
              className={`group relative flex flex-col items-center justify-center w-[160px] md:w-[220px] aspect-[3/4] p-5 bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden
                                ${isCenter ? "border-[#FF5722]/40 shadow-2xl shadow-[#FF5722]/10" : "border-slate-100 shadow-sm cursor-pointer hover:border-[#FF5722]/20"}
                            `}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-b from-[#FF5722]/5 to-transparent transition-opacity duration-500 ${isCenter ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />

              <div className="relative w-16 h-16 mb-2 flex items-center justify-center z-10">
                <div
                  className={`absolute inset-0 bg-[#FF5722]/10 blur-xl rounded-full transition-transform duration-500 ${isCenter ? "scale-150" : "scale-0 group-hover:scale-125"}`}
                />

                {category.category_image ? (
                  <Image
                    src={getBaseImageUrl(
                      companyDomain,
                      category.category_image,
                      "",
                    )}
                    alt={category.name}
                    width={60}
                    height={60}
                    className={`relative z-10 object-contain transition-all duration-500 ${isCenter ? "scale-110" : "group-hover:scale-110"}`}
                    unoptimized
                  />
                ) : (
                  <div
                    className={`relative z-10 w-14 h-14 rounded-xl border flex items-center justify-center font-black text-2xl transition-all duration-500
                                        ${isCenter ? "bg-[#FF5722] text-white border-[#FF5722]" : "bg-slate-50 border-slate-100 text-[#121212] group-hover:bg-[#FF5722] group-hover:text-white"}
                                    `}
                  >
                    {category.name?.[0]}
                  </div>
                )}
              </div>

              <span
                className={`relative z-10 text-[14px] font-bold text-center uppercase tracking-tight leading-tight transition-colors duration-300
                                ${isCenter ? "text-[#121212]" : "text-slate-500 group-hover:text-[#121212]"}
                            `}
              >
                {category.name}
              </span>

              {isCenter && (
                <Link
                  href={`/${category.url}`}
                  className="absolute bottom-6 z-20 text-[10px] font-black text-[#FF5722] uppercase tracking-[0.2em] hover:underline"
                >
                  Explore Now
                </Link>
              )}

              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[4px] transition-all duration-500 rounded-t-full bg-[#FF5722] ${isCenter ? "w-1/2" : "w-0 group-hover:w-1/4"}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Category3DSlider;

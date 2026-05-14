"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { splitHeading } from "@/constants/hooks";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  merchantName: string;
  slug: string;
}

const MerchantCategorySlider: React.FC<Props> = ({
  categories,
  merchantName,
  slug,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showSliders, setShowSliders] = useState(false);

  // New Heading as per your request
  const heading = `Browse Categories by ${merchantName}`;
  const [firstWord, restWords] = splitHeading(heading);

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
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.6;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <style jsx>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
        .hide-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="container mx-auto px-4">
        {/* HEADING */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-block px-4 py-1.5 mb-4 border border-gray-100 rounded-full bg-gray-50/50 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
              OFFICIAL <span className="text-[#ff912f]">PARTNER</span>
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-[#111318] tracking-tight leading-tight">
            {firstWord && <span className="text-[#ff912f]">{firstWord} </span>}
            <span>{restWords || heading}</span>
          </h2>

          <div className="flex items-center gap-1.5 mt-4">
            <div className="w-8 h-[3px] bg-[#ff912f] rounded-full" />
            <div className="w-2 h-[3px] bg-black rounded-full" />
            <div className="w-8 h-[3px] bg-[#ff912f] rounded-full" />
          </div>

          <p className="mt-4 text-gray-500 text-sm max-w-xl font-medium">
            Explore the latest premium categories and exclusive collections
            curated just for you.
          </p>
        </div>

        <div className="relative group/main pt-4">
          {/* Navigation Buttons */}
          {showSliders && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute -left-2 sm:-left-6 top-[55%] -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-xl border border-gray-100 text-[#111318] hover:bg-[#ff912f] hover:text-white transition-all duration-300 opacity-0 group-hover/main:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-4 h-4"
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
                className="absolute -right-2 sm:-right-6 top-[55%] -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-xl border border-gray-100 text-[#111318] hover:bg-[#ff912f] hover:text-white transition-all duration-300 opacity-0 group-hover/main:opacity-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Cards Slider */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 py-6 px-2 hide-scroll scroll-smooth snap-x snap-mandatory"
          >
            {categories.map((item, i) => (
              <Link
                key={item.id || i}
                href={`/products/${slug}/${item.slug}`}
                className="group/card flex-shrink-0 snap-start no-underline"
              >
                <div className="relative w-[160px] md:w-[190px] h-[220px] md:h-[250px] flex flex-col items-center justify-between p-6 bg-[#fcfcfc] border border-gray-100 rounded-[2.5rem] group-hover/card:bg-white group-hover/card:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover/card:border-[#ff912f]/40 group-hover/card:-translate-y-2 transition-all duration-500 overflow-hidden">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-gray-50 flex items-center justify-center shadow-inner group-hover/card:border-[#ff912f]/20 transition-all">
                    <span className="text-lg font-black text-[#ff912f]/30 group-hover/card:text-[#ff912f] transition-colors">
                      {item.name.charAt(0)}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 block">
                      Collection
                    </span>
                    <h4 className="text-[14px] md:text-[16px] font-black text-[#111318] uppercase tracking-tight leading-tight group-hover/card:text-[#ff912f] transition-colors">
                      {item.name}
                    </h4>
                  </div>

                  <div className="w-full">
                    <div className="w-full py-2.5 rounded-2xl bg-gray-50 text-[#111318] group-hover/card:bg-[#ff912f] group-hover/card:text-white flex items-center justify-center gap-2 transition-all duration-300">
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        Explore
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 group-hover/card:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#ff912f]/5 rounded-full group-hover/card:scale-150 transition-transform duration-700" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchantCategorySlider;

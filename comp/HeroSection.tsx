"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Bed, MapPin, Star } from "lucide-react";

interface Props {
  keywords: string[];
  mer_slug: string;
  cat_slug: string;
}

const luxuryHotels = [
  {
    title: "Santorini Villa",
    desc: "Luxury villa overlooking the Aegean Sea, offering breathtaking sunset views and a private infinity pool.",
    img: "https://images.unsplash.com/photo-1599916382059-2968a101a410?auto=format&fit=crop&w=800&q=80",
    rating: "4.8",
    stay: "5 Night Stay",
  },
  {
    title: "Alpine Retreat",
    desc: "Serene mountain retreat with floor-to-ceiling windows and private spa access for ultimate relaxation.",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    rating: "4.9",
    stay: "3 Night Stay",
  },
  {
    title: "Burj Al Arab",
    desc: "Iconic 7-star experience with private butler service and underwater dining experiences.",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    rating: "5.0",
    stay: "2 Night Stay",
  },
  {
    title: "The Ritz-Carlton",
    desc: "Ultra-luxury suites with world-class service and panoramic skyline views in the heart of the city.",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    rating: "4.7",
    stay: "4 Night Stay",
  },
];

const HeroSection = ({ keywords, mer_slug, cat_slug }: Props) => {
  const displayTags = keywords?.slice(0, 6) ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % luxuryHotels.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] flex flex-col items-center overflow-hidden bg-[#0A0A0A] pt-32 pb-20 px-6 sm:px-12">
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF5F1F]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-6 mt-10 inline-flex items-center gap-2.5 bg-white/5 border border-white/10 text-[#FF5F1F] text-[11px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full shadow-lg">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5F1F] animate-pulse" />
          Exclusive Rental Access
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col items-start text-left w-full max-w-[460px]">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-[900] text-white tracking-tight mb-4 leading-[1.1]">
              STAY IN LUXURY <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5F1F] via-[#FF8C00] to-[#FF5F1F]">
                FOR SIGNIFICANTLY LESS
              </span>
            </h1>

            <p className="text-zinc-400 text-xs md:text-sm mb-8 leading-relaxed font-medium">
              Unlock verified corporate rates and hidden discount codes for the
              world's most prestigious hotel chains and luxury apartment
              rentals.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 w-full sm:w-auto">
              <Link
                href={`/all-stores/A`}
                className="group relative px-5 py-2.5 bg-[#FF5F1F] hover:bg-[#E54E10] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl flex items-center justify-center gap-2.5 w-full sm:w-auto overflow-hidden"
              >
                <Bed size={14} />
                <span>Search Deals</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href={`/${cat_slug}`}
                className="group px-5 py-2.5 bg-white/5 text-zinc-300 border border-white/10 hover:border-[#FF5F1F]/40 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2.5 w-full sm:w-auto"
              >
                <MapPin size={14} className="text-[#FF5F1F]" />
                <span>Browse Coupons</span>
              </Link>
            </div>

            {displayTags.length > 0 && (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-[1px] bg-[#FF5F1F]/50" />
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                    Trending Tags
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {displayTags.map((tag, i) => (
                    <Link
                      key={i}
                      href={`/search?query=${encodeURIComponent(tag)}`}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:border-[#FF5F1F]/40 transition-all duration-300"
                    >
                      <span className="text-[9px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full h-[380px] flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] h-[380px] sm:h-[350px]">
              {luxuryHotels.map((item, i) => {
                let offset = i - activeIndex;
                if (offset < 0) offset += luxuryHotels.length;

                const isVisible = offset < 3;

                return (
                  <div
                    key={i}
                    className="absolute top-0 right-0 w-full h-full bg-[#111] rounded-[2rem] overflow-hidden transition-all duration-700 ease-in-out border border-white/10 flex flex-col shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: `translateX(-${offset * 35}px) scale(${1 - offset * 0.05})`,
                      zIndex: 30 - offset,
                      filter: `brightness(${1 - offset * 0.25})`,
                      pointerEvents: offset === 0 ? "auto" : "none",
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="500px"
                        priority={i === activeIndex}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
                        <h3 className="text-white text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3 font-medium">
                          {item.desc}
                        </p>

                        <div className="flex items-center gap-3 mb-6">
                          <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
                            <span className="text-white/80 text-[10px] font-bold">
                              {item.rating}
                            </span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={8}
                                  fill={idx < 4 ? "white" : "none"}
                                  stroke="white"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">
                              {item.stay}
                            </span>
                          </div>
                        </div>

                        <Link
                          href="/all-stores/A"
                          className="w-full bg-white text-black py-3 rounded-full text-sm font-black text-center hover:bg-zinc-200 transition-colors uppercase tracking-tight shadow-lg shadow-white/5"
                        >
                          Reserve now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

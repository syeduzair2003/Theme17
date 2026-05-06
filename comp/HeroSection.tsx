"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Bed, MapPin } from 'lucide-react';

interface Props {
    keywords: string[];
    mer_slug: string;
    cat_slug: string;
}

const luxuryHotels = [
    { 
        title: "The Ritz-Carlton", 
        desc: "Ultra-luxury suites with world-class service.", 
        img: "https://images.unsplash.com/photo-1542314831-c6a4d140e628?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        title: "Burj Al Arab", 
        desc: "Iconic 7-star experience with private butler service.", 
        img: "https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        title: "Four Seasons", 
        desc: "Modern luxury with breathtaking skyline views.", 
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" 
    },
    { 
        title: "Aman Resorts", 
        desc: "Serene mountain retreat for ultimate relaxation.", 
        img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" 
    }
];

const HeroSection = ({ keywords, mer_slug, cat_slug }: Props) => {
    const displayTags = keywords?.slice(0, 6) ?? []; 
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % luxuryHotels.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full min-h-[600px] flex flex-col items-center overflow-hidden bg-[#0A0A0A] pt-32 pb-20 px-6 sm:px-12">
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF5F1F]/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
                
                {/* ─── CENTERED TOP BADGE ─── */}
                <div className="mb-6 mt-10 inline-flex items-center gap-2.5 bg-white/5 border border-white/10 text-[#FF5F1F] text-[11px] font-black uppercase tracking-[0.25em] px-5 py-2 rounded-full shadow-lg">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF5F1F] animate-pulse" />
                    Exclusive Rental Access
                </div>

                {/* ─── CONTENT WRAPPER (Split into 2 columns) ─── */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
                    {/* LEFT COLUMN: Content */}
                    <div className="flex flex-col items-start text-left w-full max-w-[460px]"> 
                        <h1 className="text-3xl sm:text-4xl lg:text-4xl font-[900] text-white tracking-tight mb-4 leading-[1.1]">
                            STAY IN LUXURY <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5F1F] via-[#FF8C00] to-[#FF5F1F] animate-gradient-x">
                                FOR SIGNIFICANTLY LESS
                            </span>
                        </h1>

                        <p className="text-zinc-400 text-xs md:text-sm mb-8 leading-relaxed font-medium">
                            Unlock verified corporate rates and hidden discount codes for the world's most 
                            prestigious hotel chains and luxury apartment rentals.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 w-full sm:w-auto">
                            <Link href={`/all-stores/A`} className="group relative px-5 py-2.5 bg-[#FF5F1F] hover:bg-[#E54E10] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl flex items-center justify-center gap-2.5 w-full sm:w-auto overflow-hidden">
                                <Bed size={14} />
                                <span>Search Deals</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link href={`/${cat_slug}`} className="group px-5 py-2.5 bg-white/5 text-zinc-300 border border-white/10 hover:border-[#FF5F1F]/40 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2.5 w-full sm:w-auto">
                                <MapPin size={14} className="text-[#FF5F1F]" />
                                <span>Browse Coupons</span>
                            </Link>
                        </div>

                        {displayTags.length > 0 && (
                            <div className="w-full">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-[1px] bg-[#FF5F1F]/50" />
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Trending Tags</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {displayTags.map((tag, i) => (
                                        <Link key={i} href={`/search?query=${encodeURIComponent(tag)}`} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:border-[#FF5F1F]/40 transition-all duration-300">
                                            <span className="text-[9px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">{tag}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Slider */}
<div className="relative w-full h-[420px] flex items-center justify-center lg:justify-end">
    {/* Width mazeed barha di hai (420px desktop / 340px mobile) */}
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] h-[320px] sm:h-[380px]">
        {luxuryHotels.map((item, i) => {
            let offset = i - activeIndex;
            if (offset < 0) offset += luxuryHotels.length;

            const isVisible = offset < 3;

            return (
                <div
                    key={i}
                    className="absolute top-0 right-0 w-full h-full bg-[#111] rounded-[1.5rem] overflow-hidden transition-all duration-700 ease-in-out border border-white/5 flex flex-col shadow-2xl"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        // Offset barha diya (30px -> 45px) taake edges mazeed bahar nikle hon
                        transform: `translateX(-${offset * 45}px) scale(${1 - offset * 0.05})`, 
                        zIndex: 30 - offset,
                        filter: `brightness(${1 - offset * 0.25})`, 
                        pointerEvents: offset === 0 ? 'auto' : 'none'
                    }}
                >
                    {/* Image Height barha kar 70% kar di hai */}
                    <div className="relative w-full h-[70%] shrink-0 p-2">
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                            <Image
                                src={item.img}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="500px" 
                                priority={i === activeIndex}
                            />
                        </div>
                    </div>

                    {/* Text part ko kam (30%) aur compact kar diya hai */}
                    <div className="p-3 flex flex-col justify-center flex-grow bg-[#111]">
                        <h3 className="text-[#FF5F1F] text-[9px] font-black uppercase tracking-[0.2em] mb-1 line-clamp-1">
                            {item.title}
                        </h3>
                        <p className="text-zinc-500 text-[9px] leading-tight font-medium line-clamp-1 opacity-80">
                            {item.desc}
                        </p>
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
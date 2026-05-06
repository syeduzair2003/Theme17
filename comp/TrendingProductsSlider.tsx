"use client";

import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { faChevronLeft, faChevronRight, FontAwesomeIcon } from '@/constants/icons';

interface Props {
    children: React.ReactNode;
}

const TrendingProductsSlider = ({ children }: Props) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        initial: 0,
        loop: true,
        mode: "snap",
        slides: {
            perView: 5,
            spacing: 20, // Increased spacing for a cleaner look
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
        created() {
            setLoaded(true);
        },
        breakpoints: {
            '(max-width: 1280px)': {
                slides: { perView: 4, spacing: 16 },
            },
            '(max-width: 1024px)': {
                slides: { perView: 3, spacing: 14 },
            },
            '(max-width: 768px)': {
                slides: { perView: 2.2, spacing: 12 },
            },
            '(max-width: 480px)': {
                slides: { perView: 1.25, spacing: 12 },
            },
        },
    });

    return (
        <div className="relative group w-full">
            {/* ── Slider Main Container ── */}
            <div ref={sliderRef} className="keen-slider py-6 overflow-visible">
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return (
                            <div className="keen-slider__slide flex justify-center h-auto px-1">
                                {child}
                            </div>
                        );
                    }
                    return child;
                })}
            </div>

            {/* ── Navigation Arrows (Orange Glass Style) ── */}
            {loaded && instanceRef.current && (
                <>
                    <button
                        className="absolute -left-2 sm:-left-5 top-[45%] -translate-y-1/2 z-30 w-11 h-11 rounded-xl flex items-center justify-center bg-[#14110e]/80 backdrop-blur-xl border border-white/5 text-white/70 shadow-2xl transition-all duration-300 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:scale-110 active:scale-95 focus:outline-none opacity-0 group-hover:opacity-100 disabled:hidden"
                        onClick={(e) => {
                            e.stopPropagation();
                            instanceRef.current?.prev();
                        }}
                        aria-label="Previous slide"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                    </button>
                    
                    <button
                        className="absolute -right-2 sm:-right-5 top-[45%] -translate-y-1/2 z-30 w-11 h-11 rounded-xl flex items-center justify-center bg-[#14110e]/80 backdrop-blur-xl border border-white/5 text-white/70 shadow-2xl transition-all duration-300 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:scale-110 active:scale-95 focus:outline-none opacity-0 group-hover:opacity-100 disabled:hidden"
                        onClick={(e) => {
                            e.stopPropagation();
                            instanceRef.current?.next();
                        }}
                        aria-label="Next slide"
                    >
                        <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
                    </button>
                </>
            )}

            {/* ── Pagination Bullets (Orange Neon Bars) ── */}
            {loaded && instanceRef.current && (
                <div className="flex justify-center mt-6 gap-2.5">
                    {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => {
                        const isActive = currentSlide === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => instanceRef.current?.moveToIdx(idx)}
                                className={`h-1 rounded-full transition-all duration-500 relative overflow-hidden ${
                                    isActive 
                                    ? "w-8 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]" 
                                    : "w-3 bg-white/10 hover:bg-white/20"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            >
                                {isActive && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2.5s infinite linear;
                }
                .keen-slider {
                    clip-path: inset(-100px 0 -100px 0); /* Keeps card hover-up and shadows visible */
                    overflow: visible !important;
                }
            `}</style>
        </div>
    );
};

export default TrendingProductsSlider;
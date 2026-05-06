"use client";

import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 group transition-all duration-700 ease-in-out ${
                isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-12 scale-50 pointer-events-none'
            }`}
            aria-label="Back to top"
        >
            {/* Orange Neon Glow Ring */}
            <div className="absolute inset-0 rounded-2xl bg-orange-600 blur-md opacity-20 group-hover:opacity-60 group-hover:scale-125 transition-all duration-500" />
            
            {/* Main Button Body - Solid Black */}
            <div className="relative flex items-center justify-center w-14 h-14 bg-black border border-white/10 rounded-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 group-hover:border-orange-500">
                
                {/* Orange Fill Up Effect on Hover */}
                <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

                {/* Icon Container */}
                <div className="relative z-10">
                    <svg 
                        className="w-6 h-6 text-orange-500 group-hover:text-black transition-all duration-300 transform group-hover:-translate-y-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={3} 
                            d="M5 10l7-7m0 0l7 7m-7-7v18" 
                        />
                    </svg>
                </div>

                {/* Vertical Shine Animation */}
                <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-1000 ease-in-out" />
            </div>
        </button>
    );
};

export default BackToTopButton;
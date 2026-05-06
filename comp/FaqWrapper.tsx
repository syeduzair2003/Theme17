"use client";
import React, { useState } from 'react';

export default function FaqWrapper({ children, totalCount }: { children: React.ReactNode[], totalCount: number }) {
    const [showAll, setShowAll] = useState(false);

    // Initial 6 items (3 left, 3 right)
    const visibleItems = showAll ? children : children.slice(0, 6);
    
    // Split into 2 columns for the grid layout
    const midIndex = Math.ceil(visibleItems.length / 2);
    const leftCol = visibleItems.slice(0, midIndex);
    const rightCol = visibleItems.slice(midIndex);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">
                <div className="space-y-4 md:space-y-6">
                    {leftCol}
                </div>
                <div className="space-y-4 md:space-y-6">
                    {rightCol}
                </div>
            </div>

            {totalCount > 6 && (
                <div className="mt-14 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="group relative inline-flex items-center justify-center px-10 py-3.5 overflow-hidden font-black text-[11px] uppercase tracking-[0.25em] italic transition-all duration-300 ease-out bg-black text-white rounded-lg hover:bg-orange-600 active:scale-95 shadow-xl shadow-slate-200"
                    >
                        <span className="relative flex items-center gap-2">
                            {showAll ? 'Show Less Questions' : 'Explore All Questions'}
                            <svg 
                                className={`w-3 h-3 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </button>
                   
                </div>
            )}
        </>
    );
}
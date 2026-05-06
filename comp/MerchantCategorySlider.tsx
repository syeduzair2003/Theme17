'use client';
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { splitHeading } from '@/constants/hooks';

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

const MerchantCategorySlider: React.FC<Props> = ({ categories, merchantName, slug }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showSliders, setShowSliders] = useState(false);

    const heading = `Product Categories for ${merchantName}`;
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
        window.addEventListener('resize', checkScroll);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener('resize', checkScroll);
        }
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.6;
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!categories || categories.length === 0) return null;

    return (
        <section className="w-full py-12 bg-transparent overflow-hidden">
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
                {/* Section Header */}
                <div className="flex flex-col mb-8 relative">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1 h-5 rounded-full bg-[#8bc94a]" aria-hidden="true" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff912f]">
                            Explore Collections
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                        {firstWord && <span className="text-[#8bc94a]">{firstWord} </span>}
                        <span className="text-gray-800">{restWords || heading}</span>
                    </h2>
                   
                </div>

                <div className="relative group/main px-2 sm:px-4">
                    {/* Navigation Buttons */}
                    {showSliders && (
                        <>
                            <button
                                onClick={() => scroll('left')}
                                className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white backdrop-blur-md rounded-full shadow-xl border-2 border-[#8bc94a] text-[#ff912f] hover:bg-[#8bc94a] hover:text-white transition-all duration-300 opacity-0 group-hover/main:opacity-100 -translate-x-2 group-hover/main:translate-x-0"
                                aria-label="Scroll left"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white backdrop-blur-md rounded-full shadow-xl border-2 border-[#8bc94a] text-[#ff912f] hover:bg-[#8bc94a] hover:text-white transition-all duration-300 opacity-0 group-hover/main:opacity-100 translate-x-2 group-hover/main:translate-x-0"
                                aria-label="Scroll right"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Scrollable Area */}
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 md:gap-8 py-10 px-6 sm:px-10 hide-scroll scroll-smooth snap-x snap-mandatory"
                    >
                        {categories.map((item, i) => (
                            <Link
                                key={item.id || i}
                                href={`/products/${slug}/${item.slug}`}
                                className="group/card flex-shrink-0 w-[240px] md:w-[280px] snap-center no-underline"
                            >
                                <div className="relative h-24 flex items-center justify-center bg-white/60 backdrop-blur-md border border-white/50 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] group-hover/card:shadow-[0_20px_40px_rgba(139,201,74,0.15)] group-hover/card:border-[#8bc94a]/30 group-hover/card:-translate-y-2 transition-all duration-500 overflow-hidden">
                                    {/* Abstract background element */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8bc94a]/10 to-transparent rounded-full -mr-10 -mt-10 group-hover/card:scale-150 transition-transform duration-700" />
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#ff912f]/10 to-transparent rounded-full -ml-8 -mb-8 group-hover/card:scale-150 transition-transform duration-700" />
                                    
                                    <div className="relative z-10 text-center px-4 w-full">
                                        <h4 className="text-[15px] md:text-[17px] font-bold text-gray-800 group-hover/card:text-[#ff912f] transition-colors duration-300 uppercase tracking-widest m-0 leading-snug">
                                            {item.name}
                                        </h4>
                                        <div className="w-0 group-hover/card:w-16 h-[2px] bg-[#8bc94a] mx-auto mt-2 transition-all duration-300" />
                                    </div>
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

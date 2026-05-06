import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface Props {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    imageSrc?: string;
    imageAlt?: string;
}

const BreadcrumbSection = ({
    title,
    breadcrumbs,
    imageSrc,
    imageAlt = "Breadcrumb Image",
}: Props) => {
    return (
        <div className="bg-[#1a1612] pt-32 pb-12 md:pt-48 md:pb-24 relative overflow-hidden">
            {/* Unique Background Elements: Deep Glows & Luxury Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#FF5F1F]/[0.06] rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#FF5F1F]/[0.04] rounded-full blur-[100px] pointer-events-none z-0"></div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Re-designed Layout: Asymmetric Flex */}
                <div className={`flex flex-col lg:flex-row items-center lg:items-end gap-12 ${imageSrc ? 'justify-between text-left' : 'justify-center text-center'}`}>
                    
                    {/* Text and Breadcrumbs Area */}
                    <div className={`flex flex-col ${imageSrc ? 'lg:w-3/5 items-center lg:items-start' : 'items-center'} mb-12 lg:mb-0`}>
                        
                        {/* Unique Minimalist Breadcrumb Style */}
                        <nav aria-label="Breadcrumb" className={`inline-block relative z-10 w-full max-w-full overflow-x-auto pb-4 md:pb-6 hide-scrollbar flex justify-center ${imageSrc ? 'lg:justify-start' : 'lg:justify-center'}`}>
                            <ol className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-[0.25em] font-black text-white/30">
                                {breadcrumbs.map((crumb, idx) => {
                                    const isLast = idx === breadcrumbs.length - 1;
                                    const isFirst = idx === 0;

                                    return (
                                        <li key={idx} className="inline-flex items-center">
                                            {/* Modern Slash Separator */}
                                            {!isFirst && <span className="mx-2 md:mx-4 text-white/10 font-light">/</span>}
                                            
                                            {/* Link or Static Text */}
                                            {crumb.href && !isLast ? (
                                                <Link href={crumb.href} className="transition-all duration-300 no-underline hover:text-[#FF5F1F] group flex items-center">
                                                    {isFirst && (
                                                        <svg className="w-3 h-3 mr-2 text-[#FF5F1F]/50 group-hover:text-[#FF5F1F] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                                        </svg>
                                                    )}
                                                    <span className="whitespace-nowrap">{crumb.label}</span>
                                                </Link>
                                            ) : (
                                                <span className={`tracking-[0.25em] ${isLast ? 'text-[#FF5F1F] font-black' : 'text-white/30'}`}>
                                                    {crumb.label === "other" && isLast ? "#" : crumb.label}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ol>
                        </nav>

                        {/* Bold Luxury Typography */}
                        <div className="relative group">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-4">
                                {title}<span className="text-[#FF5F1F]">.</span>
                            </h1>
                            {/* Animated Accent Divider */}
                            <div className="w-24 h-[3px] bg-gradient-to-r from-[#FF5F1F] to-transparent rounded-full shadow-[0_0_15px_rgba(255,95,31,0.5)] transition-all duration-500 group-hover:w-40"></div>
                        </div>

                    </div>

                    {/* Unique Image Area: The Geometric Frame */}
                    {imageSrc && (
                        <div className="lg:w-2/5 flex justify-center lg:justify-end relative w-full h-[300px] md:h-[380px]">
                            {/* Decorative Floating Squares */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[320px] md:h-[320px] border border-white/5 rotate-12 rounded-[3rem] z-0 transition-transform duration-1000 group-hover:rotate-45"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] md:w-[320px] md:h-[320px] border border-[#FF5F1F]/10 -rotate-6 rounded-[3rem] z-0"></div>
                            
                            {/* Image Wrapper with Soft Glass Effect */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center transform transition-all duration-700 hover:scale-110">
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    fill
                                    className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)] brightness-110"
                                    unoptimized
                                    priority
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
            
            {/* Local Styles for scannability and performance */}
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
};

export default BreadcrumbSection;
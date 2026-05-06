import { getBaseImageUrl, getMerchantHref } from '@/constants/hooks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    merchant: string;
    companyDomain: string;
    store_slug: string;
    slug_type: string;
}

const MerchantCard = ({ merchant, companyDomain, store_slug, slug_type }: any) => {
    const href = getMerchantHref(merchant, store_slug, slug_type);
    const firstLetter = merchant.merchant_name?.[0]?.toUpperCase() || '#';
    
    return (
        <Link href={href} className="group flex flex-col p-6 bg-white rounded-[2rem] border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-[#8bc94a]/15 hover:border-[#8bc94a]/30 hover:-translate-y-2 relative overflow-hidden no-underline h-[250px]">
            
            {/* Top Colored Border Accent - Expands from center on hover */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-1.5 bg-[#8bc94a] transition-all duration-500 ease-out group-hover:w-full"></div>

            {/* Massive Background Letter Watermark - Thematic for Alphabet Directory */}
            <div className="absolute -bottom-8 -right-4 text-[180px] font-black text-gray-50 opacity-40 group-hover:text-[#8bc94a] group-hover:opacity-[0.04] transition-all duration-700 select-none z-0 transform group-hover:scale-110 group-hover:-rotate-12 pointer-events-none leading-none">
                {firstLetter}
            </div>

            {/* Subtle Glowing Orb effect on hover */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#ff912f]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0 pointer-events-none"></div>

            {/* Main Content Container */}
            <div className="relative z-10 flex flex-col h-full">
                
                {/* Logo Section - Significantly larger for maximum impact */}
                <div className="flex-1 flex items-center justify-center w-full mb-3 mt-2">
                    {merchant.merchant_logo ? (
                        <div className="relative w-[90%] h-[110px] flex items-center justify-center">
                            <Image 
                                src={getBaseImageUrl(companyDomain, merchant.merchant_logo, '')}
                                alt={merchant.merchant_name}
                                fill
                                className="object-contain filter transform transition-all duration-700 ease-out group-hover:scale-110 origin-center"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 transition-all duration-500 group-hover:bg-white group-hover:border-[#ff912f]/30 group-hover:shadow-[0_0_20px_rgba(255,145,47,0.1)]">
                            <span className="text-4xl font-light text-gray-300 group-hover:text-[#ff912f] transition-colors duration-500">{firstLetter}</span>
                        </div>
                    )}
                </div>
                
                {/* Text & Button Area */}
                <div className="flex flex-col items-center mt-auto h-[60px] justify-end pb-1">
                    {/* Store Title */}
                    <h3 className="text-[16px] font-bold text-gray-700 text-center leading-snug line-clamp-2 transition-all duration-400 group-hover:-translate-y-8 group-hover:opacity-0 m-0 w-full absolute bottom-6 px-4">
                        {merchant.merchant_name}
                    </h3>
                    
                    {/* Animated Pill Button - Slides up to replace the title */}
                    <div className="absolute bottom-6 opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out w-full flex justify-center px-4">
                        <span className="inline-flex items-center justify-center gap-2 bg-[#ff912f] text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-lg shadow-[#8bc94a]/30 uppercase tracking-widest w-full max-w-[180px]">
                            Visit Store
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                               <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            
        </Link>
    );
};

export default MerchantCard;
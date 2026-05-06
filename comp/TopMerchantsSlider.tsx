"use client";

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Helpers
import { getMerchantHref, getBaseImageUrl } from '@/constants/hooks'; 

const TopMerchantsSlider = ({ merchants, domain, companyData }: any) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return <div className="w-full h-44 bg-transparent" />;
    if (!merchants || merchants.length === 0) return null;

    return (
        <div className="w-full relative py-6 px-10">
            <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={25}
                slidesPerView={2}
                loop={merchants.length > 6}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                navigation={{
                    nextEl: '.swiper-next-luxury',
                    prevEl: '.swiper-prev-luxury',
                }}
                breakpoints={{
                    480: { slidesPerView: 3, spaceBetween: 20 },
                    768: { slidesPerView: 4, spaceBetween: 25 },
                    1024: { slidesPerView: 5, spaceBetween: 30 },
                    1280: { slidesPerView: 6, spaceBetween: 30 },
                }}
                className="!pb-8"
            >
                {merchants.map((merchant: any) => (
                    <SwiperSlide key={merchant.unique_id}>
                        <Link
                            href={getMerchantHref(merchant, companyData?.store_slug, companyData?.slug_type)}
                            className="group relative flex flex-col items-center justify-center h-40 w-full bg-transparent"
                        >
                            {/* ─── MAIN SHAPE ─── */}
                            <div className="absolute inset-0 bg-white border border-gray-100 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-none rounded-bl-none shadow-sm transition-all duration-300 group-hover:border-[#ff912f]/40 overflow-hidden">
                                
                                {/* Inner Soft Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#ff912f]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* ─── THE FIX: BORDER LINE ─── */}
                                {/* Hum ne width ko 100% rakha hai aur transform se control kiya hai taake curve perfect rahay */}
                                <div className="absolute bottom-0 left-0 h-[5px] bg-[#ff912f] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out rounded-br-[2.5rem]" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="relative w-14 h-10 transition-transform duration-500 group-hover:scale-110">
                                    <Image
                                        src={getBaseImageUrl(domain, merchant.merchant_logo, '')}
                                        alt={merchant.merchant_name}
                                        fill
                                        unoptimized
                                        className="object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
                                    />
                                </div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] text-center line-clamp-1 group-hover:text-[#111318] transition-colors">
                                    {merchant.merchant_name}
                                </span>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ─── ARROWS ─── */}
            <div className="swiper-prev-luxury absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center cursor-pointer group/nav transition-all hover:bg-[#111318] hover:border-[#111318]">
                <svg className="w-4 h-4 text-[#111318] group-hover/nav:text-[#ff912f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                </svg>
            </div>

            <div className="swiper-next-luxury absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center cursor-pointer group/nav transition-all hover:bg-[#111318] hover:border-[#111318]">
                <svg className="w-4 h-4 text-[#111318] group-hover/nav:text-[#ff912f] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    );
};

export default TopMerchantsSlider;
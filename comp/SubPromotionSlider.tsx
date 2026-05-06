"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { SubPromotion } from '@/services/dataTypes';
import { getBaseImageUrl, getPromotionHref } from '@/constants/hooks';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { faArrowRight, FontAwesomeIcon } from '@/constants/icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Props {
    subPromotions: SubPromotion[];
    domain: string;
    promotionSlug: string;
}

const SubPromotionSlider = ({ subPromotions, domain, promotionSlug }: Props) => {
    if (!subPromotions || subPromotions.length === 0) return null;

    return (
        <div className="relative group/slider w-full max-w-[1400px] mx-auto px-4 md:px-14">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20} 
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 25 },
                    1280: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="!pb-12 !pt-4"
            >
                {subPromotions.map((item) => (
                    <SwiperSlide key={item.unique_id}>
                        <Link
                            href={getPromotionHref(item, promotionSlug)}
                            className="group/card block relative h-[300px] md:h-[340px] rounded-[3rem] overflow-hidden bg-[#0d0f14] border border-white/5 transition-all duration-500 hover:border-[#ff912f]/30"
                        >
                            {/* 1. Image Layer with Smooth Zoom */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={getBaseImageUrl(domain, item.category_image, '')}
                                    alt={item.category_name}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-1000 group-hover/card:scale-110 opacity-40 group-hover/card:opacity-60"
                                />
                                {/* Overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-[#0d0f14]/80 to-transparent" />
                            </div>

                            {/* 2. Content Layer */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-end p-8 text-center">
                                {/* Category Badge style heading */}
                                <div className="mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 group-hover/card:border-[#ff912f]/40 transition-colors">
                                     <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Category</span>
                                </div>

                                <h4 className="text-white text-xl font-black tracking-tight mb-2 group-hover/card:text-[#ff912f] transition-colors leading-tight">
                                    {item.category_name}
                                </h4>
                                
                                {item.category_detail && (
                                    <p className="text-gray-500 text-xs line-clamp-1 italic mb-6 opacity-80 group-hover/card:text-gray-300">
                                        {item.category_detail}
                                    </p>
                                )}

                                {/* 3. Ultra-Sleek Explore Button */}
                                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover/card:bg-[#ff912f] group-hover/card:w-32 transition-all duration-500 overflow-hidden">
                                    <span className="absolute left-6 opacity-0 group-hover/card:opacity-100 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500">
                                        Explore
                                    </span>
                                    <FontAwesomeIcon 
                                        icon={faArrowRight} 
                                        className="text-white text-sm group-hover/card:ml-20 transition-all duration-500" 
                                    />
                                </div>
                            </div>

                            {/* Corner Accent (Very Subtle) */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* 4. Arrows Fix - Centered & Safe */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none flex justify-between px-1 md:px-2">
                <button className="swiper-button-prev-custom pointer-events-auto w-11 h-11 rounded-full bg-[#111318] border border-white/10 text-gray-400 flex items-center justify-center shadow-none hover:bg-[#ff912f] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 -translate-x-4 group-hover/slider:translate-x-0">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                </button>
                <button className="swiper-button-next-custom pointer-events-auto w-11 h-11 rounded-full bg-[#111318] border border-white/10 text-gray-400 flex items-center justify-center shadow-none hover:bg-[#ff912f] hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 translate-x-4 group-hover/slider:translate-x-0">
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
            </div>
        </div>
    );
};

export default SubPromotionSlider;
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
    <div className="relative group/slider px-4 md:px-0">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="rounded-3xl !pb-2"
      >
        {subPromotions.map((item) => (
          <SwiperSlide key={item.unique_id}>
            <Link
              href={getPromotionHref(item, promotionSlug)}
              className="group/card block relative h-[280px] md:h-[320px] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2"
            >
              {/* Image */}
              <Image
                src={getBaseImageUrl(domain, item.category_image, '')}
                alt={item.category_name}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h4 className="text-white text-lg font-bold mb-1 line-clamp-1 group-hover/card:text-[#8bc94a] transition-colors">
                  {item.category_name}
                </h4>
                {item.category_detail && (
                  <p className="text-white/70 text-xs line-clamp-1 italic font-medium">
                    {item.category_detail}
                  </p>
                )}
                
                {/* View Offers Button */}
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8bc94a] transition-all duration-500 transform translate-y-2 opacity-50 group-hover/card:opacity-100 group-hover/card:translate-y-0">
                  Explore Offers
                  <div className="w-6 h-6 rounded-full bg-[#8bc94a] text-white flex items-center justify-center text-[10px] shadow-lg shadow-[#8bc94a40]">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls */}
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center z-10 text-gray-400 hover:text-[#8bc94a] opacity-0 group-hover/slider:opacity-100 group-hover/slider:-translate-x-2 md:group-hover/slider:-translate-x-12 transition-all duration-500">
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center z-10 text-gray-400 hover:text-[#8bc94a] opacity-0 group-hover/slider:opacity-100 group-hover/slider:translate-x-2 md:group-hover/slider:translate-x-12 transition-all duration-500">
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default SubPromotionSlider;

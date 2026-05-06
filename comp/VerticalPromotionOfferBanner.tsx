"use client";

import { OffersOffer } from "@/services/dataTypes";
import React, { useState } from "react";
import { filterOfferBanners, getBannerDimensions } from "@/constants/hooks";
import Banner from "./Banner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  bannerResponse: OffersOffer[];
  domain: string;
  mer_slug: string;
  slug_type: string;
}

const VerticalPromotionOfferBanner = ({
  bannerResponse,
  domain,
  mer_slug,
  slug_type,
}: Props) => {
  const filtered = filterOfferBanners(bannerResponse, 50, 2000, 65, 2000);
  const initialVisibleCount = 6;
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);
  const [loading, setLoading] = useState(false);

  const handleToggleVisible = () => {
    setLoading(true);
    setTimeout(() => {
      if (visibleCount < filtered.length) {
        setVisibleCount((prev) => prev + 6);
      } else {
        setVisibleCount(initialVisibleCount);
        window.scrollTo({ top: 200, behavior: "smooth" });
      }
      setLoading(false);
    }, 300);
  };

  if (!filtered || filtered.length === 0) return null;

  const displayedBanners = filtered.slice(0, visibleCount);
  const isShowingAll = visibleCount >= filtered.length;

  return (
    <div className="relative group/sidebar mb-10">
      <div className="absolute -inset-1 bg-black/5 rounded-[2.5rem] blur-xl -z-10" />

      <div className="relative bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50">
        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center">
          <h4 className="text-lg font-black text-[#1a1612] tracking-tight m-0 uppercase">
            Exclusive <span className="text-[#FF5F1F]">Banners</span>
          </h4>
          <div className="h-1 w-10 bg-[#FF5F1F] rounded-full mt-2 shadow-[0_2px_10px_rgba(255,95,31,0.2)]"></div>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {displayedBanners.map((offer_data, i) => {
            const dimension = getBannerDimensions(offer_data);
            return (
              <div key={i} className="transition-all duration-300">
                <Banner
                  data={offer_data}
                  height={dimension?.height}
                  mer_slug={mer_slug}
                  slug_type={slug_type}
                  domain={domain}
                  width={dimension?.width}
                />
              </div>
            );
          })}
        </div>

        {filtered.length > initialVisibleCount && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleToggleVisible}
              disabled={loading}
              className="group relative w-full max-w-[240px] h-[54px] bg-[#1a1612] hover:bg-[#ff912f] rounded-full flex items-center justify-center transition-all duration-500 active:scale-95 shadow-lg shadow-black/10 overflow-hidden border border-transparent hover:border-orange-400"
            >
              {loading ? (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  className="animate-spin text-white group-hover:text-white text-lg"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm transition-colors duration-300 group-hover:text-white">
                    {isShowingAll ? "Show Less" : "Show More"}
                  </span>
                  <FontAwesomeIcon
                    icon={isShowingAll ? faChevronUp : faChevronDown}
                    className="text-white text-[10px] transition-all duration-300 group-hover:text-white group-hover:translate-y-0"
                  />
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalPromotionOfferBanner;

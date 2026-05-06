"use client";

import { OffersOffer } from "@/services/dataTypes";
import React, { useEffect, useState } from "react";
import { filterOfferBanners, getBannerDimensions } from "@/constants/hooks";
import Banner from "./Banner";
import { apiCategoryOfferBanners } from "@/apis/user";

interface Props {
  bannerResponse: OffersOffer[];
  domain: string;
  mer_slug: string;
  slug_type: string;
  categoryId: string;
  companyId: string;
}

const VerticalCategoryOfferBanner = ({
  bannerResponse,
  domain,
  mer_slug,
  slug_type,
  categoryId,
  companyId,
}: Props) => {
  const [banners, setBanners] = useState<OffersOffer[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const initialFiltered = filterOfferBanners(
      bannerResponse,
      50,
      2000,
      65,
      2000,
    );
    setBanners(initialFiltered);
  }, [bannerResponse]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await apiCategoryOfferBanners(categoryId, companyId, page);
      const newBanners = filterOfferBanners(
        res.data?.offers || [],
        50,
        2000,
        65,
        2000,
      );

      setBanners((prev) => [...prev, ...newBanners]);
      if (res?.data?.pagination?.next_page) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
      setIsExpanded(true);
    } catch (error) {
      console.error("Error loading more vertical banners", error);
    } finally {
      setLoading(false);
    }
  };

  const showLess = () => {
    const initialFiltered = filterOfferBanners(
      bannerResponse,
      50,
      2000,
      65,
      2000,
    );
    setBanners(initialFiltered);
    setPage(2);
    setHasMore(true);
    setIsExpanded(false);
  };

  if (banners?.length === 0) return null;

  return (
    <div className="relative group/sidebar mb-10 w-full">
      <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden text-center w-full">
        {/* Decorative Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FF5F1F]/5 to-transparent rounded-full -ml-16 -mt-16 blur-3xl opacity-60" />

        {/* Header */}
        <div className="relative mb-8 flex flex-col items-center">
          <h4 className="text-lg font-black text-[#1a1612] tracking-tight m-0 uppercase">
            Exclusive <span className="text-[#FF5F1F]">Banners</span>
          </h4>
          <div className="h-1 w-10 bg-[#FF5F1F] rounded-full mt-2 shadow-[0_2px_10px_rgba(255,95,31,0.2)]"></div>
        </div>

        {/* Banners List */}
        <div className="flex flex-col gap-4 mb-8 relative z-10">
          {banners?.map((offer_data, i) => {
            const dimension = getBannerDimensions(offer_data);
            return (
              <div
                key={i}
                className="transition-transform duration-500 hover:scale-[1.02]"
              >
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

        {/* Combined Actions Section */}
        {(hasMore || isExpanded) && (
          <div className="mt-6 flex flex-col gap-3 relative z-10">
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="relative overflow-hidden group/btn px-8 py-3.5 bg-[#1a1612] text-white rounded-2xl font-bold text-sm transition-all duration-300 hover:bg-[#FF5F1F] hover:shadow-[0_10px_25px_rgba(255,95,31,0.3)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full"
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? (
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  <span>{loading ? "Loading..." : "Show More"}</span>
                </div>
              </button>
            )}

            {isExpanded && (
              <button
                onClick={showLess}
                disabled={loading}
                className="px-8 py-3.5 bg-gray-50 text-gray-500 border border-gray-100 rounded-2xl font-bold text-sm transition-all duration-300 hover:bg-white hover:text-[#1a1612] hover:border-gray-300 active:scale-95 w-full"
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerticalCategoryOfferBanner;

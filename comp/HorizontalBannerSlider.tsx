"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { OffersOffer } from "@/services/dataTypes";
import { apiRandomOfferBanners } from "@/apis/offers";
import { filterOfferBanners, getBannerDimensions } from "@/constants/hooks";
import Banner from "./Banner";
import { faAngleLeft, faAngleRight, FontAwesomeIcon } from "@/constants/icons";

interface Props {
  companyId: string;
  mer_slug: string;
  slug_type: string;
  domain: string;
}
const HorizontalBannerSlider = ({
  companyId,
  slug_type,
  mer_slug,
  domain,
}: Props) => {
  const [offers, setOffers] = useState<OffersOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<{
    current_page: number;
    last_page: number;
    next_page: number | null;
  } | null>(null);
  const latestRequest = useRef(0);
  const MAX_EMPTY_ATTEMPTS = 1;
  const emptyAttempts = useRef(0);
  // 1. Ref and state for intersection observer
  const sliderSectionRef = useRef<HTMLElement | null>(null);
  const [sliderInView, setSliderInView] = useState(false);
  const [isSliderReady, setIsSliderReady] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const offersRef = useRef(offers);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const paginationRef = useRef(pagination);
  const sliderInViewRef = useRef(sliderInView);

  useEffect(() => {
    offersRef.current = offers;
  }, [offers]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);
  useEffect(() => {
    sliderInViewRef.current = sliderInView;
  }, [sliderInView]);

  // Keen slider
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    mode: "snap",
    created: () => {
      setIsSliderReady(true);
    },
    slideChanged: (s) => {
      if (
        sliderInViewRef.current &&
        s.track.details.rel === offersRef.current.length - 1 &&
        hasMoreRef.current &&
        !loadingRef.current &&
        paginationRef.current?.next_page
      ) {
        getOffers(paginationRef.current.next_page);
      }
    },
  });
  const autoplayInterval = 6000;

  const startAutoplay = () => {
    if (!slider.current || !isSliderReady || autoplayRef.current) return;
    autoplayRef.current = setInterval(() => {
      const details = slider.current?.track.details;
      const currentAbsIndex = details?.abs || 0;
      slider.current?.moveToIdx(currentAbsIndex + 1, true, {
        duration: 3000,
        easing: (t) => t,
      });
    }, autoplayInterval);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  useEffect(() => {
    if (!slider.current || !isSliderReady) return;

    startAutoplay();

    const wrapper = sliderSectionRef.current;
    if (wrapper) {
      wrapper.addEventListener("mouseenter", stopAutoplay);
      wrapper.addEventListener("mouseleave", startAutoplay);
    }

    return () => {
      stopAutoplay();
      if (wrapper) {
        wrapper.removeEventListener("mouseenter", stopAutoplay);
        wrapper.removeEventListener("mouseleave", startAutoplay);
      }
    };
  }, [slider, isSliderReady]);

  const getOffers = useCallback(
    async (pageNum: number, reset = false) => {
      setLoading(true);
      const requestId = Date.now();
      latestRequest.current = requestId;
      try {
        const bannerOffers = await apiRandomOfferBanners(companyId, pageNum);
        if (latestRequest.current !== requestId) return;
        const apiOffers = bannerOffers?.data?.offers || [];
        const filterOfferBanner = filterOfferBanners(
          apiOffers,
          300,
          1000,
          0,
          150,
        );
        const paginationData = bannerOffers?.data?.pagination || {};
        setPagination({
          current_page: paginationData.current_page,
          last_page: paginationData.last_page,
          next_page: paginationData.next_page,
        });
        if (
          filterOfferBanner.length === 0 &&
          paginationData.next_page &&
          emptyAttempts.current < MAX_EMPTY_ATTEMPTS
        ) {
          emptyAttempts.current += 1;
          await getOffers(paginationData.next_page, false);
          return;
        } else {
          emptyAttempts.current = 0;
        }
        if (reset) {
          setOffers(filterOfferBanner);
        } else if (filterOfferBanner.length > 0) {
          setOffers((prev) => [...prev, ...filterOfferBanner]);
        }
        setHasMore(paginationData.next_page !== null);
      } finally {
        setLoading(false);
      }
    },
    [companyId],
  );
  useEffect(() => {
    if (!sliderSectionRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        setSliderInView(entries[0].isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(sliderSectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setOffers([]);
    setPagination(null);
    emptyAttempts.current = 0;
    getOffers(1, true);
  }, [companyId]);

  useEffect(() => {
    if (slider.current) {
      slider.current.update();
    }
  }, [offers]);

  const goPrev = () => slider.current?.prev();
  const goNext = () => slider.current?.next();

  return (
    <section ref={sliderSectionRef} className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {offers?.length > 0 ? (
          <>
            <div ref={sliderRef} className="keen-slider">
              {offers.map((items: OffersOffer, i: number) => {
                const dimension = getBannerDimensions(items);
                return (
                  <div
                    key={i}
                    className="keen-slider__slide flex items-center justify-center h-[180px] sm:h-[280px] bg-slate-50 relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
                    <Banner
                      data={items}
                      height={dimension?.height}
                      width={dimension?.width}
                      offerLink={null}
                      mer_slug={mer_slug}
                      slug_type={slug_type}
                      domain={domain}
                    />
                  </div>
                );
              })}
              {loading && (
                <div className="keen-slider__slide flex items-center justify-center h-full bg-white/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#8bc94a] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-slate-500">
                      Loading more...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ff912f] hover:text-white hover:border-[#ff912f] shadow-lg scale-90 hover:scale-100"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#ff912f] hover:text-white hover:border-[#ff912f] shadow-lg scale-90 hover:scale-100"
            >
              <FontAwesomeIcon icon={faAngleRight} className="w-5 h-5" />
            </button>

            {/* Premium Banner Badge */}
            <div className="absolute top-6 left-6 z-10">
              <span className="px-5 py-2 rounded-full bg-white/80 backdrop-blur-md text-[#8bc94a] text-[11px] font-extrabold tracking-widest uppercase border border-[#8bc94a]/30 shadow-sm">
                Exclusive Deals
              </span>
            </div>
          </>
        ) : loading ? (
          <div className="flex items-center justify-center h-[280px] bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 border-4 border-[#8bc94a] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-semibold tracking-tight text-lg">
                Curating best offers...
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default HorizontalBannerSlider;

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
    <section
      ref={sliderSectionRef}
      className="max-w-7xl mx-auto px-6 py-6 selection:bg-orange-100"
    >
      <div className="relative group rounded-[2.5rem] overflow-hidden bg-white border border-slate-100 shadow-[0_30px_70px_rgba(0,0,0,0.035)] hover:shadow-[0_35px_80px_rgba(255,95,31,0.045)] transition-all duration-500">
        {offers?.length > 0 ? (
          <>
            <div ref={sliderRef} className="keen-slider">
              {offers.map((items: OffersOffer, i: number) => {
                const dimension = getBannerDimensions(items);
                return (
                  <div
                    key={i}
                    className="keen-slider__slide flex items-center justify-center h-[200px] sm:h-[320px] bg-gradient-to-b from-slate-50/40 to-white relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-orange-500/[0.015] pointer-events-none" />

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
                <div className="keen-slider__slide flex items-center justify-center h-full bg-white/70 backdrop-blur-md absolute inset-0 z-20">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-[3px] border-[#FF5F1F] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      Syncing catalog...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={goPrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 text-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white hover:border-black shadow-md scale-95 hover:scale-100"
              aria-label="Previous Slide"
            >
              <FontAwesomeIcon icon={faAngleLeft} className="w-4 h-4" />
            </button>

            <button
              onClick={goNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 text-slate-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white hover:border-black shadow-md scale-95 hover:scale-100"
              aria-label="Next Slide"
            >
              <FontAwesomeIcon icon={faAngleRight} className="w-4 h-4" />
            </button>

            <div className="absolute top-6 left-6 z-10">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/40 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5F1F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5F1F]"></span>
                </span>
                <span className="text-slate-900 text-[10px] font-black tracking-[0.25em] uppercase font-mono">
                  Verified Collection
                </span>
              </div>
            </div>
          </>
        ) : loading ? (
          <div className="flex items-center justify-center h-[320px] bg-white rounded-[2.5rem] border border-slate-100 shadow-inner">
            <div className="flex flex-col items-center gap-4">
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-slate-100 rounded-full absolute"></div>
                <div className="w-12 h-12 border-2 border-[#FF5F1F] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-400 font-bold tracking-widest text-[11px] uppercase font-mono">
                Assembling dynamic canvas...
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default HorizontalBannerSlider;

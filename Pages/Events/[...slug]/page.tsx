import {
  apiGetEventOfferBanners,
  apiGetEventSuggestedMerchants,
} from "@/apis/offers";
import {
  apiCategoryWithSub,
  apiCompanyUpdatedData,
  apiGetAllEvents,
  apiGetEventBanners,
  apiGetEventDetails,
} from "@/apis/user";
import BreadcrumbSection from "@/components/Theme-17/comp/BreadcrumbSection";
import EventsOfferCard, {
  EventsGrid,
} from "@/components/Theme-17/comp/EventsOfferCard";
import VerticalPromotionOfferBanner from "@/components/Theme-17/comp/VerticalPromotionOfferBanner";
import CategoryGrid from "@/components/Theme-17/comp/CategoryGrid";
import {
  cleanHtmlContent,
  extractAllOffers,
  filterOfferBanners,
  getEventsHref,
  getMerchantHref,
  getProductDetailHref,
} from "@/constants/hooks";
import { faBolt, FontAwesomeIcon } from "@/constants/icons";
import cookieService from "@/services/CookiesService";
import { MerchantWithOffers, Offer } from "@/services/dataTypes";
import PaginatedOffers from "@/components/Theme-17/comp/PaginatedOffers";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { stripHtml } from "string-strip-html";

type Props = Promise<{ slug: string[] }>;

type MerchantOfferItem = {
  offer: Offer;
  merchant: MerchantWithOffers;
};

const page = async ({ params }: { params: Props }) => {
  const { slug } = await params;
  const companyDomain = await cookieService.get("domain");
  const response = await apiCompanyUpdatedData(companyDomain);
  const companyData = response?.data;
  const [
    event,
    banners,
    eventMerchants,
    suggestedEvents,
    eventOfferBanners,
    suggestedCategories,
  ] = await Promise.all([
    apiGetEventDetails(companyData?.unique_id, slug[0]).then((res) => res.data),
    apiGetEventBanners(companyData?.unique_id, slug[0]).then((res) => res.data),
    apiGetEventSuggestedMerchants(companyData?.unique_id, slug[0]).then(
      (res) => res.data,
    ),
    apiGetAllEvents(companyDomain.domain).then((res) => res.data),
    apiGetEventOfferBanners(companyData?.unique_id, slug[0]).then(
      (res) => res.data,
    ),
    apiCategoryWithSub(companyData?.unique_id).then((res) => res.data),
  ]);

  if (!event) return notFound();

  const offerBanners = extractAllOffers(eventOfferBanners);
  const filteredVerticalBanners = filterOfferBanners(
    offerBanners || [],
    50,
    2000,
    65,
    2000,
  );

  const allOffers: MerchantOfferItem[] =
    event?.merchants?.flatMap((merchant) =>
      (merchant?.offers || []).map((offer) => ({
        offer,
        merchant,
      })),
    ) || [];

  const description = event?.event?.description || "";
  const cleanDesc = cleanHtmlContent(description);
  const plainDesc = stripHtml(cleanDesc).result;
  const isLongDescription = plainDesc.length > 400;

  return (
    <main className="bg-[#f8fafc] min-h-screen">
      {/* Breadcrumb - Untouched design/size as requested */}
      <BreadcrumbSection
        title={event?.event?.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: `/events` },
          { label: event?.event?.name, href: `/events/${event?.event?.slug}` },
        ]}
      />

      <section className={isLongDescription ? "pb-12 pt-10" : "pb-24 pt-10"}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* LEFT SIDEBAR AREA */}
            <aside className="lg:col-span-4 flex flex-col gap-8">
              {/* Categories with Show More/Less Toggle */}
              <CategoryGrid categories={suggestedCategories} />

              {/* Banner Offers */}
              {filteredVerticalBanners?.length > 0 && (
                <div className="rounded-[2.5rem] overflow-hidden shadow-sm border border-white">
                  <VerticalPromotionOfferBanner
                    bannerResponse={filteredVerticalBanners}
                    domain={companyDomain?.domain}
                    mer_slug={companyData?.store_slug}
                    slug_type={companyData?.slug_type}
                  />
                </div>
              )}

              {/* Suggested Events - Clean Grid Layout */}
{suggestedEvents?.length > 0 && (
  <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 max-w-md">
    
    {/* Updated Header for Events */}
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
        {/* Event/Discovery Star Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#ff912f" />
        </svg>
      </div>
      <h4 className="text-xl font-bold text-black tracking-tight">Events</h4>
    </div>
    
    {/* 2-Column Grid Layout */}
    <div className="grid grid-cols-2 gap-3 mb-8">
      {suggestedEvents.slice(0, 6).map((sEvent, i) => (
        <Link
          key={i}
          href={getEventsHref(sEvent, "slug")}
          className="flex items-center justify-center px-4 py-4 rounded-2xl bg-[#f8fafd] border border-transparent transition-all duration-300 hover:bg-white hover:border-[#ff912f]/30 group"
        >
          {/* Light Font Style */}
          <span className="text-[13px] font-medium text-[#4b5563] group-hover:text-[#ff912f] transition-colors text-center line-clamp-1">
            {sEvent?.name}
          </span>
        </Link>
      ))}
    </div>

    {/* View All Button - Orange Text & Black BG */}
    <Link 
       href="/events" 
       className="w-full h-[56px] bg-black rounded-full flex items-center justify-center gap-2 group transition-all active:scale-95 shadow-lg shadow-black/10"
    >
      <span className="text-[11px] font-black text-[#ff912f] uppercase tracking-[0.2em]">
        View All Events ({suggestedEvents.length})
      </span>
      <svg 
        className="w-3 h-3 text-[#ff912f] transition-transform group-hover:translate-y-0.5" 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    </Link>
  </div>
)}
            </aside>

            {/* MAIN CONTENT AREA */}
<div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
  {/* Sleek Minimalist Header Card */}
  <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group">
    {/* Subtle Luxury Gradient - Top Right */}
    <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff912f]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

    <div className="relative z-10 flex items-center justify-between gap-6">
      <div className="flex flex-col gap-2.5">
        {/* Minimalist Badge */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-black text-[#ff912f] text-[9px] font-black uppercase tracking-wider">
            Premium
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Verified Deals
          </span>
        </div>

        {/* Compact & Clean Title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight flex flex-wrap items-center gap-x-2">
            {event?.event?.name}
            <span className="text-[#ff912f] font-medium italic text-xl md:text-2xl">
              — Exclusive
            </span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">
            Hand-picked vouchers for{" "}
            <span className="text-black font-semibold">
              Gettopdiscounts
            </span>{" "}
            members.
          </p>
        </div>
      </div>

      {/* Smaller, Elegant Icon Badge */}
      <div className="shrink-0">
        <div className="relative bg-black h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10 border-b-2 border-[#ff912f]/30">
          <FontAwesomeIcon
            icon={faBolt}
            className="text-[#ff912f] text-xl md:text-2xl"
          />
        </div>
      </div>
    </div>
  </div>

  {/* Offers Section with Pagination Integration */}
  {allOffers.length > 0 ? (
    <PaginatedOffers 
      allOffers={allOffers}
      companyData={companyData}
      companyDomain={companyDomain}
    />
  ) : (
    /* Elegant Empty State */
    <div className="bg-white rounded-[2rem] py-16 px-8 text-center border border-slate-100 shadow-sm">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <FontAwesomeIcon
          icon={faBolt}
          className="text-slate-200 text-xl"
        />
      </div>
      <h3 className="text-xl font-bold text-black mb-1">
        No Active Offers
      </h3>
      <p className="text-slate-400 max-w-xs mx-auto text-xs font-medium">
        Check back later for fresh premium {event?.event?.name} discounts.
      </p>
    </div>
  )}
</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;

import {
  apiGetPromotionOffers,
  apiGetSubPromotion,
} from "@/apis/page_optimization";
import { apiCompanyUpdatedData } from "@/apis/user";
import {
  cleanHtmlContent,
  discardHTMLTags,
  extractFirstSentences,
  getBaseImageUrl,
  getMerchantHref,
  getProductDetailHref,
  splitHeading,
} from "@/constants/hooks";
import {
  faBolt,
  faCheck,
  faGreaterThan,
  FontAwesomeIcon,
} from "@/constants/icons";
import cookieService from "@/services/CookiesService";
import { MerchantWithOffers, Offer } from "@/services/dataTypes";
import Link from "next/link";
import React from "react";
import { stripHtml } from "string-strip-html";
import Image from "next/image";
import EventsOfferCard, { EventsGrid } from "./EventsOfferCard";
import SubPromotionSlider from "./SubPromotionSlider";
import ParentPromotionSchema from "@/components/shared/SchemaScripts/ParentPromotionSchema";
import TopMerchantsSlider from "./TopMerchantsSlider";

type MerchantOfferItem = {
  offer: Offer;
  merchant: MerchantWithOffers;
};

const ParentPromotionPage = async ({ params }: { params: string }) => {
  const slug = params;
  const companyDomainObj = await cookieService.get("domain");
  const domain = companyDomainObj?.domain || "";

  const response = await apiCompanyUpdatedData(companyDomainObj);
  const companyData = response?.data;

  const [promotionRes, subPromotionsRes] = await Promise.all([
    apiGetPromotionOffers(companyData?.unique_id, slug),
    apiGetSubPromotion(companyData?.unique_id, slug),
  ]);

  const promotion = promotionRes?.data;
  const subPromotions = subPromotionsRes?.data || [];

  const allOffers: MerchantOfferItem[] =
    promotion?.merchants?.flatMap((merchant) =>
      (merchant?.offers || []).map((offer) => ({
        offer,
        merchant,
      })),
    ) || [];

  const description = promotion?.promotion?.description || "";
  const cleanDesc = cleanHtmlContent(description);
  const plainDesc = stripHtml(cleanDesc).result;
  const shortDesc = extractFirstSentences(plainDesc, 20);

  const isLongDescription = plainDesc.length > 400;

  const [firstWord, restWords] = splitHeading(
    promotion?.promotion?.name || "Exclusive Promotion",
  );

  return (
    <main className="min-h-screen bg-[#fcfdfa] pt-[65px] md:pt-[105px]">
      {/* ─── PREMIUM HANGING DARK HERO SECTION WITH PATTERNS ─── */}
      <section className="relative w-full bg-[#fcfdfa] overflow-hidden">
        <div className="w-full">
          <div className="relative group bg-[#111318] rounded-t-none rounded-b-[7rem] md:rounded-b-[8rem] px-6 py-12 md:py-16 border-b border-white/5 flex flex-col items-center text-center overflow-hidden transition-all duration-500">
            {/* ─── SIDE ORNAMENTS & PATTERNS ─── */}
            {/* Left Side: Modern Dot Pattern */}
            <div className="absolute left-10 bottom-12 hidden lg:block opacity-20 pointer-events-none">
              <div className="grid grid-cols-4 gap-3">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[#ff912f] to-transparent"
                  />
                ))}
              </div>
            </div>

            {/* Right Side: Minimalist Lines */}
            <div className="absolute right-0 bottom-20 hidden lg:block opacity-10 pointer-events-none">
              <div className="w-32 h-[1px] bg-gradient-to-l from-transparent via-white to-transparent -rotate-45 mb-4" />
              <div className="w-24 h-[1px] bg-gradient-to-l from-transparent via-[#ff912f] to-transparent -rotate-45" />
            </div>

            {/* 1. Centered Breadcrumbs */}
            <nav className="mb-6 relative z-10" aria-label="breadcrumb">
              <ol className="flex items-center justify-center space-x-2 text-[11px] uppercase tracking-[0.25em] font-black">
                <li>
                  <Link
                    href="/"
                    className="flex items-center text-gray-500 hover:text-[#ff912f] transition-all duration-300 no-underline group/home"
                  >
                    <svg
                      className="w-3.5 h-3.5 mr-1.5 mb-0.5 text-gray-600 transition-all duration-300 group-hover/home:text-[#ff912f] group-hover/home:scale-110"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-700">/</span>
                  <Link
                    href={`/${companyData?.promotion_slug}`}
                    className="text-gray-500 hover:text-[#ff912f] transition-colors no-underline"
                  >
                    Promotions
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-700">/</span>
                  <span className="text-[#ff912f]">
                    {promotion?.promotion?.name}
                  </span>
                </li>
              </ol>
            </nav>

            {/* 2. Content Area */}
            <div className="relative z-10 flex flex-col gap-4 max-w-4xl px-4 items-center">
              <div className="inline-flex items-center bg-white/[0.03] border border-white/10 px-3 py-1 rounded-full mb-1">
                <span className="w-1.5 h-1.5 bg-[#ff912f] rounded-full mr-2 shadow-[0_0_8px_#ff912f]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {allOffers.length} Active Deals
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                {firstWord && (
                  <span className="text-[#ff912f]">{firstWord} </span>
                )}
                <span className="text-gray-100">
                  {restWords || promotion?.promotion?.name}
                </span>
              </h1>

              {!isLongDescription && description && (
                <div
                  className="text-gray-400 text-sm md:text-base leading-relaxed mt-2 max-w-2xl opacity-80"
                  dangerouslySetInnerHTML={{ __html: cleanDesc }}
                />
              )}

              {isLongDescription && shortDesc && (
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mt-2 opacity-70 max-w-xl italic">
                  &quot;{shortDesc}...&quot;
                </p>
              )}
            </div>

            {/* Subtle Glow Overlay */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.01] rounded-full blur-[100px] pointer-events-none" />
          </div>
        </div>
      </section>
      {/* ─── SLEEK CENTERED SUB-PROMOTIONS HEADING ─── */}
      {subPromotions && subPromotions.length > 0 && (
        <section className="mt-16 pb-16 md:pb-6 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-10 md:gap-12">
              {/* Centered & Attractive Heading Section */}
              <div className="relative flex flex-col items-center text-center max-w-2xl mx-auto">
                {/* Top Decorative Element */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-[#ff912f] rounded-full" />
                  <div className="w-2 h-2 rounded-full bg-[#ff912f] shadow-[0_0_8px_#ff912f]" />
                  <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-[#ff912f] rounded-full" />
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[#111318] tracking-tight uppercase leading-none">
                  Curated Deals{" "}
                  <span className="text-[#ff912f]">by Category</span>
                </h2>

                {/* Modern Subtext with subtle divider */}
                <div className="mt-4 flex flex-col items-center">
                  <p className="text-gray-400 text-[13px] md:text-sm font-medium tracking-wide">
                    Hand-picked specialized offers for the{" "}
                    <span className="text-gray-900 font-bold">
                      {promotion?.promotion?.name}
                    </span>{" "}
                    event.
                  </p>
                  <div className="mt-4 w-12 h-1 bg-gray-100 rounded-full" />
                </div>
              </div>

              {/* Slider Component */}
              <div className="relative group">
                <SubPromotionSlider
                  subPromotions={subPromotions}
                  domain={domain}
                  promotionSlug={companyData?.promotion_slug}
                />
              </div>
            </div>
          </div>
        </section>
      )}
      {/* OFFERS GRID */}
      <section className={isLongDescription ? "pb-12 mt-12" : "pb-24 mt-20"}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-12">
            {/* Dark Sleek Section Header */}
            <div className="flex flex-col items-center text-center gap-6">
              <div className="flex flex-col items-center gap-4">
                {/* Glowing Top Badge */}
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#111318] border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                  <div className="w-2 h-2 rounded-full bg-[#ff912f] shadow-[0_0_10px_#ff912f] animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300">
                    Verified <span className="text-[#ff912f]">Deals</span>
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-[#111318] tracking-tighter uppercase leading-none">
                  Featured <span className="text-[#ff912f]">Savings</span>
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-12 h-1 bg-[#ff912f] rounded-full" />
                  <div className="w-2 h-1 bg-gray-200 rounded-full" />
                </div>
              </div>

              {allOffers.length > 0 && (
                <div className="bg-[#111318] border border-white/5 backdrop-blur-md text-white px-8 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-2xl">
                  {allOffers.length} Live Offers Available
                </div>
              )}
            </div>

            {/* Grid Container */}
            <div className="relative pt-4">
              <EventsGrid>
                {allOffers.map((item, index) => (
                  <EventsOfferCard
                    key={`${item.offer.unique_id}-${index}`}
                    product={item.offer}
                    merchantHref={getMerchantHref(
                      item.merchant,
                      companyData?.store_slug,
                      companyData?.slug_type,
                    )}
                    domain={domain}
                    merchant_name={item.merchant?.merchant_name}
                    merchant_logo={item.merchant?.merchant_logo}
                    productDetailUrl={
                      item.offer?.slug
                        ? getProductDetailHref(
                            item.merchant,
                            companyData?.slug_type,
                            item.offer.slug,
                            item.offer.category?.slug,
                          )
                        : null
                    }
                  />
                ))}
              </EventsGrid>
            </div>

            {/* Premium Dark Empty State */}
            {allOffers.length === 0 && (
              <div className="bg-[#111318] rounded-[4rem] py-24 px-10 text-center border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff912f]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-3xl flex items-center justify-center mb-8 rotate-12">
                    <FontAwesomeIcon
                      icon={faBolt}
                      className="text-[#ff912f] text-4xl"
                    />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight uppercase">
                    Hunting New <span className="text-[#ff912f]">Deals</span>
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm font-medium leading-relaxed italic">
                    &quot;We are currently updating our vault with fresh
                    discounts. Check back in a few moments.&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TOP RATED MERCHANTS SECTION */}
      {promotion?.merchants && promotion.merchants.length > 0 && (
        <section className="pb-24 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-12">
              {/* Header - Stays Server-Side */}
              <div className="flex flex-col items-center text-center gap-4">
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#111318] border border-white/10 shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff912f] shadow-[0_0_8px_#ff912f]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                    Partnered <span className="text-[#ff912f]">Brands</span>
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#111318] tracking-tighter uppercase">
                  Top Brands in{" "}
                  <span className="text-[#ff912f]">
                    {promotion?.promotion?.name}
                  </span>
                </h2>
              </div>

              <TopMerchantsSlider
                merchants={promotion.merchants.slice(0, 15)}
                domain={domain}
                companyData={companyData}
              />
            </div>
          </div>
        </section>
      )}

    {/* ─── BOTTOM DESCRIPTION SECTION ─── */}
 {isLongDescription && description && (
  <section className="pb-16 pt-4">
    <div className="container mx-auto px-4 max-w-4xl">
      {/* Main Container: Centered & Sophisticated */}
      <div className="relative bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#ff912f] rounded-b-full" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col items-center">
          {/* Header Section: Centered & Refined */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff912f]">
                Premium Insights
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-[#111318] tracking-tight max-w-2xl">
              More About {promotion?.promotion?.name}
            </h3>
            
            {/* Minimalist Divider */}
            <div className="mt-4 w-12 h-1 bg-gray-50 rounded-full" />
          </div>

          {/* Clean Editorial Typography */}
          <div
            className="text-gray-500 text-base leading-[1.8] font-medium 
                       prose prose-slate max-w-none w-full
                       prose-p:mb-6 last:prose-p:mb-0
                       prose-headings:text-[#111318] prose-headings:font-black prose-headings:mb-3 prose-headings:text-center
                       prose-strong:text-[#111318] prose-strong:font-bold
                       prose-ul:my-4 prose-li:mb-1
                       prose-a:text-[#ff912f] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                       selection:bg-[#ff912f]/10 selection:text-[#ff912f]"
            dangerouslySetInnerHTML={{ __html: cleanDesc }}
          />
        </div>

        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ff912f]/[0.02] rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  </section>
)}

      <ParentPromotionSchema
        companyId={companyData?.unique_id}
        company_name={companyData?.company_name}
        slug={slug}
        promotionName={promotion?.promotion?.name}
        promoSlug={companyData?.promotion_slug}
      />
    </main>
  );
};

export default ParentPromotionPage;

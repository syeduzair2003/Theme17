import React from 'react'
import { apiGetSimilarMerchants, apiMerchantDetails } from '@/apis/merchant';
import { apiOfferBanners, apiSpecificOffers } from '@/apis/offers';
import { apiNavCategory } from '@/apis/page_optimization';
import { apiGetMetaData } from '@/apis/user';
import {
  cleanHtmlContent,
  discardHTMLTags,
  extractFirstSentences,
  filterOfferBanners,
  getBaseImageUrl,
  getLastUpdateDate,
  getRandomRating,
  getRandomStoreSeoTitle,
  splitHeadingFromDetails
} from '@/constants/hooks';
import cookieService from '@/services/CookiesService';
import { faArrowRight, faGreaterThan, FontAwesomeIcon, faCheck, faBolt } from '@/constants/icons'; 
import Link from 'next/link';
import Image from 'next/image';
import RenderRating from './RenderRating';
import CouponCard from './CouponCard';
import CategorySidebar from './CategorySidebar';
import VerticalOfferBanner from './VerticalOfferBanner';
import LazyLoadingOffers from './LazyLoadingOffers';


interface Props {
  merchant_id: string;
  slug: string[];
  product_id: Promise<string>;
  company_id: string;
  store_slug: string;
  category_slug: string;
  slug_type: string;
  ads_campaign: boolean;
}

const OffersPage = async ({ merchant_id, product_id, slug, company_id, store_slug, category_slug, slug_type, ads_campaign }: Props) => {
  const [
    awaited_p_id,
    bannerResponse,
    categories,
    offers,
    similarMerchantsRes,
    cookieDomain,
    metaRes,
    merchantDetailsRes
  ] = await Promise.all([
    product_id,
    apiOfferBanners(merchant_id, company_id),
    apiNavCategory(company_id),
    apiSpecificOffers(merchant_id, company_id, 1),
    apiGetSimilarMerchants(company_id, merchant_id),
    cookieService.get("domain"),
    apiGetMetaData(JSON.stringify(slug), (await cookieService.get("domain")).domain),
    apiMerchantDetails(merchant_id, company_id)
  ]);

  const companyDomain = cookieDomain.domain;
  const similarMerchant = similarMerchantsRes?.data;
  const navCategories = categories?.data || [];
  const filteredVerticalBanners = filterOfferBanners(bannerResponse?.data?.offers || [], 10, 2000, 10, 2000);

  const meta = metaRes?.data;
  const merchant_details = {
    ...merchantDetailsRes,
    mer_meta_title: meta?.meta_title,
    mer_meta_desc: meta?.meta_description,
  };
  const [heading, details] = splitHeadingFromDetails(merchant_details?.data?.merchant_detail);
  const cleanDetails = details ? discardHTMLTags(details) : "";
  const shortDesc = cleanDetails ? extractFirstSentences(cleanDetails, 25) : `${merchant_details?.data?.merchant_name} offers the best deals and promo codes. Save more on your next purchase with our verified coupons.`;

  return (
    <main className="min-h-screen bg-[#F4F4F4] text-neutral-900 antialiased selection:bg-[#FF5A00] selection:text-white">
      
      {/* ─── IMMERSIVE ONYX COMMAND HERO ─── */}
      <section className="relative bg-neutral-950 text-white pt-32 md:pt-36 pb-16 overflow-hidden border-b border-neutral-800">
        {/* Laser Orange Top Glow Grid Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#FF5A00] to-transparent opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,90,0,0.06),transparent_50%)]" />

        <div className="container mx-auto px-4 md:px-6">
          
          {/* 1. PREMIUM HIGH-INTERACTIVE BREADCRUMBS */}
          <div className="w-full pb-10 flex justify-center" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-3 text-[11px] font-bold tracking-[0.15em] text-neutral-400 uppercase select-none">
              
              {/* Home Link Frame */}
              <li className="flex items-center gap-2 group">
                <svg className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#FF5A00] transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <Link 
                  href="/" 
                  className="hover:text-[#FF5A00] text-neutral-400 transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#FF5A00] hover:after:w-full after:transition-all after:duration-300"
                >
                  HOME
                </Link>
              </li>
              
              {/* Stores Directory Link Frame */}
              <li className="flex items-center gap-3">
                <span className="text-[12px] text-neutral-700 font-normal">/</span>
                <Link 
                  href="/all-stores/A" 
                  className="hover:text-[#FF5A00] text-neutral-400 transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1.5px] after:bg-[#FF5A00] hover:after:w-full after:transition-all after:duration-300"
                >
                  STORES
                </Link>
              </li>
              
              {/* Active Current Merchant Identifier */}
              <li className="flex items-center gap-3">
                <span className="text-[12px] text-neutral-700 font-normal">/</span>
                <span className="text-[#FF5A00] font-black tracking-[0.18em]">
                  {merchant_details?.data?.merchant_name || "RETAILER"}
                </span>
              </li>

            </ol>
          </div>

          {/* 2. Split Geometric Dashboard Assembly */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Frame: Data Fields */}
            <div className="lg:col-span-8 space-y-6 order-2 lg:order-1 relative z-10">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 bg-[#FF5A00] text-neutral-950 font-black text-[9px] tracking-widest uppercase px-3 py-1 rounded-sm shadow-md">
                  <FontAwesomeIcon icon={faCheck} className="text-[9px]" /> SECURE VERIFIED PARTNER
                </span>
                <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-sm">
                  <RenderRating rating={getRandomRating(merchant_details?.data?.rating)} />
                  <span className="text-[11px] font-black text-neutral-400">
                    {getRandomRating(merchant_details?.data?.rating)} ALPHA_SCORE
                  </span>
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase leading-none max-w-4xl text-white">
                {heading ? discardHTMLTags(heading) : getRandomStoreSeoTitle(merchant_details?.data?.merchant_name)}
              </h1>

              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-3xl font-medium border-l-[3px] border-[#FF5A00] pl-4 italic">
                &quot;{shortDesc}&quot;
              </p>

              {details && (
                <div className="pt-2">
                  <Link
                    href="#merchant-details"
                    className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#FF5A00] hover:text-white transition-colors group"
                  >
                    <span>ANALYZE ARCHIVE DATA</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[8px] transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            {/* Right Frame: Floating Asset Pod */}
            <div className="lg:col-span-4 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[280px] aspect-square bg-white rounded-3xl p-8 flex items-center justify-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-neutral-800 group transition-transform duration-500 hover:-translate-y-2">
                <div className="w-full h-full relative">
                  <Image
                    src={getBaseImageUrl(companyDomain, merchant_details?.data?.merchant_logo, "")}
                    alt={merchant_details?.data?.merchant_name}
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
                
                {/* Neon-Style Metric Overlay Counter */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-2 flex items-center gap-2.5 shadow-xl min-w-[150px] justify-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5A00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5A00]"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">
                    {offers?.data?.offers?.length || 0} LIVE CREDITS
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TECHNICAL INTERFACE GRID ─── */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Central Stream Column (Left Panel) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Dynamic Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-6 py-4 rounded-xl border border-neutral-200/80 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 bg-neutral-950 rounded-xs flex items-center justify-center">
                    <div className="w-1 h-1 bg-[#FF5A00]" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                    AVAILABLE DISCOUNT RENDERS
                  </h2>
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-100 px-3 py-1 rounded border border-neutral-200">
                  REF_SYNC: <span className="text-[#FF5A00]">{getLastUpdateDate(1).toUpperCase()}</span>
                </div>
              </div>

              {/* Verified Coupons Display Container */}
              <div className="space-y-4">
                {offers?.data?.offers?.length > 0 ? (
                  <LazyLoadingOffers
                    initialOffers={offers?.data?.offers}
                    companyId={company_id}
                    merchantId={merchant_id}
                    awaited_p_id={awaited_p_id}
                    mer_slug_type={slug_type}
                    mer_slug={store_slug}
                    offerBanner={bannerResponse?.data?.offers}
                    domain={companyDomain}
                    merchantName={merchant_details?.data?.merchant_name}
                    pagination={offers?.data?.pagination}
                    ads_campaign={ads_campaign}
                  />
                ) : (
                  <div className="bg-white rounded-2xl py-20 px-6 text-center border-2 border-dashed border-neutral-200">
                    <div className="w-12 h-12 bg-neutral-950 text-[#FF5A00] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <FontAwesomeIcon icon={faBolt} className="text-sm" />
                    </div>
                    <h3 className="text-xs font-black text-neutral-900 uppercase tracking-widest mb-1">DATASTREAM EMPTY</h3>
                    <p className="text-neutral-400 text-xs max-w-xs mx-auto font-medium">No verified discount frames found matching this entity token currently.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Architectural Modules Panel (Right Sidebar) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Curated Recommendations Component */}
              {similarMerchant && similarMerchant.length > 0 && (
                <div className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-950">SIMILAR DOMAINS</h3>
                    <Link href="/all-stores/A" className="text-[9px] font-black uppercase tracking-widest text-[#FF5A00] hover:underline">BROWSE ALL</Link>
                  </div>

                  <div className="space-y-3">
                    {similarMerchant.slice(0, 4).map((merchant: any) => (
                      <Link key={merchant.unique_id} href={`/${store_slug}/${merchant.slug}`} className="group flex items-center gap-3.5 p-2.5 rounded-lg border border-transparent hover:border-neutral-200 hover:bg-neutral-50 transition-all duration-300 block">
                        <div className="w-12 h-12 bg-white border border-neutral-200 rounded-lg flex items-center justify-center p-2.5 shadow-2xs group-hover:border-neutral-400 transition-colors">
                          <Image
                            src={getBaseImageUrl(companyDomain, merchant.merchant_logo, "")}
                            alt={merchant.merchant_name}
                            width={32} height={32}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-neutral-800 group-hover:text-[#FF5A00] transition-colors">{merchant.merchant_name}</span>
                          <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">{merchant?.offer_count || "0"} CREDITS AVAILABLE</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Categories Modular Block */}
              {navCategories.length > 0 && (
                <div className="bg-white rounded-xl border border-neutral-200/80 p-2 shadow-2xs">
                  <CategorySidebar
                    categories={navCategories}
                    parentCategory={merchant_details?.data?.merchant_name}
                  />
                </div>
              )}

              {/* Vertical Ads Banner Segment */}
              {filteredVerticalBanners.length > 0 && (
                <div className="rounded-xl overflow-hidden border border-neutral-200/80 shadow-2xs bg-white">
                  <VerticalOfferBanner
                    bannerResponse={filteredVerticalBanners}
                    domain={companyDomain}
                    mer_slug={store_slug}
                    slug_type={slug_type}
                    merchantId={merchant_id}
                    companyId={company_id}
                    pagination={bannerResponse?.data?.pagination}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ─── CORPORATE INFORMATION GLOSSARY FOOTER ─── */}
      {details && (
        <section id="merchant-details" className="pb-24 scroll-mt-6">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-neutral-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-950">
                  ENTITY RECONSTRUCTION & INDEX FOR {merchant_details?.data?.merchant_name.toUpperCase()}
                </h3>
                <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center shadow-xs">
                  <FontAwesomeIcon icon={faCheck} className="text-[10px] text-[#FF5A00]" />
                </div>
              </div>
              <div
                className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/50 p-6 rounded-xl border border-neutral-200/60 prose prose-neutral max-w-none prose-sm font-medium prose-neutral-zinc prose-zinc-strong zinc prose-zinc-em"
                dangerouslySetInnerHTML={{ __html: cleanHtmlContent(details) }}
              />
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default OffersPage;
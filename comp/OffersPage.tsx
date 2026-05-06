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
    <main className="min-h-screen bg-[#fcfdfa]">
      {/* ─── PREMIUM BREADCRUMB & HEADER SECTION ─── */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#8bc94a05] rounded-bl-[120px] -z-10" />
        <div className="absolute top-0 left-0 w-1/4 h-1/2 bg-[#ff912f03] rounded-br-[120px] -z-10" />

        <div className="container mx-auto px-4">
          {/* 1. Unique Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-3 text-[12px] font-bold tracking-widest text-[#222e4850] uppercase">
              <li>
                <Link href="/" className="hover:text-[#8bc94a] transition-colors">Home</Link>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGreaterThan} className="text-[8px] opacity-30" />
                <Link href={`/all-stores/A`} className="hover:text-[#8bc94a] transition-colors">{store_slug}</Link>
              </li>
              <li className="flex items-center gap-3">
                <FontAwesomeIcon icon={faGreaterThan} className="text-[8px] opacity-30" />
                <span className="text-[#8bc94a]">{merchant_details?.data?.merchant_name}</span>
              </li>
            </ol>
          </nav>

          {/* 2. Main Store Dashboard Header */}
          <div className="bg-white rounded-[3rem] p-6 lg:p-14 shadow-[0_40px_100px_rgba(139,201,74,0.06)] border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8bc94a08] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center relative">
              {/* Left Side: Info */}
              <div className="lg:col-span-8 order-2 lg:order-1">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-[#8bc94a15] text-[#8bc94a] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Verified Merchant
                    </span>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                      <RenderRating rating={getRandomRating(merchant_details?.data?.rating)} />
                      <span className="text-xs font-black text-gray-400">
                        {getRandomRating(merchant_details?.data?.rating)}
                      </span>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-[#222e48] leading-[1.15]">
                    {heading ? discardHTMLTags(heading) : getRandomStoreSeoTitle(merchant_details?.data?.merchant_name)}
                  </h1>

                  {/* Short Description */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8bc94a] via-[#8bc94a50] to-transparent rounded-full" />
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-4xl font-medium italic opacity-90">
                      &quot;{shortDesc}&quot;
                    </p>
                  </div>

                  {/* Explore Store Link (Minimalist Style) */}
                  {details && (
                    <div className="mt-8 pt-8 border-t border-gray-50">
                      <Link
                        href="#merchant-details"
                        className="inline-flex items-center gap-3 text-[11px] font-black text-[#8bc94a] uppercase tracking-[0.25em] cursor-pointer hover:opacity-80 transition-opacity no-underline"
                      >
                        <span>Explore Store Information</span>
                        <div className="w-8 h-8 rounded-full bg-[#8bc94a10] flex items-center justify-center">
                          <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Visuals */}
              <div className="lg:col-span-4 order-1 lg:order-2">
                <div className="relative w-full max-w-[320px] mx-auto lg:ml-auto group">
                  {/* Card Glow */}
                  <div className="absolute -inset-6 bg-gradient-to-tr from-[#8bc94a30] via-transparent to-[#ff912f20] rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                  {/* Logo Card */}
                  <div className="relative bg-white aspect-[5/4] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col items-center justify-center p-10 transform group-hover:-translate-y-3 transition-all duration-700 ease-out">
                    <div className="w-full h-full relative">
                      <Image
                        src={getBaseImageUrl(companyDomain, merchant_details?.data?.merchant_logo, "")}
                        alt={merchant_details?.data?.merchant_name}
                        fill
                        className="object-contain transform group-hover:scale-110 transition-transform duration-1000"
                      />
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-50 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <div className="w-10 h-10 rounded-xl bg-[#ff912f] text-white flex items-center justify-center shadow-lg shadow-[#ff912f40]">
                      <FontAwesomeIcon icon={faBolt} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 leading-none mb-1">Active Offers</span>
                      <span className="text-sm font-black text-gray-900 leading-none">{offers?.data?.offers?.length || 0}+ Deals</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT SECTION ─── */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* 1. Main Column: Offers */}
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-8">
                {/* Section Heading */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-[#8bc94a] rounded-full" />
                    <h2 className="text-2xl md:text-3xl font-black text-[#222e48]">
                      Verified Coupons & Deals
                    </h2>
                  </div>
                  <p className="text-xs font-bold text-gray-400 tracking-wider">
                    LAST CHECKED: <span className="text-[#ff912f]">{getLastUpdateDate(1).toUpperCase()}</span>
                  </p>
                </div>

                {/* Offers List */}
                <div className="flex flex-col gap-6">
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
                    <div className="bg-white rounded-[2.5rem] py-20 px-10 text-center border border-dashed border-gray-200">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FontAwesomeIcon icon={faBolt} className="text-gray-200 text-3xl" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">No Active Offers Yet</h3>
                      <p className="text-gray-400 text-sm max-w-xs mx-auto">We&apos;re constantly updating our database. Check back soon for new savings!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Sidebar Column */}
            <div className="lg:col-span-4 flex flex-col gap-10">
              {/* Similar Stores Card */}
              {similarMerchant && similarMerchant.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white">
                  <h4 className="text-xl font-black text-[#222e48] mb-8 pb-4 border-b border-gray-50 flex items-center justify-between">
                    Similar Stores
                    <Link href="/all-stores/A" className="text-[10px] uppercase tracking-widest text-[#8bc94a] hover:opacity-70 transition-opacity">See All</Link>
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {similarMerchant.slice(0, 4).map((merchant: any) => (
                      <Link key={merchant.unique_id} href={`/${store_slug}/${merchant.slug}`} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-[#8bc94a05] transition-all duration-300">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <Image
                            src={getBaseImageUrl(companyDomain, merchant.merchant_logo, "")}
                            alt={merchant.merchant_name}
                            width={50} height={50}
                            className="object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[#222e48] group-hover:text-[#8bc94a] transition-colors">{merchant.merchant_name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{merchant?.offer_count || "Exclusive"} Offers</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {/* ─── CATEGORY SIDEBAR ─── */}
              {navCategories.length > 0 && (
                <CategorySidebar
                  categories={navCategories}
                  parentCategory={merchant_details?.data?.merchant_name}
                />
              )}

              {/* ─── VERTICAL BANNER OFFERS ─── */}
              {filteredVerticalBanners.length > 0 && (
                <VerticalOfferBanner
                  bannerResponse={filteredVerticalBanners}
                  domain={companyDomain}
                  mer_slug={store_slug}
                  slug_type={slug_type}
                  merchantId={merchant_id}
                  companyId={company_id}
                  pagination={bannerResponse?.data?.pagination}
                />
              )}

            </div>

          </div>
        </div>
      </section>

      {/* ─── FULL STORE DETAILS SECTION ─── */}
      {details && (
        <section id="merchant-details" className="pb-24 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-[3rem] p-8 lg:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-white">
              <h2 className="text-2xl md:text-3xl font-black text-[#222e48] mb-10 pb-6 border-b border-gray-50 flex items-center justify-between">
                Everything About {merchant_details?.data?.merchant_name}
                <div className="w-12 h-12 rounded-2xl bg-[#8bc94a10] flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheck} className="text-[#8bc94a] text-xl" />
                </div>
              </h2>
              <div
                className="text-base text-gray-500 leading-relaxed bg-[#fcfdfa] p-8 lg:p-12 rounded-[2rem] border border-gray-50 prose prose-slate max-w-none"
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

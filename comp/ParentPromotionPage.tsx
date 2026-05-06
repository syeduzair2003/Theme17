import { apiGetPromotionOffers, apiGetSubPromotion } from '@/apis/page_optimization';
import { apiCompanyUpdatedData } from '@/apis/user';
import {
    cleanHtmlContent,
    discardHTMLTags,
    extractFirstSentences,
    getBaseImageUrl,
    getMerchantHref,
    getProductDetailHref,
    splitHeading
} from '@/constants/hooks';
import { faBolt, faCheck, faGreaterThan, FontAwesomeIcon } from '@/constants/icons';
import cookieService from '@/services/CookiesService';
import { MerchantWithOffers, Offer } from '@/services/dataTypes';
import Link from 'next/link';
import React from 'react';
import { stripHtml } from 'string-strip-html';
import Image from 'next/image';
import EventsOfferCard, { EventsGrid } from './EventsOfferCard';
import SubPromotionSlider from './SubPromotionSlider';
import ParentPromotionSchema from '@/components/shared/SchemaScripts/ParentPromotionSchema';

type MerchantOfferItem = {
    offer: Offer;
    merchant: MerchantWithOffers;
};

const ParentPromotionPage = async ({ params }: { params: string }) => {
    const slug = params;
    const companyDomainObj = await cookieService.get("domain");
    const domain = companyDomainObj?.domain || '';

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
            }))
        ) || [];

    const description = promotion?.promotion?.description || '';
    const cleanDesc = cleanHtmlContent(description);
    const plainDesc = stripHtml(cleanDesc).result;
    const shortDesc = extractFirstSentences(plainDesc, 20);

    // Logic: If long description, put it at the end. Otherwise keep it at top.
    const isLongDescription = plainDesc.length > 400;

    const [firstWord, restWords] = splitHeading(promotion?.promotion?.name || 'Exclusive Promotion');

    return (
        <main className="min-h-screen bg-[#fcfdfa] pt-[65px] md:pt-[105px]">
            {/* ─── PREMIUM HEADER SECTION ─── */}
            <section className="relative pt-6 pb-20 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/3 h-[500px] bg-[#8bc94a08] rounded-bl-[160px] -z-10" />
                <div className="absolute top-60 left-0 w-1/4 h-[400px] bg-[#ff912f05] rounded-br-[160px] -z-10" />

                <div className="container mx-auto px-4">
                    {/* 1. Breadcrumbs */}
                    <nav className="mb-10" aria-label="breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3 bg-white/80 backdrop-blur-md px-5 md:px-7 py-2.5 md:py-3 rounded-full border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.12)] whitespace-nowrap">
                            {/* Home Item */}
                            <li className="inline-flex items-center">
                                <Link href="/" className="inline-flex items-center text-[13px] md:text-sm font-semibold transition-all duration-300 no-underline text-gray-500 hover:text-[#8bc94a] group">
                                    <svg className="w-4 h-4 mr-1.5 md:mr-2 text-gray-400 group-hover:text-[#8bc94a] transition-colors" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                    </svg>
                                    <span className="capitalize">Home</span>
                                </Link>
                            </li>

                            {/* Promotions Item */}
                            <li className="inline-flex items-center">
                                <svg className="w-4 h-4 text-gray-300 mx-1 md:mx-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <Link href={`/${companyData?.promotion_slug}`} className="inline-flex items-center text-[13px] md:text-sm font-semibold transition-all duration-300 no-underline text-gray-500 hover:text-[#8bc94a]">
                                    <span className="capitalize">Promotions</span>
                                </Link>
                            </li>

                            {/* Current Page Item */}
                            <li className="inline-flex items-center">
                                <svg className="w-4 h-4 text-gray-300 mx-1 md:mx-2.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-[13px] md:text-sm font-bold tracking-wider text-[#Ff912f] capitalize">
                                    {promotion?.promotion?.name}
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* 2. Hero Component */}
                    <div className="bg-white rounded-[3.5rem] p-8 lg:p-16 shadow-[0_45px_100px_rgba(139,201,74,0.08)] border border-white relative overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#8bc94a10] to-[#ff912f10] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10 flex flex-col gap-8 max-w-4xl mx-auto text-center">
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <span className="bg-[#8bc94a15] text-[#8bc94a] px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                                    Active Campaign
                                </span>
                                <span className="bg-[#ff912f10] text-[#ff912f] px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                                    <FontAwesomeIcon icon={faBolt} className="mr-2" />
                                    {allOffers.length}+ Selected Offers
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#222e48] leading-[1.05] tracking-tight">
                                {firstWord && (
                                    <span style={{ color: '#8bc94a' }}>{firstWord} </span>
                                )}
                                <span className="text-gray-800">{restWords || promotion?.promotion?.name}</span>
                            </h1>

                            {/* Top Description (if short) */}
                            {!isLongDescription && description && (
                                <div
                                    className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium mt-4 prose prose-slate max-w-none prose-p:mb-0"
                                    dangerouslySetInnerHTML={{ __html: cleanDesc }}
                                />
                            )}

                            {/* Short Intro (if long) */}
                            {isLongDescription && shortDesc && (
                                <p className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium italic opacity-80 mt-4">
                                    &quot;{shortDesc}...&quot;
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── SUB-PROMOTIONS SLIDER ─── */}
            {subPromotions && subPromotions.length > 0 && (
                <section className="pb-24 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col gap-8">
                            {/* Section Heading */}
                            <div className="flex flex-wrap items-center justify-between gap-6 border-b border-gray-100 pb-8">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-10 bg-[#ff912f] rounded-full" />
                                        <h2 className="text-3xl md:text-4xl font-black text-[#222e48]">
                                            Curated Deals by Category
                                        </h2>
                                    </div>
                                    <p className="text-gray-400 font-medium pl-5 tracking-wide">
                                        Explored specialized offers hand-picked for the {promotion?.promotion?.name} event.
                                    </p>
                                </div>
                            </div>

                            {/* Slider Component */}
                            <SubPromotionSlider
                                subPromotions={subPromotions}
                                domain={domain}
                                promotionSlug={companyData?.promotion_slug}
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* ─── MAIN OFFERS GRID ─── */}
            <section className={isLongDescription ? "pb-12" : "pb-24"}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col gap-10">
                        {/* Section Header */}
                        <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#8bc94a15] rounded-2xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faBolt} className="text-[#8bc94a] text-xl" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl md:text-3xl font-black text-[#222e48]">
                                        Verified Offers & Deals
                                    </h2>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff912f]">
                                        Today&apos;s Featured Savings
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <EventsGrid>
                            {allOffers.map((item, index) => (
                                <EventsOfferCard
                                    key={`${item.offer.unique_id}-${index}`}
                                    product={item.offer}
                                    merchantHref={getMerchantHref(
                                        item.merchant,
                                        companyData?.store_slug,
                                        companyData?.slug_type
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
                                                item.offer.category?.slug
                                            )
                                            : null
                                    }
                                />
                            ))}
                        </EventsGrid>

                        {allOffers.length === 0 && (
                            <div className="bg-white rounded-[3rem] py-24 px-10 text-center border border-dashed border-gray-200">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <FontAwesomeIcon icon={faBolt} className="text-gray-200 text-4xl" />
                                </div>
                                <h3 className="text-2xl font-black text-[#222e48] mb-4">No Active Offers Found</h3>
                                <p className="text-gray-400 max-w-sm mx-auto font-medium">
                                    We&apos;re currently refreshing our database with new deals. Please check back shortly!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ─── TOP RATED MERCHANTS SECTION ─── */}
            {promotion?.merchants && promotion.merchants.length > 0 && (
                <section className="pb-24">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col gap-10">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                                <div className="w-1.5 h-8 bg-[#8bc94a] rounded-full" />
                                <h2 className="text-2xl md:text-3xl font-black text-[#222e48]">
                                    Top Brands in {promotion?.promotion?.name}
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {promotion.merchants.slice(0, 12).map((merchant) => (
                                    <Link
                                        key={merchant.unique_id}
                                        href={getMerchantHref(merchant, companyData?.store_slug, companyData?.slug_type)}
                                        className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4"
                                    >
                                        <div className="relative w-full h-16">
                                            <Image
                                                src={getBaseImageUrl(domain, merchant.merchant_logo, '')}
                                                alt={merchant.merchant_name}
                                                fill
                                                unoptimized
                                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                sizes="120px"
                                            />
                                        </div>
                                        <span className="text-xs font-black text-[#222e48] text-center line-clamp-1 group-hover:text-[#8bc94a] transition-colors uppercase tracking-wider">
                                            {merchant.merchant_name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ─── BOTTOM DESCRIPTION SECTION ─── */}
            {isLongDescription && description && (
                <section className="pb-24">
                    <div className="container mx-auto px-4">
                        <div className="bg-white rounded-[3.5rem] p-8 lg:p-16 shadow-[0_25px_70px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col gap-10">
                            <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                                <h3 className="text-2xl md:text-3xl font-black text-[#222e48]">
                                    More About {promotion?.promotion?.name}
                                </h3>
                                <div className="w-14 h-14 bg-[#8bc94a10] rounded-2xl flex items-center justify-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-[#8bc94a] text-2xl" />
                                </div>
                            </div>
                            <div
                                className="text-base text-gray-500 leading-relaxed font-medium bg-[#fcfdfa] p-8 md:p-12 rounded-[2.5rem] border border-gray-50 prose prose-slate max-w-none"
                                dangerouslySetInnerHTML={{ __html: cleanDesc }}
                            />
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
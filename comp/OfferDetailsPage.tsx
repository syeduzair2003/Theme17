import { apiGetMerchantUniqueId } from '@/apis/merchant';
import { apiGetCategoryProducts, apiGetCategoryProductsOffer, apiGetProductDetails } from '@/apis/user';
import OfferOutUrl from '@/components/shared/OfferOutUrl';
import SpecificProductSchema from '@/components/shared/SchemaScripts/SpecificProductSchema';
import { calculateDiscountPercent, discardHTMLTags, getBaseImageUrl, getCurrencySymbol, getFinalDiscountTag, getMerchantHref, getProductDetailHref, getProductMerchantHref, getRandomRating, splitHeadingFromDetails } from '@/constants/hooks';
import { faArrowRight, faStar, FontAwesomeIcon } from '@/constants/icons';
import cookieService from '@/services/CookiesService';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import BreadcrumbSection from './BreadcrumbSection';
import EventOfferCard from './EventsOfferCard';
import RateUs from './RateUs';
import RenderRating from './RenderRating';

interface Props {
    company_id: string;
    store_slug: string;
    slug_type: string;
    product_id: string;
    current_merchant_slug: string;
    categorySlug: string;
}

const OfferDetailsPage = async ({ company_id, store_slug, slug_type, product_id, current_merchant_slug, categorySlug }: Props) => {
    const cookieData = await cookieService.get('domain');
    const companyDomain = cookieData?.domain;
    
    const [response, catRes, merRes, cat] = await Promise.all([
        apiGetProductDetails(company_id, product_id, current_merchant_slug).then(res => res.data),
        apiGetCategoryProductsOffer(company_id, current_merchant_slug, categorySlug).then(res => res.data),
        apiGetMerchantUniqueId(current_merchant_slug, company_id).then(res => res.data),
        apiGetCategoryProducts(company_id, current_merchant_slug).then(res => res.data)
    ])

    if (!response) return notFound();

    const similarCategory = catRes?.filter((item) => item.unique_id !== response?.unique_id);
    const formatCategoryName = (slug: string): string => slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || "";

    return (
        <div className="bg-[#fcfcfa] min-h-screen pb-20">
            <BreadcrumbSection
                title={response?.offer_title}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Products", href: "/products" },
                    { label: merRes?.merchant_name, href: getProductMerchantHref(response?.merchant, slug_type) },
                    { label: formatCategoryName(categorySlug), href: `/products/${response?.merchant?.slug}/${categorySlug}` },
                    { label: response?.offer_title }
                ]}
            />

            <main className="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Column - Main Offer Info */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* High-Impact Offer Card */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="p-5 md:p-8">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Product Image Wrapper */}
                                    <div className="w-full md:w-[240px] aspect-square relative bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 group shrink-0">
                                        <Image
                                            src={getBaseImageUrl(companyDomain, response?.product_image, "")}
                                            alt={response?.offer_title}
                                            fill
                                            priority
                                            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 240px"
                                        />
                                        {/* Discount Badge */}
                                        <div className="absolute top-3 right-3 h-8 w-8 bg-[#ff912f] rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                                            <span className="text-white text-[8px] font-black italic">SAVE</span>
                                        </div>
                                    </div>

                                    {/* Title and Price Info */}
                                    <div className="flex-1 min-w-0 py-2">
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-4">
                                            {discardHTMLTags(response?.offer_title)}
                                        </h1>

                                        <div className="flex flex-wrap items-center gap-4 mb-6">
                                            <div className="flex flex-col justify-center">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price Now</span>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-black text-[#8bc94a]">
                                                        {getCurrencySymbol(response?.currency)}{response?.sale_price}
                                                    </span>
                                                    {response?.original_price && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            {getCurrencySymbol(response?.currency)}{response?.original_price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-[#ff912f]/5 px-3 py-1 rounded-lg border border-[#ff912f]/10">
                                                <span className="text-[#ff912f] font-bold text-sm">
                                                    {getFinalDiscountTag(response?.offer_title, calculateDiscountPercent(response?.original_price, response?.sale_price))}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Call to Action */}
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <OfferOutUrl 
                                                domain={companyDomain} 
                                                merchantHref={getMerchantHref(response?.merchant, store_slug, slug_type)} 
                                                outUrl={response?.url} 
                                                unique_id={response?.unique_id} 
                                                customClass="inline-flex items-center justify-center gap-2 bg-[#8bc94a] hover:bg-[#ff912f] text-white px-7 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg group no-underline"
                                            >
                                                <span>Collect Deal</span>
                                                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                            </OfferOutUrl>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Offer Details Section */}
                        {response?.offer_detail && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-[#8bc94a] rounded-full"></span>
                                    Product Description
                                </h3>
                                <div 
                                    className="prose prose-sm prose-slate max-w-none text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: response?.offer_detail }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <aside className="lg:col-span-4 space-y-6">
                        
                        {/* Merchant Identity Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-16 h-16 bg-gray-50 rounded-xl p-2 flex items-center justify-center border border-gray-100 shrink-0">
                                    <Image 
                                        src={getBaseImageUrl(companyDomain, response?.merchant?.merchant_logo, "")}
                                        alt={response?.merchant?.merchant_name}
                                        width={48}
                                        height={48}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">
                                        {response?.merchant?.merchant_name}
                                    </h4>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <RenderRating rating={getRandomRating(response?.merchant?.rating)} />
                                        <span className="text-[10px] font-bold text-gray-400 ml-1">
                                            {getRandomRating(response?.merchant?.rating)}/5
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <Link 
                                href={getProductMerchantHref(response?.merchant, slug_type)}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-gray-100 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all no-underline"
                            >
                                Visit Brand Store
                                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-gray-300" />
                            </Link>
                        </div>

                        {/* Rate Us Widget */}
                        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                            <RateUs offer_id={response?.unique_id || ""} company_id={company_id} />
                        </div>

                        {/* More Categories */}
                        {cat?.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden relative">
                                {/* Decorative background decoration */}
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#8bc94a]/5 rounded-full blur-2xl"></div>
                                
                                <h4 className="text-sm font-bold text-gray-900 mb-5 relative z-10 uppercase tracking-widest border-b border-gray-50 pb-4">
                                     More Categories From {response?.merchant?.merchant_name}
                                </h4>
                                <div className="space-y-1.5 relative z-10">
                                    {cat.slice(0, 4).map((category, i) => (
                                        <Link 
                                            key={i}
                                            href={`${getProductMerchantHref(response?.merchant, slug_type)}/${category.slug}`}
                                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#8bc94a]/5 transition-colors group no-underline"
                                        >
                                            <span className="text-[13px] font-semibold text-gray-600 group-hover:text-[#8bc94a] transition-colors flex items-center gap-3">
                                                <span className="w-1 h-1 bg-gray-300 rounded-full group-hover:bg-[#8bc94a]"></span>
                                                {category.name}
                                            </span>
                                            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 text-gray-200 group-hover:text-[#8bc94a] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                                <Link 
                                    href={getProductMerchantHref(response?.merchant, slug_type)}
                                    className="mt-6 inline-flex items-center gap-2 text-[#ff912f] font-bold text-[11px] uppercase tracking-wider hover:underline no-underline relative z-10"
                                >
                                    View all
                                    <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                                </Link>
                            </div>
                        )}
                    </aside>
                </div>

                {/* Bottom Section - Related Products */}
                {similarCategory?.length > 0 && (
                    <section className="mt-16">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                    Shop More <span className="text-[#8bc94a]">{formatCategoryName(categorySlug)}</span> Options from <span className="text-[#ff912f]">{response?.merchant?.merchant_name}</span>
                                </h2>
                                <div className="w-12 h-1 bg-[#8bc94a] rounded-full mt-2"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarCategory.slice(0, 4).map((item, i) => (
                                <EventOfferCard
                                    key={i}
                                    product={item}
                                    merchantHref={getMerchantHref(merRes, store_slug, slug_type)}
                                    domain={companyDomain}
                                    merchant_name={merRes?.merchant_name}
                                    merchant_logo={merRes?.merchant_logo}
                                    productDetailUrl={getProductDetailHref(merRes, slug_type, item?.slug, item?.category?.slug)}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <SpecificProductSchema 
                company_id={company_id} 
                product_id={response?.unique_id} 
                current_merchant_slug={current_merchant_slug} 
                slug_type={slug_type} 
            />
        </div>
    );
}

export default OfferDetailsPage;

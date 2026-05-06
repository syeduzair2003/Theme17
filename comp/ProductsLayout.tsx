import { apiGetProductCategories, apiGetProductCategoryMerchant, apiGetProductSuggestedMerchant } from '@/apis/page_optimization';
import BreadcrumbSection from '@/components/Theme-11/comp/BreadcrumbSection';
import React from 'react';
import RoundedMerchant from './RoundedMerchant';
import ProductOffers from './ProductOffers';
import Link from 'next/link';
import Image from 'next/image';
import CategorySidebar from './CategorySidebar';
import { getBaseImageUrl } from '@/constants/hooks';
import cookieService from '@/services/CookiesService';

interface Props {
    page?: string;
    companyId: string;
    storeSlug: string;
    slugType: string;
    categoryId?: string;
    slug?: string[];
    categoryName?: string;
}

const ProductsLayout = async ({ page, companyId, storeSlug, slugType, categoryId, slug, categoryName }: Props) => {

    const [categories, merchants, suggestedMerchants] = await Promise.all([
        apiGetProductCategories(companyId, categoryId).then(res => res.data),
        apiGetProductCategoryMerchant(companyId, categoryId).then(res => res.data),
        apiGetProductSuggestedMerchant(companyId, categoryId).then(res => res.data),
    ]);
    const safeSlug = slug ?? [];
    const domainObj = await cookieService.get("domain");
    const companyDomain = domainObj?.domain || "";

    const cleanedSlug = safeSlug?.filter(
        (s, i) => !(s === "page" || (!isNaN(Number(s)) && safeSlug[i - 1] === "page"))
    );

    const paths: { href: string; label: string }[] = cleanedSlug?.map((segment, index) => {
        const href = `/all-products/${cleanedSlug?.slice(0, index + 1).join("/")}`;
        const label = segment.replace(/-/g, " ");
        return { href, label };
    });

    return (
        <div className="bg-[#fcfcfa] min-h-screen pb-10" style={{ background: 'linear-gradient(to bottom, #ffffff, #fdfbfa)' }}>
            <BreadcrumbSection
                title="All Products"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { href: "/all-products", label: "All Products" },
                    ...paths
                ]}
            />
            {/* Trending Merchants Section */}
            {merchants?.length > 0 && (
                <RoundedMerchant
                    merchants={merchants}
                    storeSlug={storeSlug}
                    slugType={slugType}
                />
            )}

            <section className="py-12 relative w-full bg-gradient-to-b from-gray-50/80 via-[#8bc94a08] to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                        {/* Left Sidebar Area */}
                        <div className="w-full lg:w-[30%] flex flex-col gap-10">
                            {/* ─── CATEGORY SIDEBAR ─── */}
                            {categories?.length > 0 && (
                                <CategorySidebar
                                    categories={categories}
                                    pageSlug="all-products"
                                    parentCategory={categoryName}
                                />
                            )}

                            {/* Similar Stores Card */}
                            {suggestedMerchants && suggestedMerchants.length > 0 && (
                                <div className="bg-white rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100">
                                    <h4 className="text-xl font-black text-[#222e48] mb-6 pb-4 border-b border-gray-50 flex items-center justify-between">
                                        Similar Stores
                                        <Link href="/all-stores/A" className="text-[10px] uppercase tracking-widest text-[#8bc94a] hover:opacity-70 transition-opacity">See All</Link>
                                    </h4>
                                    <div className="flex flex-col gap-3">
                                        {suggestedMerchants.slice(0, 5).map((merchant: any) => (
                                            <Link key={merchant.unique_id} href={`/${storeSlug}/${merchant.slug}`} className="group flex items-center gap-4 py-3 px-3 rounded-2xl hover:bg-[#8bc94a]/5 transition-all duration-300">
                                                <div className="w-[60px] h-[60px] bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:shadow-[0_4px_15px_rgba(139,201,74,0.1)] transition-all duration-300">
                                                    <Image
                                                        src={getBaseImageUrl(companyDomain, merchant.merchant_logo, "")}
                                                        alt={merchant.merchant_name}
                                                        width={50} height={50}
                                                        className="object-contain opacity-85 group-hover:opacity-100 transition-opacity drop-shadow-sm group-hover:scale-105 duration-300"
                                                    />
                                                </div>
                                                <div className="flex flex-col w-[calc(100%-75px)]">
                                                    <span className="text-sm font-bold text-[#222e48] group-hover:text-[#8bc94a] transition-colors line-clamp-1 truncate block">{merchant.merchant_name}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{merchant?.offer_count || "New"} Offers</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Content Area: Product Offers */}
                        <div className="w-full lg:w-[70%]">
                            <ProductOffers
                                category_id={categoryId}
                                page={page}
                                company_id={companyId}
                                mer_slug={storeSlug}
                                mer_slug_type={slugType}
                                slug={slug}
                            />
                        </div>


                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductsLayout;
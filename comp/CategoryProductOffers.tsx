import { apiGetMerchantUniqueId } from '@/apis/merchant';
import { apiGetCategoryProductsOffer } from '@/apis/user';
import cookieService from '@/services/CookiesService';
import React from 'react'
import BreadcrumbSection from './BreadcrumbSection';
import { getMerchantHref, getProductDetailHref, splitHeading } from '@/constants/hooks';
import EventsOfferCard, { EventsGrid } from './EventsOfferCard';

interface Props {
    slug: string;        // merchant slug e.g. "amazon.com"
    companyId: string;
    storeSlug: string;
    slugType: string;
    category: string;    // category slug e.g. "healthcare"
}

const CategoryProductOffers = async ({ slug, companyId, storeSlug, slugType, category }: Props) => {
    const companyDomain = await cookieService.get("domain");

    const [products, merRes] = await Promise.all([
        apiGetCategoryProductsOffer(companyId, slug, category).then(res => res.data),
        apiGetMerchantUniqueId(slug, companyId).then(res => res.data),
    ]);
    const formatCategoryName = (slug: string): string => slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const heading = `Trending Deals at ${merRes?.merchant_name}`;
    const [firstWord, restWords] = splitHeading(heading);

    return (
        <>
            <BreadcrumbSection
                title={formatCategoryName(category)}
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: merRes?.merchant_name, href: `/products/${slug}` },
                    { label: formatCategoryName(category), href: `/products/${slug}/${category}` },
                ]}
            />

            <div className="max-w-[1320px] mx-auto px-4 mt-8">
                <div className="flex flex-col mb-8 relative">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-1 h-5 rounded-full bg-[#8bc94a]" aria-hidden="true" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff912f]">
                            Special Offers
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                        {firstWord && <span className="text-[#8bc94a]">{firstWord} </span>}
                        <span className="text-gray-800">{restWords || heading}</span>
                    </h2>
                </div>
            </div>

            <EventsGrid>
                {products?.length > 0 && products?.map((product, item) => (
                    <EventsOfferCard
                        key={item}
                        product={product}
                        merchantHref={getMerchantHref(merRes, storeSlug, slugType)}
                        productDetailUrl={getProductDetailHref(merRes, slugType, product?.slug, product?.category?.slug)}
                        domain={companyDomain?.domain}
                        merchant_name={merRes?.merchant_name}
                        merchant_logo={merRes?.merchant_logo}
                    />
                ))}
            </EventsGrid>
        </>
    )
}

export default CategoryProductOffers
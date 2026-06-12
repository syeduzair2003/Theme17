import { apiGetMerchantUniqueId } from "@/apis/merchant";
import { apiGetCategoryProductsOffer } from "@/apis/user";
import cookieService from "@/services/CookiesService";
import React from "react";
import BreadcrumbSection from "./BreadcrumbSection";
import {
  getMerchantHref,
  getProductDetailHref,
  splitHeading,
} from "@/constants/hooks";
import EventsOfferCard, { EventsGrid } from "./EventsOfferCard";

interface Props {
  slug: string;
  companyId: string;
  storeSlug: string;
  slugType: string;
  category: string;
}

const CategoryProductOffers = async ({
  slug,
  companyId,
  storeSlug,
  slugType,
  category,
}: Props) => {
  const companyDomain = await cookieService.get("domain");

  const [products, merRes] = await Promise.all([
    apiGetCategoryProductsOffer(companyId, slug, category).then(
      (res) => res.data,
    ),
    apiGetMerchantUniqueId(slug, companyId).then((res) => res.data),
  ]);
  const formatCategoryName = (slug: string): string =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const heading = `Trending Deals at ${merRes?.merchant_name}`;
  const [firstWord, restWords] = splitHeading(heading);

  return (
    <>
      <BreadcrumbSection
        title={formatCategoryName(category)}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: merRes?.merchant_name, href: `/products/${slug}` },
          {
            label: formatCategoryName(category),
            href: `/products/${slug}/${category}`,
          },
        ]}
      />

      <div className="max-w-[1320px] mx-auto px-4 mt-8">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#111318]">
              Special <span className="text-[#ff912f]">Offers</span>
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-[#111318] tracking-tight mb-4">
            {firstWord && <span className="text-[#ff912f]">{firstWord} </span>}
            {restWords || heading}
          </h2>

          <div className="flex items-center gap-2">
            <div className="h-[2px] w-8 bg-[#ff912f] rounded-full" />
            <div className="h-[4px] w-4 bg-[#111318] rounded-full" />
            <div className="h-[2px] w-8 bg-[#ff912f] rounded-full" />
          </div>
        </div>
      </div>

      <EventsGrid>
        {products?.length > 0 &&
          products?.map((product, item) => (
            <EventsOfferCard
              key={item}
              product={product}
              merchantHref={getMerchantHref(merRes, storeSlug, slugType)}
              productDetailUrl={getProductDetailHref(
                merRes,
                slugType,
                product?.slug,
                product?.category?.slug,
              )}
              domain={companyDomain?.domain}
              merchant_name={merRes?.merchant_name}
              merchant_logo={merRes?.merchant_logo}
            />
          ))}
      </EventsGrid>
    </>
  );
};

export default CategoryProductOffers;

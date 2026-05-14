import { apiGetMerchantUniqueId } from "@/apis/merchant";
import { apiGetCategoryProducts, apiGetMerchantProducts } from "@/apis/user";
import cookieService from "@/services/CookiesService";
import React from "react";
import BreadcrumbSection from "./BreadcrumbSection";
import MerchantCategorySlider from "./MerchantCategorySlider";
import EventsOfferCard, { EventsGrid } from "./EventsOfferCard";
import {
  getMerchantHref,
  getProductDetailHref,
  splitHeading,
} from "@/constants/hooks";

interface Props {
  slug: string;
  companyId: string;
  storeSlug: string;
  slugType: string;
}

const MerchantProductsPage = async ({
  slug,
  companyId,
  storeSlug,
  slugType,
}: Props) => {
  const companyDomain = await cookieService.get("domain");
  const [products, merRes, cat] = await Promise.all([
    apiGetMerchantProducts(companyId, slug).then((res) => res.data),
    apiGetMerchantUniqueId(slug, companyId).then((res) => res.data),
    apiGetCategoryProducts(companyId, slug).then((res) => res.data),
  ]);

  const heading = `Trending Deals at ${merRes?.merchant_name}`;
  const [firstWord, restWords] = splitHeading(heading);

  return (
    <div className="bg-[#ffffff] min-h-screen pb-20">
      {/* ─── BREADCRUMB ─── */}
      <BreadcrumbSection
        title={merRes?.merchant_name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: slug, href: `/products/${slug}` },
        ]}
      />

      {/* ─── CATEGORY NAVIGATION (Seamless Top Bar) ─── */}
      {cat?.length > 0 && (
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <MerchantCategorySlider
            categories={cat}
            merchantName={merRes?.merchant_name}
            slug={slug}
          />
        </div>
      )}

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 mt-16">
        {/* ─── MINIMALIST SECTION HEADER ─── */}
        <div className="flex flex-col items-center text-center mb-16">
          {/* Subtle Badge */}
          <div className="px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#111318]">
              Verified <span className="text-[#ff912f]">Inventory</span>
            </span>
          </div>

          {/* Clean Centered Heading */}
          <h2 className="text-4xl md:text-5xl font-black text-[#111318] tracking-tight mb-4">
            {firstWord && <span className="text-[#ff912f]">{firstWord} </span>}
            {restWords || heading}
          </h2>

          {/* Sophisticated Accent Line */}
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-8 bg-[#ff912f] rounded-full" />
            <div className="h-[4px] w-4 bg-[#111318] rounded-full" />
            <div className="h-[2px] w-8 bg-[#ff912f] rounded-full" />
          </div>

          <p className="mt-6 text-gray-500 font-medium text-sm md:text-base max-w-lg">
            Explore the latest premium offers and exclusive discounts from{" "}
            {merRes?.merchant_name} curated just for you.
          </p>
        </div>

        {/* ─── PRODUCTS GRID AREA ─── */}
        <div className="relative">
          {products?.length > 0 ? (
            <EventsGrid>
              {products.map((product: any, item: number) => (
                <div key={item} className="h-full">
                  <EventsOfferCard
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
                </div>
              ))}
            </EventsGrid>
          ) : (
            /* Clean Minimalist Empty State */
            <div className="py-24 text-center bg-[#fcfcfc] rounded-[3rem] border border-gray-100">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-50">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-bold text-[#111318]">
                No active offers available
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Please check back in a few hours for updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantProductsPage;

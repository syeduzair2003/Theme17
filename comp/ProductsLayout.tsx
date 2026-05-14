import {
  apiGetProductCategories,
  apiGetProductCategoryMerchant,
  apiGetProductSuggestedMerchant,
} from "@/apis/page_optimization";
import BreadcrumbSection from "@/components/Theme-17/comp/BreadcrumbSection";
import React from "react";
import RoundedMerchant from "./RoundedMerchant";
import ProductOffers from "./ProductOffers";
import Link from "next/link";
import Image from "next/image";
import CategorySidebar from "./CategorySidebar";
import { getBaseImageUrl } from "@/constants/hooks";
import cookieService from "@/services/CookiesService";

interface Props {
  page?: string;
  companyId: string;
  storeSlug: string;
  slugType: string;
  categoryId?: string;
  slug?: string[];
  categoryName?: string;
}

const ProductsLayout = async ({
  page,
  companyId,
  storeSlug,
  slugType,
  categoryId,
  slug,
  categoryName,
}: Props) => {
  const [categories, merchants, suggestedMerchants] = await Promise.all([
    apiGetProductCategories(companyId, categoryId).then((res) => res.data),
    apiGetProductCategoryMerchant(companyId, categoryId).then(
      (res) => res.data,
    ),
    apiGetProductSuggestedMerchant(companyId, categoryId).then(
      (res) => res.data,
    ),
  ]);
  const safeSlug = slug ?? [];
  const domainObj = await cookieService.get("domain");
  const companyDomain = domainObj?.domain || "";

  const cleanedSlug = safeSlug?.filter(
    (s, i) =>
      !(s === "page" || (!isNaN(Number(s)) && safeSlug[i - 1] === "page")),
  );

  const paths: { href: string; label: string }[] = cleanedSlug?.map(
    (segment, index) => {
      const href = `/all-products/${cleanedSlug?.slice(0, index + 1).join("/")}`;
      const label = segment.replace(/-/g, " ");
      return { href, label };
    },
  );

  return (
    <div
      className="bg-[#fcfcfa] min-h-screen pb-10"
      style={{ background: "linear-gradient(to bottom, #ffffff, #fdfbfa)" }}
    >
      <BreadcrumbSection
        title="All Products"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { href: "/all-products", label: "All Products" },
          ...paths,
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

      <section className="py-12 relative w-full bg-gradient-to-b from-gray-50/80 via-[#ff912f]/[0.02] to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Left Sidebar Area */}
            <div className="w-full lg:w-[30%] flex flex-col gap-10">
              {/* CATEGORY SIDEBAR */}
              {categories?.length > 0 && (
                <CategorySidebar
                  categories={categories}
                  pageSlug="all-products"
                  parentCategory={categoryName}
                />
              )}

              {suggestedMerchants && suggestedMerchants.length > 0 && (
                <div className="bg-white rounded-[2rem] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#ff912f]/[0.03] rounded-full blur-2xl" />

                  <h4 className="text-lg font-black text-[#111318] mb-6 pb-4 border-b border-gray-50 flex items-center justify-between relative z-10">
                    Similar Stores
                    <Link
                      href="/all-stores/A"
                      className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff912f] hover:translate-x-1 transition-transform inline-flex items-center"
                    >
                      See All
                    </Link>
                  </h4>

                  <div className="flex flex-col gap-4 relative z-10">
                    {suggestedMerchants.slice(0, 5).map((merchant: any) => (
                      <Link
                        key={merchant.unique_id}
                        href={`/${storeSlug}/${merchant.slug}`}
                        className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-[#111318]/[0.02] transition-all duration-300"
                      >
                        <div className="w-[64px] h-[64px] bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:shadow-[0_8px_20px_rgba(255,145,47,0.12)] group-hover:border-[#ff912f]/20 transition-all duration-300 relative overflow-hidden">
                          <Image
                            src={getBaseImageUrl(
                              companyDomain,
                              merchant.merchant_logo,
                              "",
                            )}
                            alt={merchant.merchant_name}
                            width={50}
                            height={50}
                            className="object-contain filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all drop-shadow-sm group-hover:scale-110 duration-500"
                          />
                        </div>
                        <div className="flex flex-col w-[calc(100%-80px)]">
                          <span className="text-sm font-bold text-[#111318] group-hover:text-[#ff912f] transition-colors line-clamp-1 truncate block tracking-tight">
                            {merchant.merchant_name}
                          </span>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#ff912f]" />
                            {merchant?.offer_count || "New"} Active Offers
                          </span>
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
  );
};

export default ProductsLayout;

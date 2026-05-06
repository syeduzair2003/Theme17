import { apiGetMultiProductOffers } from "@/apis/user";
import {
  getBaseImageUrl,
  getMerchantHref,
  getProductDetailHref,
  splitHeading,
} from "@/constants/hooks";
import { HomeMultiProductData, OffersOffer } from "@/services/dataTypes";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import cookieService from "@/services/CookiesService";
import TrendingProductsSlider from "./TrendingProductsSlider";
import TrendingProductsCard from "./TrendingProductsCard";

interface Props {
  companyId: string;
  mer_slug_type: string;
  mer_slug: string;
}

const TrendingProducts = async ({
  companyId,
  mer_slug_type,
  mer_slug,
}: Props) => {
  const count = 8;
  const responseData = (await apiGetMultiProductOffers(companyId)).data;
  const companyDomain = await cookieService.get("domain");

  const renderSection = (sectionData: HomeMultiProductData) => {
    if (!sectionData?.offers?.length) {
      return null;
    }

    const [headingFirst, headingSecond] = splitHeading(
      sectionData?.home_page_widget?.widget_heading,
    );

    return (
      <div
        className="mb-12 last:mb-0 w-full relative"
        key={sectionData?.merchant?.unique_id}
      >
        {/* ── Compact Header Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Merchant Logo - Themed to #14110e */}
            {sectionData?.merchant?.merchant_logo && (
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-[#14110e] rounded-xl p-2.5 border border-white/5 shadow-md relative overflow-hidden group/logo ring-1 ring-orange-500/10">
                <div className="absolute inset-0 bg-orange-500/5 group-hover/logo:bg-orange-500/10 transition-colors duration-500" />
                <Image
                  src={getBaseImageUrl(
                    companyDomain.domain,
                    sectionData.merchant.merchant_logo,
                    "",
                  )}
                  alt="Merchant Logo"
                  fill
                  className="object-contain p-2.5 transition-all duration-700 group-hover/logo:scale-110"
                />
              </div>
            )}

            <div className="flex flex-col">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-500/80">
                  Verified Merchant
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-lg sm:text-xl md:text-2xl font-[900] text-white leading-tight m-0 tracking-tight uppercase italic">
                {headingFirst && (
                  <span className="text-orange-500">{headingFirst} </span>
                )}
                <span className="text-zinc-100">
                  {headingSecond || "Collection"}
                </span>
              </h2>

              {/* SubText */}
              {sectionData?.home_page_widget?.widget_text && (
                <p className="mt-0.5 text-[12px] text-zinc-500 leading-snug m-0 max-w-sm font-medium line-clamp-1">
                  {sectionData.home_page_widget.widget_text}
                </p>
              )}
            </div>
          </div>

          {/* View All Button */}
          <div className="shrink-0">
            <Link
              href={getMerchantHref(
                sectionData?.merchant,
                mer_slug,
                mer_slug_type,
              )}
              className="group relative inline-flex items-center justify-center gap-2 text-[10px] font-black no-underline px-5 py-2.5 rounded-lg border border-white/5 text-zinc-300 bg-[#14110e] transition-all duration-300 hover:bg-orange-600 hover:text-white hover:border-orange-500 shadow-sm overflow-hidden"
            >
              <span className="relative z-10 uppercase tracking-widest">
                Explore All
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3 relative z-10 group-hover:translate-x-1 transition-transform"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ── Subtle Divider ── */}
        <div
          className="w-full h-px mb-8 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          aria-hidden="true"
        />

        {/* ── Slider Container ── */}
        <div className="w-full relative">
          <TrendingProductsSlider>
            {sectionData.offers.slice(0, count).map((item, i) => (
              <TrendingProductsCard
                key={i}
                item={item}
                merchantHref={getMerchantHref(
                  sectionData?.merchant,
                  mer_slug,
                  mer_slug_type,
                )}
                merchant_logo={
                  item?.merchant?.merchant_logo ||
                  sectionData?.merchant?.merchant_logo
                }
                productDetailUrl={
                  item?.offer?.slug
                    ? getProductDetailHref(
                        sectionData?.merchant,
                        mer_slug_type,
                        item?.offer?.slug,
                      )
                    : null
                }
              />
            ))}
          </TrendingProductsSlider>
        </div>
      </div>
    );
  };

  if (!responseData?.first && !responseData?.second) return null;

  return (
    <section className="relative py-12 md:py-20 bg-[#1a1612] overflow-hidden">
      {/* ── Subtle Orange Glow ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-orange-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-orange-800/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="w-full max-w-[1280px] mx-auto">
          {responseData?.first && renderSection(responseData?.first)}

          {/* Spacer */}
          {responseData?.first && responseData?.second && (
            <div className="h-16" />
          )}

          {responseData?.second && renderSection(responseData?.second)}
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
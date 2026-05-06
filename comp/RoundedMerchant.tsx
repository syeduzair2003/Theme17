import React from "react";
import cookieService from "@/services/CookiesService";
import RoundedMerchantSlider from "./RoundedMerchantSlider";

interface Props {
  merchants: any[];
  storeSlug: string;
  slugType: string;
}

const RoundedMerchant = async ({ merchants, storeSlug, slugType }: Props) => {
  const companyDomainObj = await cookieService.get("domain");
  const companyDomain = companyDomainObj?.domain || "";

  if (!merchants || merchants.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-[#fcfcfc] relative w-full overflow-hidden">
      <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-[#FF5F1F]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* ── Header Section ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative">
          <div className="flex-1">
            {/* Badge Text */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5F1F]/5 border border-[#FF5F1F]/10 mb-4 transition-all duration-300 hover:bg-[#FF5F1F]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#FF5F1F]">
                Top Rated Stores
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-black text-[#1a1612] leading-[1.1] tracking-tighter m-0">
              Trending{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5F1F] to-[#ff912f]">
                Merchants
              </span>
              <span className="text-[#FF5F1F]">.</span>
            </h2>

            {/* Subtext */}
            <p className="mt-4 text-[14px] text-gray-400 max-w-xl leading-relaxed font-medium">
              Curated selection of premium retailers delivering exceptional
              value and verified savings across our global network.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="h-px w-32 bg-gradient-to-r from-[#FF5F1F]/30 to-transparent mb-2"></div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300">
              Global Partners
            </span>
          </div>
        </div>

        {/* ── Slider Component ── */}
        <div className="relative group">
          {/* Floating slider */}
          <div className="absolute inset-0 bg-[#FF5F1F]/[0.01] rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="relative z-10">
            <RoundedMerchantSlider
              merchants={merchants}
              companyDomain={companyDomain}
              mer_slug={storeSlug}
              mer_slug_type={slugType}
            />
          </div>
        </div>

        {/* ── Elegant Divider ── */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          <div className="w-2 h-2 rounded-full border-2 border-[#FF5F1F]/20"></div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default RoundedMerchant;

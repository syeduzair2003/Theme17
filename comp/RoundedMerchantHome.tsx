import { apiGetTopCashbackMerchants } from "@/apis/page_optimization";
import cookieService from "@/services/CookiesService";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  splitHeading,
  getBaseImageUrl,
  getMerchantHref,
} from "@/constants/hooks";
import { ArrowRight, Sparkles } from "lucide-react";

interface Props {
  companyId: string;
  mer_slug: string;
  mer_slug_type: string;
}

const RoundedMerchantHome = async ({
  companyId,
  mer_slug,
  mer_slug_type,
}: Props) => {
  const companyDomainObj = await cookieService.get("domain");
  const companyDomain = companyDomainObj?.domain || "";

  const merchants = await apiGetTopCashbackMerchants(companyId);

  const heading =
    merchants?.data?.cashback_merchants_widget?.widget_heading ||
    "Cash Back At Stores";
  const subText = merchants?.data?.cashback_merchants_widget?.widget_text;
  const [firstWord, restWords] = splitHeading(heading);

  const merchantList = merchants.data?.merchants || [];

  if (merchantList?.length > 0) {
    return (
      <section
        aria-label="Cashback Merchants Section"
        className="relative w-full py-16 md:py-20 bg-[#1a1612] overflow-hidden"
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-carousel {
                        display: flex;
                        width: max-content;
                        animation: scroll 40s linear infinite;
                    }
                    .animate-carousel:hover {
                        animation-play-state: paused;
                    }
                `,
          }}
        />

        <div className="container relative z-10 mx-auto px-4">
          {/* ── Header Section ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FF5722]/10 border border-[#FF5722]/20 rounded-full text-[9px] font-bold text-[#FF5722] uppercase tracking-[0.2em]">
                  <Sparkles size={10} className="fill-[#FF5722]" />
                  Top Offers
                </div>
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight m-0 uppercase italic leading-tight">
                {firstWord && (
                  <span className="text-[#FF5722]">{firstWord} </span>
                )}
                <span className="text-white">{restWords || heading}</span>
              </h2>

              {subText && (
                <p className="mt-3 text-[13px] text-gray-400 font-medium max-w-xl italic border-l border-[#FF5722]/30 pl-3">
                  {subText}
                </p>
              )}
            </div>

            <div className="shrink-0">
              <Link
                href={`/${mer_slug}`}
                className="group relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-6 py-3 rounded-full bg-[#FF5722] text-white hover:bg-white hover:text-[#1a1612] transition-all duration-300 shadow-lg"
              >
                <span className="relative z-10">View All Stores</span>
                <ArrowRight
                  size={14}
                  className="relative z-10 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* ── Store Carousel ── */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#1a1612] to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#1a1612] to-transparent z-20 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="animate-carousel gap-10 md:gap-14 py-8">
                {[...merchantList, ...merchantList, ...merchantList].map(
                  (merchant, i) => {
                    const merchantName = merchant.merchant_name;
                    const merchantLogo = merchant.merchant_logo;
                    const href = getMerchantHref(
                      merchant,
                      mer_slug,
                      mer_slug_type,
                    );

                    return (
                      <Link
                        key={i}
                        href={href}
                        className="flex flex-col items-center w-28 sm:w-32 group/card no-underline"
                      >
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-5 group-hover/card:-translate-y-2 transition-transform duration-300">
                          <div className="absolute inset-0 rounded-full bg-[#FF5722]/15 blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity" />

                          <div className="relative w-full h-full rounded-tr-[1.5rem] rounded-bl-[1.5rem] border border-white/10 bg-[#241f1a] flex items-center justify-center p-5 group-hover/card:border-[#FF5722]/50 transition-all shadow-2xl">
                            {merchantLogo ? (
                              <Image
                                src={getBaseImageUrl(
                                  companyDomain,
                                  merchantLogo,
                                  "",
                                )}
                                alt={merchantName}
                                fill
                                className="object-contain p-5 sm:p-6 brightness-110 group-hover/card:scale-110 transition-all duration-500"
                                unoptimized
                              />
                            ) : (
                              <div className="text-[#FF5722] font-black text-2xl uppercase">
                                {merchantName?.[0]}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-500 font-bold text-[9px] uppercase tracking-widest text-center group-hover/card:text-[#FF5722] transition-colors line-clamp-1">
                          {merchantName}
                        </span>
                      </Link>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return null;
};

export default RoundedMerchantHome;

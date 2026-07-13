import { apiGetAllPromotion } from "@/apis/user";
import { getPromotionHref } from "@/constants/hooks";
import cookieService from "@/services/CookiesService";
import { Promotion } from "@/services/dataTypes";
import Link from "next/link";
import React from "react";
import BreadcrumbSection from "./BreadcrumbSection";

const PromotionsPage = async ({ promotionSlug }: { promotionSlug: string }) => {
  const companyDomain = (await cookieService.get("domain")).domain;
  const promotions = (await apiGetAllPromotion(companyDomain)).data;

  return (
    <div className="bg-[#fafafa] min-h-screen text-slate-800 selection:bg-orange-500/20">
      <BreadcrumbSection
        title={"Trending Promotions"}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Promotions", href: "/promotions" },
        ]}
      />

      <section className="py-12 md:py-20 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/[0.02] rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/[0.02] rounded-full blur-[100px] -z-10"></div>

        <div className="container mx-auto max-w-6xl">
          {/* Header Area */}
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-slate-800">
              Exclusive <span className="text-orange-500">Deals</span>
            </h2>
            <div className="h-[2px] w-12 bg-orange-600 mx-auto rounded-full"></div>
            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
              Verified Premium Offers
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 justify-items-center">
            {promotions?.length > 0 ? (
              promotions.map((promotion: Promotion, index: number) => (
                <Link
                  key={index}
                  href={getPromotionHref(promotion, promotionSlug)}
                  className="group relative w-full flex justify-center"
                >
                  {/* Card Layout */}
                  <div className="relative w-full max-w-[270px] h-[350px] bg-white border border-slate-200 rounded-[2rem] p-7 flex flex-col items-center justify-between text-center transition-all duration-500 hover:border-orange-500/60 hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] shadow-sm overflow-hidden">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="text-black/[0.04] font-black text-4xl absolute top-4 left-6 select-none group-hover:text-orange-500/10 transition-colors duration-500">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>

                    <div className="mt-8 relative z-10">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mb-5 mx-auto transform group-hover:scale-110 group-hover:bg-orange-500/[0.08] group-hover:border-orange-500/30 transition-all duration-500">
                        <svg
                          className="w-6 h-6 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                          />
                        </svg>
                      </div>

                      <h3 className="text-lg md:text-xl font-black text-slate-800 leading-tight uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors duration-300 px-2">
                        {promotion?.name}
                      </h3>
                    </div>

                    {/* Action Button */}
                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all duration-500 text-[10px] font-black uppercase tracking-widest">
                        <span>View Offers</span>
                        <svg
                          className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-500"></div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                <h3 className="text-xl font-black text-slate-400 uppercase italic tracking-widest">
                  No active events
                </h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PromotionsPage;

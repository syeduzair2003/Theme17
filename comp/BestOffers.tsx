import { apiGetPopularDeals } from "@/apis/page_optimization";
import { discardHTMLTags, splitHeading } from "@/constants/hooks";
import { OffersOffer } from "@/services/dataTypes";
import React from "react";
import OfferCard from "./offerCard";
import { Sparkles, ArrowRight } from "lucide-react";

interface Props {
  companyId: string;
  mer_slug_type: string;
  mer_slug: string;
}

const BestOffers = async ({ companyId, mer_slug_type, mer_slug }: Props) => {
  const response = await apiGetPopularDeals(companyId);
  const bestOffers = response.data;
  const heading =
    response?.data?.popular_deals_widget?.widget_heading || "Best Offers";
  const subText =
    discardHTMLTags(response?.data?.popular_deals_widget?.widget_text) ||
    "Handpicked deals and exclusive coupons just for you";
  const [firstWord, restWords] = splitHeading(heading);

  const count = 8;
  const offersList = bestOffers?.offers || [];

  if (offersList.length === 0) return null;

  return (
    <section
      aria-label="Best Offers Section"
      className="relative w-full py-12 md:py-16 bg-[#F9F9F9] border-y border-black/[0.03] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <Sparkles size={120} className="text-black" />
      </div>

      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[1px] bg-[#FF5F1F]" />
              <span className="text-[9px] font-black text-[#FF5F1F] uppercase tracking-[0.3em]">
                Top Trending
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-black text-[#0D0D0D] tracking-tighter m-0 uppercase leading-none">
              {firstWord && (
                <span className="text-[#FF5F1F]">{firstWord} </span>
              )}
              <span className="text-slate-800">{restWords || heading}</span>
            </h2>

            {subText && (
              <p className="mt-3 text-[10px] text-gray-500 text-lg leading-relaxed max-w-4xl font-medium">
                {subText}
              </p>
            )}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5 items-stretch">
          {offersList.slice(0, count).map((offer: OffersOffer, i: number) => (
            <div
              key={i}
              className="flex h-full w-full transition-transform duration-300 hover:-translate-y-1"
            >
              <OfferCard
                offer={offer}
                mer_slug_type={mer_slug_type}
                mer_slug={mer_slug}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section Line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-black/[0.05]" />
    </section>
  );
};

export default BestOffers;

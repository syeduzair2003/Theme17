import React from 'react';
import Link from 'next/link';
import { apiGetPopularOffers } from '@/apis/page_optimization';
import { splitHeading } from '@/constants/hooks';
import cookieService from '@/services/CookiesService';
import CouponCard from './CouponCard';

interface Props {
  companyId: string;
  mer_slug_type: string;
  mer_slug: string;
}

const PopularCoupons = async ({ companyId, mer_slug_type, mer_slug }: Props) => {
  // ── Logic (Preserved 100%) ──
  const response = await apiGetPopularOffers(companyId);
  const domainData = await cookieService.get("domain");
  const domain = domainData?.domain || "";
  
  const widget = response?.data?.popular_offer_widget;
  const couponData = response?.data?.offers;

  if (!couponData || couponData.length === 0) return null;

  const heading = widget?.widget_heading ?? 'Popular Coupons & Deals';
  const subText = widget?.widget_text ?? 'Hand-picked best offers and exclusive discounts for you';
  const [firstWord, restWords] = splitHeading(heading);

  return (
    <section
      aria-label="Popular Coupons Section"
      className="relative w-full overflow-hidden py-12 md:py-16 bg-[#020617]"
    >
      {/* ── Theme Background Glow ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* ── Header Section (Styled from image_f18518.png) ── */}
        <div className="mb-10">
          {/* Badge and Decorative Line Row */}
          <div className="flex items-center gap-4 mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-sm">
              <svg className="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                Today's Best Picks
              </span>
            </div>
            {/* Horizontal Line from Reference Image */}
            <div className="h-[1px] w-20 md:w-32 bg-gradient-to-r from-slate-700 to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-4xl">
              {/* Heading (Size reduced & Italic Heavy style) */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-[900] leading-tight m-0 tracking-tighter uppercase ">
                <span className="text-[#5c72ff]">{firstWord} </span>
                <span className="text-white/95">{restWords || heading}</span>
              </h2>
              
              {subText && (
                <p className="mt-3 text-slate-400 text-sm md:text-base font-medium max-w-xl m-0 leading-relaxed">
                  {subText}
                </p>
              )}
            </div>

            {/* Explore All Button (With Hover BG Fill) */}
            <div className="shrink-0">
              <Link
                href="/all-stores/A"
                className="group inline-flex items-center gap-2 text-[12px] font-bold no-underline px-6 py-3 rounded-xl border border-indigo-500/50 text-white bg-transparent hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300 backdrop-blur-md shadow-xl"
              >
                Explore All Offers
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all"
                >
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        

        {/* ── Coupon Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {couponData.slice(0, 6).map((offer, index) => (
            <div key={index} className="flex justify-center w-full">
              <CouponCard 
                offer={offer}
                mer_slug={mer_slug}
                mer_slug_type={mer_slug_type}
                domain={domain}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCoupons;
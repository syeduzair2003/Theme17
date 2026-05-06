import React from 'react';
import Link from 'next/link';
import { apiGetTopMerchants } from '@/apis/page_optimization';
import { splitHeading } from '@/constants/hooks';
import TopMerchants from './TopMerchants';
import { ArrowRight, Zap } from 'lucide-react';

interface Props {
  companyId: string;
  mer_slug: string;
  mer_slug_type: string;
}

const MerchantsCarousel = async ({ companyId, mer_slug, mer_slug_type }: Props) => {
  const merchants = await apiGetTopMerchants(companyId);

  const widget = merchants?.data?.top_merchants_widget;
  const merchantList = merchants?.data?.merchants;

  if (!merchantList || merchantList.length === 0) return null;

  const heading = widget?.widget_heading ?? 'Verified Stores & Brands';
  const subText = widget?.widget_text ?? 'Curated coupon codes from your favourite retailers';
  const [firstWord, restWords] = splitHeading(heading);

  return (
    <section
      aria-label="Top Merchants Section"
      className="relative w-full py-12 md:py-16 bg-[#F9F9F9] border-y border-black/[0.03]"
    >
      <div className="container relative z-10 mx-auto px-4 lg:px-6">
        
        {/* ── Compact Header Row ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          
          <div className="max-w-xl">
            {/* Minimal Eyebrow */}
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} className="text-[#FF5F1F] fill-[#FF5F1F]" />
              <span className="text-[9px] font-bold text-[#FF5F1F] uppercase tracking-[0.2em]">
                Partner Network
              </span>
            </div>

            {/* Compact Heading */}
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight m-0 uppercase leading-tight">
              {firstWord && (
                <span className="text-[#FF5F1F]">{firstWord} </span>
              )}
              <span className="text-slate-800">{restWords || heading}</span>
            </h2>

            {/* Tight Sub-text */}
            {subText && (
              <p className="mt-2 text-[10px] text-gray-500 text-lg leading-relaxed max-w-3xl font-medium">
                {subText}
              </p>
            )}
          </div>

          {/* Compact Action Button */}
          <div className="shrink-0">
            <Link
              href="/all-stores/A"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg border border-black/5 text-white bg-[#0D0D0D] hover:bg-[#FF5F1F] transition-all duration-300 group"
            >
              <span>View All</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="relative">
          <TopMerchants
            merchantData={merchantList}
            mer_slug={mer_slug}
            mer_slug_type={mer_slug_type}
          />
        </div>

      </div>
    </section>
  );
};

export default MerchantsCarousel;
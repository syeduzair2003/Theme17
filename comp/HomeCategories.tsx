import { apiGetTopCategories } from '@/apis/page_optimization';
import { splitHeading } from '@/constants/hooks';
import React from 'react';
import Link from 'next/link';
import { faArrowRight, FontAwesomeIcon } from '@/constants/icons';
import cookieService from '@/services/CookiesService';

// Naya component yahan import karlo (path adjust karlena agar zaroorat ho)
import Category3DSlider from './Category3DSlider'; 

interface Props {
    companyId: string;
    slug_type: string;
    cat_slug: string;
}

const HomeCategories = async ({ companyId, cat_slug, slug_type }: Props) => {
    const response = await apiGetTopCategories(companyId);
    const topCategoriesResponse = response.data;
    const companyDomain = (await cookieService.get('domain')).domain;

    const heading = response?.data?.top_category_widget?.widget_heading || 'Top Categories';
    const subText = response?.data?.top_category_widget?.widget_text;
    const [firstWord, restWords] = splitHeading(heading);

    if (topCategoriesResponse?.categories?.length > 0) {
        return (
            <section
                aria-label="Categories Section"
                className="relative w-full py-12 md:py-16 lg:py-20 overflow-hidden bg-[#fafafa]"
            >
                {/* ── Subtle Light Background Elements ── */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#FF5722]/5 blur-[100px] rounded-full" />
                    <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-black/5 blur-[100px] rounded-full" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* ── Optimized Section Header ── */}
<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
    <div className="flex-1 min-w-0">
        {/* Orange Eyebrow - Slimmer version */}
        <div className="flex items-center gap-2 mb-2.5">
            <span className="w-8 h-[1.5px] rounded-full bg-[#FF5722]" aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FF5722]">
                Browse by niche
            </span>
        </div>

        {/* Heading - Reduced Size & Tighter Tracking */}
        <h2 className="text-2xl md:text-3xl font-[900] text-white tracking-tight leading-[1.1] m-0">
            {firstWord && (
                <span className="text-[#FF5722] mr-2 uppercase italic">{firstWord}</span>
            )}
            <span className="text-slate-800 uppercase">{restWords || heading}</span>
        </h2>

        {/* Sub-text - Balanced spacing */}
        {subText && (
            <p className="mt-3 text-[10px] text-gray-500 text-lg leading-relaxed max-w-3xl font-medium">
                {subText}
            </p>
        )}
    </div>

    {/* View All Button - More Compact & Elegant */}
    <div className="shrink-0">
            <Link
              href={`/${cat_slug}`}
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg border border-black/5 text-white bg-[#0D0D0D] hover:bg-[#FF5F1F] transition-all duration-300 group"
            >
              <span>View All</span>
              <FontAwesomeIcon icon={faArrowRight} size="lg" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
</div>
                    {/* ── Slider Injection ── */}
                    <Category3DSlider 
                        categories={topCategoriesResponse.categories} 
                        companyDomain={companyDomain} 
                    />
                </div>
            </section>
        );
    }
    return null;
};

export default HomeCategories;
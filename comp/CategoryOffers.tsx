import { apiCategoryOffers } from '@/apis/user';
import { getLastUpdateDate, getProductDetailHref } from '@/constants/hooks';
import cookieService from '@/services/CookiesService';
import { OffersOffer } from '@/services/dataTypes';
import React from 'react'
import Pagination from './Pagination';
import OfferCard from './offerCard';

interface Props {
    url_slug: string[];
    page?: string;
    company_id: string;
    mer_slug: string;
    mer_slug_type: string;
    category_id: string;
}

const CategoryOffers = async ({ url_slug, page, company_id, mer_slug, mer_slug_type, category_id }: Props) => {
    const pageUrl = `/category/${url_slug?.join('/')}`;
    const currentPage = Math.max(1, parseInt(page || "1", 10));
    const catOffers = (await apiCategoryOffers(category_id, company_id, currentPage)).data;
    const totalPages = catOffers?.pagination?.last_page || 0;
    const domain = (await cookieService.get("domain"))?.domain || "";
    const offers = [...(catOffers?.featured_offers || []), ...(catOffers?.offers || [])];

    return (
        <div className="w-full h-full flex flex-col">
            {/* Redesigned Verified Deals Banner */}
            {offers?.length > 0 && (
                <div className="group/banner mb-8 relative overflow-hidden bg-white border border-gray-100 rounded-[2rem] p-5 flex items-center gap-4 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,95,31,0.05)]">
                    {/* Animated Accent */}
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#FF5F1F]/5 to-transparent skew-x-12 translate-x-10 group-hover/banner:translate-x-0 transition-transform duration-1000" />
                    
                    <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#1a1612] flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10">
                        <span className="text-[#FF5F1F] text-xl font-black">✓</span>
                    </div>
                    
                    <div className="relative z-10">
                        <h4 className="text-[#1a1612] font-black text-sm m-0 flex items-center gap-2">
                            Verified Deals Hub
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF5F1F] animate-pulse"></span>
                        </h4>
                        <p className="text-gray-400 text-[11px] md:text-xs m-0 mt-1 leading-relaxed">
                            Hand-tested by our experts for maximum savings. 
                            <span className="hidden md:inline ml-1 font-medium text-gray-500">Last verified: {getLastUpdateDate(1)}</span>
                        </p>
                    </div>
                </div>
            )}
            
            {/* Enhanced Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 relative z-10 w-full mb-12 min-h-[300px]">
                {offers && offers.length > 0 ? (
                    offers.map((item: OffersOffer, i: number) => {
                        return (
                            <div key={i} className="flex flex-col h-full w-full transition-all duration-500 hover:-translate-y-2">
                                <OfferCard
                                    offer={item}
                                    mer_slug_type={mer_slug_type}
                                    mer_slug={mer_slug}
                                    type="offer"
                                    productDetailUrl={item?.offer?.slug ? getProductDetailHref(item?.merchant, mer_slug_type, item?.offer?.slug, item?.offer?.category?.slug) : null}
                                />
                            </div>
                        )
                    })
                ) : (
                    /* Redesigned Empty State */
                    <div className="col-span-full w-full py-24 bg-[#fcfcfc] rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-6">
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 bg-[#FF5F1F]/5 rounded-full animate-ping opacity-20" />
                            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                                <span className="text-3xl grayscale opacity-30 select-none">🔍</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-[#1a1612] m-0 tracking-tight">No Offers Found</h3>
                        <p className="text-gray-400 mt-3 max-w-sm text-sm leading-relaxed">
                            We couldn&apos;t find any active deals in this section. Try exploring our other categories for massive savings!
                        </p>
                    </div>
                )}
            </div>
            
            {/* Pagination with Spacing */}
            {offers && offers.length > 0 && (
                <div className="pt-8 border-t border-gray-50">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl={pageUrl}
                    />
                </div>
            )}
        </div>
    );
};

export default CategoryOffers;
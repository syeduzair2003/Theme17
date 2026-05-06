"use client";

import { OffersOffer, PaginationType } from '@/services/dataTypes';
import React, { useEffect, useState } from 'react';
import { filterOfferBanners, getBannerDimensions } from '@/constants/hooks';
import { apiOfferBanners } from '@/apis/offers'; // Adjust path if needed
import Spinner from 'react-bootstrap/Spinner';
import Banner from './Banner';

interface Props {
    bannerResponse: OffersOffer[];
    domain: string;
    mer_slug: string;
    slug_type: string;
    merchantId: string;
    companyId: string;
    pagination: PaginationType;
}

const VerticalOfferBanner = ({ bannerResponse, domain, mer_slug, slug_type, merchantId, companyId, pagination }: Props) => {
    const [banners, setBanners] = useState<OffersOffer[]>([]);
    const [page, setPage] = useState(2);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const initialFiltered = filterOfferBanners(bannerResponse, 20, 2000, 20, 2000);
        setBanners(initialFiltered);
        if (pagination?.next_page === null) {
            setHasMore(false);
        }
    }, [bannerResponse]);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const res = await apiOfferBanners(merchantId, companyId, page);
            const newBanners = filterOfferBanners(res.data?.offers || [], 20, 2000, 20, 2000);

            setBanners(prev => [...prev, ...newBanners]);
            if (res?.data?.pagination?.next_page) {
                setPage(prev => prev + 1);
                setIsExpanded(true);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more vertical banners", error);
        } finally {
            setLoading(false);
        }
    };

    const showLess = () => {
        const initialFiltered = filterOfferBanners(bannerResponse, 20, 2000, 20, 2000);
        setBanners(initialFiltered);
        setPage(2);
        setHasMore(true);
        setIsExpanded(false);
    };

    if (banners?.length === 0) return null;

    return (
        <div className="relative group/sidebar mb-10">
            {/* Elegant Background Layer */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-[#8bc94a20] to-[#ff912f10] rounded-[2.5rem] blur opacity-50 group-hover/sidebar:opacity-100 transition duration-1000 -z-10" />

            <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white/50 overflow-hidden text-center">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8bc94a08] rounded-full blur-3xl -mr-16 -mt-16" />

                {/* Header section with refined typography */}
                <h4 className="text-xl font-black text-[#222e48] mb-8 pb-4 border-b border-gray-50 flex items-center justify-center relative">
                    Related Banner Offers
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full -mb-[2px]" />
                </h4>

                <div className="flex flex-col gap-2 mb-8">
                    {banners?.map((offer_data, i) => {
                        const dimension = getBannerDimensions(offer_data);
                        return (
                            <Banner
                                key={i}
                                data={offer_data}
                                height={dimension?.height}
                                mer_slug={mer_slug}
                                slug_type={slug_type}
                                domain={domain}
                                width={dimension?.width}
                            />
                        );
                    })}
                </div>

                <div className={`flex items-center gap-4 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                    {hasMore && (
                        <button 
                            onClick={loadMore} 
                            className="relative group/btn overflow-hidden rounded-full py-3 px-8 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                            <span className="relative z-10 text-sm font-bold text-[#222e48] group-hover/btn:text-[#8bc94a] transition-colors">
                                {loading ? <Spinner size="sm" animation="border" className="border-[#8bc94a]" /> : "Show More"}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#8bc94a08] to-[#ff912f08] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                    )}
                    {isExpanded && (
                        <button 
                            onClick={showLess} 
                            className="relative group/btn overflow-hidden rounded-full py-3 px-8 bg-white/50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 flex items-center gap-2"
                        >
                            <span className="relative z-10 text-sm font-bold text-[#222e4860] group-hover/btn:text-red-400 transition-colors">
                                {loading ? <Spinner size="sm" animation="border" /> : "Show Less"}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerticalOfferBanner;
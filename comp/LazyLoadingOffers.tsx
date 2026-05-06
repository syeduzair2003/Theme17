"use client"
import { apiSpecificOffers } from '@/apis/offers';
import { apiExpiredOffers } from '@/apis/user';
import { OffersOffer, PaginationType } from '@/services/dataTypes';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { filterOfferBanners, getBannerDimensions, getBaseImageUrl } from '@/constants/hooks';
import dynamic from 'next/dynamic';

const Banner = dynamic(() => import('./Banner'), {
  ssr: false,
});

const OffersListView = dynamic(() => import('./OffersListView'), {
  ssr: false,
});

interface Props {
    initialOffers: OffersOffer[];
    companyId: string;
    merchantId: string;
    awaited_p_id: string;
    mer_slug_type: string;
    mer_slug: string;
    offerBanner: OffersOffer[];
    domain: string;
    merchantName: string;
    pagination: PaginationType;
    ads_campaign: boolean;
}

const LazyLoadingOffers = ({ initialOffers, companyId, merchantId, awaited_p_id, mer_slug_type, mer_slug, offerBanner, domain, merchantName, pagination, ads_campaign }: Props) => {
    const [offers, setOffers] = useState<OffersOffer[]>(initialOffers);
    const [expiredOffers, setExpiredOffers] = useState<OffersOffer[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);
    const [filteredOfferBanners, setFilteredOfferBanners] = useState<OffersOffer[]>([]);
    const [lazy, setLazy] = useState(false);
    const bannerDisplayAfter = 2;
    useEffect(() => {
        const timer = setTimeout(() => setLazy(true), 400);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setOffers(initialOffers);
        fetchExpiredOffers();
    }, [initialOffers]);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        if (page == pagination?.last_page) {
            setHasMore(false);
            return;
        }
        setLoading(true);
        try {
            const nextPage = page + 1;
            const response = await apiSpecificOffers(merchantId, companyId, nextPage);

            if (response.data?.offers.length > 0) {
                setOffers(prev => [...prev, ...response.data.offers]);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExpiredOffers = async () => {
        try {
            const response = await apiExpiredOffers(merchantId, companyId);
            setExpiredOffers(response.data?.offers || []);
        } catch (error) {
            // console.error("Error fetching expired offers:", error);
        }
    };

    const observerCallback = useCallback(
        (node: any) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            }, { threshold: 0.1 });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, loadMore]
    );

    useEffect(() => {
        if (offerBanner?.length > 0) {
            setFilteredOfferBanners(filterOfferBanners(offerBanner, 300, 600, 50, 150))
        }
    }, [offerBanner])

    return (
        <>
            <section className="w-full py-8 md:py-12 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-6">
                        <div className="w-full space-y-6">
                            {offers.map((offer, index) => (
                                offer.status === 1 && offer.offer.status === 1 ? (
                                    <React.Fragment key={offer.id}>
                                        <div
                                            ref={index === offers.length - 1 ? observerCallback : undefined}
                                            className="w-full"
                                        >
                                            <OffersListView
                                                product={offer}
                                                companyId={companyId}
                                                awaited_p_id={awaited_p_id}
                                                mer_slug_type={mer_slug_type}
                                                mer_slug={mer_slug}
                                                domain={domain}
                                                ads_campaign={ads_campaign}
                                            />
                                        </div>
                                        {(index + 1) % bannerDisplayAfter === 0 &&
                                            filteredOfferBanners.length > 0 &&
                                            filteredOfferBanners[Math.floor(index / bannerDisplayAfter)] && (() => {
                                                const banner = filteredOfferBanners[Math.floor(index / bannerDisplayAfter)];
                                                const dimension = getBannerDimensions(banner);
                                                return (
                                                    <div className="w-full flex justify-center py-4" key={`banner-${Math.floor(index / bannerDisplayAfter)}`}>
                                                        <Banner
                                                            data={banner} height={dimension?.height} width={dimension?.width} offerLink={null} domain={domain} mer_slug={mer_slug} slug_type={mer_slug_type}
                                                        />
                                                    </div>
                                                );
                                            })()
                                        }
                                    </React.Fragment>
                                ) : null
                            ))}
                            {loading && (
                                <div className="flex justify-center items-center py-10 w-full">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8bc94a]"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            {expiredOffers?.length > 0 ?
                <section className="w-full py-12 md:py-20 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                                    Old deals & coupons that might still work for <span className="text-[#8bc94a]">{merchantName}</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {expiredOffers?.map((item, i) => {
                                    if (i <= 9){
                                        return (
                                            <OffersListView
                                                key={i}
                                                product={item}
                                                companyId={companyId}
                                                awaited_p_id={awaited_p_id}
                                                mer_slug_type={mer_slug_type}
                                                mer_slug={mer_slug}
                                                domain={domain}
                                                ads_campaign={ads_campaign}
                                            />
                                        )
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </section>
                : <></>}
            <script
                type="application/ld+json"
                id='AggregateOffer'
                dangerouslySetInnerHTML={{
                    "__html": JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AggregateOffer",
                        "name": `${merchantName} Coupons & Deals`,
                        "description": `Currently, there are several active coupons and deals available for ${merchantName} products.`,
                        "offerCount": offers.length,
                        "offers": offers.map((offer) => ({
                        "@type": "Offer",
                        "name": offer?.offer?.offer_title,
                        "description": offer?.offer?.offer_detail,
                        "url": getBaseImageUrl(`${domain}`, `${offer.offer?.url}`, ""),
                        }))
                    })
                }}
            />
        </>
    )
}

export default LazyLoadingOffers

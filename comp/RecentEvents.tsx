import { apiGetHomeEventDetails } from '@/apis/user';
import cookieService from '@/services/CookiesService';
import { MerchantWithOffers, Offer } from '@/services/dataTypes';
import React from 'react';
import Link from 'next/link';
import {
    discardHTMLTags,
    getEventsHref,
    getMerchantHref,
    getProductDetailHref,
    splitHeading,
} from '@/constants/hooks';
import EventsOfferCard, { EventsGrid } from './EventsOfferCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
    companyId: string;
    mer_slug: string;
    mer_slug_type: string;
}

type MerchantOfferItem = {
    offer: Offer;
    merchant: MerchantWithOffers;
};

const RecentEvents = async ({ companyId, mer_slug, mer_slug_type }: Props) => {
    const companyDomain = (await cookieService.get('domain')).domain;
    const eventMerchants = (await apiGetHomeEventDetails(companyId)).data;

    const allOffers: MerchantOfferItem[] =
        eventMerchants?.merchants?.flatMap((merchant) =>
            (merchant?.offers || []).map((offer) => ({
                offer,
                merchant,
            }))
        ) || [];

    if (allOffers.length === 0) return null;

    const count = 8;
    const event = eventMerchants?.event;
    const heading = event?.name ?? 'Recent Events';
    const subText = discardHTMLTags(event?.description) ?? 'Exclusive deals and limited time offers from our latest events';
    const [firstWord, restWords] = splitHeading(heading);

    return (
        <section
            aria-label="Recent Events Section"
            className="relative w-full py-16 md:py-24 bg-[#f8f9fa] overflow-hidden"
        >
            {/* ── Soft Top Divider ── */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FF5722]/10 to-transparent" />
            
            {/* ── Subtle Background Shapes ── */}
            <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-[#FF5722]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-slate-200 blur-[80px] rounded-full pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4">
                {/* ── Section header row ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div className="flex-1 min-w-0">
                        {/* Eye-catching Badge */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#FF5722]/20 rounded-full text-[10px] font-black text-[#FF5722] uppercase tracking-[0.2em] shadow-sm">
                                <Sparkles size={12} className="fill-[#FF5722]" />
                                Featured Events
                            </div>
                            <div className="h-px w-10 bg-slate-200" />
                        </div>

                        {/* Heading - Size reduced to match your sleek style */}
                        <h2 className="text-2xl md:text-3xl font-black text-[#1a1612] tracking-tight m-0 uppercase italic leading-tight">
                            {firstWord && (
                                <span className="text-[#FF5722]">{firstWord} </span>
                            )}
                            <span className="text-slate-800">{restWords || heading}</span>
                        </h2>

                        {/* Sub-text */}
                        {subText && (
                            <p className="mt-3 text-[10px] text-gray-500 text-lg leading-relaxed max-w-3xl font-medium">
                                {subText}
                            </p>
                        )}
                    </div>

                    {/* Right: View All button - Sleek Design */}
                    <div className="shrink-0">
                        <Link
                            href={getEventsHref(event, mer_slug_type)}
                            className="group relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-7 py-3.5 rounded-full bg-[#1a1612] text-white hover:bg-[#FF5722] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
                        >
                            <span className="relative z-10">Explore All</span>
                            <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* ── Grid of Cards ── */}
                <div className="relative">
                    <EventsGrid>
                        {allOffers.slice(0, count).map((item, i) => (
                            <EventsOfferCard
                                key={i}
                                product={item.offer}
                                merchantHref={getMerchantHref(item.merchant, mer_slug, mer_slug_type)}
                                domain={companyDomain}
                                merchant_name={item.merchant?.merchant_name}
                                merchant_logo={item.merchant?.merchant_logo}
                                productDetailUrl={
                                    item.offer?.slug
                                        ? getProductDetailHref(
                                            item.merchant,
                                            mer_slug_type,
                                            item.offer.slug,
                                            item.offer.category?.slug
                                        )
                                        : null
                                }
                            />
                        ))}
                    </EventsGrid>
                </div>
            </div>

            {/* ── Bottom fade for smooth transition ── */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>
    );
};

export default RecentEvents;
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    discardHTMLTags,
    getBaseImageUrl,
    getMerchantHref,
    getRandomStoreSeoTitle,
    splitHeadingFromDetails,
} from '@/constants/hooks';
import cookieService from '@/services/CookiesService';
import { Merchant } from '@/services/dataTypes';
import { Zap, Plus } from 'lucide-react';

interface Props {
    merchantData: Merchant[];
    mer_slug: string;
    mer_slug_type: string;
}

const TopMerchants = async ({ merchantData, mer_slug, mer_slug_type }: Props) => {
    const companyDomain = await cookieService.get('domain');

    // Cap at 12 merchants
    const displayMerchants = merchantData?.slice(0, 12) ?? [];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {displayMerchants.map((merchant, index) => {
                const [heading] = splitHeadingFromDetails(merchant?.merchant_detail);
                const displayTitle = heading
                    ? discardHTMLTags(heading)
                    : getRandomStoreSeoTitle(merchant?.merchant_name);
                const logoSrc = getBaseImageUrl(companyDomain.domain, merchant.merchant_logo, '');
                const href = getMerchantHref(merchant, mer_slug, mer_slug_type);
                const offerCount = merchant.total_offers ?? 0;
                const offerLabel =
                    offerCount > 0 ? `${offerCount}+ DEALS` : 'VIEW DEALS';

                return (
                    <Link
                        key={merchant.unique_id ?? index}
                        href={href}
                        className="group relative flex flex-col items-center rounded-xl bg-white border border-black/10 no-underline transition-all duration-500 hover:border-[#FF5F1F]/40 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 overflow-hidden"
                    >
                        {/* --- Darker Top Accent (Always Visible but subtle) --- */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-black/[0.05] group-hover:bg-[#FF5F1F] transition-colors duration-500" />

                        {/* --- Discount Badge --- */}
                        {merchant.discount_tag && (
                            <div className="absolute top-2.5 right-2.5 z-20">
                                <span className="flex items-center gap-1 bg-[#0D0D0D] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-md shadow-md group-hover:bg-[#FF5F1F] transition-colors duration-300">
                                    <Zap size={7} className="fill-current" />
                                    {merchant.discount_tag}
                                </span>
                            </div>
                        )}

                        {/* --- Logo Area: Slightly darker background for contrast --- */}
                        <div className="w-full aspect-[1.1/1] flex items-center justify-center p-5 relative bg-black/[0.02] group-hover:bg-transparent transition-colors duration-500">
                            <div className="relative w-full h-full transition-all duration-500 group-hover:scale-110">
                                <Image
                                    src={logoSrc}
                                    alt={`${merchant.merchant_name} coupons and deals`}
                                    fill
                                    sizes="(max-width: 768px) 80px, 120px"
                                    className="object-contain filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-500"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* --- Content Area --- */}
                        <div className="w-full p-4 pt-3 text-center relative z-10">
                            {/* Merchant Name */}
                            <p className="text-[10px] font-black text-[#1A1A1A] group-hover:text-[#FF5F1F] uppercase tracking-tight line-clamp-1 mb-2 transition-colors duration-300">
                                {merchant.merchant_name}
                            </p>

                            {/* Compact Offer Pill */}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/[0.05] group-hover:bg-[#FF5F1F]/10 border border-black/[0.05] group-hover:border-[#FF5F1F]/20 rounded-md transition-all duration-300">
                                <span className="text-[8px] font-black text-gray-500 group-hover:text-[#FF5F1F] uppercase tracking-tighter">
                                    {offerLabel}
                                </span>
                                <Plus size={8} className="text-gray-400 group-hover:text-[#FF5F1F]" />
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default TopMerchants;
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    calculateOfferDuration,
    discardHTMLTags,
    getBaseImageUrl,
    getCurrencySymbol,
    getFinalDiscountTag,
    getRandomStoreSeoTitle,
} from '@/constants/hooks';
import { Offer, ProductData } from '@/services/dataTypes';
import OfferOutUrl from '@/components/shared/OfferOutUrl';
import { faCalendarDays, faArrowRight, FontAwesomeIcon } from '@/constants/icons';
import OfferDetailsToggle from './OfferDetailsToggle';

interface Props {
    product: Offer | ProductData;
    domain: string;
    merchantHref: string;
    merchant_name: string;
    merchant_logo: string;
    productDetailUrl?: string | null;
}

const EventsOfferCard = ({
    product,
    merchantHref,
    domain,
    merchant_name,
    merchant_logo,
    productDetailUrl,
}: Props) => {
    const type = product?.offer_type?.name;
    const imageSrc =
        type === 'product'
            ? getBaseImageUrl(domain, product?.product_image, '')
            : getBaseImageUrl(domain, merchant_logo, '');

    const originalPrice = product?.original_price ? parseFloat(product?.original_price) : 0;
    const salePrice = product?.sale_price ? parseFloat(product?.sale_price) : 0;
    const discountPercent =
        originalPrice > 0 && salePrice > 0
            ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
            : null;
    const finalDiscountTag = getFinalDiscountTag(
        product?.offer_title || product?.offer_detail,
        discountPercent
    );

    const isCoupon = !!product?.coupon_code;

    return (
        /* ─── ASYMMETRIC PREMIUM CARD ─── */
        <div className="flex flex-col h-[420px] w-full bg-white border border-gray-100 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-lg rounded-bl-lg hover:border-[#ff912f]/40 transition-all duration-500 group overflow-hidden shadow-sm hover:shadow-[0_15px_40px_-15px_rgba(255,145,47,0.2)]">
            
            {/* ── IMAGE SECTION (Compact & Clean) ── */}
            <div className="relative h-44 m-2 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-md rounded-bl-md bg-[#fafafa] flex items-center justify-center p-6 overflow-hidden">
                {/* Discount Tag (Top Right) */}
                {finalDiscountTag && (
                    <div className="absolute top-3 right-3 z-20">
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase text-white bg-[#111318] rounded-full shadow-lg">
                            {finalDiscountTag}
                        </span>
                    </div>
                )}

                <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                    <Image
                        src={imageSrc}
                        alt={getRandomStoreSeoTitle(merchant_name)}
                        className="object-contain"
                        fill
                        sizes="250px"
                        unoptimized
                    />
                </div>
                
                {/* Subtle Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#ff912f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* ── CONTENT SECTION (No Extra Gaps) ── */}
            <div className="flex flex-col flex-1 px-5 pb-5 pt-2">
                {/* Merchant Brand Label */}
                <Link
                    href={merchantHref}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff912f] mb-1.5 no-underline flex items-center gap-1.5"
                >
                    <span className="w-1 h-1 rounded-full bg-[#ff912f]" />
                    {merchant_name}
                </Link>

                {/* Offer Title */}
                <div className="h-12 mb-3">
                    {product?.is_detail === 1 && productDetailUrl ? (
                        <Link
                            href={productDetailUrl}
                            className="text-[15px] font-bold text-[#111318] leading-snug line-clamp-2 no-underline group-hover:text-[#ff912f] transition-colors duration-300"
                        >
                            {discardHTMLTags(product?.offer_title)}
                        </Link>
                    ) : (
                        <h3 className="text-[15px] font-bold text-[#111318] leading-snug line-clamp-2 m-0 group-hover:text-[#ff912f] transition-colors duration-300">
                            {discardHTMLTags(product?.offer_title)}
                        </h3>
                    )}
                </div>

                {/* Price & Duration Row */}
                <div className="flex items-center justify-between mb-4 bg-gray-50/50 p-2 rounded-xl border border-gray-100/50">
                    <div className="flex flex-col">
                        {type === 'product' && (salePrice > 0 || originalPrice > 0) ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-lg font-black text-[#111318]">
                                    {getCurrencySymbol(product?.currency)}{salePrice}
                                </span>
                                {originalPrice > 0 && (
                                    <span className="text-[11px] text-gray-400 line-through font-medium">
                                        {getCurrencySymbol(product?.currency)}{originalPrice}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-[9px] font-black text-[#111318] uppercase tracking-widest bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                                Verified Deal
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-[#ff912f]/60 text-xs" />
                        <span>{calculateOfferDuration(product?.end_date)}</span>
                    </div>
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="mt-auto space-y-2.5">
                    {/* Details Link */}
                    <div className="flex justify-center border-t border-gray-50 pt-2.5">
                        <OfferDetailsToggle
                            domain={domain}
                            imageSrc={product?.product_image}
                            merchantHref={merchantHref}
                            offer={product}
                            type="anchor"
                            merchantImg={merchant_logo}
                        />
                    </div>
                    
                    {/* Main CTA */}
                    {isCoupon ? (
                        <OfferOutUrl
                            unique_id={product?.unique_id}
                            outUrl={product?.url}
                            merchantHref={merchantHref}
                            domain={domain}
                            customClass="relative w-full py-3 rounded-xl border-2 border-dashed border-[#ff912f]/30 bg-[#ff912f]/5 flex items-center justify-center group/btn overflow-hidden transition-all no-underline"
                        >
                            <span className="text-xs font-black text-[#ff912f] uppercase tracking-widest">
                                {product?.coupon_code?.trim().split(' ')[0].slice(0, 5)}...
                            </span>
                            <div className="absolute inset-0 bg-[#ff912f] flex items-center justify-center translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300">
                                <span className="text-xs font-black text-white uppercase tracking-tighter">Reveal Coupon Code</span>
                            </div>
                        </OfferOutUrl>
                    ) : (
                        <OfferOutUrl
                            unique_id={product?.unique_id}
                            outUrl={product?.url}
                            merchantHref={merchantHref}
                            domain={domain}
                            customClass="w-full py-3 rounded-xl bg-[#111318] text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#ff912f] transition-all duration-300 no-underline shadow-lg shadow-black/5"
                        >
                            {type === 'product' ? 'Add to Cart' : 'Activate Deal'}
                            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </OfferOutUrl>
                    )}
                </div>
            </div>
        </div>
    );
};

export const EventsGrid = ({ children, cols = 4 }: { children: React.ReactNode, cols?: number }) => {
    const gridCols = cols === 3 ? 'xl:grid-cols-3' : 'xl:grid-cols-4';
    return (
        <div className="max-w-[1400px] mx-auto px-4 py-8">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-6`}>
                {children}
            </div>
        </div>
    );
};

export default EventsOfferCard;
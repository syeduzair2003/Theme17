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
        <div className="flex flex-col h-[400px] w-full bg-white rounded-[24px] border border-slate-100 hover:border-[#FF5722]/30 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-md">
            
            {/* ── Smaller Image Container ── */}
            <div className="relative h-32 m-2 rounded-[18px] bg-[#FFF8F5] flex items-center justify-center p-4 overflow-hidden border border-[#FF5722]/5">
                {/* Compact Discount Badge */}
                {finalDiscountTag && (
                    <div className="absolute top-2 right-2 z-20">
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase text-white bg-[#FF5722] rounded-md shadow-sm">
                            {finalDiscountTag}
                        </span>
                    </div>
                )}

                <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                        src={imageSrc}
                        alt={getRandomStoreSeoTitle(merchant_name)}
                        className="object-contain"
                        fill
                        sizes="200px"
                        unoptimized
                    />
                </div>
            </div>

            {/* ── Reduced Padding Content Section ── */}
            <div className="flex flex-col flex-1 px-4 pb-4 pt-1">
                {/* Tight Merchant Label */}
                <Link
                    href={merchantHref}
                    className="text-[9px] font-bold uppercase tracking-wider text-[#FF5722] mb-1 no-underline"
                >
                    {merchant_name}
                </Link>

                {/* Title - Line clamp 2 */}
                <div className="h-10 mb-2">
                    {product?.is_detail === 1 && productDetailUrl ? (
                        <Link
                            href={productDetailUrl}
                            className="text-[14px] font-bold text-[#121212] leading-tight line-clamp-2 no-underline group-hover:text-[#FF5722] transition-colors"
                        >
                            {discardHTMLTags(product?.offer_title)}
                        </Link>
                    ) : (
                        <h3 className="text-[14px] font-bold text-[#121212] leading-tight line-clamp-2 m-0 group-hover:text-[#FF5722] transition-colors">
                            {discardHTMLTags(product?.offer_title)}
                        </h3>
                    )}
                </div>

                {/* Compact Price & Timer */}
                <div className="flex items-center justify-between mt-auto mb-3">
                    <div className="flex flex-col">
                        {type === 'product' && (salePrice > 0 || originalPrice > 0) ? (
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-black text-[#121212]">
                                    {getCurrencySymbol(product?.currency)}{salePrice}
                                </span>
                                {originalPrice > 0 && (
                                    <span className="text-[10px] text-slate-400 line-through">
                                        {getCurrencySymbol(product?.currency)}{originalPrice}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-[9px] font-bold text-[#FF5722] uppercase bg-[#FF5722]/5 px-2 py-0.5 rounded border border-[#FF5722]/10">
                                Verified
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                        <FontAwesomeIcon icon={faCalendarDays} className="text-[#FF5722]/50" />
                        <span>{calculateOfferDuration(product?.end_date)}</span>
                    </div>
                </div>

                {/* ── Compact Actions ── */}
                <div className="space-y-2">
                    <div className="flex justify-center border-t border-slate-50 pt-2">
                        <OfferDetailsToggle
                            domain={domain}
                            imageSrc={product?.product_image}
                            merchantHref={merchantHref}
                            offer={product}
                            type="anchor"
                            merchantImg={merchant_logo}
                        />
                    </div>
                    
                    {isCoupon ? (
                        <OfferOutUrl
                            unique_id={product?.unique_id}
                            outUrl={product?.url}
                            merchantHref={merchantHref}
                            domain={domain}
                            customClass="relative w-full py-2 rounded-xl border border-dashed border-[#FF5722]/40 bg-[#FF5722]/5 flex items-center justify-center group/btn overflow-hidden transition-all no-underline"
                        >
                            <span className="text-[11px] font-black text-[#FF5722] uppercase tracking-wider">
                                {product?.coupon_code?.trim().split(' ')[0].slice(0, 4)}...
                            </span>
                            <div className="absolute inset-0 bg-[#FF5722] flex items-center justify-center translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300">
                                <span className="text-[10px] font-black text-white uppercase">Copy Code</span>
                            </div>
                        </OfferOutUrl>
                    ) : (
                        <OfferOutUrl
                            unique_id={product?.unique_id}
                            outUrl={product?.url}
                            merchantHref={merchantHref}
                            domain={domain}
                            customClass="w-full py-2 rounded-xl bg-[#121212] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FF5722] transition-all no-underline shadow-sm"
                        >
                            {type === 'product' ? 'Buy Now' : 'Get Deal'}
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
        <div className="max-w-[1400px] mx-auto px-4 py-6">
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-4`}>
                {children}
            </div>
        </div>
    );
};

export default EventsOfferCard;
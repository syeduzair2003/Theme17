import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import {
    discardHTMLTags,
    getBaseImageUrl,
    getCurrencySymbol,
    getFinalDiscountTag,
    getMerchantHref,
    getRandomRating,
    getRandomStoreSeoTitle
} from '@/constants/hooks';
import { OffersOffer } from '@/services/dataTypes';
import OfferOutUrl from '@/components/shared/OfferOutUrl';
import { faArrowRight, faCheck, FontAwesomeIcon, faBolt, faCircleCheck } from '@/constants/icons';
import OfferDetailsToggle from './OfferDetailsToggle';

interface Props {
    offer: OffersOffer;
    mer_slug_type: string;
    mer_slug: string;
    domain: string;
    productDetailUrl?: string | null;
}

const CouponCard = ({ offer, mer_slug_type, mer_slug, domain, productDetailUrl }: Props) => {
    const merchantHref = getMerchantHref(offer.merchant, mer_slug, mer_slug_type);
    const product = offer?.offer || offer;
    const merchant = offer?.merchant;

    const imageSrc = product?.product_image
        ? getBaseImageUrl(domain, product?.product_image, "")
        : getBaseImageUrl(domain, merchant?.merchant_logo, "");

    const originalPrice = product?.original_price ? parseFloat(product.original_price) : 0;
    const salePrice = product?.sale_price ? parseFloat(product.sale_price) : 0;
    const discountPercent = originalPrice > 0 && salePrice > 0
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : null;

    const finalDiscountTag = getFinalDiscountTag(
        product?.offer_title || product?.offer_detail,
        discountPercent,
    );

    const isCoupon = !!product?.coupon_code;

    return (
        <div className="group relative w-full bg-[#0f172a] rounded-[1.5rem] border border-white/5 hover:border-indigo-500/50 transition-all duration-500 overflow-hidden shadow-2xl">
            
            {/* ── Background Glow Effect ── */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[80px] group-hover:bg-indigo-600/20 transition-all duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row p-5 gap-6">
                
                {/* ── Left Side: Image Container (Floating Style) ── */}
                <div className="relative flex-shrink-0 mx-auto md:mx-0">
                    <div className="w-[140px] h-[140px] bg-slate-800/50 rounded-2xl border border-white/5 flex items-center justify-center p-4 backdrop-blur-sm group-hover:translate-y-[-5px] transition-transform duration-500 shadow-xl">
                        <div className="relative w-full h-full">
                            <Image
                                src={imageSrc}
                                alt={getRandomStoreSeoTitle(merchant?.merchant_name)}
                                className="object-contain filter transition-all duration-500 group-hover:brightness-110"
                                fill
                                sizes="140px"
                            />
                        </div>
                    </div>
                    
                    {/* Floating Badge */}
                    {finalDiscountTag && (
                        <div className="absolute -top-3 -left-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-500/40 uppercase italic tracking-tighter">
                            {finalDiscountTag}
                        </div>
                    )}
                </div>

                {/* ── Middle: Content ── */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                            {merchant?.merchant_name}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-widest">
                            <FontAwesomeIcon icon={faCircleCheck} className="w-2.5 h-2.5" />
                            Verified
                        </span>
                    </div>

                    {product?.is_detail === 1 && productDetailUrl ? (
                        <Link href={productDetailUrl} className="no-underline group/title">
                            <h3 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-2 m-0 group-hover/title:text-indigo-400 transition-colors italic">
                                {discardHTMLTags(product?.offer_title)}
                            </h3>
                        </Link>
                    ) : (
                        <h3 className="text-lg md:text-xl font-bold text-white leading-snug line-clamp-2 m-0">
                            {discardHTMLTags(product?.offer_title)}
                        </h3>
                    )}

                    <div className="mt-4 flex items-center gap-4">
                        <OfferDetailsToggle
                            domain={domain}
                            imageSrc={product?.product_image}
                            merchantHref={merchantHref}
                            offer={product}
                            type='anchor'
                            merchantImg={offer?.merchant?.merchant_logo}
                        />
                    </div>
                </div>

                {/* ── Right Side: Action Area ── */}
                <div className="w-full md:w-[220px] flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-white/5 pt-5 md:pt-0 md:pl-6 gap-4">
                    
                    {/* Price Section */}
                    {(salePrice > 0 || originalPrice > 0) ? (
                        <div className="text-right flex flex-col items-center md:items-end">
                            <span className="text-2xl font-black text-white tracking-tighter">
                                {getCurrencySymbol(product?.currency)}{salePrice}
                            </span>
                            {originalPrice > 0 && (
                                <span className="text-xs text-slate-500 line-through font-medium">
                                    {getCurrencySymbol(product?.currency)}{originalPrice}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="px-4 py-1 rounded-full bg-slate-800 border border-white/5">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                Exclusive Deal
                            </span>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    {isCoupon ? (
                        <OfferOutUrl
                            unique_id={product?.unique_id}
                            outUrl={product?.url}
                            merchantHref={merchantHref}
                            domain={domain}
                            customClass="relative w-full py-4 rounded-xl bg-white flex items-center justify-center overflow-hidden group/btn no-underline transition-all duration-300 shadow-xl shadow-white/5"
                        >
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest transition-transform duration-500 group-hover/btn:-translate-y-12">
                                Reveal Code
                            </span>
                            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-12 group-hover/btn:translate-y-0 transition-transform duration-500 bg-gradient-to-r from-indigo-600 to-purple-600">
                                <span className="text-[13px] font-black text-white uppercase tracking-[0.2em]">
                                    {product?.coupon_code?.trim().split(' ')[0].slice(0, 10)}
                                </span>
                            </div>
                        </OfferOutUrl>
                    ) : (
                        <OfferOutUrl
                            unique_id={product?.unique_id}
                            outUrl={product?.url}
                            merchantHref={merchantHref}
                            domain={domain}
                            customClass="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-indigo-800 transition-all duration-300 no-underline shadow-lg shadow-indigo-500/20 group/deal"
                        >
                            Activate Deal
                            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover/deal:translate-x-1 transition-transform" />
                        </OfferOutUrl>
                    )}
                </div>
            </div>
            
            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent group-hover:w-full transition-all duration-700" />
        </div>
    );
}

export default CouponCard;
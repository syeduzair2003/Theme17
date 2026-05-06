import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import {
    calculateOfferDuration,
    discardHTMLTags,
    extractPromoDiscountTag,
    getBaseImageUrl,
} from '@/constants/hooks';
import OfferOutUrl from '@/components/shared/OfferOutUrl';
import OfferDetailsToggle from './OfferDetailsToggle';
import { faFire, FontAwesomeIcon } from '@/constants/icons';

interface Props {
    product: any;
    merchantHref: string;
    domain: string;
    merchant_logo?: string;
    merchant_name?: string;
    productDetailUrl?: string | null;
}

const ProductCard = ({ product, merchantHref, domain, merchant_logo, merchant_name, productDetailUrl }: Props) => {
    const type = product?.offer_type?.name;

    const imageSrc = type === "product"
        ? getBaseImageUrl(domain, product?.product_image, "")
        : getBaseImageUrl(domain, merchant_logo || "", "");

    const originalPrice = product?.original_price ? parseFloat(product.original_price) : 0;
    const salePrice = product?.sale_price ? parseFloat(product.sale_price) : 0;
    const discountPercent = originalPrice > 0 && salePrice > 0
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : null;

    const finalDiscountTag =
        extractPromoDiscountTag(product?.offer_title || product?.offer_detail) ||
        (discountPercent ? `${discountPercent}% Off` : null);

    return (
        <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8bc94a]/10 w-full h-full border border-gray-100 flex-grow">
            {/* Top Image Section */}
            <div className="relative w-full h-[180px] bg-gradient-to-br from-gray-50 to-gray-100/50 flex-shrink-0 overflow-hidden">
                {/* Time Left Ribbon */}
                <div className="absolute top-0 left-0 bg-[#8bc94a] text-white text-[11px] font-bold px-3 py-1.5 rounded-br-xl z-20 shadow-sm backdrop-blur-sm bg-opacity-90">
                    {calculateOfferDuration(product?.end_date)}
                </div>
                
                {/* Sale Badge */}
                {finalDiscountTag && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#ff912f] to-[#ff7b00] text-white text-xs font-bold px-2.5 py-1.5 rounded-full z-20 shadow-md flex items-center gap-1.5 transform transition-transform group-hover:scale-105">
                        <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
                        {finalDiscountTag}
                    </div>
                )}

                <Image
                    src={imageSrc}
                    alt={product?.offer_title || "Offer"}
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Bottom Content Section */}
            <div className="p-5 flex flex-col flex-grow relative bg-white z-10">
                <div className="flex-grow">
                    {/* Merchant Name */}
                    {merchant_name && (
                        <p className="text-[11px] font-bold text-[#ff912f] uppercase tracking-wider mb-2 opacity-80">
                            {merchant_name}
                        </p>
                    )}

                    {product?.is_detail === 1 && productDetailUrl ? (
                         <Link href={productDetailUrl} className="text-decoration-none group-hover:text-[#8bc94a] transition-colors duration-300">
                            <h3 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 mb-2 group-hover:text-[#8bc94a]">
                                {discardHTMLTags(product?.offer_title)}
                            </h3>
                        </Link>
                    ) : (
                        <h3 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 mb-2 group-hover:text-[#8bc94a] transition-colors duration-300">
                            {discardHTMLTags(product?.offer_title)}
                        </h3>
                    )}
                    
                    {/* Prices */}
                    <div className="flex items-center gap-2 mb-3">
                         {salePrice > 0 ? (
                            <>
                                <span className="text-lg font-extrabold text-[#8bc94a]">
                                    ${salePrice.toFixed(2)}
                                </span>
                                {originalPrice > 0 && (
                                    <span className="text-sm font-semibold text-gray-400 line-through">
                                        ${originalPrice.toFixed(2)}
                                    </span>
                                )}
                            </>
                         ) : originalPrice > 0 ? (
                             <span className="text-lg font-extrabold text-[#8bc94a]">
                                 ${originalPrice.toFixed(2)}
                             </span>
                         ) : null}
                    </div>
                </div>

                {/* Toggle & Action */}
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between gap-3 relative before:absolute before:top-0 before:left-[-20px] before:right-[-20px] before:border-t before:border-gray-50">
                    <div className="text-[13px] text-gray-500 font-medium">
                         <OfferDetailsToggle 
                            domain={domain} 
                            imageSrc={product?.product_image} 
                            merchantImg={merchant_logo} 
                            merchantHref={merchantHref} 
                            offer={product} 
                            type='anchor' 
                         />
                    </div>
                    
                    <div className="flex-shrink-0 z-10">
                         <div className="inline-block relative">
                             <OfferOutUrl
                                unique_id={product?.unique_id}
                                outUrl={product?.url}
                                merchantHref={merchantHref}
                                domain={domain}
                                customClass="!bg-gray-900 group-hover:!bg-[#8bc94a] !text-white text-[12px] font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-[#8bc94a]/30 inline-flex items-center justify-center min-w-[90px]"
                            >
                                Get Deal
                            </OfferOutUrl>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
"use client"
import { Offer, OffersOffer } from '@/services/dataTypes'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import RenderRating from './RenderRating'
import OfferModal from './OfferModal'
import { discardHTMLTags, extractPromoDiscountTag, getBaseImageUrl, getCurrencySymbol, getFinalDiscountTag, getMerchantHref, getRandomRating } from '@/constants/hooks'
import { apiOfferDetails } from '@/apis/offers'
import OfferOutUrl from '@/components/shared/OfferOutUrl'
// import Image from "@/components/shared/Image";
import OfferDuration from './OfferDuration'
import SocialMediaShare from './SocialMediaShare'
import SimpleOfferModal from './SimpleOfferModal'
import OfferDetailsToggle from './OfferDetailsToggle'

interface Props {
    product: OffersOffer,
    companyId: string,
    awaited_p_id?: string,
    mer_slug_type: string,
    mer_slug: string,
    domain: string,
    ads_campaign: boolean,
}

let renderCount = 0;
const OffersListView = ({ product, companyId, awaited_p_id, mer_slug_type, mer_slug, domain, ads_campaign }: Props) => {
    const [p_data, setP_data] = useState<Offer | null>(null);
    // const [imageSrc, setImageSrc] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const merchantHref = getMerchantHref(product.merchant, mer_slug, mer_slug_type);

    // useEffect(() => {
    //     if (product?.offer?.offer_type?.name === "product") {
    //         setImageSrc(getBaseImageUrl(domain, product?.offer?.product_image, ""));
    //     }else {
    //         setImageSrc(getBaseImageUrl(domain, product?.merchant?.merchant_logo, ""));
    //     }
    // }, [product]);


    useEffect(() => {
        if (!awaited_p_id || !companyId) return;

        let cancelled = false;

        const fetchOfferDetails = async () => {
            try {
                const offer_details = await apiOfferDetails(awaited_p_id, companyId);
                if (!cancelled) {
                    setP_data(offer_details.data);
                    renderCount += 1;
                }
                if (renderCount === 1) {
                    setShowModal(true);
                }
            } catch (error) {
                console.error("Error fetching offer details:", error);
            }
        };

        fetchOfferDetails();

        return () => {
            cancelled = true;
        };
    }, [awaited_p_id, companyId]);

    const originalPrice = product?.offer?.original_price ? parseFloat(product?.offer?.original_price) : 0;
    const salePrice = product?.offer?.sale_price ? parseFloat(product?.offer?.sale_price) : 0;
    const discountPercent = originalPrice > 0 && salePrice > 0
        ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
        : null;
    const finalDiscountTag = getFinalDiscountTag(
        product?.offer?.offer_title || product?.offer?.offer_detail,
        discountPercent,
    );



    // const imageSrc =
    // product?.offer?.offer_type?.name === "product"
    //     ? getBaseImageUrl(domain, product?.offer?.product_image, "")
    //     : getBaseImageUrl(domain, product?.merchant?.merchant_logo, "");

    return (
        <>
            {showModal && p_data != null && !ads_campaign && (
                <OfferModal
                    data={p_data}
                    companyId={companyId}
                    onClose={() => setShowModal(false)}
                    domain={domain}
                    merchantHref={merchantHref}
                    merchantImg={product?.merchant?.merchant_logo}
                    productImg={product?.offer?.product_image}
                />
            )}
            {(showModal && ads_campaign && p_data != null) && (
                <SimpleOfferModal
                    data={p_data}
                    onClose={() => setShowModal(false)}
                    domain={domain}
                    merchantHref={merchantHref}
                    finalDiscountTag={finalDiscountTag}
                    merchantImg={product?.merchant?.merchant_logo}
                />
            )}
            <div className="w-full mb-6">
                <div className="relative flex flex-col md:flex-row items-center w-full h-full p-5 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 gap-6">

                    {/* Discount Ribbon - Using Secondary Color */}
                    {finalDiscountTag && (
                        <div className="absolute top-0 right-0 z-10">
                            <div className="bg-[#Ff912f] text-white text-xs md:text-sm font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl shadow-md">
                                {finalDiscountTag}
                            </div>
                        </div>
                    )}

                    {/* Hidden Debug Info (Retained from original) */}
                    <div className="hidden">
                        Type Name: {product?.offer?.offer_type?.name}, Discount: {finalDiscountTag}
                    </div>

                    {/* Left/Main Content Area */}
                    <div className="flex-1 w-full flex flex-col gap-4 pt-4 md:pt-0">

                        {/* Duration & Title */}
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-500 text-sm font-medium">
                                <OfferDuration endDate={product?.offer?.end_date} />
                            </div>
                            <h4 className="text-left text-gray-800 text-lg md:text-xl font-bold leading-tight">
                                {discardHTMLTags(product?.offer?.offer_title?.replaceAll('_', ' '))}
                            </h4>
                        </div>

                        {/* Price & Social Info */}
                        {(product?.offer?.offer_type?.name === "product" || product?.offer?.product_image !== null) && (
                            <div className="flex justify-between items-center mt-1">
                                <div className="flex items-baseline gap-3">
                                    {product?.offer?.sale_price && (
                                        <span className="font-extrabold text-[#8bc94a] text-2xl md:text-3xl">
                                            {getCurrencySymbol(product?.offer?.currency)}{product?.offer?.sale_price}
                                        </span>
                                    )}
                                    {product?.offer?.original_price && (
                                        <span className="text-gray-400 text-sm md:text-base font-medium line-through decoration-gray-300">
                                            {getCurrencySymbol(product?.offer?.currency)}{product?.offer?.original_price}
                                        </span>
                                    )}
                                </div>

                                <SocialMediaShare
                                    offerUrl={`/${product?.offer?.url}`}
                                    offerTitle={product?.offer?.offer_title}
                                    merchantHref={merchantHref}
                                    unique_id={product?.offer?.unique_id}
                                    domain={domain}
                                />
                            </div>
                        )}

                        {/* Action Area (Bottom Row) */}
                        <div className="w-full mt-2 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <OfferDetailsToggle
                                    domain={domain}
                                    imageSrc={product?.offer?.product_image}
                                    merchantHref={merchantHref}
                                    offer={product?.offer}
                                    type='anchor'
                                    merchantImg={product?.merchant?.merchant_logo}
                                />
                            </div>

                            {/* Social Share fallback if no image */}
                            {product?.offer?.product_image === null && (
                                <SocialMediaShare
                                    offerUrl={`/${product?.offer?.url}`}
                                    offerTitle={product?.offer?.offer_title}
                                    merchantHref={merchantHref}
                                    unique_id={product?.offer?.unique_id}
                                    domain={domain}
                                />
                            )}

                            {/* Call to Action Buttons */}
                            {product?.offer?.coupon_code ? (
                                <OfferOutUrl
                                    unique_id={product?.offer?.unique_id}
                                    outUrl={product?.offer?.url}
                                    merchantHref={merchantHref}
                                    domain={domain}
                                    customClass="relative flex items-center justify-center p-1 rounded-full border-2 border-dashed border-[#Ff912f] group-hover:border-[#8bc94a] bg-white cursor-pointer w-full sm:w-auto min-w-[160px] group transition-all duration-300 hover:shadow-md hover:shadow-[#8bc94a]/20"
                                >
                                    <div className="bg-[#8bc94a] group-hover:bg-[#Ff912f] text-white font-bold w-full rounded-full flex items-center justify-center py-2 px-6 transition-colors duration-300">
                                        Show Coupon
                                    </div>
                                </OfferOutUrl>
                            ) : (
                                <OfferOutUrl
                                    unique_id={product?.offer?.unique_id}
                                    outUrl={product?.offer?.url}
                                    merchantHref={merchantHref}
                                    domain={domain}
                                    customClass="flex items-center justify-center bg-[#8bc94a] hover:bg-[#Ff912f] text-white font-bold rounded-full py-2.5 px-8 shadow-md shadow-[#8bc94a]/30 hover:shadow-[#Ff912f]/30 transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
                                >
                                    <span>
                                        {product?.offer?.offer_type?.name === "product" ? "Buy Now" : "Get Deal"}
                                    </span>
                                </OfferOutUrl>
                            )}
                        </div>
                    </div>

                    {/* Right Area (Image) */}
                    {product?.offer?.product_image && (
                        <div className="flex items-center justify-center shrink-0 w-full md:w-[160px] lg:w-[180px] p-2 bg-gray-50/50 rounded-xl border border-gray-50">
                            <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px]">
                                <Image
                                    src={getBaseImageUrl(domain, product?.offer?.product_image, "")}
                                    alt={
                                        product?.offer?.offer_type?.name === "product"
                                            ? `${product?.offer?.offer_title || "Product"} image`
                                            : `${product?.merchant?.merchant_name} Deals and Coupons`
                                    }
                                    className="object-contain mix-blend-multiply"
                                    fill
                                    sizes="(max-width: 768px) 120px, 140px"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default OffersListView

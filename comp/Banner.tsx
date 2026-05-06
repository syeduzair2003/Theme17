import OfferOutUrl from '@/components/shared/OfferOutUrl';
import { getBaseImageUrl, getMerchantHref } from '@/constants/hooks';
import { OffersMerchant, OffersOffer } from '@/services/dataTypes';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import Image from "@/components/shared/Image";

interface Props {
    data: OffersOffer;
    merchant?: OffersMerchant;
    height?: number;
    offerLink?: string | null;
    mer_slug?: string;
    slug_type?: string;
    domain: string;
    unoptimized?: boolean;
    width?: number;
}

const Banner = ({ data, height, offerLink, mer_slug, slug_type, domain, unoptimized = false, width }: Props) => {
    const { offer_title, offer_detail, banner_image, url } = data?.offer ?? {};

    return (
        <div className="group relative w-full mb-6">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1">
                {mer_slug && slug_type ? (
                    <OfferOutUrl 
                        outUrl={offerLink || url || ""} 
                        unique_id={data?.offer?.unique_id || ""} 
                        merchantHref={getMerchantHref(data?.merchant, mer_slug, slug_type)} 
                        domain={domain}
                        customClass="block relative transition-transform duration-500 group-hover:scale-[1.02]"
                    >
                        <Image
                            src={getBaseImageUrl(domain, banner_image, "")}
                            alt={`${data?.merchant?.merchant_name || "Merchant"} discount coupons and deals`}
                            objectFit="contain"
                            className="mx-auto"
                            loading='lazy'
                            height={height}
                            width={width}
                            unoptimized={unoptimized}
                        />
                    </OfferOutUrl>
                ) : (
                    <Link 
                        href={offerLink || url || ""} 
                        rel="nofollow sponsored noopener noreferrer" 
                        className="block relative transition-transform duration-500 group-hover:scale-[1.02]"
                    >
                        <Image
                            src={getBaseImageUrl(domain, banner_image, "")}
                            alt={offer_detail || offer_title || "Offer Banner"}
                            layout='responsive'
                            height={height || 200}
                            width={width || 300}
                            objectFit="contain"
                            className="mx-auto"
                            loading='lazy'
                            unoptimized={unoptimized}
                        />
                    </Link>
                )}
                
                {/* Subtle Overlay Glow on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8bc94a05] to-[#ff912f05] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
        </div>
    );
};

export default Banner

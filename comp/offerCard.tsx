import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  discardHTMLTags,
  getBaseImageUrl,
  getCurrencySymbol,
  getFinalDiscountTag,
  getMerchantHref,
  getRandomRating,
  getRandomStoreSeoTitle,
} from "@/constants/hooks";
import RenderRating from "@/components/Theme-11/comp/RenderRating";
import { OffersOffer } from "@/services/dataTypes";
import OfferOutUrl from "@/components/shared/OfferOutUrl";
import cookieService from "@/services/CookiesService";
import OfferDetailsToggle from "./OfferDetailsToggle";
import { faArrowRight, faCheck, FontAwesomeIcon } from "@/constants/icons";
import { Zap } from "lucide-react";

interface Props {
  offer: OffersOffer;
  mer_slug_type: string;
  mer_slug: string;
  type?: string;
  productDetailUrl?: string | null;
}

const OfferCard = async ({
  offer,
  mer_slug_type,
  mer_slug,
  type,
  productDetailUrl,
}: Props) => {
  const merchantHref = getMerchantHref(offer.merchant, mer_slug, mer_slug_type);
  const domainData = await cookieService.get("domain");
  const domain = domainData?.domain || "";
  const product = offer?.offer || offer;
  const isProduct =
    type === "product" ||
    product?.offer_type?.name?.toLowerCase() === "product";

  const imageSrc =
    isProduct && product?.product_image
      ? getBaseImageUrl(domain, product?.product_image, "")
      : getBaseImageUrl(domain, offer?.merchant?.merchant_logo, "");

  const rating = getRandomRating(offer?.offer?.rating);
  const originalPrice = product?.original_price
    ? parseFloat(product.original_price)
    : 0;
  const salePrice = product?.sale_price ? parseFloat(product.sale_price) : 0;
  const discountPercent =
    originalPrice > 0 && salePrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : null;

  const finalDiscountTag = getFinalDiscountTag(
    product?.offer_title || product?.offer_detail,
    discountPercent,
  );

  const isCoupon = !!product?.coupon_code;

  return (
    <div className="group relative flex flex-col w-full h-full bg-white rounded-xl p-3 border border-black/10 hover:border-[#FF5F1F]/40 transition-all duration-500 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] overflow-hidden">
      
      {/* ── Ultra-Compact Image Container (Reduced Height) ── */}
      <div className="relative aspect-[16/8] w-full mb-3 bg-[#F9F9F9] rounded-lg overflow-hidden flex items-center justify-center p-2 group-hover:bg-white transition-colors duration-500 border border-black/[0.02]">
        
        {/* Compact Badge */}
        <div className="absolute top-1.5 right-1.5 z-20">
          {finalDiscountTag ? (
            <div className="bg-[#0D0D0D] text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md group-hover:bg-[#FF5F1F] transition-colors duration-300">
              <Zap size={8} className="fill-current" />
              {finalDiscountTag}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider flex items-center gap-1">
              <FontAwesomeIcon icon={faCheck} className="w-1.5 h-1.5" />
              Verified
            </div>
          )}
        </div>

        {/* Scaled Image */}
        <div className="relative w-[70%] h-[70%] transform group-hover:scale-110 transition-transform duration-500 ease-out">
          <Image
            src={imageSrc}
            alt={getRandomStoreSeoTitle(offer?.merchant?.merchant_name)}
            className="object-contain"
            fill
            sizes="(max-width: 768px) 100px, 120px"
            priority={false}
          />
        </div>
      </div>

      {/* ── Content Section ── */}
      <div className="flex flex-col flex-grow px-0.5">
        {/* Increased Text Size for Merchant */}
        <Link href={merchantHref} className="no-underline">
          <span className="text-[9px] font-black text-gray-400 group-hover:text-[#FF5F1F] uppercase tracking-[0.1em] mb-1 block transition-colors">
            {offer?.merchant?.merchant_name}
          </span>
        </Link>

        {/* Increased Text Size for Title */}
        <div className="h-10 mb-2 overflow-hidden">
          {product?.is_detail === 1 && productDetailUrl ? (
            <Link href={productDetailUrl} className="no-underline">
              <h3 className="text-[12px] font-bold text-[#0D0D0D] leading-tight line-clamp-2 m-0 group-hover:text-[#FF5F1F] transition-colors">
                {discardHTMLTags(product?.offer_title)}
              </h3>
            </Link>
          ) : (
            <h3 className="text-[12px] font-bold text-[#0D0D0D] leading-tight line-clamp-2 m-0">
              {discardHTMLTags(product?.offer_title)}
            </h3>
          )}
        </div>

        {/* Increased Price Size */}
        <div className="flex items-center justify-between mt-auto mb-3">
            <div className="flex items-center gap-1 scale-[0.75] origin-left">
              <RenderRating rating={rating} />
              <span className="text-[10px] text-gray-400 font-bold">({rating})</span>
            </div>

            {(isProduct || salePrice > 0 || originalPrice > 0) && (
              <div className="flex items-center gap-1.5 leading-none">
                {salePrice > 0 && (
                  <span className="text-[12px] font-black text-[#0D0D0D]">
                    {getCurrencySymbol(product?.currency)}{salePrice}
                  </span>
                )}
                {originalPrice > 0 && (
                  <span className="text-[9px] text-gray-400 line-through">
                    {getCurrencySymbol(product?.currency)}{originalPrice}
                  </span>
                )}
              </div>
            )}
        </div>
      </div>

      {/* ── Footer Actions ── */}
      <div className="mt-auto pt-3 border-t border-black/[0.03] space-y-2">
        <div className="flex justify-center">
          <OfferDetailsToggle
            domain={domain}
            imageSrc={product?.product_image}
            merchantHref={merchantHref}
            offer={product}
            type="anchor"
            merchantImg={offer?.merchant?.merchant_logo}
          />
        </div>

        {isCoupon ? (
          <OfferOutUrl
            unique_id={product?.unique_id}
            outUrl={product?.url}
            merchantHref={merchantHref}
            domain={domain}
            customClass="relative w-full py-2.5 rounded-lg bg-[#0D0D0D] flex items-center justify-center overflow-hidden group/btn no-underline transition-all duration-300"
          >
            <span className="text-[9px] font-black text-white uppercase tracking-widest transition-transform duration-300 group-hover/btn:-translate-y-12">
              Show Code
            </span>
            <div className="absolute inset-0 flex flex-col items-center justify-center translate-y-12 group-hover/btn:translate-y-0 transition-transform duration-300 bg-[#FF5F1F]">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                {product?.coupon_code?.trim().split(" ")[0].slice(0, 10)}
              </span>
            </div>
          </OfferOutUrl>
        ) : (
          <OfferOutUrl
            unique_id={product?.unique_id}
            outUrl={product?.url}
            merchantHref={merchantHref}
            domain={domain}
            customClass="w-full py-2.5 rounded-lg bg-[#FF5F1F] text-white text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0D0D0D] transition-all duration-300 no-underline"
          >
            <span>{isProduct ? "Shop Now" : "Claim Deal"}</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform"
            />
          </OfferOutUrl>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
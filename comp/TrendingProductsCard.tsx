import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  calculateOfferDuration,
  discardHTMLTags,
  extractPromoDiscountTag,
  getBaseImageUrl,
  getCurrencySymbol,
} from "@/constants/hooks";
import { OffersOffer } from "@/services/dataTypes";
import OfferOutUrl from "@/components/shared/OfferOutUrl";
import OfferDetailsToggle from "./OfferDetailsToggle";
import { faFire, FontAwesomeIcon, faArrowRight } from "@/constants/icons";
import cookieService from "@/services/CookiesService";

interface Props {
  item: OffersOffer;
  merchantHref: string;
  merchant_logo?: string;
  productDetailUrl?: string | null;
}

const TrendingProductsCard = async ({
  item,
  merchantHref,
  merchant_logo,
  productDetailUrl,
}: Props) => {
  const companyDomain = await cookieService.get("domain");

  const product = item?.offer;
  const type = item?.offer?.offer_type?.name; // usually "product" or "coupon"

  const imageSrc =
    type === "product"
      ? getBaseImageUrl(companyDomain.domain, product?.product_image, "")
      : getBaseImageUrl(companyDomain.domain, merchant_logo || "", "");

  const originalPrice = product?.original_price
    ? parseFloat(product.original_price)
    : 0;
  const salePrice = product?.sale_price ? parseFloat(product.sale_price) : 0;
  const discountPercent =
    originalPrice > 0 && salePrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : null;

  const finalDiscountTag =
    extractPromoDiscountTag(product?.offer_title || product?.offer_detail) ||
    (discountPercent ? `${discountPercent}% Off` : null);

  return (
    <div className="group relative flex flex-col bg-[#1a1612] rounded-[1.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 w-full h-full border border-white/5 hover:border-orange-500/40 flex-grow shadow-2xl">
      
      {/* ── Top Image Section ── */}
      <div className="relative w-full h-[170px] sm:h-[190px] bg-[#14110e] flex-shrink-0 overflow-hidden">
        {/* Subtle Ambient Light Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        
        {/* Time Left - Dark Themed Badge */}
        <div className="absolute top-3 left-3 bg-[#1a1612]/90 backdrop-blur-md border border-white/10 text-orange-500 text-[9px] font-bold px-2.5 py-1 rounded-lg z-20 shadow-md uppercase tracking-tight">
            {calculateOfferDuration(product?.end_date)}
        </div>
        
        {/* Sale Badge - Signature Orange */}
        {finalDiscountTag && (
            <div className="absolute top-3 right-3 bg-orange-600 text-white text-[9px] font-black px-2.5 py-1 rounded-lg z-20 shadow-lg flex items-center gap-1 uppercase tracking-wider">
                <FontAwesomeIcon icon={faFire} className="w-2.5 h-2.5" />
                {finalDiscountTag}
            </div>
        )}

        <Image
            src={imageSrc}
            alt={product?.offer_title || "Offer"}
            fill
            className="object-contain p-7 z-0 transition-transform duration-700 group-hover:scale-105" 
            sizes="(max-width: 480px) 80vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 20vw"
        />
      </div>

      {/* ── Bottom Content Section ── */}
      <div className="p-4 flex flex-col flex-grow relative z-20">
        <div className="flex-grow">
          {product?.is_detail === 1 && productDetailUrl ? (
            <Link href={productDetailUrl} className="no-underline group/title">
              <h3 className="text-[13px] sm:text-[14px] font-bold text-zinc-100 leading-snug line-clamp-2 mb-2.5 min-h-[2.2rem] group-hover/title:text-orange-500 transition-colors tracking-tight">
                {discardHTMLTags(product?.offer_title)}
              </h3>
            </Link>
          ) : (
            <h3 className="text-[13px] sm:text-[14px] font-bold text-zinc-300 leading-snug line-clamp-2 mb-2.5 min-h-[2.2rem] tracking-tight">
              {discardHTMLTags(product?.offer_title)}
            </h3>
          )}

          {/* Prices - Clean Orange Highlight */}
          <div className="flex items-center gap-2 mb-4">
            {salePrice > 0 && (
              <span className="text-base sm:text-lg font-black text-orange-500 tracking-tight">
                {getCurrencySymbol(product?.currency)}
                {salePrice.toFixed(2)}
              </span>
            )}
            {originalPrice > 0 && (
              <span className="text-[10px] font-semibold text-zinc-500 line-through decoration-zinc-700">
                {getCurrencySymbol(product?.currency)}
                {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* ── Action Footer ── */}
        <div className="mt-auto border-t border-white/5 pt-3.5 flex items-center justify-between gap-2">
          {/* View Details Toggle */}
          <div className="text-[10px] sm:text-[11px] text-zinc-400 font-bold hover:text-orange-500 transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer">
            <OfferDetailsToggle
              domain={companyDomain.domain}
              imageSrc={product?.product_image}
              merchantImg={merchant_logo}
              merchantHref={merchantHref}
              offer={product}
              type="anchor"
            />
          </div>

          {/* Shop Button */}
          <div className="flex-shrink-0">
            <div className="inline-block relative">
              <OfferOutUrl
                unique_id={product?.unique_id}
                outUrl={product?.url}
                merchantHref={merchantHref}
                domain={companyDomain.domain}
                customClass="!bg-orange-600 hover:!bg-orange-500 !text-white text-[10px] font-black uppercase tracking-[0.1em] py-2 px-3.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-orange-600/20 inline-flex items-center justify-center gap-1.5 group/btn whitespace-nowrap"
              >
                <span>Shop</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="w-2.5 h-2.5 group-hover/btn:translate-x-1 transition-transform"
                />
              </OfferOutUrl>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Bottom Line Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-500 ease-in-out" />
    </div>
  );
};

export default TrendingProductsCard;
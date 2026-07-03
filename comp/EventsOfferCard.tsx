import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  calculateOfferDuration,
  discardHTMLTags,
  getBaseImageUrl,
  getCurrencySymbol,
  getFinalDiscountTag,
  getRandomStoreSeoTitle,
} from "@/constants/hooks";
import { Offer, ProductData } from "@/services/dataTypes";
import OfferOutUrl from "@/components/shared/OfferOutUrl";
import {
  faCalendarDays,
  faArrowRight,
  FontAwesomeIcon,
} from "@/constants/icons";
import OfferDetailsToggle from "./OfferDetailsToggle";

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
    type === "product"
      ? getBaseImageUrl(domain, product?.product_image, "")
      : getBaseImageUrl(domain, merchant_logo, "");

  const originalPrice = product?.original_price
    ? parseFloat(product?.original_price)
    : 0;
  const salePrice = product?.sale_price ? parseFloat(product?.sale_price) : 0;
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
    <div className="group relative flex flex-col bg-white rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-none rounded-br-none overflow-hidden border border-zinc-400/90 transition-all duration-300 hover:border-[#ff912f] hover:shadow-[0_10px_20px_rgba(255,145,47,0.08)]">
      {/* IMAGE SECTION - Compacted */}
      <div className="relative h-32 m-2 rounded-tr-[1.5rem] rounded-bl-[1.5rem] border-b-2 border-zinc-300/90 bg-[#fafafa] flex items-center justify-center p-4 overflow-hidden">
        {finalDiscountTag && (
          <div className="absolute top-2 right-2 z-20">
            <span className="px-2 py-0.5 text-[9px] font-black uppercase text-white bg-[#111318] rounded-full shadow-lg">
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
            sizes="200px"
            unoptimized
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff912f]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* CONTENT SECTION - Compacted Padding */}
      <div className="flex flex-col flex-1 p-4 pt-1">
        <Link
          href={merchantHref}
          className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ff912f] mb-1 no-underline flex items-center gap-1"
        >
          <span className="w-1 h-1 rounded-full bg-[#ff912f]" />
          {merchant_name}
        </Link>

        {/* Title Area - Compacted Height */}
        <div className="h-10 mb-2">
          {product?.is_detail === 1 && productDetailUrl ? (
            <Link
              href={productDetailUrl}
              className="text-[14px] font-bold text-[#111318] leading-tight line-clamp-2 no-underline group-hover:text-[#ff912f] transition-colors duration-300"
            >
              {discardHTMLTags(product?.offer_title)}
            </Link>
          ) : (
            <h3 className="text-[14px] font-bold text-[#111318] leading-tight line-clamp-2 m-0 group-hover:text-[#ff912f] transition-colors duration-300">
              {discardHTMLTags(product?.offer_title)}
            </h3>
          )}
        </div>

        <div className="flex items-center justify-between mb-3 bg-gray-50/80 px-2 py-1.5 rounded-lg border border-gray-100/50">
          <div className="flex flex-col">
            {type === "product" && (salePrice > 0 || originalPrice > 0) ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-black text-[#111318]">
                  {getCurrencySymbol(product?.currency)}
                  {salePrice}
                </span>
                {originalPrice > 0 && (
                  <span className="text-[10px] text-gray-400 line-through font-medium">
                    {getCurrencySymbol(product?.currency)}
                    {originalPrice}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[8px] font-black text-[#111318] uppercase tracking-widest bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100">
                Verified Deal
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-400">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-[#ff912f]/60 text-[10px]"
            />
            <span>{calculateOfferDuration(product?.end_date)}</span>
          </div>
        </div>

        {/* BUTTONS - Slimmer padding */}
        <div className="mt-auto space-y-2">
          <div className="flex justify-center border-t border-gray-50 pt-2">
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
              customClass="relative w-full py-2.5 rounded-lg border-2 border-dashed border-[#ff912f]/30 bg-[#ff912f]/5 flex items-center justify-center group/btn overflow-hidden transition-all no-underline"
            >
              <span className="text-[11px] font-black text-[#ff912f] uppercase tracking-widest">
                {product?.coupon_code?.trim().split(" ")[0].slice(0, 5)}...
              </span>
              <div className="absolute inset-0 bg-[#ff912f] flex items-center justify-center translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300">
                <span className="text-[11px] font-black text-white uppercase tracking-tighter">
                  Reveal Code
                </span>
              </div>
            </OfferOutUrl>
          ) : (
            <OfferOutUrl
              unique_id={product?.unique_id}
              outUrl={product?.url}
              merchantHref={merchantHref}
              domain={domain}
              customClass="w-full py-2.5 rounded-lg bg-[#111318] text-white text-[10px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-1.5 hover:bg-[#ff912f] transition-all duration-300 no-underline shadow-sm"
            >
              {type === "product" ? "Add to Cart" : "Activate"}
              <FontAwesomeIcon
                icon={faArrowRight}
                className="w-2.5 h-2.5 group-hover:translate-x-1 transition-transform"
              />
            </OfferOutUrl>
          )}
        </div>
      </div>
    </div>
  );
};

export const EventsGrid = ({
  children,
  cols = 4,
}: {
  children: React.ReactNode;
  cols?: number;
}) => {
  const gridCols = cols === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4";
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-6`}
      >
        {children}
      </div>
    </div>
  );
};

export default EventsOfferCard;
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  calculateOfferDuration,
  discardHTMLTags,
  extractPromoDiscountTag,
  getBaseImageUrl,
} from "@/constants/hooks";
import OfferOutUrl from "@/components/shared/OfferOutUrl";
import OfferDetailsToggle from "./OfferDetailsToggle";
import { faFire, FontAwesomeIcon } from "@/constants/icons";

interface Props {
  product: any;
  merchantHref: string;
  domain: string;
  merchant_logo?: string;
  merchant_name?: string;
  productDetailUrl?: string | null;
}

const ProductCard = ({
  product,
  merchantHref,
  domain,
  merchant_logo,
  merchant_name,
  productDetailUrl,
}: Props) => {
  const type = product?.offer_type?.name;

  const imageSrc =
    type === "product"
      ? getBaseImageUrl(domain, product?.product_image, "")
      : getBaseImageUrl(domain, merchant_logo || "", "");

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
    <div className="group relative flex flex-col bg-white rounded-2xl transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] w-full h-full border border-gray-100 flex-grow overflow-hidden">
      {/* IMAGE SECTION */}
      <div className="relative w-full h-[155px] bg-[#fcfcfc] overflow-hidden flex items-center justify-center border-b border-gray-50/50">
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="bg-[#111318] text-white text-[8px] font-black px-2 py-1 rounded-md tracking-tighter uppercase">
            {calculateOfferDuration(product?.end_date)}
          </span>
        </div>

        {finalDiscountTag && (
          <div className="absolute top-2.5 right-2.5 bg-white text-[#ff912f] text-[9px] font-bold px-2 py-1 rounded-md shadow-sm border border-gray-50 flex items-center gap-1 z-20">
            <FontAwesomeIcon icon={faFire} className="w-2.5 h-2.5" />
            {finalDiscountTag}
          </div>
        )}

        <div className="relative w-[65%] h-[65%] transition-transform duration-500 group-hover:scale-105">
          <Image
            src={imageSrc}
            alt={product?.offer_title || "Offer"}
            fill
            className="object-contain mix-blend-multiply"
            sizes="200px"
          />
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand & Price Header */}
        <div className="flex justify-between items-center mb-2 gap-2">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">
            {merchant_name || "Store"}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[14px] font-black text-[#111318]">
              ${(salePrice || originalPrice).toFixed(2)}
            </span>
            {salePrice > 0 && originalPrice > 0 && (
              <span className="text-[10px] text-gray-300 line-through font-medium">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex-grow mb-4">
          {productDetailUrl ? (
            <Link href={productDetailUrl} className="block group/title">
              <h3 className="text-[13px] font-bold text-[#111318] leading-[1.4] line-clamp-2 group-hover/title:text-[#ff912f] transition-colors">
                {discardHTMLTags(product?.offer_title)}
              </h3>
            </Link>
          ) : (
            <h3 className="text-[13px] font-bold text-[#111318] leading-[1.4] line-clamp-2">
              {discardHTMLTags(product?.offer_title)}
            </h3>
          )}
        </div>

        {/* ACTION BAR */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
          <div className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
            <OfferDetailsToggle
              domain={domain}
              imageSrc={product?.product_image}
              merchantImg={merchant_logo}
              merchantHref={merchantHref}
              offer={product}
              type="anchor"
            />
          </div>

          <div className="flex-grow">
            <OfferOutUrl
              unique_id={product?.unique_id}
              outUrl={product?.url}
              merchantHref={merchantHref}
              domain={domain}
              customClass="w-full !bg-[#111318] group-hover:!bg-[#ff912f] !text-white text-[11px] font-black py-2 rounded-xl transition-all duration-300 flex items-center justify-center uppercase tracking-tighter shadow-sm"
            >
              Get Deal
            </OfferOutUrl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

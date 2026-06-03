"use client";
import { Offer, OffersOffer } from "@/services/dataTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import RenderRating from "./RenderRating";
import OfferModal from "./OfferModal";
import {
  discardHTMLTags,
  extractPromoDiscountTag,
  getBaseImageUrl,
  getCurrencySymbol,
  getFinalDiscountTag,
  getMerchantHref,
  getRandomRating,
} from "@/constants/hooks";
import { apiOfferDetails } from "@/apis/offers";
import OfferOutUrl from "@/components/shared/OfferOutUrl";
// import Image from "@/components/shared/Image";
import OfferDuration from "./OfferDuration";
import SocialMediaShare from "./SocialMediaShare";
import SimpleOfferModal from "./SimpleOfferModal";
import OfferDetailsToggle from "./OfferDetailsToggle";

interface Props {
  product: OffersOffer;
  companyId: string;
  awaited_p_id?: string;
  mer_slug_type: string;
  mer_slug: string;
  domain: string;
  ads_campaign: boolean;
}

let renderCount = 0;
const OffersListView = ({
  product,
  companyId,
  awaited_p_id,
  mer_slug_type,
  mer_slug,
  domain,
  ads_campaign,
}: Props) => {
  const [p_data, setP_data] = useState<Offer | null>(null);
  // const [imageSrc, setImageSrc] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const merchantHref = getMerchantHref(
    product.merchant,
    mer_slug,
    mer_slug_type,
  );

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

  const originalPrice = product?.offer?.original_price
    ? parseFloat(product?.offer?.original_price)
    : 0;
  const salePrice = product?.offer?.sale_price
    ? parseFloat(product?.offer?.sale_price)
    : 0;
  const discountPercent =
    originalPrice > 0 && salePrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : null;
  const finalDiscountTag = getFinalDiscountTag(
    product?.offer?.offer_title || product?.offer?.offer_detail,
    discountPercent,
  );

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
      {showModal && ads_campaign && p_data != null && (
        <SimpleOfferModal
          data={p_data}
          onClose={() => setShowModal(false)}
          domain={domain}
          merchantHref={merchantHref}
          finalDiscountTag={finalDiscountTag}
          merchantImg={product?.merchant?.merchant_logo}
        />
      )}

      <div className="w-full mb-4 group/capsule relative select-none">
        <div className="absolute inset-0 bg-neutral-50/60 rounded-tl-2xl rounded-br-2xl transition-all duration-200 group-hover/capsule:scale-[1.001] -z-10" />

        <div className="relative w-full bg-white border border-neutral-200/70 rounded-tl-2xl rounded-br-2xl p-4 md:p-5 transition-all duration-200 group-hover/capsule:border-neutral-400 group-hover/capsule:shadow-[0_10px_28px_rgba(0,0,0,0.02)]">
          <div className="w-full flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center">
              <OfferDuration endDate={product?.offer?.end_date} />
            </div>

            {finalDiscountTag && (
              <span className="bg-neutral-950 text-[#FF5A00] text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded transition-transform duration-200 group-hover/capsule:scale-105">
                {finalDiscountTag}
              </span>
            )}
          </div>

          <div className="hidden">
            Type Name: {product?.offer?.offer_type?.name}, Discount:{" "}
            {finalDiscountTag}
          </div>

          <div className="flex items-start gap-4 w-full mb-3">
            {product?.offer?.product_image && (
              <div className="relative shrink-0 w-20 h-20 md:w-22 md:h-22 bg-neutral-50 rounded-xl border border-neutral-200/80 overflow-hidden flex items-center justify-center transition-all duration-200 group-hover/capsule:bg-white group-hover/capsule:border-neutral-300">
                <div className="relative w-full h-full p-1.5 flex items-center justify-center">
                  <Image
                    src={getBaseImageUrl(
                      domain,
                      product?.offer?.product_image,
                      "",
                    )}
                    alt={
                      product?.offer?.offer_type?.name === "product"
                        ? `${product?.offer?.offer_title || "Product"} image`
                        : `${product?.merchant?.merchant_name} Deals and Coupons`
                    }
                    className="object-contain mix-blend-multiply transition-transform duration-200 group-hover/capsule:scale-102"
                    fill
                    sizes="(max-width: 768px) 80px, 88px"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1.5 self-center">
              <h4 className="text-left text-neutral-800 text-sm md:text-base font-bold tracking-tight leading-snug line-clamp-2 transition-colors duration-200 group-hover/capsule:text-neutral-950">
                {discardHTMLTags(
                  product?.offer?.offer_title?.replaceAll("_", " "),
                )}
              </h4>

              {(product?.offer?.offer_type?.name === "product" ||
                product?.offer?.product_image !== null) && (
                <div className="flex items-baseline gap-2 pt-0.5">
                  {product?.offer?.sale_price && (
                    <span className="font-extrabold text-neutral-950 text-lg md:text-xl tracking-tight transition-colors duration-200 group-hover/capsule:text-[#FF5A00]">
                      {getCurrencySymbol(product?.offer?.currency)}
                      {product?.offer?.sale_price}
                    </span>
                  )}
                  {product?.offer?.original_price && (
                    <span className="text-neutral-400 text-[11px] font-semibold line-through tracking-wide decoration-neutral-200">
                      {getCurrencySymbol(product?.offer?.currency)}
                      {product?.offer?.original_price}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-full border-t border-neutral-100/90 my-3" />

          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-0.5">
            <div className="text-left text-[11px] md:text-xs font-bold text-neutral-400 hover:text-[#FF5A00] transition-colors cursor-pointer underline decoration-neutral-200 hover:decoration-[#FF5A00] underline-offset-4 shrink-0">
              <OfferDetailsToggle
                domain={domain}
                imageSrc={product?.offer?.product_image}
                merchantHref={merchantHref}
                offer={product?.offer}
                type="anchor"
                merchantImg={product?.merchant?.merchant_logo}
              />
            </div>

            <div className="flex items-center justify-center max-h-6 overflow-hidden shrink-0">
              {product?.offer?.unique_id && (
                <div className="flex items-center justify-center [&_span]:hidden [&_p]:hidden [&_h4]:hidden [&_a]:flex [&_a]:items-center">
                  <SocialMediaShare
                    offerUrl={`/${product?.offer?.url}`}
                    offerTitle={product?.offer?.offer_title}
                    merchantHref={merchantHref}
                    unique_id={product?.offer?.unique_id}
                    domain={domain}
                  />
                </div>
              )}
            </div>

            <div className="min-w-[125px] sm:min-w-[145px] w-full sm:w-auto shrink-0">
              {product?.offer?.coupon_code ? (
                <OfferOutUrl
                  unique_id={product?.offer?.unique_id}
                  outUrl={product?.offer?.url}
                  merchantHref={merchantHref}
                  domain={domain}
                  customClass="relative flex items-center justify-center p-[1px] rounded-full border border-dashed border-neutral-300 hover:border-neutral-950 bg-white cursor-pointer w-full group/btn transition-colors duration-200"
                >
                  <div className="bg-neutral-950 group-hover/btn:bg-[#FF5A00] text-white group-hover/btn:text-neutral-950 font-extrabold text-[11px] uppercase tracking-wider w-full rounded-full flex items-center justify-center py-2 px-3 transition-colors duration-200">
                    Show Coupon
                  </div>
                </OfferOutUrl>
              ) : (
                <OfferOutUrl
                  unique_id={product?.offer?.unique_id}
                  outUrl={product?.offer?.url}
                  merchantHref={merchantHref}
                  domain={domain}
                  customClass="flex items-center justify-center bg-neutral-950 hover:bg-[#FF5A00] text-white hover:text-neutral-950 text-[11px] font-extrabold uppercase tracking-wider rounded-full py-2.5 px-4 transition-all duration-200 w-full text-center shadow-xs"
                >
                  <span>
                    {product?.offer?.offer_type?.name === "product"
                      ? "Buy Now"
                      : "Get Deal"}
                  </span>
                </OfferOutUrl>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OffersListView;

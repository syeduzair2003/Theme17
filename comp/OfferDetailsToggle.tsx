"use client";

import React, { useState } from "react";
import OfferModal from "@/components/Theme-17/comp/OfferModal";
import { Offer, ProductData } from "@/services/dataTypes";
import { getFinalDiscountTag } from "@/constants/hooks";
import SimpleOfferModal from "./SimpleOfferModal";

interface Props {
  offer: Offer | ProductData;
  merchantHref: string;
  imageSrc: string;
  merchantImg?: string | null;
  domain: string;
  type: "anchor" | "button";
  buttonClass?: string;
}

const OfferDetailsToggle = ({
  offer,
  merchantHref,
  domain,
  type,
  buttonClass,
  imageSrc,
  merchantImg,
}: Props) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const originalPrice = offer?.original_price
    ? parseFloat(offer?.original_price)
    : 0;
  const salePrice = offer?.sale_price ? parseFloat(offer?.sale_price) : 0;
  const discountPercent =
    originalPrice > 0 && salePrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : null;

  const finalDiscountTag = getFinalDiscountTag(
    offer?.offer_title || offer?.offer_detail,
    discountPercent,
  );

  return (
    <>
      {type === "anchor" ? (
        <span
          onClick={handleClick}
          className={`text-[11px] font-bold text-gray-500 hover:text-[#ff912f] cursor-pointer transition-colors duration-300 underline underline-offset-4 ${buttonClass || ""}`}
        >
          View Details
        </span>
      ) : (
        <button
          onClick={handleClick}
          className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all duration-300 ${buttonClass || "bg-gray-100 text-gray-600 hover:bg-[#8bc94a] hover:text-white"}`}
        >
          View Details
        </button>
      )}

      {showModal && (
        <SimpleOfferModal
          data={offer}
          onClose={() => setShowModal(false)}
          domain={domain}
          finalDiscountTag={finalDiscountTag}
          merchantHref={merchantHref}
          merchantImg={merchantImg}
          productImg={imageSrc}
        />
      )}
    </>
  );
};

export default OfferDetailsToggle;

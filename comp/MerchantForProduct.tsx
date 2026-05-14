import React from "react";
import { getBaseImageUrl, parseDiscountTag } from "@/constants/hooks";
import { faArrowRight, FontAwesomeIcon } from "@/constants/icons";
import Image from "next/image";
import Link from "next/link";

interface Props {
  merchant_name: string;
  merchant_logo: string;
  companyDomain: string;
  merchant_href: string;
  discountTag?: string | null;
}

const MerchantForProduct = async ({
  merchant_name,
  merchant_logo,
  companyDomain,
  merchant_href,
  discountTag,
}: Props) => {
  const parsedDiscount = parseDiscountTag(discountTag);

  return (
    <div className="w-full h-full">
      <Link href={merchant_href} className="group block w-full h-full">
        {/* CARD */}
        <div className="flex flex-col h-full bg-[#111318] border border-white/10 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-bl-xl rounded-tr-xl overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-[#ff912f]/40 transition-all duration-500 relative">
          {/* Discount Badge */}
          {parsedDiscount && (
            <div className="absolute top-4 right-5 bg-[#ff912f] text-white px-3 py-1 rounded-full z-20 shadow-lg">
              <span className="font-black text-[9px] uppercase tracking-tighter">
                {parsedDiscount.value} {parsedDiscount.middle}
              </span>
            </div>
          )}

          {/* CONTENT AREA */}
          <div className="flex flex-col items-center p-6 pt-10 flex-grow text-center">
            <div className="relative w-20 h-20 rounded-full bg-white p-3 shadow-xl mb-6 group-hover:scale-105 transition-transform duration-500 shrink-0 border-4 border-[#1a1c23]">
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                <Image
                  src={getBaseImageUrl(companyDomain, merchant_logo, "")}
                  alt={`${merchant_name} logo`}
                  fill
                  className="object-contain"
                  sizes="80px"
                />
              </div>
            </div>

            {/* Merchant Info */}
            <div className="mb-6">
              <h3 className="text-lg font-black text-white leading-tight line-clamp-1 group-hover:text-[#ff912f] transition-colors">
                {merchant_name}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff912f]"></span>
                <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">
                  Verified Merchant
                </p>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-auto w-full">
              <div className="flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-2xl bg-[#ff912f] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#ff912f]/10 group-hover:bg-white group-hover:text-[#111318] transition-all duration-300">
                <span>Explore Deals</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MerchantForProduct;

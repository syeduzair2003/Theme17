import { getBaseImageUrl, getMerchantHref } from "@/constants/hooks";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  merchant: any;
  companyDomain: string;
  store_slug: string;
  slug_type: string;
}

const MerchantCard = ({
  merchant,
  companyDomain,
  store_slug,
  slug_type,
}: Props) => {
  const href = getMerchantHref(merchant, store_slug, slug_type);
  const firstLetter = merchant.merchant_name?.[0]?.toUpperCase() || "#";

  return (
    <Link
      href={href}
      className="group flex flex-col p-6 bg-[#161412] rounded-[2rem] border border-zinc-800/60 transition-all duration-500 hover:border-[#ff912f]/40 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] hover:-translate-y-1.5 relative overflow-hidden no-underline h-[240px]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#ff912f]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Brand Logo Display Stage */}
        <div className="flex-1 flex items-center justify-center w-full mb-2">
          {merchant.merchant_logo ? (
            <div className="relative w-[85%] h-[95px] flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
              <Image
                src={getBaseImageUrl(companyDomain, merchant.merchant_logo, "")}
                alt={merchant.merchant_name}
                fill
                className="object-contain filter brightness-[0.95] group-hover:brightness-100 transition-all duration-500"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center border border-zinc-800 transition-all duration-500 group-hover:border-[#ff912f]/30 shadow-inner">
              <span className="text-2xl font-light text-zinc-500 group-hover:text-[#ff912f] transition-colors duration-500 font-mono">
                {firstLetter}
              </span>
            </div>
          )}
        </div>

        <div className="relative h-[48px] w-full flex items-center justify-center overflow-hidden">
          <h3 className="text-[15px] font-bold tracking-wide text-zinc-200 text-center line-clamp-1 w-full m-0 transition-all duration-500 ease-out transform group-hover:-translate-y-10 group-hover:opacity-0 px-2">
            {merchant.merchant_name}
          </h3>

          <div className="absolute inset-0 flex items-center justify-center translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <span className="inline-flex items-center justify-center gap-1.5 bg-[#ff912f] text-white px-6 py-2.5 rounded-full text-[11px] font-extrabold tracking-widest uppercase shadow-lg shadow-[#ff912f]/10 hover:bg-[#e07d24] transition-colors duration-300 w-full max-w-[160px]">
              Visit Store
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MerchantCard;

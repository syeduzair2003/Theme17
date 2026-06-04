import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CategoryData,
  EventResponse,
  Merchant,
  Promotion,
} from "@/services/dataTypes";
import { getBaseImageUrl, getMerchantHref } from "@/constants/hooks";
import MobileNavWrapper from "./MobileNavWrapper";
import NavSearch from "./NavSearch";
import NavigationPill from "./NavigationPill";
import ScrollNavbarWrapper from "./ScrollNavbarWrapper";

interface Props {
  merchantData: Merchant[];
  categories: CategoryData[] | any;
  headerPromoMerchant: Merchant[] | null;
  companyDomain: string;
  unique_id: string;
  mer_slug: string;
  mer_slug_type: string;
  promo_slug: string;
  cat_slug: string;
  blog_url?: string;
  blog_title?: string;
  company_logo: string | null;
  events: EventResponse[];
  promotions: Promotion[];
}

const NavbarSec = ({
  unique_id,
  merchantData,
  categories,
  headerPromoMerchant,
  companyDomain,
  mer_slug,
  mer_slug_type,
  cat_slug,
  blog_url,
  blog_title,
  company_logo,
  events,
  promotions,
  promo_slug,
}: Props) => {
  const companyLogo = getBaseImageUrl(
    companyDomain,
    company_logo,
    "/themes/Theme_3/images/logo.png",
  );

  return (
    <header className="fixed top-0 left-0 w-full z-[10000]">
      {headerPromoMerchant && headerPromoMerchant.length > 0 && (
        <div className="w-full bg-[#0D0D0D] border-b border-white/5 hidden md:block relative z-[10020]">
          <div className="max-w-[1400px] mx-auto flex justify-center items-center py-2.5 overflow-hidden whitespace-nowrap">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/30 px-3">
                Featured Luxury Partners:
              </span>
              {headerPromoMerchant.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center group">
                  <Link
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-[#FF5F1F] transition-all px-4"
                    href={getMerchantHref(item, mer_slug, mer_slug_type)}
                  >
                    {item?.merchant_name}
                  </Link>
                  {i !== headerPromoMerchant.slice(0, 5).length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-[#FF5F1F]/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ScrollNavbarWrapper>
        <nav className="relative w-full bg-[#141414] border-b border-white/5 shadow-2xl overflow-visible">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF5F1F]/40 to-transparent" />

          {/* 🔹 RESPONSIVE FIX: px-4 lg:px-4 se layout stretch control mein rahega aur elements wrap ya crop nahi honge */}
          <div className="max-w-[1400px] mx-auto px-4 lg:px-4 xl:px-8 py-5 flex items-center justify-between gap-2">
            
            {/* Logo Container */}
            <div className="flex-shrink-0 flex items-center justify-start z-[10005]">
              <Link
                href="/"
                className="group relative transition-transform duration-300 hover:scale-105 flex-shrink-0"
              >
                <div className="absolute -inset-3 bg-[#FF5F1F]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                {companyLogo && (
                  <Image
                    src={companyLogo}
                    alt="Logo"
                    width={140}
                    height={40}
                    className="relative object-contain brightness-110 contrast-125 invert max-w-[110px] sm:max-w-[140px]"
                    priority
                  />
                )}
              </Link>
            </div>

            {/* Centered Navigation Menu */}
            {/* 🔹 RESPONSIVE FIX: scale-90 lg:scale-95 xl:scale-100 se 1024px screen par menu halka sa slim ho jaye ga taake space ban sake */}
            <div className="hidden lg:flex flex-initial items-center justify-center z-[10001] mx-1 xl:mx-6 transform scale-95 xl:scale-100 transition-all duration-300">
              <div className="bg-[#1A1A1A] rounded-2xl p-0.5 xl:p-1 border border-white/10 hover:border-[#FF5F1F]/30 shadow-sm max-w-full">
                <NavigationPill
                  merchantData={merchantData}
                  categories={categories}
                  mer_slug={mer_slug}
                  mer_slug_type={mer_slug_type}
                  cat_slug={cat_slug}
                  events={events}
                  promotions={promotions}
                  promo_slug={promo_slug}
                  blog_title={blog_title}
                  blog_url={blog_url}
                  companyDomain={companyDomain}
                />
              </div>
            </div>

            {/* Right Action Items (Search + Mobile Burger) */}
            <div className="flex-shrink-0 flex items-center justify-end gap-2 relative z-[10006]">
              <div className="hidden lg:block relative">
                {/* 🔹 RESPONSIVE FIX: Default width ko tight kiya taake 1024px par fits in ho sake aur dropdown perfectly right-0 par open ho */}
                <div className="relative group w-28 xl:w-36 lg:hover:w-[240px] lg:focus-within:w-[240px] xl:hover:w-[280px] xl:focus-within:w-[280px] transition-all duration-500 ease-in-out flex justify-end">
                  <Suspense
                    fallback={
                      <div className="w-28 h-11 rounded-2xl animate-pulse bg-white/5 border border-white/10" />
                    }
                  >
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-[#FF5F1F]/30 via-orange-500/10 to-[#FF5F1F]/30 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 blur-[3px]" />

                    <div className="relative w-full bg-[#141414] group-hover:bg-[#1A1A1A] group-focus-within:bg-[#1A1A1A] rounded-2xl border border-white/5 group-hover:border-white/10 group-focus-within:border-white/10 transition-all duration-500 shadow-inner">
                      <NavSearch
                        companyId={unique_id}
                        mer_slug={mer_slug}
                        slug_type={mer_slug_type}
                        cat_slug={cat_slug}
                      />
                    </div>
                  </Suspense>
                </div>
              </div>

              {/* Mobile Trigger */}
              <div className="lg:hidden flex items-center relative z-[20000] shrink-0">
                <MobileNavWrapper
                  categories={categories || []}
                  merchantData={merchantData || []}
                  events={events || []}
                  promotions={promotions || []}
                  cat_slug={cat_slug}
                  mer_slug={mer_slug}
                  mer_slug_type={mer_slug_type}
                  promo_slug={promo_slug}
                  blog_url={blog_url}
                  blog_title={blog_title}
                  companyLogo={companyLogo}
                  companyId={unique_id}
                  companyDomain={companyDomain}
                />
              </div>
            </div>

          </div>
        </nav>
      </ScrollNavbarWrapper>
    </header>
  );
};

export default NavbarSec;
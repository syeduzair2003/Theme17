"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { faChevronDown, FontAwesomeIcon } from "@/constants/icons";
import {
  getBaseImageUrl,
  getEventsHref,
  getMerchantHref,
  getPromotionHref,
} from "@/constants/hooks";

interface Props {
  merchantData: any[];
  categories: any[];
  mer_slug: string;
  mer_slug_type: string;
  cat_slug: string;
  events: any[];
  promotions: any[];
  promo_slug: string;
  blog_title?: string;
  blog_url?: string;
  companyDomain: string;
}

export default function NavigationPill({
  merchantData,
  categories,
  mer_slug,
  mer_slug_type,
  cat_slug,
  events,
  promotions,
  promo_slug,
  blog_title,
  blog_url,
  companyDomain,
}: Props) {
  const pathname = usePathname() || "";

  const getNavClass = (isActive: boolean) => {
    return `flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${
      isActive
        ? "bg-[#FF5F1F] text-white shadow-[0_0_20px_rgba(255,95,31,0.3)] border border-orange-400/20"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`;
  };

  return (
    <nav className="flex items-center gap-1">
      <Link href="/" className={getNavClass(pathname === "/")}>
        Home
      </Link>

      {/* STORES DROPDOWN */}
      <div className="group relative">
        <div
          className={`cursor-pointer ${getNavClass(pathname.startsWith("/all-stores"))}`}
        >
          {" "}
          Stores{" "}
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
          <div className="bg-[#1A1A1A] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-5 w-[500px] flex flex-col gap-4 backdrop-blur-2xl">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {merchantData?.length > 0 ? (
                merchantData.slice(0, 10).map((item, i) => (
                  <Link
                    key={i}
                    href={getMerchantHref(item, mer_slug, mer_slug_type)}
                    className="flex items-center gap-3 w-full bg-white/[0.02] hover:bg-white/5 p-2 rounded-2xl transition-all group/item border-b border-white/[0.06] hover:border-b-[#FF5F1F]/50"
                  >
                    <span className="w-10 h-10 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 relative flex items-center justify-center group-hover/item:scale-105 transition-transform">
                      {item?.merchant_logo ? (
                        <Image
                          src={getBaseImageUrl(
                            companyDomain,
                            item?.merchant_logo,
                            "",
                          )}
                          alt={item?.merchant_name}
                          layout="fill"
                          objectFit="contain"
                          className="p-1.5"
                        />
                      ) : (
                        <span className="text-black/40 text-[10px] font-bold uppercase text-center leading-[9px]">
                          No Logo
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] font-bold text-white/80 group-hover/item:text-[#FF5F1F] truncate tracking-tight">
                      {item.merchant_name}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-white/40 p-2 italic col-span-2 text-center">
                  No stores available
                </div>
              )}
            </div>

            <Link
              href={`/all-stores/A`}
              className="w-fit mx-auto px-6 py-2.5 text-center text-[11px] font-black uppercase tracking-widest text-white bg-[#FF5F1F] hover:bg-[#ff783e] transition-all duration-300 rounded-xl shadow-[0_4px_15px_rgba(255,95,31,0.2)] flex items-center justify-center gap-2 group/btn mt-1"
            >
              View All Stores{" "}
              <span className="text-white group-hover/btn:translate-x-1 transition-all duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORIES DROPDOWN */}
      <div className="group relative">
        <div
          className={`cursor-pointer ${getNavClass(pathname.includes(`/${cat_slug}`))}`}
        >
          {" "}
          Categories{" "}
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
          <div className="bg-[#1A1A1A] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-5 w-[500px] flex flex-col gap-4 backdrop-blur-2xl">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {categories?.length > 0 ? (
                categories.slice(0, 10).map((item: any, i: number) => (
                  <Link
                    key={i}
                    href={`/${item?.url}`}
                    className="flex items-center gap-3 w-full bg-white/[0.02] hover:bg-white/5 p-2 rounded-2xl transition-all group/cat border-b border-white/[0.06] hover:border-b-[#FF5F1F]/50"
                  >
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-white/10 group-hover/cat:border-[#FF5F1F]/30 transition-colors p-1.5 flex-shrink-0">
                      <Image
                        src={getBaseImageUrl(
                          companyDomain,
                          item?.category_image,
                          "",
                        )}
                        alt={item?.name}
                        height={22}
                        width={22}
                        className="object-cover"
                      />
                    </span>
                    <span className="text-[13px] font-bold text-white/80 group-hover/cat:text-[#FF5F1F] truncate tracking-tight">
                      {item.name}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-sm text-white/40 p-2 italic col-span-2 text-center">
                  No categories available
                </div>
              )}
            </div>

            <Link
              href={`/${cat_slug}`}
              className="w-fit mx-auto px-6 py-2.5 text-center text-[11px] font-black uppercase tracking-widest text-white bg-[#FF5F1F] hover:bg-[#ff783e] transition-all duration-300 rounded-xl shadow-[0_4px_15px_rgba(255,95,31,0.2)] flex items-center justify-center gap-2 group/btn mt-1"
            >
              View All Categories{" "}
              <span className="text-white group-hover/btn:translate-x-1 transition-all duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* PRODUCTS DROPDOWN */}
      <div className="group relative">
        <div
          className={`cursor-pointer ${getNavClass(pathname.startsWith("/all-products") || pathname.startsWith("/products"))}`}
        >
          {" "}
          Products{" "}
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
          <div className="bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-3 flex flex-col gap-2 min-w-[240px] backdrop-blur-2xl">
            <Link
              href="/products"
              className="bg-white/[0.02] hover:bg-white/5 hover:text-[#FF5F1F] p-3 rounded-xl transition-all text-[13px] font-bold text-white/80 border-b border-white/[0.06] hover:border-b-[#FF5F1F]/50"
            >
              Brands Products
            </Link>

            <Link
              href="/all-products"
              className="w-fit mx-auto px-5 py-2 text-center text-[11px] font-black uppercase tracking-widest text-white bg-[#FF5F1F] hover:bg-[#ff783e] transition-all duration-300 rounded-xl shadow-[0_4px_15px_rgba(255,95,31,0.2)] flex items-center justify-center gap-2 group/btn mt-1"
            >
              View All Products{" "}
              <span className="text-white group-hover/btn:translate-x-1 transition-all duration-300">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* EVENTS DROPDOWN */}
      {events?.length > 0 && (
        <div className="group relative">
          <div
            className={`cursor-pointer ${getNavClass(pathname.startsWith("/events"))}`}
          >
            {" "}
            Events{" "}
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180"
            />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
            <div className="bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-3 flex flex-col gap-2 min-w-[240px] backdrop-blur-2xl">
              <div className="flex flex-col gap-1.5">
                {events.slice(0, 5).map((item, i) => (
                  <Link
                    key={i}
                    href={getEventsHref(item, "slug")}
                    className="bg-white/[0.02] hover:bg-white/5 hover:text-[#FF5F1F] p-3 rounded-xl transition-all text-[13px] font-bold text-white/80 border-b border-white/[0.06] hover:border-b-[#FF5F1F]/50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link
                href={`/events`}
                className="w-fit mx-auto px-5 py-2 text-center text-[11px] font-black uppercase tracking-widest text-white bg-[#FF5F1F] hover:bg-[#ff783e] transition-all duration-300 rounded-xl shadow-[0_4px_15px_rgba(255,95,31,0.2)] flex items-center justify-center gap-2 group/btn mt-1"
              >
                View All Events{" "}
                <span className="text-white group-hover/btn:translate-x-1 transition-all duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* PROMOTIONS DROPDOWN */}
      {promotions?.length > 0 && (
        <div className="group relative">
          <div
            className={`cursor-pointer ${getNavClass(pathname.includes(`/${promo_slug}`))}`}
          >
            {" "}
            Promotions{" "}
            <FontAwesomeIcon
              icon={faChevronDown}
              className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180"
            />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
            <div className="bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-3 flex flex-col gap-2 min-w-[240px] backdrop-blur-2xl">
              <div className="flex flex-col gap-1.5">
                {promotions.slice(0, 5).map((item, i) => (
                  <Link
                    key={i}
                    href={getPromotionHref(item, promo_slug)}
                    className="bg-white/[0.02] hover:bg-white/5 hover:text-[#FF5F1F] p-3 rounded-xl transition-all text-[13px] font-bold text-white/80 border-b border-white/[0.06] hover:border-b-[#FF5F1F]/50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <Link
                href={`/${promo_slug}`}
                className="w-fit mx-auto px-5 py-2 text-center text-[11px] font-black uppercase tracking-widest text-white bg-[#FF5F1F] hover:bg-[#ff783e] transition-all duration-300 rounded-xl shadow-[0_4px_15px_rgba(255,95,31,0.2)] flex items-center justify-center gap-2 group/btn mt-1"
              >
                View All Promotion{" "}
                <span className="text-white group-hover/btn:translate-x-1 transition-all duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {blog_title && blog_url && (
        <Link href={blog_url} className={getNavClass(pathname === blog_url)}>
          {blog_title}
        </Link>
      )}
    </nav>
  );
}

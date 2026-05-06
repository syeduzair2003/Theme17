"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { faChevronDown, FontAwesomeIcon } from '@/constants/icons';
import { getBaseImageUrl, getEventsHref, getMerchantHref, getPromotionHref } from '@/constants/hooks';

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
  const pathname = usePathname() || '';

  // Updated to Luxury Dark & Orange Theme
  const getNavClass = (isActive: boolean) => {
    return `flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${
      isActive
        ? 'bg-[#FF5F1F] text-white shadow-[0_0_20px_rgba(255,95,31,0.3)] border border-orange-400/20'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`;
  };

  return (
    <nav className="flex items-center gap-1">
      <Link href="/" className={getNavClass(pathname === '/')}>
        Home
      </Link>

      <div className="group relative">
        <Link href={`/all-stores/A`} className={getNavClass(pathname.startsWith('/all-stores'))}>
          Stores
          <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
        </Link>
        {/* Dropdown Stores - Luxury Night UI */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
          <div className="bg-[#1A1A1A] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-5 w-[480px] flex flex-wrap gap-2 backdrop-blur-2xl">
            {merchantData?.length > 0 ? (
              merchantData.slice(0, 10).map((item, i) => (
                <Link key={i} href={getMerchantHref(item, mer_slug, mer_slug_type)} className="flex items-center gap-3 w-[calc(50%-0.25rem)] hover:bg-white/5 p-2.5 rounded-2xl transition-all group/item border border-transparent hover:border-white/5">
                  <span className="w-10 h-10 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0 relative flex items-center justify-center group-hover/item:scale-105 transition-transform">
                    {item?.merchant_logo ?
                      <Image src={getBaseImageUrl(companyDomain, item?.merchant_logo, "")} alt={item?.merchant_name} layout="fill" objectFit="contain" className="p-1.5" />
                      : <span className="text-black/40 text-[10px] font-bold uppercase text-center leading-[9px]">No Logo</span>
                    }
                  </span>
                  <span className="text-[13px] font-bold text-white/80 group-hover/item:text-[#FF5F1F] truncate">{item.merchant_name}</span>
                </Link>
              ))
            ) : (
              <div className="text-sm text-white/40 p-2 italic">No stores available</div>
            )}
            {merchantData?.length > 10 && (
              <Link href={`/all-stores/A`} className="w-full text-center mt-3 py-2.5 text-[12px] font-black uppercase tracking-widest text-[#FF5F1F] hover:text-white bg-[#FF5F1F]/10 hover:bg-[#FF5F1F] transition-all rounded-xl border border-orange-500/20">View All Stores</Link>
            )}
          </div>
        </div>
      </div>

      <div className="group relative">
        <Link href={`/${cat_slug}`} className={getNavClass(pathname.includes(`/${cat_slug}`))}>
          Categories
          <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
        </Link>
        {/* Dropdown Categories - Luxury Night UI */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
          <div className="bg-[#1A1A1A] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-5 w-[480px] flex flex-wrap gap-2 backdrop-blur-2xl">
            {categories?.length > 0 ? (
              categories.slice(0, 10).map((item: any, i: number) => (
                <Link key={i} href={`/${item?.url}`} className="flex items-center gap-3 w-[calc(50%-0.25rem)] hover:bg-white/5 p-2.5 rounded-2xl transition-all group/cat border border-transparent hover:border-white/5">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover/cat:border-[#FF5F1F]/50 transition-colors p-1.5">
                    <Image src={getBaseImageUrl(companyDomain, item?.category_image, "")} alt={item?.name} height={24} width={24} className="object-contain brightness-200" />
                  </span>
                  <span className="text-[13px] font-bold text-white/80 group-hover/cat:text-[#FF5F1F] truncate">{item.name}</span>
                </Link>
              ))
            ) : (
              <div className="text-sm text-white/40 p-2 italic">No categories available</div>
            )}
          </div>
        </div>
      </div>

      <div className="group relative">
        <Link href="/all-products" className={getNavClass(pathname.startsWith('/all-products') || pathname.startsWith('/products'))}>
          Products
          <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
          <div className="bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-2 flex flex-col gap-1 min-w-[240px] backdrop-blur-2xl">
            <Link href="/products" className="hover:bg-[#FF5F1F] hover:text-white p-3 rounded-xl transition-all text-[13px] font-bold text-white/80">
              Brands Products
            </Link>
          </div>
        </div>
      </div>

      {events?.length > 0 && (
        <div className="group relative">
          <Link href={`/events`} className={getNavClass(pathname.startsWith('/events'))}>
            Events
            <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
            <div className="bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-2 flex flex-col gap-1 min-w-[240px] backdrop-blur-2xl">
              {events.slice(0, 5).map((item, i) => (
                <Link key={i} href={getEventsHref(item, "slug")} className="hover:bg-[#FF5F1F] hover:text-white p-3 rounded-xl transition-all text-[13px] font-bold text-white/80">
                  {item.name}
                </Link>
              ))}
              {events.length > 5 && (
                <Link href={`/events`} className="hover:bg-white/5 p-3 text-center rounded-xl transition-colors text-[11px] font-black uppercase tracking-widest text-[#FF5F1F] mt-1 border-t border-white/5">View All Events</Link>
              )}
            </div>
          </div>
        </div>
      )}

      {promotions?.length > 0 && (
        <div className="group relative">
          <Link href={`/${promo_slug}`} className={getNavClass(pathname.includes(`/${promo_slug}`))}>
            Promotions
            <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 transition-transform duration-300 group-hover:rotate-180" />
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-max z-[100]">
            <div className="bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 p-2 flex flex-col gap-1 min-w-[240px] backdrop-blur-2xl">
              {promotions.slice(0, 5).map((item, i) => (
                <Link key={i} href={getPromotionHref(item, promo_slug)} className="hover:bg-[#FF5F1F] hover:text-white p-3 rounded-xl transition-all text-[13px] font-bold text-white/80">
                  {item.name}
                </Link>
              ))}
              {promotions.length > 5 && (
                <Link href={`/${promo_slug}`} className="hover:bg-white/5 p-3 text-center rounded-xl transition-colors text-[11px] font-black uppercase tracking-widest text-[#FF5F1F] mt-1 border-t border-white/5">View All Deals</Link>
              )}
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
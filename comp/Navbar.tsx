import React, { Suspense } from 'react'
import Link from "next/link";
import Image from "next/image";
import { CategoryData, EventResponse, Merchant, Promotion } from '@/services/dataTypes'
import { getBaseImageUrl, getMerchantHref } from '@/constants/hooks';
import MobileNavWrapper from './MobileNavWrapper';
import NavSearch from './NavSearch';
import NavigationPill from './NavigationPill';

interface Props {
  merchantData: Merchant[],
  categories: CategoryData[] | any,
  headerPromoMerchant: Merchant[] | null,
  companyDomain: string,
  unique_id: string,
  mer_slug: string,
  mer_slug_type: string,
  promo_slug: string,
  cat_slug: string,
  blog_url?: string,
  blog_title?: string,
  company_logo: string | null,
  events: EventResponse[],
  promotions: Promotion[],
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
  promo_slug 
}: Props) => {
  
  const companyLogo = getBaseImageUrl(companyDomain, company_logo, "/themes/Theme_3/images/logo.png");

  return (
    <header className="fixed top-0 left-0 w-full z-[10000]">
      {/* ── Top Ticker ── */}
      {headerPromoMerchant && headerPromoMerchant.length > 0 && (
        <div className="w-full bg-[#0D0D0D] border-b border-white/5 hidden md:block relative z-[10001]">
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

      {/* ── Main Navbar ── */}
      <nav className="relative w-full bg-[#141414] border-b border-white/5 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF5F1F]/40 to-transparent" />

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 flex items-center">
          
          {/* 1. LEFT: Branding */}
          <div className="flex-1 flex items-center justify-start z-[10005]">
            <Link href="/" className="group relative transition-transform duration-300 hover:scale-105 flex-shrink-0">
              <div className="absolute -inset-3 bg-[#FF5F1F]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              {companyLogo && (
                <Image
                  src={companyLogo}
                  alt="Logo"
                  width={150}
                  height={45}
                  className="relative object-contain brightness-110 contrast-125 invert"
                  priority
                />
              )}
            </Link>
          </div>

          {/* 2. CENTER: Navigation Pill (Shifted Left for Space) */}
          <div className="hidden lg:flex flex-none items-center justify-center z-[10001] lg:mr-12">
            <div className="bg-[#1A1A1A] rounded-2xl p-1 border border-white/10 hover:border-[#FF5F1F]/30 transition-all duration-300 shadow-sm">
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

          {/* 3. RIGHT: Actions */}
          <div className="flex-1 flex items-center justify-end gap-3 lg:gap-6 relative z-[10006]">
            
            {/* Search Bar: Desktop */}
            <div className="hidden lg:block relative">
              <div className="relative group w-32 hover:w-[280px] focus-within:w-[280px] transition-all duration-500 ease-in-out flex justify-end">
                <Suspense fallback={<div className="w-32 h-11 rounded-2xl animate-pulse bg-white/5 border border-white/10" />}>
                  {/* Glow Effect */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-[#FF5F1F]/30 via-orange-500/10 to-[#FF5F1F]/30 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 blur-[3px]" />
                  
                  {/* Container: Removed overflow-hidden to show search results */}
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

            {/* Mobile Menu */}
            <div className='lg:hidden flex items-center relative z-[20000] shrink-0'>
              <div className="p-2.5 bg-[#FF5F1F] rounded-xl shadow-[0_0_20px_rgba(255,95,31,0.2)] hover:bg-orange-600 active:scale-90 transition-all border border-orange-400/10">
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

        </div>
      </nav>
    </header>
  )
}

export default NavbarSec;
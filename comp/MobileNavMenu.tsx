"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getMerchantHref,
  getPromotionHref,
} from "@/constants/hooks";
import { FontAwesomeIcon } from "@/constants/icons";
import { faChevronDown, faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import NavSearch from "./NavSearch";

interface Props {
  companyId: string;
  companyLogo: string;
  companyDomain: string;
  categories?: any[];
  merchantData?: any[];
  events?: any[];
  promotions?: any[];
  blog_title?: string | null;
  blog_url?: string | null;
  mer_slug: string;
  cat_slug: string;
  mer_slug_type: string;
  promo_slug: string;
}

export default function MobileNavMenu({
  companyId,
  companyLogo,
  companyDomain,
  categories = [],
  merchantData = [],
  events = [],
  promotions = [],
  blog_title,
  blog_url,
  mer_slug,
  cat_slug,
  mer_slug_type,
  promo_slug,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);

  const handleToggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSection(null);
  };

  const renderSection = (
    title: string,
    sectionName: string,
    items: any[],
    renderLink: (item: any) => { href: string; label: string },
    viewAllHref?: string
  ) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    return (
      <li className="border-b border-gray-100 last:border-0 relative">
        <div
          className="flex justify-between items-center py-4 px-5 w-full text-left font-semibold text-gray-800 hover:bg-[#f4f9f0] hover:text-[#8bc94a] transition-all cursor-pointer"
          onClick={() => handleToggleSection(sectionName)}
        >
          <span className="text-[14px]">{title}</span>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openSection === sectionName ? 'bg-[#8bc94a] text-white' : 'bg-gray-100 text-gray-500'}`}>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-3 h-3 transition-transform duration-300 ${
                openSection === sectionName ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#F4F7F6]/50 ${
            openSection === sectionName ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="py-2 px-6 flex flex-col gap-1">
            {items.slice(0, 10).map((item, i) => {
              const { href, label } = renderLink(item);
              return (
                <li key={i}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className="block py-2.5 text-[13px] font-medium text-gray-600 hover:text-[#ff912f] hover:translate-x-1 transition-all truncate"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
            {viewAllHref && (
              <li>
                <Link
                  href={viewAllHref}
                  onClick={closeMenu}
                  className="inline-block py-2 text-[12px] font-bold text-[#8bc94a] hover:text-[#ff912f] transition-colors mt-2"
                >
                  View All {title} &rarr;
                </Link>
              </li>
            )}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <>
      <button
        type="button"
        aria-label="Toggle mobile menu"
        onClick={toggle}
        style={{ 
          display: 'flex',
          visibility: 'visible',
          opacity: 1,
          zIndex: 20010,
          pointerEvents: 'auto',
          minWidth: '44px',
          width: '44px',
          height: '44px',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4f9f0',
          border: '1px solid rgba(139,201,74,0.3)',
          borderRadius: '12px',
          color: '#8bc94a',
          position: 'relative',
          marginLeft: '8px',
          marginRight: '8px',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '24px', height: '24px' }}>
           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-16 6h16" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[1050] bg-[#111]/40 backdrop-blur-sm transition-all duration-400 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 w-[85%] max-w-[380px] h-full bg-white shadow-[10px_0_40px_rgba(0,0,0,0.1)] z-[1100] transform transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col rounded-r-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white rounded-tr-2xl">
          <Link href="/" onClick={closeMenu} className="block relative h-10 w-28">
            <Image
              src={companyLogo || "/themes/Theme_3/images/logo.png"}
              alt="Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Link>
          <button
            onClick={closeMenu}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white hover:rotate-90 transition-all duration-300"
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        </div>

        {/* Search container pulled OUT of scroll area so dropdown isn't clipped */}
        <div className="p-4 pb-3 bg-gray-50/50 border-b border-gray-100 relative z-[1200]">
          <div className="pointer-events-auto w-full relative">
            <React.Suspense fallback={<div className="w-full h-10 bg-gray-100 animate-pulse rounded-xl"></div>}>
              <NavSearch
                companyId={companyId}
                mer_slug={mer_slug}
                slug_type={mer_slug_type}
                cat_slug={cat_slug}
              />
            </React.Suspense>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <nav className="p-2 pt-4 pb-10">
            <ul className="flex flex-col bg-white border border-gray-100 rounded-2xl mx-3 overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <li className="border-b border-gray-100">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block py-4 px-5 text-[14px] font-semibold text-gray-800 hover:text-[#8bc94a] hover:bg-[#f4f9f0] transition-colors"
                >
                  Home
                </Link>
              </li>

              {renderSection("Stores", "stores", merchantData, (m) => ({
                href: getMerchantHref(m, mer_slug, mer_slug_type),
                label: m.merchant_name,
              }), "/all-stores/A")}

              {renderSection("Categories", "categories", categories, (c) => ({
                href: `/${c?.url || c?.category_slug}`,
                label: c.name || c.category_name,
              }), `/${cat_slug}`)}

              {renderSection("Events", "events", events, (e) => ({
                href: getPromotionHref(e, promo_slug),
                label: e.name,
              }), "/events")}

              {renderSection("Promotions", "promotions", promotions, (p) => ({
                href: getPromotionHref(p, promo_slug),
                label: p.name,
              }), `/${promo_slug}`)}

              <li className="border-b border-gray-100">
                <div
                  className="flex justify-between items-center py-4 px-5 w-full text-left font-semibold text-gray-800 hover:text-[#8bc94a] hover:bg-[#f4f9f0] transition-colors cursor-pointer"
                  onClick={() => handleToggleSection("products")}
                >
                  <span className="text-[14px]">Products</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openSection === "products" ? 'bg-[#8bc94a] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`w-3 h-3 transition-transform duration-300 ${
                        openSection === "products" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#F4F7F6]/50 ${
                    openSection === "products" ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="py-2 px-6">
                    <li>
                      <Link
                        href="/products"
                        onClick={closeMenu}
                        className="block py-2 text-[13px] font-medium text-gray-600 hover:text-[#ff912f] hover:translate-x-1 transition-all"
                      >
                        Brands Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/all-products"
                        onClick={closeMenu}
                        className="inline-block py-2 text-[12px] font-bold text-[#8bc94a] hover:text-[#ff912f] transition-colors mt-2"
                      >
                        View All Products &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>

            {blog_title && blog_url && (
              <div className="mt-6 mx-3">
                <Link
                  href={blog_url}
                  target="_blank"
                  onClick={closeMenu}
                  className="block w-full py-3.5 px-5 text-[14px] font-bold text-white bg-gradient-to-r from-[#8bc94a] to-[#ff912f] hover:shadow-lg hover:shadow-[#8bc94a]/30 transition-all rounded-xl text-center"
                >
                  {blog_title}
                </Link>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}

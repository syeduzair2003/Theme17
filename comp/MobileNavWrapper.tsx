"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { getMerchantHref, getPromotionHref } from "@/constants/hooks";
import { FontAwesomeIcon } from "@/constants/icons";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";

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

export default function MobileNavWrapper({
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

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggle = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    document.body.style.overflow = next ? "hidden" : "";
  }, [isOpen]);

  const handleToggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setOpenSection(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, searchParams, closeMenu]);

  const renderSection = (
    title: string,
    sectionName: string,
    items: any[],
    renderLink: (item: any) => { href: string; label: string },
    viewAllHref?: string,
  ) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    const isSectionOpen = openSection === sectionName;

    return (
      <li className="border-b border-zinc-900/40 last:border-0 relative transition-all duration-300">
        <div
          className={`flex justify-between items-center py-4 px-5 w-full text-left font-bold transition-all cursor-pointer select-none ${
            isSectionOpen
              ? "bg-white/[0.02] text-[#FF5F1F]"
              : "text-zinc-300 hover:bg-white/[0.01] hover:text-[#FF5F1F]"
          }`}
          onClick={() => handleToggleSection(sectionName)}
        >
          <span className="text-[13px] tracking-widest uppercase font-extrabold">
            {title}
          </span>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${isSectionOpen ? "bg-[#FF5F1F] text-black border-transparent" : "bg-zinc-950 text-zinc-500 border-zinc-800/80"}`}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`w-2.5 h-2.5 transition-transform duration-300 ease-out ${isSectionOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out bg-black/20 ${isSectionOpen ? "max-h-[800px] opacity-100 border-t border-zinc-900/50" : "max-h-0 opacity-0 pointer-events-none"}`}
        >
          <ul className="p-3 flex flex-col gap-2">
            {items.slice(0, 10).map((item, i) => {
              const { href, label } = renderLink(item);
              return (
                <li key={i}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-[#FF5F1F]/40 hover:bg-zinc-800/60 transition-all group no-underline"
                  >
                    <span className="flex items-center gap-3 text-[13px] font-medium text-zinc-300 group-hover:text-white transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F]" />
                      {label}
                    </span>
                    <span className="text-zinc-600 group-hover:text-[#FF5F1F] transition-colors text-[10px]">
                      &rarr;
                    </span>
                  </Link>
                </li>
              );
            })}
            {viewAllHref && (
              <li className="mt-1">
                <Link
                  href={viewAllHref}
                  onClick={closeMenu}
                  className="flex items-center justify-center py-3 w-full text-[11px] font-black text-[#FF5F1F] hover:text-white bg-[#FF5F1F]/5 hover:bg-[#FF5F1F] transition-all rounded-lg uppercase tracking-wider no-underline border border-[#FF5F1F]/20"
                >
                  View All {title}
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
        className="flex items-center justify-center p-2.5 bg-[#FF5F1F] text-white rounded-xl shadow-[0_0_20px_rgba(255,95,31,0.2)] hover:bg-orange-600 active:scale-90 transition-all border border-orange-400/10 shrink-0 relative z-[100000]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.3}
          stroke="currentColor"
          className="w-[22px] h-[22px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-[99990] bg-black/70 backdrop-blur-md transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}`}
        onClick={closeMenu}
      />

      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[430px] z-[99995] pointer-events-auto flex flex-col bg-[#110e0c] border-r border-zinc-900/60 shadow-[5px_0_50px_rgba(0,0,0,0.9)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-900/50 bg-[#161412] relative">
          <Link
            href="/"
            onClick={closeMenu}
            className="block relative h-9 w-28"
          >
            <Image
              src={companyLogo || "/themes/Theme_3/images/logo.png"}
              alt="Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </Link>
          <button
            onClick={closeMenu}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800/40"
          >
            <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
          <nav className="p-3 pt-5 pb-8">
            <ul className="flex flex-col bg-[#161412] border border-zinc-900/80 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
              {/* HOME LINK - Styled same as other headers */}
              <li className="border-b border-zinc-900/40">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block py-4 px-5 text-zinc-300 hover:text-[#FF5F1F] hover:bg-white/[0.01] transition-all no-underline text-[13px] tracking-widest uppercase font-extrabold"
                >
                  Home
                </Link>
              </li>

              {/* DYNAMIC SECTIONS */}
              {renderSection(
                "Stores",
                "stores",
                merchantData,
                (m) => ({
                  href: getMerchantHref(m, mer_slug, mer_slug_type),
                  label: m.merchant_name,
                }),
                "/all-stores/A",
              )}
              {renderSection(
                "Categories",
                "categories",
                categories,
                (c) => ({
                  href: `/${c?.url || c?.category_slug}`,
                  label: c.name || c.category_name,
                }),
                `/${cat_slug}`,
              )}
              {renderSection(
                "Events",
                "events",
                events,
                (e) => ({ href: `/${e?.slug || "events"}`, label: e.name }),
                "/events",
              )}
              {renderSection(
                "Promotions",
                "promotions",
                promotions,
                (p) => ({
                  href: getPromotionHref(p, promo_slug),
                  label: p.name,
                }),
                `/${promo_slug}`,
              )}

              {/* PRODUCTS SECTION */}
              <li className="border-b border-zinc-900/40 relative">
                <div
                  className={`flex justify-between items-center py-4 px-5 w-full text-left font-bold transition-all cursor-pointer select-none ${openSection === "products" ? "bg-white/[0.02] text-[#FF5F1F]" : "text-zinc-300 hover:bg-white/[0.01] hover:text-[#FF5F1F]"}`}
                  onClick={() => handleToggleSection("products")}
                >
                  <span className="text-[13px] tracking-widest uppercase font-extrabold">
                    Products
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${openSection === "products" ? "bg-[#FF5F1F] text-black border-transparent" : "bg-zinc-950 text-zinc-500 border-zinc-800/80"}`}
                  >
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`w-2.5 h-2.5 transition-transform duration-300 ${openSection === "products" ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out bg-black/20 ${openSection === "products" ? "max-h-[200px] opacity-100 border-t border-zinc-900/50" : "max-h-0 opacity-0 pointer-events-none"}`}
                >
                  <ul className="p-3 flex flex-col gap-2">
                    <li>
                      <Link
                        href="/products"
                        onClick={closeMenu}
                        className="flex items-center justify-between py-3 px-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-[#FF5F1F]/40 hover:bg-zinc-800/60 transition-all group no-underline"
                      >
                        <span className="text-[13px] font-medium text-zinc-300 group-hover:text-white">
                          Brands Products
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/all-products"
                        onClick={closeMenu}
                        className="flex items-center justify-center py-3 w-full text-[11px] font-black text-[#FF5F1F] hover:text-white bg-[#FF5F1F]/5 hover:bg-[#FF5F1F] transition-all rounded-lg uppercase tracking-wider no-underline border border-[#FF5F1F]/20"
                      >
                        View All Products
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
                  className="block w-full py-3.5 px-5 text-[11px] font-black text-white bg-gradient-to-r from-[#FF5F1F] to-[#e07d24] active:scale-[0.98] hover:shadow-[0_0_25px_rgba(255,95,31,0.15)] transition-all rounded-xl text-center uppercase tracking-widest no-underline"
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

const LazyNavSearch = React.lazy(() => import("./NavSearch"));

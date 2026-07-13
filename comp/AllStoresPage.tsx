import { apiGetMerchantsAlphabetically } from "@/apis/merchant";
import cookieService from "@/services/CookiesService";
import { MerchantResponse } from "@/services/dataTypes";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getMerchantHref, getBaseImageUrl } from "@/constants/hooks";
import MerchantCard from "./MerchantCard";
import BreadcrumbSection from "./BreadcrumbSection";

interface Props {
  store_slug: string;
  slug_type: string;
  company_id: string;
  slug: string;
  page?: string;
}

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PAGE_SIZE = 36;

const AllStoresPage = async ({
  store_slug,
  slug_type,
  company_id,
  slug,
  page,
}: Props) => {
  const companyDomain = (await cookieService.get("domain"))?.domain || "";
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const apiSlug = slug === "other" ? "#" : slug;

  if (slug.length > 1 && slug !== "other") {
    return notFound();
  }

  const merchantData: MerchantResponse = (
    await apiGetMerchantsAlphabetically(
      company_id,
      apiSlug,
      PAGE_SIZE,
      currentPage,
    )
  )?.data;

  const filteredMerchants =
    slug === "other"
      ? merchantData?.merchants?.filter(
          (item) =>
            !item.merchant_name || !/^[A-Z]/i.test(item.merchant_name.trim()),
        )
      : merchantData?.merchants?.filter((item) =>
          item.merchant_name?.toUpperCase().startsWith(slug.toUpperCase()),
        );

  const totalPages = merchantData?.pagination?.last_page || 1;
  const paginatedMerchants =
    filteredMerchants
      ?.sort((a, b) => a.merchant_name.localeCompare(b.merchant_name))
      ?.slice(0, PAGE_SIZE) || [];

  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
  const baseUrl = `/all-stores/${slug}`;

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16 relative overflow-hidden text-slate-800">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#ff912f]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Breadcrumb Header Row */}
      <div className="w-full bg-white/80 border-b border-black/[0.05] backdrop-blur-md">
        <BreadcrumbSection
          title="All-Stores"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "All Stores", href: "/all-stores/A" },
            { label: slug },
          ]}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12 relative z-10">
        {/* Brand Directory Toggle Header */}
        <div className="flex justify-center mb-12 w-full px-2">
          <div className="group relative flex items-center justify-center w-full max-w-[160px] hover:max-w-3xl max-h-20 hover:min-h-[190px] p-4 bg-gradient-to-b from-white to-slate-50 border border-black/[0.08] rounded-2xl backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(255,145,47,0.1)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden cursor-pointer">
            <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-90 group-hover:pointer-events-none">
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#ff912f] font-black opacity-90 mb-1">
                BRAND DIRECTORY
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-800 tracking-widest">
                  {slug.toUpperCase() === "OTHER" ? "#" : slug.toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 animate-pulse">
                  ▼
                </span>
              </div>
            </div>

            <div className="w-full opacity-0 scale-95 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-600 ease-out pointer-events-none group-hover:pointer-events-auto grid grid-cols-7 sm:grid-cols-9 gap-2.5 justify-items-center items-center py-2">
              {ALPHABETS.map((alpha) => {
                const isActive = slug.toUpperCase() === alpha;
                return (
                  <Link
                    key={alpha}
                    href={`/all-stores/${alpha}`}
                    className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-[13px] sm:text-[14px] font-black tracking-wider transition-all duration-300 no-underline ${
                      isActive
                        ? "bg-[#ff912f] text-white scale-110 shadow-lg shadow-[#ff912f]/20 border-transparent z-10"
                        : "bg-white text-slate-600 border border-black/5 hover:border-[#ff912f]/40 hover:text-[#ff912f] hover:bg-[#ff912f]/5 hover:-translate-y-0.5"
                    }`}
                  >
                    {alpha}
                  </Link>
                );
              })}

              <Link
                href={`/all-stores/other`}
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-[13px] sm:text-[14px] font-black transition-all duration-300 no-underline ${
                  slug.toLowerCase() === "other"
                    ? "bg-[#ff912f] text-white scale-110 shadow-lg shadow-[#ff912f]/20 border-transparent z-10"
                    : "bg-white text-slate-600 border border-black/5 hover:border-[#ff912f]/40 hover:text-[#ff912f] hover:bg-[#ff912f]/5 hover:-translate-y-0.5"
                }`}
              >
                #
              </Link>
            </div>
          </div>
        </div>

        <div
          className="w-full max-w-4xl mx-auto h-[1px] mb-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,145,47,0.1), rgba(255,145,47,0.4), rgba(255,145,47,0.1), transparent)",
          }}
        />

        {/* STORES GRID AREA */}
        {paginatedMerchants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pb-12">
            {paginatedMerchants.map((item, i) => (
              <MerchantCard
                key={i}
                merchant={item}
                companyDomain={companyDomain}
                store_slug={store_slug}
                slug_type={slug_type}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-black/[0.06] rounded-[2.5rem] shadow-xl backdrop-blur-md">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-black/[0.05] shadow-inner">
              <span className="text-2xl text-[#ff912f] font-black tracking-widest">
                {slug.toUpperCase()}
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              No Premium Stores Found
            </h4>
            <p className="text-slate-500 mt-2 text-sm max-w-xs text-center font-medium">
              Try browsing another premium alphabet index.
            </p>
          </div>
        )}

        {/* PAGINATION LAYOUT WRAPPER */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-20 pt-8 border-t border-black/[0.06] pb-6">
            <div className="flex items-center bg-white border border-black/[0.06] h-[58px] rounded-full p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] select-none backdrop-blur-md">
              {currentPage === 1 ? (
                <div className="flex items-center gap-2 text-slate-300 font-black text-[11px] uppercase tracking-[0.15em] pl-6 pr-5 cursor-not-allowed">
                  <span>‹</span> <span>PREV</span>
                </div>
              ) : (
                <Link
                  href={`${baseUrl}/page/${prevPage}`}
                  className="flex items-center gap-2 text-slate-600 hover:text-[#ff912f] font-black text-[11px] uppercase tracking-[0.15em] pl-6 pr-5 no-underline transition-colors duration-200"
                >
                  <span>‹</span> <span>PREV</span>
                </Link>
              )}

              <div className="h-6 w-[1px] bg-black/[0.08]" />

              {/* Page Counter */}
              <div className="flex items-baseline px-7 font-mono font-black text-sm tracking-widest">
                <span className="text-[#ff912f] text-base">{currentPage}</span>
                <span className="text-slate-300 mx-2.5 font-sans text-xs">
                  /
                </span>
                <span className="text-slate-600">{totalPages}</span>
              </div>

              <div className="h-6 w-[1px] bg-black/[0.08]" />

              {currentPage === totalPages ? (
                <div className="flex items-center justify-center h-full px-7 rounded-full bg-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-[0.15em] ml-3 cursor-not-allowed">
                  <span>NEXT</span> <span className="ml-1.5">›</span>
                </div>
              ) : (
                <Link
                  href={`${baseUrl}/page/${nextPage}`}
                  className="flex items-center justify-center h-full px-7 rounded-full bg-[#ff912f] text-white hover:bg-[#e07d24] font-black text-[11px] uppercase tracking-[0.15em] no-underline transition-all duration-300 shadow-md hover:shadow-[#ff912f]/10 ml-3 group"
                >
                  <span>NEXT</span>
                  <span className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-0.5">
                    ›
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllStoresPage;

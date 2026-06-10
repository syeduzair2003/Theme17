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
const PAGE_SIZE = 36; // Multiples of 4 are better for grid-cols-4

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
    <div className="bg-[#110e0c] min-h-screen pb-16 relative overflow-hidden text-gray-200">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#ff912f]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full bg-black/40 border-b border-gray-900/60 backdrop-blur-md">
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
        <div className="flex justify-center mb-12 w-full px-2">
          <div className="group relative flex items-center justify-center w-full max-w-[160px] hover:max-w-3xl max-h-20 hover:min-h-[190px] p-4 bg-gradient-to-b from-[#161920]/80 to-[#0b0d11]/90 border border-gray-800/60 rounded-2xl backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] hover:shadow-[0_0_50px_rgba(255,145,47,0.08)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden cursor-pointer">
            <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-90 group-hover:pointer-events-none">
              <span className="text-[9px] tracking-[0.35em] uppercase text-[#ff912f] font-black opacity-80 mb-1">
                BRAND DIRECTORY
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white tracking-widest">
                  {slug.toUpperCase() === "OTHER" ? "#" : slug.toUpperCase()}
                </span>
                <span className="text-[10px] text-gray-500 animate-pulse">
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
                        ? "bg-[#ff912f] text-black scale-110 shadow-lg shadow-[#ff912f]/20 border-transparent z-10"
                        : "bg-black/40 text-gray-400 border border-gray-900 hover:border-[#ff912f]/40 hover:text-white hover:bg-[#ff912f]/5 hover:-translate-y-0.5"
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
                    ? "bg-[#ff912f] text-black scale-110 shadow-lg shadow-[#ff912f]/20 border-transparent z-10"
                    : "bg-black/40 text-gray-400 border border-gray-900 hover:border-[#ff912f]/40 hover:text-white hover:bg-[#ff912f]/5 hover:-translate-y-0.5"
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
              "linear-gradient(90deg, transparent, rgba(255,145,47,0.1), rgba(255,145,47,0.3), rgba(255,145,47,0.1), transparent)",
          }}
        ></div>

        {/* STORES DISPLAY GRID */}
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
          <div className="flex flex-col items-center justify-center py-24 bg-black/30 border border-gray-900/60 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
            <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center mb-5 border border-gray-800/80 shadow-inner">
              <span className="text-2xl text-[#ff912f] font-black tracking-widest">
                {slug.toUpperCase()}
              </span>
            </div>
            <h4 className="text-xl font-black text-white tracking-tight uppercase">
              No Premium Stores Found
            </h4>
            <p className="text-gray-500 mt-2 text-sm max-w-xs text-center font-medium">
              Try browsing another premium alphabet index.
            </p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-20 pt-8 border-t border-gray-900/40 pb-6">
            <div className="flex items-center bg-black/50 border border-gray-900/50 h-[58px] rounded-full p-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] select-none backdrop-blur-md">
              {currentPage === 1 ? (
                <div className="flex items-center gap-2 text-gray-800/60 font-black text-[11px] uppercase tracking-[0.15em] pl-6 pr-5 cursor-not-allowed">
                  <span>‹</span> <span>PREV</span>
                </div>
              ) : (
                <Link
                  href={`${baseUrl}/page/${prevPage}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-[#ff912f] font-black text-[11px] uppercase tracking-[0.15em] pl-6 pr-5 no-underline transition-colors duration-200"
                >
                  <span>‹</span> <span>PREV</span>
                </Link>
              )}

              <div className="h-6 w-[1px] bg-gray-800/60" />

              <div className="flex items-baseline px-7 font-mono font-black text-sm tracking-widest">
                <span className="text-[#ff912f] text-base">{currentPage}</span>
                <span className="text-gray-600 mx-2.5 font-sans text-xs">
                  /
                </span>
                <span className="text-gray-400/90">{totalPages}</span>
              </div>

              <div className="h-6 w-[1px] bg-gray-800/60" />

              {currentPage === totalPages ? (
                <div className="flex items-center justify-center h-full px-7 rounded-full bg-gray-900/40 text-gray-700 font-black text-[11px] uppercase tracking-[0.15em] ml-3 cursor-not-allowed">
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

import {
  Merchant,
  SearchCategories,
  SearchResponse,
} from "@/services/dataTypes";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import cookieService from "@/services/CookiesService";
import { getBaseImageUrl } from "@/constants/hooks";
import { ArrowRight, Search, Sparkles } from "lucide-react";

interface Props {
  slug_type: string;
  mer_slug: string;
  cat_slug: string;
  searchData: SearchResponse;
  query: string;
}

const SearchPage = async ({
  slug_type,
  mer_slug,
  cat_slug,
  searchData,
  query,
}: Props) => {
  const getHref = (store: Merchant) =>
    `/${mer_slug}/${store[slug_type as keyof Merchant] || store.slug}`;
  const getCatHref = (category: SearchCategories) =>
    `/${cat_slug}/${category[slug_type as keyof SearchCategories] || category.slug}`;
  const companyDomain = await cookieService.get("domain");

  if (!searchData?.merchants?.length && !searchData?.categories?.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 sm:p-20 min-h-[500px] flex items-center justify-center text-center relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center gap-6 relative z-10 max-w-sm">
          <div className="w-20 h-20 bg-orange-50/60 border border-orange-100 rounded-3xl flex items-center justify-center text-orange-500 shadow-inner">
            <Search size={32} strokeWidth={2} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              No Matches Found
            </h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              We couldn&apos;t find any premium deals or stores matching{" "}
              <span className="text-orange-500 font-bold">
                &quot;{query}&quot;
              </span>
              .
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 px-8 py-3.5 bg-slate-900 hover:bg-orange-500 text-white rounded-2xl font-bold uppercase text-[11px] tracking-wider transition-all duration-300 shadow-md hover:shadow-orange-500/20"
          >
            Return to Dashboard
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.02] blur-3xl rounded-full pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 p-2 sm:p-6 bg-white">
      {searchData?.merchants?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 uppercase text-[16px]">
              <span className="w-2 h-5 bg-orange-500 rounded-md"></span>
              Stores for &ldquo;{query}&rdquo;
            </h2>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/40">
              {searchData.merchants.length} Results
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchData.merchants.map((merchant: any, i: number) => (
              <Link
                key={i}
                href={getHref(merchant)}
                className="group bg-white border border-slate-100/80 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_25px_50px_rgba(249,115,22,0.07)] hover:border-orange-500/20 hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center gap-5 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-4 shadow-sm group-hover:bg-white group-hover:shadow-md group-hover:border-orange-500/10 transition-all duration-500">
                  <Image
                    src={getBaseImageUrl(
                      companyDomain.domain,
                      merchant.merchant_logo,
                      "",
                    )}
                    alt={merchant.merchant_name}
                    width={90}
                    height={90}
                    className="w-full h-full object-contain filter contrast-[1.01]"
                  />
                </div>

                <div className="w-full flex flex-col items-center gap-4">
                  <h3 className="font-black text-slate-900 text-[16px] tracking-tight group-hover:text-orange-500 transition-colors duration-300">
                    {merchant.merchant_name}
                  </h3>

                  <div className="inline-flex items-center gap-2 text-white bg-slate-900 group-hover:bg-orange-500 font-bold text-[10px] uppercase tracking-wider py-2.5 px-5 rounded-full shadow-sm transition-all duration-300">
                    <span>Visit Store</span>
                    <ArrowRight
                      size={12}
                      strokeWidth={2.5}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {searchData?.categories?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 uppercase text-[16px]">
              <span className="w-2 h-5 bg-slate-200 rounded-md"></span>
              Categories matching &ldquo;{query}&rdquo;
            </h2>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/40">
              {searchData.categories.length} Found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {searchData.categories.map((category: any) => (
              <Link
                key={category.unique_id}
                href={category?.url || getCatHref(category)}
                className="group bg-white border border-slate-100/70 hover:border-orange-500/20 rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] transition-all duration-300 flex items-center justify-between overflow-hidden"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2.5 group-hover:bg-orange-50/50 group-hover:border-orange-100 transition-all duration-300 shrink-0">
                    <Image
                      src={getBaseImageUrl(
                        companyDomain.domain,
                        category?.category_image,
                        "",
                      )}
                      alt={category?.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-black text-slate-800 text-[13px] tracking-tight group-hover:text-orange-500 transition-colors duration-300 uppercase truncate">
                      {category?.name}
                    </h4>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 flex items-center justify-center text-slate-400 transition-all duration-300 shrink-0 mr-1">
                  <ArrowRight size={12} strokeWidth={2.5} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchPage;

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
import { ArrowRight, Search } from "lucide-react";

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
      <div className="bg-white border border-slate-100 rounded-[3rem] p-16 min-h-[500px] flex items-center justify-center relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center text-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-inner">
            <Search size={48} strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-black tracking-tight italic">
              Zero Matches Found
            </h3>
            <p className="text-slate-500 max-w-md text-base font-medium">
              We couldn&apos;t find any stores or categories matching{" "}
              <span className="text-orange-500 font-bold">
                &quot;{query}&quot;
              </span>
              . Try a different keyword.
            </p>
          </div>
          <Link
            href="/"
            className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-orange-500 transition-all duration-500 shadow-2xl hover:-translate-y-1"
          >
            Return to Dashboard
          </Link>
        </div>
        {/* Subtle Decorative Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-slate-100 blur-[120px] rounded-full pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 sm:gap-24">
      {/* Stores Section */}
      {searchData?.merchants?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-black tracking-tighter flex items-center gap-4 italic uppercase text-[18px]">
                <span className="w-2 h-8 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.3)]"></span>
                Stores for &ldquo;{query}&rdquo;
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 border border-slate-100 px-5 py-2 rounded-full">
              {searchData.merchants.length} Results
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchData.merchants.map((merchant: any, i: number) => (
              <Link
                key={i}
                href={getHref(merchant)}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-7 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] hover:border-orange-500/20 transition-all duration-500 relative overflow-hidden flex flex-col items-center text-center gap-6"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/[0.03] to-transparent rounded-bl-[4rem] group-hover:scale-150 transition-transform duration-700" />

                <div className="w-28 h-28 bg-white border border-slate-50 rounded-[2rem] flex items-center justify-center p-5 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:border-orange-500/10 transition-all duration-500 group-hover:-translate-y-2 relative z-10">
                  <Image
                    src={getBaseImageUrl(
                      companyDomain.domain,
                      merchant.merchant_logo,
                      "",
                    )}
                    alt={merchant.merchant_name}
                    width={120}
                    height={120}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="relative z-10 w-full">
                  <h3 className="font-black text-black text-lg leading-tight mb-3 group-hover:text-orange-500 transition-colors duration-300 italic">
                    {merchant.merchant_name}
                  </h3>
                  <div className="inline-flex items-center gap-2 text-black font-black text-[10px] uppercase tracking-[0.2em] py-2 px-4 bg-slate-50 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <span>Visit Store</span>
                    <ArrowRight
                      size={12}
                      strokeWidth={3}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      {searchData?.categories?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-10 px-4">
            <h2 className="text-2xl font-black text-black tracking-tighter flex items-center gap-4 italic uppercase text-[18px]">
              <span className="w-2 h-8 bg-slate-200 rounded-full"></span>
              Categories matching &ldquo;{query}&rdquo;
            </h2>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50 border border-slate-100 px-5 py-2 rounded-full">
              {searchData.categories.length} Found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchData.categories.map((category: any) => (
              <Link
                key={category.unique_id}
                href={category?.url || getCatHref(category)}
                className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:border-black/5 transition-all duration-500 flex items-center gap-5 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-[4rem] opacity-50 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-3 shadow-inner group-hover:bg-white group-hover:border-orange-500/20 group-hover:scale-110 transition-all duration-500 z-10">
                  <Image
                    src={getBaseImageUrl(
                      companyDomain.domain,
                      category?.category_image,
                      "",
                    )}
                    alt={category?.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                <div className="flex-1 z-10">
                  <h4 className="font-black text-slate-800 text-[15px] leading-tight group-hover:text-orange-500 transition-colors duration-300 uppercase tracking-tight">
                    {category?.name}
                  </h4>
                </div>
                <div className="z-10 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight size={18} className="text-orange-500" />
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

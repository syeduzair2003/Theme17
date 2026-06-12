import {
  apiCompanyUpdatedData,
  apiSearchResult,
  apiMostSearch,
  apiGetAllKeywords,
} from "@/apis/user";
import cookieService from "@/services/CookiesService";
import React from "react";
import HorizontalBannerSlider from "../../comp/HorizontalBannerSlider";
import Link from "next/link";
import SearchPage from "../../comp/SearchPage";
import { ChevronRight, TrendingUp, Tag as TagIcon } from "lucide-react";

interface Props {
  searchParams: Promise<{ [key: string]: string }>;
}

const page = async ({ searchParams }: Props) => {
  const queryParams: any = await searchParams;
  const companyDomain = await cookieService.get("domain");
  const c_data = (await apiCompanyUpdatedData(companyDomain)).data;
  const searchResult = await apiSearchResult(
    queryParams.query,
    c_data?.unique_id,
  );
  const most_search = (await apiMostSearch(c_data?.unique_id))?.data;
  const all_tags = (await apiGetAllKeywords(c_data?.unique_id))?.data;

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-24 pt-32 selection:bg-orange-100 selection:text-orange-900 antialiased">
      {/* Title Section */}
      <div className="relative bg-white overflow-hidden border-b border-slate-100/80 shadow-[0_2px_20px_rgba(0,0,0,0.01)]">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.005] to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-2.5 text-[11px] font-black tracking-[0.25em] uppercase text-slate-500">
              <Link
                href="/"
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Home
              </Link>
              <ChevronRight
                size={10}
                className="text-slate-600"
                strokeWidth={3}
              />
              <span className="text-slate-900/80">Search Queries</span>
            </nav>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Showing results for{" "}
                <span className="text-[#FF5F1F] relative inline-block italic font-serif px-2">
                  &ldquo;{queryParams.query}&rdquo;
                </span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold tracking-tight max-w-xl mx-auto leading-relaxed">
                Verified luxury directories, premium discount structures, and
                matches found.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 sm:mt-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <aside className="lg:w-1/4 w-full shrink-0">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.025)] sticky top-32 overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-orange-500/[0.03] blur-3xl rounded-full pointer-events-none" />

              <div className="relative">
                <h2 className="text-[11px] font-black text-slate-900 mb-6 tracking-[0.3em] uppercase flex items-center gap-2.5 font-mono border-l-4 border-[#FF5F1F] pl-3">
                  <TrendingUp size={12} className="text-[#FF5F1F]" />
                  Popular Picks
                </h2>

                {most_search?.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {most_search.map((tag: string, i: number) => (
                      <li key={i}>
                        <Link
                          href={`/search?query=${tag}`}
                          className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-[13px] font-bold text-slate-700 transition-all duration-300 bg-slate-50/50 hover:bg-orange-50/40 border border-slate-100/60 hover:border-orange-500/20 hover:text-slate-950 group/item text-left shadow-sm"
                        >
                          <span className="truncate pr-2">{tag}</span>
                          <ChevronRight
                            size={12}
                            className="text-[#FF5F1F] opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 shrink-0"
                            strokeWidth={3}
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-6 text-slate-400 text-center text-[11px] uppercase font-mono tracking-wider bg-slate-50/50 rounded-xl border border-dashed border-slate-200/60">
                    No active trends
                  </div>
                )}
              </div>

              {all_tags?.length > 0 && (
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
              )}

              {all_tags?.length > 0 && (
                <div className="relative">
                  <h2 className="text-[11px] font-black text-slate-900 mb-5 tracking-[0.3em] uppercase flex items-center gap-2.5 font-mono border-l-4 border-slate-200 pl-3">
                    <TagIcon size={12} className="text-slate-400" />
                    Hot Tags
                  </h2>
                  <ul className="flex flex-wrap gap-1.5">
                    {all_tags.map((tag: string, i: number) => (
                      <li key={i}>
                        <Link
                          href={`/search?query=${tag}`}
                          className="inline-flex items-center px-3.5 py-2 rounded-xl text-[11px] font-bold text-slate-600 transition-all duration-200 bg-slate-50/50 hover:bg-[#FF5F1F] hover:text-white border border-slate-100 hover:border-orange-500 shadow-sm hover:-translate-y-0.5"
                        >
                          #{tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          <main className="lg:w-3/4 w-full">
            <div className="relative rounded-[2.5rem] bg-white border border-slate-100/80 shadow-[0_20px_50px_rgba(0,0,0,0.02)] transition-all duration-500">
              <SearchPage
                slug_type={c_data?.slug_type}
                mer_slug={c_data?.store_slug}
                cat_slug={c_data?.category_slug}
                searchData={searchResult?.data}
                query={queryParams.query}
              />
            </div>
          </main>
        </div>
      </div>

      <div className="pt-6 mt-16 pb-2">
        <HorizontalBannerSlider
          companyId={c_data?.unique_id}
          slug_type={c_data?.slug_type}
          mer_slug={c_data?.store_slug}
          domain={companyDomain.domain}
        />
      </div>
    </div>
  );
};

export default page;

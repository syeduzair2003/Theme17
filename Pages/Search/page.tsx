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
    <div className="bg-[#fcfcfc] min-h-screen pb-20 pt-20 lg:pt-28 selection:bg-orange-100">
      {/* ── Header Section ── */}
      <div className="relative border-b border-slate-100 bg-white overflow-hidden">
        {/* Banner Section */}
        <div className="pt-4 sm:pt-8">
          <HorizontalBannerSlider
            companyId={c_data?.unique_id}
            slug_type={c_data?.slug_type}
            mer_slug={c_data?.store_slug}
            domain={companyDomain.domain}
          />
        </div>

        {/* Search Context / Breadcrumb Container */}
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 relative z-10">
          <div className="flex flex-col gap-4">
            <nav className="flex items-center gap-3 text-[10px] sm:text-[11px] font-black tracking-[0.3em] uppercase text-slate-400 italic">
              <Link
                href="/"
                className="hover:text-orange-500 transition-all duration-300"
              >
                Home
              </Link>
              <span className="w-1.5 h-1.5 bg-orange-500/30 rounded-full"></span>
              <span className="text-slate-900/40">Search Results</span>
            </nav>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f0f0f] tracking-tighter">
                Showing results for{" "}
                <span className="text-orange-500 relative inline-block italic">
                  &quot;{queryParams.query}&quot;
                  <span className="absolute bottom-2 left-0 w-full h-[8px] bg-orange-500/5 -z-10"></span>
                </span>
              </h1>
              <p className="text-slate-500 text-sm font-bold tracking-tight">
                Top verified deals and discounts curated specifically for you.
              </p>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Background */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-orange-500/[0.02] to-transparent pointer-events-none -skew-x-12 transform translate-x-1/4" />
      </div>

      {/* ── Main Content Layout ── */}
      <div className="max-w-7xl mx-auto px-6 mt-12 sm:mt-16">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Sidebar: Left Side */}
          <aside className="lg:w-1/4 w-full">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] sticky top-32 overflow-hidden group">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-orange-500/[0.03] blur-3xl rounded-full" />

              {/* Section: Popular Picks */}
              <div className="relative">
                <h2 className="text-[11px] font-black text-black mb-10 tracking-[0.4em] uppercase flex items-center gap-4 italic border-l-4 border-orange-500 pl-4">
                  Popular Picks
                </h2>

                {most_search?.length > 0 ? (
                  <ul className="flex flex-col gap-3">
                    {most_search.map((tag: string, i: number) => (
                      <li key={i}>
                        <Link
                          href={`/search?query=${tag}`}
                          className="flex items-center justify-between w-full px-6 py-4 rounded-2xl text-[13px] font-bold text-slate-600 transition-all duration-300 bg-slate-50 hover:bg-black hover:text-white group/item border border-transparent shadow-sm hover:shadow-xl"
                        >
                          <span>{tag}</span>
                          <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-orange-500 text-white opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={4}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-8 text-slate-400 text-center text-xs italic bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    No recent trends
                  </div>
                )}
              </div>

              {/* Divider */}
              {all_tags?.length > 0 && (
                <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
              )}

              {/* Section: Popular Tags */}
              {all_tags?.length > 0 && (
                <div className="relative">
                  <h2 className="text-[11px] font-black text-black mb-8 tracking-[0.4em] uppercase flex items-center gap-4 italic border-l-4 border-slate-200 pl-4">
                    Hot Tags
                  </h2>
                  <ul className="flex flex-wrap gap-2.5">
                    {all_tags.map((tag: string, i: number) => (
                      <li key={i}>
                        <Link
                          href={`/search?query=${tag}`}
                          className="inline-flex items-center px-5 py-2.5 rounded-xl text-[12px] font-black text-slate-500 transition-all duration-300 bg-slate-100 hover:bg-orange-500 hover:text-white border border-transparent hover:border-orange-200 shadow-sm hover:-translate-y-1"
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

          {/* Main Content: Right Side */}
          <main className="lg:w-3/4 w-full">
            <div className="relative rounded-[3rem] overflow-hidden">
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
    </div>
  );
};

export default page;

import { apiCategoryWithSub } from '@/apis/user';
import { CategoryChild } from '@/services/dataTypes';
import Link from 'next/link';
import React from 'react';

interface Props {
    company_id: string;
}

const CatPage = async ({ company_id }: Props) => {
    const categoryData = (await apiCategoryWithSub(company_id)).data;

    if (!categoryData || categoryData?.length === 0) {
        return (
            <section className="py-24 flex justify-center items-center min-h-[50vh] bg-[#1a1612]">
                <div className="text-center p-12 bg-white/[0.03] backdrop-blur-xl shadow-2xl rounded-3xl border border-white/10 max-w-md w-full relative overflow-hidden group">
                    <div className="w-20 h-20 mx-auto mb-6 bg-white/5 text-[#FF5F1F] rounded-full flex items-center justify-center border border-white/10 transition-colors duration-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No Categories Found</h3>
                    <p className="text-white/50 leading-relaxed text-sm">
                        It looks like there are no categories available right now. Please check back later.
                    </p>
                </div>
            </section>
        );
    }

    // Sort parent categories by name
    categoryData?.sort((a, b) =>
        a?.category?.name?.localeCompare(b?.category?.name, undefined, { sensitivity: 'base' })
    );

    const sortChildren = (children: CategoryChild[]) => {
        if (!children) return [];
        return [...children].sort((a, b) => {
            const nameA = typeof a === "string" ? a : a?.name;
            const nameB = typeof b === "string" ? b : b?.name;
            return nameA?.localeCompare(nameB, undefined, { sensitivity: "base" });
        });
    };

    const renderChildren = (children: CategoryChild[], depth = 0) => {
        if (!children || children.length === 0) return null;

        const sortedChildren = sortChildren(children);

        return (
            <ul className={`flex flex-col gap-1.5 ${depth > 0 ? "ml-4 mt-1.5 pl-4 border-l border-white/5" : "mt-2"}`}>
                {sortedChildren?.map((child, idx) => {
                    if (typeof child === 'string') {
                        return (
                            <li key={idx} className="group/link flex items-center text-[14px] text-white/50 hover:text-[#FF5F1F] transition-all duration-300 py-1">
                                <span className="relative flex items-center justify-center w-4 h-4 mr-2 shrink-0">
                                    <span className="absolute w-1 h-1 rounded-full bg-white/20 transition-all duration-200 group-hover/link:scale-0"></span>
                                    <svg className="absolute w-3.5 h-3.5 text-[#FF5F1F] opacity-0 scale-50 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                                <span className="group-hover/link:translate-x-1 transition-transform duration-300">{child}</span>
                            </li>
                        );
                    }

                    return (
                        <li key={idx} className="flex flex-col">
                            <Link href={child?.url || '#'} className="group/link flex items-center text-[14px] text-white/50 hover:text-[#FF5F1F] transition-all duration-300 py-1">
                                <span className="relative flex items-center justify-center w-4 h-4 mr-2 shrink-0">
                                    <span className="absolute w-1 h-1 rounded-full bg-white/20 transition-all duration-200 group-hover/link:scale-0"></span>
                                    <svg className="absolute w-3.5 h-3.5 text-[#FF5F1F] opacity-0 scale-50 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                                <span className="group-hover/link:translate-x-1 transition-transform duration-300 font-medium">{child?.name}</span>
                            </Link>
                            {(child?.child?.length ?? 0) > 0 && renderChildren(child.child!, depth + 1)}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <section className="py-12 lg:py-20 bg-[#1a1612] min-h-screen relative overflow-hidden">
            {/* Background Accent Orbs for continuity */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#FF5F1F]/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#FF5F1F]/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
                    {categoryData?.map((cat, idx) => {
                        const firstLetter = cat?.category?.name?.charAt(0).toUpperCase() || '?';

                        return (
                            <div className="break-inside-avoid" key={idx}>
                                <div className="relative group bg-white/[0.03] backdrop-blur-md rounded-2xl shadow-2xl border border-white/5 hover:border-[#FF5F1F]/30 pt-8 p-6 sm:px-7 sm:pb-8 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                                    
                                    {/* Animated Top Gradient Line */}
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-white/5 overflow-hidden">
                                        <div className="w-full h-full bg-gradient-to-r from-transparent via-[#FF5F1F] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                                    </div>

                                    <div className="relative z-10">
                                        <Link href={cat?.category?.url || '#'}>
                                            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-white/5 group/title cursor-pointer">
                                                <div className="w-12 h-12 shrink-0 rounded-xl bg-white/5 text-white/70 border border-white/10 group-hover/title:bg-[#FF5F1F] group-hover/title:text-white group-hover/title:border-[#FF5F1F] group-hover/title:shadow-[0_0_15px_rgba(255,95,31,0.4)] transition-all duration-500 flex items-center justify-center">
                                                    <span className="text-xl font-black">{firstLetter}</span>
                                                </div>
                                                <h4 className="text-[18px] font-black text-white group-hover/title:text-[#FF5F1F] transition-colors duration-300 leading-tight tracking-tight">
                                                    {cat?.category?.name}
                                                </h4>
                                            </div>
                                        </Link>

                                        <div className="pl-1">
                                            {renderChildren(cat?.category?.child ?? [])}
                                        </div>
                                    </div>

                                    {/* Corner Decorative Glow */}
                                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF5F1F]/[0.03] rounded-full blur-2xl group-hover:bg-[#FF5F1F]/[0.1] transition-colors duration-500"></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CatPage;
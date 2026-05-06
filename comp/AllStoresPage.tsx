import { apiGetMerchantsAlphabetically } from '@/apis/merchant';
import cookieService from '@/services/CookiesService';
import { MerchantResponse } from '@/services/dataTypes';
import { notFound } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMerchantHref, getBaseImageUrl } from '@/constants/hooks';
import MerchantCard from './MerchantCard';
import BreadcrumbSection from './BreadcrumbSection';

interface Props {
    store_slug: string;
    slug_type: string;
    company_id: string;
    slug: string; 
    page?: string;
}

const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PAGE_SIZE = 36; // Multiples of 4 are better for grid-cols-4



const AllStoresPage = async ({ store_slug, slug_type, company_id, slug, page }: Props) => {
    const companyDomain = (await cookieService.get("domain"))?.domain || "";
    const currentPage = Math.max(1, parseInt(page || "1", 10));
    const apiSlug = slug === "other" ? "#" : slug;

    if (slug.length > 1 && slug !== "other") {
        return notFound();
    }

    const merchantData: MerchantResponse = (await apiGetMerchantsAlphabetically(company_id, apiSlug, PAGE_SIZE, currentPage))?.data;

    const filteredMerchants = slug === "other"
        ? merchantData?.merchants?.filter(item => !item.merchant_name || !/^[A-Z]/i.test(item.merchant_name.trim()))
        : merchantData?.merchants?.filter(item => item.merchant_name?.toUpperCase().startsWith(slug.toUpperCase()));

    const totalPages = merchantData?.pagination?.last_page || 1;
    const paginatedMerchants = filteredMerchants
        ?.sort((a, b) => a.merchant_name.localeCompare(b.merchant_name))
        ?.slice(0, PAGE_SIZE) || [];

    const prevPage = currentPage > 1 ? currentPage - 1 : 1;
    const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;
    const baseUrl = `/all-stores/${slug}`;

    return (
        <div className="bg-[#fcfcfa] min-h-screen pb-10" style={{ background: 'linear-gradient(to bottom, #ffffff, #fdfbfa)' }}>
            <BreadcrumbSection 
                title="All-Stores"
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "All Stores", href: "/all-stores/A" },
                    { label: slug }
                ]}
            />
            
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Alphabet Toggle Directory */}
                <div className="flex justify-center mb-10 w-full px-2">
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl">
                        {ALPHABETS.map((alpha) => {
                            const isActive = slug.toUpperCase() === alpha;
                            return (
                                <Link
                                    key={alpha}
                                    href={`/all-stores/${alpha}`}
                                    className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-[13px] md:text-[14px] font-extrabold transition-all duration-300 hover:shadow-md no-underline ${
                                        isActive 
                                        ? "bg-[#8bc94a] text-white -translate-y-1 scale-110 shadow-lg shadow-[#8bc94a]/30 border-transparent z-10" 
                                        : "bg-white text-gray-500 border border-gray-200 hover:bg-[#ff912f]/10 hover:text-[#ff912f] hover:-translate-y-0.5 hover:border-[#ff912f]/40 hover:z-10"
                                    }`}
                                >
                                    {alpha}
                                </Link>
                            )
                        })}
                        <Link
                            href={`/all-stores/other`}
                            className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-[13px] md:text-[14px] font-extrabold transition-all duration-300 hover:shadow-md no-underline ${
                                slug.toLowerCase() === "other" 
                                ? "bg-[#8bc94a] text-white -translate-y-1 scale-110 shadow-lg shadow-[#8bc94a]/30 border-transparent z-10" 
                                : "bg-white text-gray-500 border border-gray-200 hover:bg-[#ff912f]/10 hover:text-[#ff912f] hover:-translate-y-0.5 hover:border-[#ff912f]/40 hover:z-10"
                            }`}
                        >
                            #
                        </Link>
                    </div>
                </div>

                {/* Thin Gradient Divider for aesthetics */}
                <div className="w-full max-w-4xl mx-auto h-[1px] mb-10" style={{ background: 'linear-gradient(90deg, transparent, #8bc94a30, #ff912f30, #8bc94a30, transparent)' }}></div>

                {/* Grid container: 4 items per row */}
                {paginatedMerchants.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pb-10">
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
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                             <span className="text-3xl text-gray-300 font-bold">{slug.toUpperCase()}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-700 m-0">No Stores Found</h4>
                        <p className="text-gray-400 mt-2">Try browsing another letter or check back later.</p>
                    </div>
                )}

                {/* Simple Bottom Pagination Loader */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8 pt-10 border-t border-gray-100 pb-10">
                        <Link 
                            href={`${baseUrl}/page/${prevPage}`}
                            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 no-underline ${currentPage === 1 ? 'border-gray-100 text-gray-300 pointer-events-none' : 'border-[#8bc94a]/30 text-[#8bc94a] hover:bg-[#8bc94a] hover:text-white hover:border-[#8bc94a] shadow-sm hover:shadow-[#8bc94a]/20 hover:-translate-y-1'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                        </Link>
                        
                        <div className="flex flex-col items-center px-4">
                            <span className="text-[14px] font-bold text-gray-700">Page {currentPage}</span>
                            <span className="text-[12px] font-medium text-gray-400">out of {totalPages}</span>
                        </div>
                        
                        <Link 
                            href={`${baseUrl}/page/${nextPage}`}
                            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 no-underline ${currentPage === totalPages ? 'border-gray-100 text-gray-300 pointer-events-none' : 'border-[#ff912f]/30 text-[#ff912f] hover:bg-[#ff912f] hover:text-white hover:border-[#ff912f] shadow-sm hover:shadow-[#ff912f]/20 hover:-translate-y-1'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllStoresPage;
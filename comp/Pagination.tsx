import React from 'react';
import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const prevPage = currentPage > 1 ? currentPage - 1 : 1;
    const nextPage = currentPage < totalPages ? currentPage + 1 : totalPages;

    return (
        <div className="flex justify-center items-center mt-12 mb-16">
            {/* ── Main Capsule Container ── */}
            <div className="inline-flex items-center bg-[#1a1612] p-1.5 rounded-full shadow-xl border border-white/5">
                
                {/* ── Previous Button ── */}
                <Link 
                    href={`${baseUrl}/page/${prevPage}`}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 no-underline group ${
                        currentPage === 1 
                        ? 'opacity-20 pointer-events-none' 
                        : 'text-white hover:bg-white/10'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:-translate-x-1">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[11px] font-black uppercase tracking-widest">Prev</span>
                </Link>

                {/* ── Page Indicator Center ── */}
                <div className="px-6 py-2 mx-1 border-x border-white/10 flex items-center gap-2">
                    <span className="text-sm font-black text-[#FF5F1F]">
                        {currentPage}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">/</span>
                    <span className="text-sm font-bold text-gray-400">
                        {totalPages}
                    </span>
                </div>

                {/* ── Next Button ── */}
                <Link 
                    href={`${baseUrl}/page/${nextPage}`}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 no-underline group ${
                        currentPage === totalPages 
                        ? 'opacity-20 pointer-events-none' 
                        : 'bg-[#FF5F1F] text-white hover:bg-[#e6551b] hover:shadow-[0_8px_20px_rgba(255,95,31,0.3)] hover:-translate-y-0.5'
                    }`}
                >
                    <span className="text-[11px] font-black uppercase tracking-widest">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform group-hover:translate-x-1">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                </Link>

            </div>
        </div>
    );
};

export default Pagination;
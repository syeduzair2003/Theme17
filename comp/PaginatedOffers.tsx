"use client";
import React, { useState, useRef } from "react";
import EventsOfferCard, { EventsGrid } from "./EventsOfferCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function PaginatedOffers({
  allOffers,
  companyData,
  companyDomain,
}: {
  allOffers: any[];
  companyData: any;
  companyDomain: any;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const topRef = useRef<HTMLDivElement>(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOffers = allOffers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allOffers.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);

    if (topRef.current) {
      const rect = topRef.current.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 120;

      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  if (allOffers.length === 0) return null;

  return (
    <div className="space-y-12" key={`page-${currentPage}`}>
      {/* Scroll Target */}
      <div ref={topRef} className="h-1" />

      <div className="space-y-6">
        <div className="px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black/30">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, allOffers.length)} of {allOffers.length}{" "}
            Offers
          </h3>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <EventsGrid cols={3}>
            {currentOffers.map((item, index) => (
              <EventsOfferCard
                key={`${item.offer.unique_id}-${index}`}
                product={item.offer}
                merchantHref={`/store/${item.merchant?.slug}`}
                domain={companyDomain?.domain}
                merchant_name={item.merchant?.merchant_name}
                merchant_logo={item.merchant?.merchant_logo}
                productDetailUrl={
                  item.offer?.slug ? `/deal/${item.offer.slug}` : null
                }
              />
            ))}
          </EventsGrid>
        </div>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <div className="inline-flex items-center bg-[#1a1612] p-1.5 rounded-full shadow-xl border border-white/5">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center gap-3 px-6 py-3 rounded-full transition-all disabled:opacity-20 group"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="text-white text-[10px] group-hover:-translate-x-1 transition-transform"
              />
              <span className="text-white font-black text-[11px] uppercase tracking-widest">
                Prev
              </span>
            </button>

            <div className="h-8 w-[1px] bg-white/10 mx-2" />

            <div className="px-6 flex items-center gap-1.5 text-white">
              <span className="text-[#ff912f] font-black text-sm">
                {currentPage}
              </span>
              <span className="opacity-30">/</span>
              <span className="font-bold text-sm">{totalPages}</span>
            </div>

            <div className="h-8 w-[1px] bg-white/10 mx-2" />

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center gap-3 px-8 py-3 rounded-full bg-[#ff5722] hover:bg-[#ff7043] transition-all shadow-lg group"
            >
              <span className="text-white font-black text-[11px] uppercase tracking-widest">
                Next
              </span>
              <FontAwesomeIcon
                icon={faChevronRight}
                className="text-white text-[10px] group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

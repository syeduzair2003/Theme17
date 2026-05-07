import { apiGetAllEvents } from "@/apis/user";
import cookieService from "@/services/CookiesService";
import React from "react";
import BreadcrumbSection from "../../comp/BreadcrumbSection";
import { getEventsHref } from "@/constants/hooks";
import Link from "next/link";

const page = async () => {
  const companyDomain = (await cookieService.get("domain")).domain;
  const events = (await apiGetAllEvents(companyDomain)).data;

  return (
    <div className="bg-[#110e0c] min-h-screen text-white font-sans">
      <BreadcrumbSection
        title="Events"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
        ]}
      />

      <section className="py-12 md:py-16 px-4 relative">
        {/* ── Background ── */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-[#FF5F1F]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[#FF5F1F]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl">
          {/* ── Offset Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-y-10 gap-x-8 lg:gap-x-12">
            {events?.length > 0 ? (
              events?.map((event: any, index: number) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`w-full ${isEven ? "md:mt-0" : "md:mt-10"}`}
                  >
                    <Link
                      href={getEventsHref(event, "slug")}
                      className="group block relative"
                    >
                      {/* Minimal Index Number */}
                      <span className="absolute -top-5 left-1 text-3xl font-black text-white/5 group-hover:text-[#FF5F1F]/20 transition-all duration-500">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </span>

                      <div className="relative bg-[#141210] border border-white/5 rounded-[2.5rem] overflow-hidden p-7 md:p-9 transition-all duration-500 hover:border-[#FF5F1F]/30 shadow-2xl">
                        {/* Visual Accent Bar */}
                        <div className="w-10 h-1 bg-[#FF5F1F] mb-8 group-hover:w-20 transition-all duration-700"></div>

                        <div className="space-y-4">
                          <h3 className="text-xl md:text-3xl font-black tracking-tighter leading-tight group-hover:text-[#FF5F1F] transition-colors duration-300">
                            {event?.name}
                          </h3>
                          <p className="text-gray-500 text-xs md:text-sm max-w-[220px] leading-relaxed opacity-80">
                            Exclusive affiliate offers and verified deals
                            curated for this event.
                          </p>
                        </div>

                        {/* Explore Button */}
                        <div className="mt-10 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[#FF5F1F] font-bold text-xs md:text-sm tracking-[0.2em] uppercase group-hover:gap-5 transition-all duration-500">
                            <span>Explore</span>
                            <div className="w-10 h-[1px] bg-[#FF5F1F]"></div>
                          </div>

                          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Corner Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5F1F]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                <h3 className="text-xl text-gray-700 font-bold tracking-widest uppercase">
                  Stay Tuned
                </h3>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;

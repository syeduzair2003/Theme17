import { apiHomePageFaqs } from "@/apis/user";
import cookieService from "@/services/CookiesService";
import React from "react";
import { faPlus, faMinus } from "@/constants/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FaqWrapper from "./FaqWrapper";

interface Props {
  slug_type: string;
  store_slug: string;
}

const HomepageFAQs = async ({ store_slug, slug_type }: Props) => {
  const companyDomainObj = await cookieService.get("domain");
  const companyDomain = companyDomainObj?.domain || "";

  const faqsRes = await apiHomePageFaqs(companyDomain);
  const allFaqs = faqsRes?.data || [];

  if (allFaqs.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Centered Heading Section */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-orange-50 rounded-full mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">
              Help Center
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none italic">
            Curious?{" "}
            <span className="text-orange-500 not-italic">Find out more.</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium mt-2 max-w-lg mx-auto">
            Clear answers to your most common questions about savings, stores,
            and coupons.
          </p>
        </div>

        {/* Data pass to Wrapper */}
        <FaqWrapper totalCount={allFaqs.length}>
          {allFaqs.map((faq: any, index: number) => (
            <details
              key={index}
              className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-orange-200 hover:bg-white hover:shadow-md"
            >
              <summary className="list-none flex justify-between items-center p-5 cursor-pointer select-none">
                <span className="font-extrabold text-black pr-4 group-open:text-orange-600 transition-colors text-sm md:text-[15px] uppercase tracking-tight">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-black group-open:bg-black group-open:text-orange-500 group-open:border-black transition-all duration-200">
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-[10px] group-open:hidden"
                  />
                  <FontAwesomeIcon
                    icon={faMinus}
                    className="text-[10px] hidden group-open:block"
                  />
                </div>
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-relaxed font-medium">
                <div
                  className="pt-4 border-t border-slate-200/50 text-[13px] md:text-[14px]"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </details>
          ))}
        </FaqWrapper>
      </div>
    </section>
  );
};

export default HomepageFAQs;

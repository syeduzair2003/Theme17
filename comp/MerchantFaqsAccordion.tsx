"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const MerchantFaqsAccordion = ({ faq, index }: { faq: any; index: number }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div
      className={`group border rounded-xl overflow-hidden transition-all duration-200 ${
        isOpen
          ? "border-orange-200 bg-white shadow-md"
          : "border-slate-200 bg-slate-50 hover:border-orange-200 hover:bg-white hover:shadow-md"
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 text-left select-none"
      >
        <span
          className={`font-extrabold pr-4 transition-colors duration-200 text-sm md:text-[15px] uppercase tracking-tight ${
            isOpen ? "text-orange-600" : "text-black"
          }`}
        >
          {faq.question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-black text-orange-500 border border-black"
              : "bg-white border border-slate-200 text-black"
          }`}
        >
          {isOpen ? (
            <Minus size={12} strokeWidth={3} />
          ) : (
            <Plus size={12} strokeWidth={3} />
          )}
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 text-slate-600 leading-relaxed font-medium">
          {/* Top Divider with subtle opacity exactly like homepage */}
          <div
            className="pt-4 border-t border-slate-200/50 text-[13px] md:text-[14px]"
            dangerouslySetInnerHTML={{ __html: faq.answer }}
          />
        </div>
      </div>
    </div>
  );
};

export default MerchantFaqsAccordion;
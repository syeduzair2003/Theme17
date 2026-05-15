"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

export default function CategoryGrid({ categories }: { categories: any[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCategories = isExpanded ? categories : categories?.slice(0, 6);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_4px_25px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
          <FontAwesomeIcon
            icon={faLayerGroup}
            className="text-[#ff912f] text-lg"
          />
        </div>
        <h4 className="text-xl font-black text-black tracking-tight">
          Categories
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
        {visibleCategories.map((cat, i) => (
          <Link
            key={i}
            href={`/${cat?.category?.url}`}
            className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-transparent hover:bg-white hover:border-[#ff912f]/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 text-center"
          >
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-black transition-colors line-clamp-1">
              {cat?.category?.name}
            </span>
          </Link>
        ))}
      </div>

      {categories.length > 6 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-6 py-3 rounded-2xl bg-black text-[10px] font-black uppercase tracking-widest text-[#ff912f] hover:bg-[#ff912f] hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isExpanded ? "Show Less" : `View All (${categories.length})`}
          <FontAwesomeIcon icon={isExpanded ? faAngleUp : faAngleDown} />
        </button>
      )}
    </div>
  );
}

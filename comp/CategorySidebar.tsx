import { faAngleRight, FontAwesomeIcon } from "@/constants/icons";
import { CategoryData } from "@/services/dataTypes";
import Link from "next/link";
import React from "react";

interface Props {
  categories: CategoryData[];
  pageSlug?: string;
  parentCategory?: string;
}

const CategorySidebar = async ({
  categories,
  pageSlug = "category",
  parentCategory,
}: Props) => {
  return (
    <div className="relative group/sidebar w-full">
      {/* Card Container */}
      <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-6 lg:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF5F1F]/5 to-transparent rounded-full -mr-8 -mt-8 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-50 to-transparent rounded-full -ml-4 -mb-4 blur-xl" />

        {/* Header Section */}
        <div className="relative mb-8 flex items-center justify-between border-b border-gray-50 pb-5">
          <div>
            <h4 className="text-lg font-black text-[#1a1612] tracking-tight m-0">
              {parentCategory ? "Related" : "Explore"}{" "}
              <span className="text-[#FF5F1F]">Hub</span>
            </h4>
            <div className="h-1 w-6 bg-[#FF5F1F] rounded-full mt-1.5 shadow-[0_2px_10px_rgba(255,95,31,0.3)]"></div>
          </div>
          <Link
            href={`/category`}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF5F1F] hover:text-[#1a1612] transition-colors bg-[#FF5F1F]/5 px-3 py-1.5 rounded-full border border-[#FF5F1F]/10"
          >
            View All
          </Link>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-2 relative z-10">
          {categories?.slice(0, 10).map((category, i) => (
            <Link
              key={i}
              href={`/${pageSlug}/${category.url.replace(/^category\//, "")}`}
              className="group flex items-center justify-between py-3 px-3 rounded-2xl hover:bg-[#fcfcfc] border border-transparent hover:border-gray-100 transition-all duration-300 relative"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 bg-gray-200 rounded-sm rotate-45 group-hover:bg-[#FF5F1F] group-hover:rotate-180 transition-all duration-500" />
                </div>

                <span className="text-[13px] font-bold text-gray-400 group-hover:text-[#1a1612] transition-colors duration-300">
                  {category?.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-2 py-1 rounded-md group-hover:bg-[#FF5F1F] group-hover:text-white transition-all duration-300">
                  {category?.total_offers}
                </span>

                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="text-[10px] text-gray-200 group-hover:text-[#FF5F1F] group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;

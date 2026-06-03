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
      <div className="relative bg-white border border-neutral-200/80 rounded-[2rem] p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF5A00]/5 to-transparent rounded-full -mr-8 -mt-8 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-neutral-50 to-transparent rounded-full -ml-4 -mb-4 blur-xl" />

        {/* Header Section */}
        <div className="relative mb-8 flex items-center justify-between border-b border-neutral-100 pb-5">
          <div>
            <h4 className="text-lg font-black text-neutral-900 tracking-tight m-0">
              {parentCategory ? "Related" : "Explore"}{" "}
              <span className="text-[#FF5A00]">Hub</span>
            </h4>
            <div className="w-8 h-1 bg-[#FF5A00] rounded-full mt-1.5 shadow-[0_2px_10px_rgba(255,90,0,0.3)]" />
          </div>
          <Link
            href={`/category`}
            className="px-4 py-1.5 bg-[#FFF5EF] border border-[#FF5A00]/20 rounded-full text-[10px] font-bold tracking-widest text-[#FF5A00] hover:bg-[#FF5A00] hover:text-white transition-all duration-200 uppercase"
          >
            VIEW ALL
          </Link>
        </div>

        {/* Categories List */}
        <div className="flex flex-col gap-2 relative z-10">
          {categories?.slice(0, 10).map((category, i) => (
            <Link
              key={i}
              href={`/${pageSlug}/${category.url.replace(/^category\//, "")}`}
              className="group flex items-center justify-between py-3 px-3 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-100 transition-all duration-300 relative"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 bg-neutral-200 rounded-sm rotate-45 group-hover:bg-[#FF5A00] group-hover:rotate-180 transition-all duration-500" />
                </div>

                <span className="text-[13px] font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors duration-300">
                  {category?.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black bg-neutral-100 text-neutral-400 px-2 py-1 rounded-md group-hover:bg-[#FF5A00] group-hover:text-white transition-all duration-300">
                  {category?.total_offers}
                </span>

                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="text-[10px] text-neutral-200 group-hover:text-[#FF5A00] group-hover:translate-x-1 transition-all duration-300"
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

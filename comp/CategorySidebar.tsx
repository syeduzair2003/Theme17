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
      <div className="relative p-5">
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
        <div className="flex flex-col gap-2.5 relative z-10">
          {categories?.slice(0, 10).map((category, i) => (
            <Link
              key={i}
              href={`/${pageSlug}/${category.url.replace(/^category\//, "")}`}
              className="group flex items-center justify-between py-3 px-3 rounded-xl bg-neutral-100 border border-neutral-100/80 hover:bg-neutral-700 hover:border-neutral-900 transition-all duration-500 relative hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-3">
                {/* Bullet Diamond */}
                <div className="relative w-2 h-2">
                  <div className="absolute inset-0 bg-[#FF5A00] rounded-sm rotate-45 group-hover:bg-white group-hover:rotate-180 transition-all duration-500" />
                </div>

                {/* Category Name */}
                <span className="text-[13px] font-bold text-neutral-800 group-hover:text-[#FF5A00] transition-colors duration-300">
                  {category?.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Arrow Icon */}
                <FontAwesomeIcon
                  icon={faAngleRight}
                  className="text-[10px] text-[#FF5A00] group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
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

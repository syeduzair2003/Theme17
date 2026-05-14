import React from "react";
import { apiGetAllProducts } from "@/apis/user";
import { getMerchantHref, getProductDetailHref } from "@/constants/hooks";
import cookieService from "@/services/CookiesService";
import { OffersOffer } from "@/services/dataTypes";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";

interface Props {
  page?: string;
  company_id: string;
  mer_slug: string;
  mer_slug_type: string;
  category_id?: string;
  slug?: string[];
}

const ProductOffers = async ({
  page,
  company_id,
  mer_slug,
  mer_slug_type,
  category_id,
  slug,
}: Props) => {
  const currentPage = Math.max(1, parseInt(page || "1", 10));
  const offers = (
    await apiGetAllProducts(company_id, category_id, currentPage.toString(), 15)
  ).data;
  const totalPages = offers?.pagination?.last_page || 0;
  const domainObj = await cookieService.get("domain");
  const domain = domainObj?.domain || "";

  const cleanedSlug = slug?.length
    ? slug.filter((s, i) => {
        if (s === "page" && !isNaN(Number(slug[i + 1]))) return false;
        if (i > 0 && slug[i - 1] === "page" && !isNaN(Number(s))) return false;
        return true;
      })
    : [];

  const baseUrl = cleanedSlug.length
    ? `/all-products/${cleanedSlug.join("/")}`
    : `/all-products`;

  return (
    <div className="w-full h-full flex flex-col">
      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 w-full mb-12 min-h-[300px]">
        {offers && offers?.offers?.length > 0 ? (
          offers?.offers?.map((item: OffersOffer, i: number) => (
            <div
              key={i}
              className="flex h-full w-full transition-transform duration-500 hover:-translate-y-1"
            >
              <ProductCard
                product={item?.offer}
                merchantHref={getMerchantHref(
                  item?.merchant,
                  mer_slug,
                  mer_slug_type,
                )}
                domain={domain}
                merchant_logo={item?.merchant?.merchant_logo}
                merchant_name={item?.merchant?.merchant_name}
                productDetailUrl={
                  item?.offer?.slug
                    ? getProductDetailHref(
                        item.merchant,
                        mer_slug_type,
                        item?.offer?.slug,
                        item?.offer?.category?.slug,
                      )
                    : null
                }
              />
            </div>
          ))
        ) : (
          <div className="col-span-full w-full py-24 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff912f]/[0.02] rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#111318]/[0.02] rounded-full -ml-16 -mb-16 blur-3xl" />

            <div className="relative z-10">
              <div className="w-24 h-24 bg-[#fbfbfb] rounded-3xl flex items-center justify-center mb-6 border border-gray-50 shadow-inner group transition-all">
                <span className="text-4xl filter grayscale group-hover:grayscale-0">
                  🔍
                </span>
              </div>

              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff912f] mb-3 block">
                No Inventory Found
              </span>

              <h3 className="text-2xl font-black text-[#111318] mb-3 tracking-tight">
                Products Are Currently Unavailable
              </h3>

              <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                We couldn't find any offers in this category. Try exploring our
                other premium collections or check back later.
              </p>

              <div className="mt-8 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff912f]" />
                <div className="w-8 h-[1px] bg-gray-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff912f]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PAGINATION SECTION */}
      <div className="mt-auto py-4 border-t border-gray-50/50">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={baseUrl}
        />
      </div>
    </div>
  );
};

export default ProductOffers;

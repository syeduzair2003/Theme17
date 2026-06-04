import { apiHomeBrandedProducts } from "@/apis/user";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  discardHTMLTags,
  getBaseImageUrl,
  getCurrencySymbol,
  getFinalDiscountTag,
} from "@/constants/hooks";
import OfferOutUrl from "@/components/shared/OfferOutUrl";
import cookieService from "@/services/CookiesService";
import { ProductData } from "@/services/dataTypes";
import {
  faArrowRightLong,
  faBolt,
  faFire,
  faTag,
  FontAwesomeIcon,
} from "@/constants/icons";
import { ArrowRight } from "lucide-react";

interface Props {
  companyId: string;
  mer_slug: string;
  mer_slug_type: string;
}

const BrandedProductsHome = async ({
  companyId,
  mer_slug,
  mer_slug_type,
}: Props) => {
  const products = await apiHomeBrandedProducts(companyId).then(
    (res) => res.data,
  );
  const companyDomain = await cookieService.get("domain");
  const domain = companyDomain.domain;

  if (!products?.products?.length) return null;

  const displayProducts = products.products.slice(0, 8);

  return (
    <section className="relative overflow-hidden py-[50px] md:py-[60px] bg-gradient-to-b from-white via-zinc-50 to-zinc-100/40">
      <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,145,47,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-[40px] -left-[40px] w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1.5 bg-black text-[#ff912f] text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full w-fit shadow-sm">
              <FontAwesomeIcon icon={faBolt} className="w-3 h-3" />
              Trending Now
            </span>
            <h2 className="text-[1.3rem] md:text-[1.85rem] font-black text-slate-800 leading-tight m-0 tracking-tight">
              Brand{" "}
              <span className="text-[1.3rem] md:text-[1.85rem] font-black text-[#ff912f] leading-tight m-0 tracking-tight">
                Spotlight
              </span>
            </h2>
            <p className="text-[0.8rem] md:text-[0.9rem] text-zinc-500 m-0 max-w-[400px] font-medium">
              Handpicked products from top brands at unbeatable prices
            </p>
          </div>
          <div className="hidden md:flex items-center">
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-7 py-3.5 rounded-full bg-[#1a1612] text-white hover:bg-[#FF5722] transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            >
              <span>View All</span>
              <ArrowRight
                size={14}
                className="relative z-10 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product: ProductData, index: number) => {
            const type = product?.offer_type?.name;
            const imageSrc = getBaseImageUrl(
              domain,
              product?.product_image,
              "",
            );
            const originalPrice = product?.original_price
              ? parseFloat(product?.original_price)
              : 0;
            const salePrice = product?.sale_price
              ? parseFloat(product?.sale_price)
              : 0;
            const discountPercent =
              originalPrice > 0 && salePrice > 0
                ? Math.round(
                    ((originalPrice - salePrice) / originalPrice) * 100,
                  )
                : null;
            const finalDiscountTag = getFinalDiscountTag(
              product?.offer_title || product?.offer_detail,
              discountPercent,
            );

            return (
              <div
                key={product.id || index}
                className="group relative flex flex-col bg-white rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-none rounded-br-none overflow-hidden border border-zinc-200/70 transition-all duration-300 hover:border-[#ff912f] hover:shadow-[0_12px_30px_rgba(255,145,47,0.06)]"
              >
                {finalDiscountTag !== null && (
                  <div className="absolute top-5 left-4 z-10 flex items-center gap-1 bg-black text-[#ff912f] text-[10px] md:text-[11px] font-black tracking-tight py-1.5 px-2.5 rounded-lg shadow-sm">
                    <FontAwesomeIcon icon={faTag} className="w-2.5 h-2.5" />
                    <span>{finalDiscountTag}</span>
                  </div>
                )}

                <div className="relative bg-[#f8f8f6] rounded-tr-[2rem] rounded-bl-[2rem] m-3 p-4 flex items-center justify-center min-height-[120px] md:min-h-[180px] overflow-hidden">
                  <div className="w-full h-[90px] md:h-[140px] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={imageSrc}
                      alt={discardHTMLTags(product?.offer_title) || "Product"}
                      className="max-w-full max-h-full"
                      height={200}
                      width={200}
                      style={{ objectFit: "contain" }}
                      unoptimized
                    />
                  </div>
                  <div className="absolute top-0 -left-full w-3/5 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[20deg] pointer-events-none group-hover:animate-[shineSweep_0.7s_ease-out_forwards]" />
                </div>

                <div className="px-4 pb-4 pt-1 flex flex-col gap-2 flex-grow">
                  <span className="text-[10px] md:text-[11px] font-black text-[#ff912f] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
                    <span className="text-[14px] leading-none">•</span>
                    {mer_slug ? mer_slug.replace("-", " ") : "Exclusive"}
                  </span>

                  <h3 className="text-[0.78rem] md:text-[0.88rem] font-bold text-zinc-900 leading-[1.4] m-0 line-clamp-2 transition-colors duration-300 group-hover:text-[#ff912f]">
                    {discardHTMLTags(product?.offer_title)}
                  </h3>

                  {type === "product" &&
                    (salePrice > 0 || originalPrice > 0) && (
                      <div className="flex flex-wrap items-center gap-1.5 my-1">
                        {product?.sale_price && salePrice > 0 && (
                          <span className="text-[1.05rem] md:text-[1.2rem] font-black text-black tracking-tight">
                            {getCurrencySymbol(product?.currency)}
                            {product?.sale_price}
                          </span>
                        )}
                        {product?.original_price &&
                          originalPrice > 0 &&
                          salePrice > 0 && (
                            <span className="text-[0.72rem] md:text-[0.82rem] text-zinc-400 line-through font-medium">
                              {getCurrencySymbol(product?.currency)}
                              {product?.original_price}
                            </span>
                          )}
                        {discountPercent && discountPercent > 0 && (
                          <span className="inline-block text-[9px] md:text-[10px] font-black text-[#ff912f] bg-orange-50/50 px-2 py-0.5 rounded tracking-tighter">
                            -{discountPercent}%
                          </span>
                        )}
                      </div>
                    )}

                  <div className="mt-auto pt-2">
                    {product?.coupon_code ? (
                      <OfferOutUrl
                        unique_id={product?.unique_id}
                        outUrl={product?.url}
                        merchantHref={`/products`}
                        domain={domain}
                        customClass="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-[0.75rem] md:text-[0.82rem] font-black no-underline transition-all duration-300 bg-black text-white hover:bg-[#ff912f] hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <span>Show Code</span>
                        <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
                      </OfferOutUrl>
                    ) : (
                      <OfferOutUrl
                        unique_id={product?.unique_id}
                        outUrl={product?.url}
                        merchantHref={`/products`}
                        domain={domain}
                        customClass="w-full py-3 rounded-xl bg-[#111318] text-white text-[10px] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-[#ff912f] transition-all duration-300 no-underline shadow-lg shadow-black/5"
                      >
                        <span>
                          {type === "product" ? "Buy Now" : "Activate Deal"}
                        </span>
                        <FontAwesomeIcon
                          icon={faArrowRightLong}
                          className="w-3.5 h-3.5"
                        />
                      </OfferOutUrl>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View-All */}
        <div className="text-center mt-7 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-white font-black text-[0.9rem] no-underline px-7 py-3 bg-black rounded-full shadow-md transition-all hover:-translate-y-0.5 hover:text-[#ff912f]"
          >
            <span>Browse All Products</span>
            <FontAwesomeIcon icon={faArrowRightLong} className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandedProductsHome;

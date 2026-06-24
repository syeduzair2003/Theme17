import { apiGetMerchantUniqueId } from "@/apis/merchant";
import {
  apiGetCategoryProducts,
  apiGetCategoryProductsOffer,
  apiGetProductDetails,
} from "@/apis/user";
import OfferOutUrl from "@/components/shared/OfferOutUrl";
import SpecificProductSchema from "@/components/shared/SchemaScripts/SpecificProductSchema";
import {
  calculateDiscountPercent,
  discardHTMLTags,
  getBaseImageUrl,
  getCurrencySymbol,
  getFinalDiscountTag,
  getMerchantHref,
  getProductDetailHref,
  getProductMerchantHref,
  getRandomRating,
  splitHeadingFromDetails,
} from "@/constants/hooks";
import { faArrowRight, faStar, FontAwesomeIcon } from "@/constants/icons";
import cookieService from "@/services/CookiesService";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import RateUs from "./RateUs";
import RenderRating from "./RenderRating";
import EventsOfferCard from "./EventsOfferCard";

interface Props {
  company_id: string;
  store_slug: string;
  slug_type: string;
  product_id: string;
  current_merchant_slug: string;
  categorySlug: string;
}

const OfferDetailsPage = async ({
  company_id,
  store_slug,
  slug_type,
  product_id,
  current_merchant_slug,
  categorySlug,
}: Props) => {
  const cookieData = await cookieService.get("domain");
  const companyDomain = cookieData?.domain;

  const [response, catRes, merRes, cat] = await Promise.all([
    apiGetProductDetails(company_id, product_id, current_merchant_slug).then(
      (res) => res.data,
    ),
    apiGetCategoryProductsOffer(
      company_id,
      current_merchant_slug,
      categorySlug,
    ).then((res) => res.data),
    apiGetMerchantUniqueId(current_merchant_slug, company_id).then(
      (res) => res.data,
    ),
    apiGetCategoryProducts(company_id, current_merchant_slug).then(
      (res) => res.data,
    ),
  ]);

  if (!response) return notFound();

  const similarCategory = catRes?.filter(
    (item) => item.unique_id !== response?.unique_id,
  );
  const formatCategoryName = (slug: string): string =>
    slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "";

  return (
    <div className="bg-neutral-50/60 min-h-screen pb-20">
      <div className="bg-[#141211] text-white pt-36 md:pt-40 pb-14 relative overflow-hidden border-b border-neutral-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
            <Link
              href="/"
              className="hover:text-[#FF5A00] transition-colors no-underline"
            >
              Home
            </Link>
            <span className="text-neutral-800 font-normal select-none">/</span>

            <Link
              href="/products"
              className="hover:text-[#FF5A00] transition-colors no-underline"
            >
              Products
            </Link>
            <span className="text-neutral-800 font-normal select-none">/</span>

            <Link
              href={getProductMerchantHref(response?.merchant, slug_type)}
              className="hover:text-[#FF5A00] transition-colors no-underline"
            >
              {merRes?.merchant_name}
            </Link>
            <span className="text-neutral-800 font-normal select-none">/</span>

            <Link
              href={`/products/${response?.merchant?.slug}/${categorySlug}`}
              className="hover:text-[#FF5A00] transition-colors no-underline"
            >
              {formatCategoryName(categorySlug)}
            </Link>
            <span className="text-neutral-800 font-normal select-none">/</span>

            <span className="text-[#FF5A00] font-bold truncate max-w-[120px] sm:max-w-[200px]">
              {discardHTMLTags(response?.offer_title)}
            </span>
          </nav>

          <div className="max-w-4xl relative">
            <h1 className="text-base md:text-lg font-bold text-white leading-snug tracking-tight">
              {discardHTMLTags(response?.offer_title)}
              <span className="text-[#FF5A00] font-black ml-0.5">.</span>
            </h1>
            <div className="w-20 h-[2px] bg-gradient-to-r from-[#FF5A00] to-transparent mt-4" />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-6xl -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start">
                  <div className="w-full sm:w-[200px] aspect-square relative bg-neutral-50 rounded-xl p-4 group shrink-0 border border-neutral-100">
                    <Image
                      src={getBaseImageUrl(
                        companyDomain,
                        response?.product_image,
                        "",
                      )}
                      alt={response?.offer_title}
                      fill
                      priority
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 200px"
                    />
                    <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 bg-neutral-900 rounded-md shadow-sm border border-neutral-800">
                      <span className="text-[#FF5A00] text-[8px] font-bold tracking-widest italic uppercase">
                        Save
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h2 className="text-lg md:text-xl font-bold text-neutral-900 tracking-tight leading-snug normal-case mb-4">
                      {discardHTMLTags(response?.offer_title)}
                    </h2>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 mb-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                          Price Now
                        </span>
                        <div className="flex items-baseline justify-center sm:justify-start gap-2">
                          <span className="text-2xl font-bold text-neutral-950 tracking-tight">
                            {getCurrencySymbol(response?.currency)}
                            {response?.sale_price}
                          </span>
                          {response?.original_price && (
                            <span className="text-xs font-medium text-neutral-400 line-through">
                              {getCurrencySymbol(response?.currency)}
                              {response?.original_price}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-orange-50/60 px-2.5 py-1 rounded-md border border-orange-100/60 self-end mb-0.5">
                        <span className="text-[#FF5A00] font-bold text-[11px] uppercase tracking-wider">
                          {getFinalDiscountTag(
                            response?.offer_title,
                            calculateDiscountPercent(
                              response?.original_price,
                              response?.sale_price,
                            ),
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start">
                      <OfferOutUrl
                        domain={companyDomain}
                        merchantHref={getMerchantHref(
                          response?.merchant,
                          store_slug,
                          slug_type,
                        )}
                        outUrl={response?.url}
                        unique_id={response?.unique_id}
                        customClass="inline-flex items-center justify-center gap-2 bg-[#FF5A00] hover:bg-neutral-950 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md group no-underline w-full sm:w-auto"
                      >
                        <span>Collect Deal</span>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="w-3 h-3 transition-transform group-hover:translate-x-0.5 text-white"
                        />
                      </OfferOutUrl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {response?.offer_detail && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-6 md:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.015)] relative overflow-hidden group">
                {/* Micro Top Accent Line */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FF5A00] to-transparent" />

                {/* Premium Tracker Header */}
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-600 mb-6 flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-[#FF5A00] rotate-45 block shrink-0 shadow-sm shadow-orange-500/20" />
                  <span>Product Overview & Details</span>
                </h3>

                <div
                  className="prose prose-sm prose-neutral max-w-none text-neutral-600 font-normal leading-relaxed 
        prose-p:mb-4 prose-p:leading-relaxed 
        prose-li:my-1.5 prose-ul:list-disc prose-ul:pl-5
        prose-strong:text-neutral-950 prose-strong:font-bold
        prose-headings:text-neutral-950 prose-headings:font-black prose-headings:tracking-tight prose-headings:mb-3 prose-headings:mt-6
        prose-a:text-[#FF5A00] prose-a:font-bold no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: response?.offer_detail }}
                />
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="bg-gradient-to-b from-white to-neutral-50/40 rounded-2xl border border-neutral-200/60 p-6 shadow-[0_12px_35px_rgba(0,0,0,0.02)] relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-5 mb-5">
                <div className="relative w-20 h-20 bg-white rounded-xl p-3 flex items-center justify-center border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] shrink-0 transition-transform duration-300 group-hover:scale-[1.03]">
                  <Image
                    src={getBaseImageUrl(
                      companyDomain,
                      response?.merchant?.merchant_logo,
                      "",
                    )}
                    alt={response?.merchant?.merchant_name}
                    width={64}
                    height={64}
                    className="object-contain max-h-full max-w-full"
                    priority
                  />
                </div>

                <div className="text-center sm:text-left lg:text-center xl:text-left min-w-0 flex-1">
                  <span className="text-[9px] font-black tracking-[0.2em] text-[#FF5A00] uppercase block mb-1">
                    Verified Brand
                  </span>
                  <h4 className="text-base font-black text-neutral-950 uppercase tracking-tight truncate leading-tight mb-2">
                    {response?.merchant?.merchant_name}
                  </h4>
                  <div className="flex items-center justify-center sm:justify-start lg:justify-center xl:justify-start gap-1.5">
                    <RenderRating
                      rating={getRandomRating(response?.merchant?.rating)}
                    />
                    <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 border border-neutral-200/50 px-1.5 py-0.5 rounded-md ml-0.5">
                      {getRandomRating(response?.merchant?.rating)}/5
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={getProductMerchantHref(response?.merchant, slug_type)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-950 text-white text-xs font-black uppercase tracking-widest hover:bg-[#FF5A00] transition-all duration-300 no-underline shadow-sm hover:shadow-md group"
              >
                <span>Visit Brand Store</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="w-3 h-3 text-white transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.015)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF5A00]/40 to-transparent" />
              <div className="rate-us-wrapper-custom">
                <RateUs
                  offer_id={response?.unique_id || ""}
                  company_id={company_id}
                />
              </div>
            </div>

            {cat?.length > 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-[0_12px_35px_rgba(0,0,0,0.015)]">
                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] border-b border-neutral-50 pb-3 mb-4">
                  More From {response?.merchant?.merchant_name}
                </h4>

                <div className="space-y-2.5">
                  {cat.slice(0, 5).map((category, i) => (
                    <Link
                      key={i}
                      href={`${getProductMerchantHref(response?.merchant, slug_type)}/${category.slug}`}
                      className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-neutral-50/80 hover:bg-neutral-800 border border-neutral-200/10 transition-all duration-200 group no-underline"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-1.5 h-1.5 bg-[#FF5A00] group-hover:bg-white rotate-45 block shrink-0 shadow-sm transition-colors duration-200" />
                        <span className="text-xs font-bold text-neutral-800 group-hover:text-[#FF5A00] transition-colors tracking-wide truncate">
                          {category.name}
                        </span>
                      </div>

                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="w-2.5 h-2.5 text-[#FF5A00] group-hover:text-white transition-all duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  ))}
                </div>

                <div className="pt-4 mt-3 border-t border-neutral-50 flex justify-center">
                  <Link
                    href={getProductMerchantHref(response?.merchant, slug_type)}
                    className="inline-flex items-center justify-center py-2 px-6 rounded-full border border-orange-200/70 bg-orange-50/40 text-[#FF5A00] font-bold text-[10px] uppercase tracking-widest hover:bg-[#FF5A00] hover:text-white hover:border-[#FF5A00] transition-all duration-200 no-underline shadow-sm"
                  >
                    View all
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>

        {similarCategory?.length > 0 && (
          <section className="mt-16">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-neutral-950">
                Shop More{" "}
                <span className="text-[#FF5A00]">
                  {formatCategoryName(categorySlug)}
                </span>{" "}
                Options
              </h2>
              <div className="w-10 h-[2px] bg-[#FF5A00] rounded-full mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarCategory.slice(0, 4).map((item, i) => (
                <EventsOfferCard
                  key={i}
                  product={item}
                  merchantHref={getMerchantHref(merRes, store_slug, slug_type)}
                  domain={companyDomain}
                  merchant_name={merRes?.merchant_name}
                  merchant_logo={merRes?.merchant_logo}
                  productDetailUrl={getProductDetailHref(
                    merRes,
                    slug_type,
                    item?.slug,
                    item?.category?.slug,
                  )}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <SpecificProductSchema
        company_id={company_id}
        product_id={response?.unique_id}
        current_merchant_slug={current_merchant_slug}
        slug_type={slug_type}
      />
    </div>
  );
};

export default OfferDetailsPage;

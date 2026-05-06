import { apiMerchantDetailsByCategory } from "@/apis/merchant";
import {
  apiCategoryOfferBanners,
  apiCompanyUpdatedData,
  apiGetCategoryUniqueId,
  apiSuggestedCategory,
} from "@/apis/user";
import BreadcrumbSection from "@/components/Theme-17/comp/BreadcrumbSection";
import CategoryOffers from "@/components/Theme-17/comp/CategoryOffers";
import CategorySidebar from "@/components/Theme-17/comp/CategorySidebar";
import OfferCard from "@/components/Theme-17/comp/offerCard";
import RoundedMerchant from "@/components/Theme-17/comp/RoundedMerchant";
import VerticalCategoryOfferBanner from "@/components/Theme-17/comp/VerticalCategoryOfferBanner";
import { filterOfferBanners } from "@/constants/hooks";
import cookieService from "@/services/CookiesService";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{ slug: string[] }>;
}

const CategoryMerchantPage = async ({ params }: Props) => {
  const { slug } = await params;
  const companyDomain = await cookieService.get("domain");

  if (slug?.length > 4 || slug[0] === "category") {
    notFound();
  }

  if (slug[slug.length - 1] === "page") {
    const cleanUrl = `/category/${slug.slice(0, slug.length - 1).join("/")}`;
    redirect(cleanUrl);
  }

  const c_data = (await apiCompanyUpdatedData(companyDomain)).data;

  let page = 1;
  const isPaginated = slug.length >= 2 && slug[slug.length - 2] === "page";

  if (isPaginated) {
    page = parseInt(slug[slug.length - 1], 10) || 1;
    if (page === 1) {
      const cleanUrl = `/category/${slug.slice(0, -2).join("/")}`;
      redirect(cleanUrl);
    }
  }

  const cleanSlug = isPaginated ? slug[slug.length - 3] : slug[slug.length - 1];

  const categorySlug = slug.slice(0, isPaginated ? -2 : undefined).join("/");

  const CategoryCheck = slug.slice(0, isPaginated ? -2 : undefined);

  const catRes = (await apiGetCategoryUniqueId(cleanSlug, c_data?.unique_id))
    .data;

  if (
    !isPaginated &&
    CategoryCheck.length == 1 &&
    catRes?.parent_category_id != null
  ) {
    return redirect(`/${catRes?.url}`);
  }

  const categoryId = catRes?.unique_id;
  if (!categoryId) return notFound();

  const [merchants, bannerResponse, categories] = await Promise.all([
    apiMerchantDetailsByCategory(categoryId, c_data?.unique_id).then(
      (res) => res.data,
    ),
    apiCategoryOfferBanners(categoryId, c_data?.unique_id, 1).then(
      (res) => res.data,
    ),
    apiSuggestedCategory(categoryId).then((res) => res.data),
  ]);

  const initialFiltered = filterOfferBanners(
    bannerResponse?.offers || [],
    50,
    2000,
    65,
    2000,
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <BreadcrumbSection
        title={catRes?.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
          { label: catRes?.name, href: `/category/${categorySlug}` },
        ]}
      />

      {merchants?.merchants?.length > 0 && (
        <div className="bg-white border-b border-gray-100 shadow-sm relative z-20">
          <RoundedMerchant
            merchants={merchants?.merchants}
            storeSlug={c_data?.store_slug}
            slugType={c_data?.slug_type}
          />
        </div>
      )}

      <section className="py-12 lg:py-20 relative w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-[#FF5F1F]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-gray-200 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-[30%] flex flex-col gap-8 order-1 sticky top-24">
              {categories?.categories?.length > 0 && (
                <div className="bg-white p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden transition-all duration-500">
                  <CategorySidebar
                    categories={categories?.categories}
                    pageSlug="category"
                    parentCategory={catRes?.name}
                  />
                </div>
              )}

              {/* Vertical Banner */}
              <div className="rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-50 bg-white">
                <VerticalCategoryOfferBanner
                  bannerResponse={initialFiltered}
                  domain={companyDomain.domain}
                  mer_slug={c_data?.store_slug}
                  slug_type={c_data?.slug_type}
                  categoryId={categoryId}
                  companyId={c_data?.unique_id}
                />
              </div>
            </aside>

            {/* Content Area */}
            <div className="w-full lg:w-[70%] order-2">
              <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#1a1612] tracking-tight">
                    Exclusive Offers <span className="text-[#FF5F1F]">.</span>
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-medium">
                    Verified deals in {catRes?.name}
                  </p>
                </div>
              </div>

              <CategoryOffers
                category_id={categoryId}
                url_slug={categorySlug?.split("/")}
                page={page?.toString()}
                company_id={c_data?.unique_id}
                mer_slug={c_data?.store_slug}
                mer_slug_type={c_data?.slug_type}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryMerchantPage;

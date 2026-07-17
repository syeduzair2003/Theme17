import { apiCompanyUpdatedData, apiGetProductMerchants } from "@/apis/user";
import cookieService from "@/services/CookiesService";
import React from "react";
import BreadcrumbSection from "../../comp/BreadcrumbSection";
import { getProductMerchantHref } from "@/constants/hooks";
import MerchantForProduct from "../../comp/MerchantForProduct";

const page = async () => {
  const companyDomain = await cookieService.get("domain");
  const companyData = (await apiCompanyUpdatedData(companyDomain)).data;
  const merchants = (await apiGetProductMerchants(companyData?.unique_id)).data;

  return (
    <div className="bg-[#fafafa] min-h-screen text-slate-800 font-sans">
      <BreadcrumbSection
        title="Branded Products"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Branded Products", href: "/products" },
        ]}
      />

      <section className="pt-16 pb-20">
        <div className="container px-4 sm:px-6 mx-auto">
          {/* Header Section */}
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-5 tracking-tight">
              Explore Our <span className="text-[#ff912f]">Top Brands</span>
            </h2>
            <div className="h-1 w-20 bg-[#ff912f] mx-auto mb-6 rounded-full" />
            <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
              Discover exclusive deals and premium products from your favorite
              merchants, all curated in one place.
            </p>
          </div>

          {/* Grid Area */}
          {merchants?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
              {merchants.map((item: any, i: number) => (
                <div key={i} className="flex h-full">
                  <MerchantForProduct
                    merchant_name={item?.merchant_name}
                    merchant_logo={item?.merchant_logo || ""}
                    companyDomain={companyDomain.domain}
                    merchant_href={getProductMerchantHref(
                      item,
                      companyData?.slug_type,
                    )}
                    discountTag={item?.promotional_tag}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-200 shadow-inner">
                <span className="text-5xl opacity-90">🛍️</span>
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                No Merchants Found
              </h3>
              <p className="text-slate-500 mt-4 max-w-xs mx-auto font-medium">
                We&apos;re currently updating our catalog. Check back soon for
                new premium products!
              </p>
              <button className="mt-10 bg-[#ff912f] text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#e07d24] transition-all duration-500 shadow-lg shadow-[#ff912f]/15">
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default page;

import { apiCompanyUpdatedData, apiGetProductMerchants } from '@/apis/user';
import cookieService from '@/services/CookiesService';
import React from 'react'
import BreadcrumbSection from '../../comp/BreadcrumbSection';
import { getProductMerchantHref } from '@/constants/hooks';
import MerchantForProduct from '../../comp/MerchantForProduct';


const page = async () => {
  const companyDomain = (await cookieService.get("domain"));
  const companyData = (await apiCompanyUpdatedData(companyDomain)).data;
  const merchants = (await apiGetProductMerchants(companyData?.unique_id)).data;

  return (
    <>
      <BreadcrumbSection
        title="Products"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Branded Products", href: "/products" }
        ]} />
      
      <section className="pt-12 pb-6 bg-white">
          <div className="container">
              {merchants?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {merchants.map((item: any, i: number) => (
                          <MerchantForProduct
                              key={i}
                              merchant_name={item?.merchant_name}
                              merchant_logo={item?.merchant_logo || ""}
                              companyDomain={companyDomain.domain}
                              merchant_href={getProductMerchantHref(item, companyData?.slug_type)}
                              discountTag={item?.promotional_tag}
                          />
                      ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                      <h3 className="text-xl font-semibold text-gray-800">No Merchants Found</h3>
                      <p className="text-gray-500 mt-2">Check back later for exciting branded products.</p>
                  </div>
              )}
          </div>
      </section>
    </>
  )
}

export default page
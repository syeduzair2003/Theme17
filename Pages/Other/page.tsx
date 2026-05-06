import { apiGetMerchantUniqueId } from '@/apis/merchant';
import { apiCheckPromoIsParent } from '@/apis/page_optimization';
import { apiCompanyUpdatedData } from '@/apis/user';
import cookieService from '@/services/CookiesService';
import dynamic from 'next/dynamic';
import { notFound, redirect } from 'next/navigation';
import React from 'react'
import PromotionsPage from '../../comp/PromotionsPage';
import ParentPromotionPage from '../../comp/ParentPromotionPage';


const OffersPage = dynamic(() => import("../../comp/OffersPage"));
const AllStoresPage = dynamic(() => import("../../comp/AllStoresPage"));
const PromotionOffersPage = dynamic(() => import("../../comp/PromotionOffersPage"));

type DynamicProps = Promise<{ slug: string[] }>;
type SearchProps = Promise<any>;

const Dynamic = async ({
  params,
  searchParams
}: {
  params: DynamicProps;
  searchParams: SearchProps;
}) => {
  const { slug } = await params;

  // Guard clause for unexpected slug formats
  if (!Array.isArray(slug) || slug.length === 0) {
    return notFound();
  }

  const { p_id, ads_campaign } = await searchParams;
  const companyDomain = await cookieService.get("domain");
  const response = await apiCompanyUpdatedData(companyDomain);
  const companyData = response?.data;

  // If company data is not valid
  if (!companyData?.unique_id) {
    return notFound();
  }
  
  if (slug.length === 1 && slug[0] === companyData.store_slug) {
    // Redirect /stores or /all-stores to /all-stores/A
    if (slug[0] === companyData.store_slug || slug[0] === "all-stores") {
      return redirect("/all-stores/A");
    }
    return notFound();
  }

  if (slug.length === 1 && slug[0] === companyData?.promotion_slug) {
    return <PromotionsPage promotionSlug={companyData?.promotion_slug} />
  }
  if (slug.length === 2 && slug[0] === companyData?.promotion_slug) {
    const checkIsParent = await apiCheckPromoIsParent(companyData?.unique_id, slug[1]);
    if (!checkIsParent?.data?.is_parent === true) {
      return <PromotionOffersPage params={slug[1]}/>
    } else {
      return <ParentPromotionPage params={slug[1]} />
    }
  }

  if (slug.length === 2) {
    if (slug[0] === companyData.store_slug) {
      const merRes = await apiGetMerchantUniqueId(slug[1], companyData.unique_id);
      const merchantId = merRes?.data?.unique_id;
      if (!merchantId) return notFound();

      return (
        <OffersPage
          merchant_id={merchantId}
          product_id={p_id}
          slug={slug}
          store_slug={companyData?.store_slug}
          slug_type={companyData?.slug_type}
          company_id={companyData?.unique_id}
          category_slug={companyData?.category_slug}
          ads_campaign={ads_campaign}
        />
      );
    }

    if (slug[0] === "all-stores") {
      return <AllStoresPage store_slug={companyData.store_slug} slug_type={companyData.slug_type} company_id={companyData.unique_id} slug={slug[1]} page="1" />;
    }
  }
  if (slug.length === 4 && slug[0] === 'all-stores' && slug[2] === 'page') {
    return <AllStoresPage store_slug={companyData.store_slug} slug_type={companyData.slug_type} company_id={companyData.unique_id} slug={slug[1]} page={slug[slug.length - 1]} />;
  }
  return notFound();
};

export default Dynamic;

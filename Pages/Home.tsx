import { apiCompanyUpdatedData, apiRecentlyUpdatedStores } from "@/apis/user"; // Added apiRecentlyUpdatedStores
import { keywordsAction } from "@/app/actions/index";
import cookieService from "@/services/CookiesService";
import React from "react";
import HeroSection from "../comp/HeroSection";
import MerchantsCarousel from "../comp/MerchantsCarousel";
import RecentEvents from "../comp/RecentEvents";
import BestOffers from "../comp/BestOffers";
import HomeCategories from "../comp/HomeCategories";
import TrendingProducts from "../comp/TrendingProducts";
import RoundedMerchantHome from "../comp/RoundedMerchantHome";
import HomepageFAQs from "../comp/HomePageFaqs";
import Blog from "../comp/Blog";
import NewsletterWithStores from "../comp/NewsletterWithStores";

const Home = async () => {
  const companyDomainObj = await cookieService.get("domain");
  const companyDomain = companyDomainObj?.domain || '';

  const companyRes = await apiCompanyUpdatedData(companyDomainObj);
  const c_data = companyRes?.data;

  // Fetching keywords for HeroSection
  const keywordsRes = await keywordsAction(c_data?.unique_id);
  const keywords: string[] = keywordsRes?.data ?? [];

  const storesRes = await apiRecentlyUpdatedStores(companyDomain);
  const storesData = storesRes?.data ?? [];

  return (
    <div className="theme-11">
      <HeroSection
        keywords={keywords}
        mer_slug={c_data?.store_slug}
        cat_slug={c_data?.category_slug}
      />

      {c_data?.popular_deals_status == 1 && (
        <BestOffers
          companyId={c_data?.unique_id}
          mer_slug_type={c_data?.slug_type}
          mer_slug={c_data?.store_slug}
        />
      )}

      {c_data?.top_merchants_status == 1 && (
        <MerchantsCarousel
          companyId={c_data?.unique_id}
          mer_slug_type={c_data?.slug_type}
          mer_slug={c_data?.store_slug}
        />
      )}

      <RoundedMerchantHome
        companyId={c_data?.unique_id}
        mer_slug={c_data?.store_slug}
        mer_slug_type={c_data?.slug_type}
      />

      <RecentEvents
        companyId={c_data?.unique_id}
        mer_slug_type={c_data?.slug_type}
        mer_slug={c_data?.store_slug}
      />

      {c_data?.top_categories_status == 1 && (
        <HomeCategories
          companyId={c_data?.unique_id}
          slug_type={c_data?.slug_type}
          cat_slug={c_data?.category_slug}
        />
      )}

      <TrendingProducts
        companyId={c_data?.unique_id}
        mer_slug_type={c_data?.slug_type}
        mer_slug={c_data?.store_slug}
      />
      
      <HomepageFAQs
        slug_type={c_data?.slug_type}
        store_slug={c_data?.store_slug}
      />
      
      <NewsletterWithStores 
        companyId={c_data?.unique_id}
        companyDomain={companyDomain}
        promoMerchants={storesData}  
        slug_type={c_data?.slug_type}
        store_slug={c_data?.store_slug}
      />

      {(c_data?.blog_title || c_data?.blog_url) && (
        <Blog companyId={c_data?.unique_id} blog_url={c_data?.blog_url} />
      )}
      
    </div>
  );
};

export default Home;
import { apiCompanyUpdatedData } from "@/apis/user";
import cookieService from "@/services/CookiesService";
import React from "react";
import BreadcrumbSection from "../../comp/BreadcrumbSection";
import CategoryPageSchema from "@/components/shared/SchemaScripts/CategoryPageSchema";
import CatPage from "../../comp/CatPage";

const page = async () => {
  const companyDomain = await cookieService.get("domain");
  const response = (await apiCompanyUpdatedData(companyDomain)).data;

  const socialLinks = {
    facebook: response?.facebook,
    twitter: response?.twitter,
    instagram: response?.instagram,
    linkedin: response?.linkedin,
    pinterest: response?.pinterest,
    youtube: response?.youtube,
    flipboard: response?.flipboard,
    tiktok: response?.tiktok,
    threads: response?.threads,
  };

  return (
    <>
      <BreadcrumbSection
        title="Our Popular Categories"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
        ]}
      />

      <CatPage company_id={response?.unique_id} />

      <CategoryPageSchema
        company_name={response?.company_name}
        company_logo={response?.company_logo}
        socialLinks={socialLinks}
        company_id={response?.unique_id}
      />
    </>
  );
};

export default page;

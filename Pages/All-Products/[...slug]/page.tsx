import { apiCompanyUpdatedData, apiGetCategoryUniqueId } from '@/apis/user';
import ProductsLayout from '@/components/Theme-17/comp/ProductsLayout';

import cookieService from '@/services/CookiesService';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: Promise<{ slug: string[] }>;
}

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const companyDomain = await cookieService.get("domain");
  const c_data = (await apiCompanyUpdatedData(companyDomain)).data;

  if (slug.length >= 2 && slug[0] === "page" && slug[1] === "1") {
    return redirect("/all-products");
  }
  if (slug[0] === 'all-products') return redirect('/all-products');
  if (slug?.length > 4){
    notFound()
  }

  // ✅ Case: parent category with page/1 → redirect to /all-products/category
  if (slug.length >= 3 && slug[slug.length - 2] === "page" && slug[slug.length - 1] === "1") {
    const cleaned = slug.slice(0, slug.length - 2).join("/");
    return redirect(`/all-products/${cleaned}`);
  }

  // ✅ Case: child category with page/1 → redirect to /all-products/category/child
  if (slug.length === 4 && slug[2] === "page" && slug[3] === "1") {
    const cleaned = slug.slice(0, 2).join("/");
    return redirect(`/all-products/${cleaned}`);
  }

  // Case: only "page/[n]"
  if (slug[0] === 'page') {
    return (
      <ProductsLayout
        page={slug[1]}
        companyId={c_data?.unique_id}
        storeSlug={c_data?.store_slug}
        slugType={c_data?.slug_type}
      />
    );
  }

  // Case: child category without page
  if (slug.length === 2) {
    const catRes = await apiGetCategoryUniqueId(slug[1], c_data.unique_id);
    const categoryId = catRes?.data?.unique_id;
    if (!categoryId) return notFound();

    return (
      <ProductsLayout
        companyId={c_data?.unique_id}
        storeSlug={c_data?.store_slug}
        slugType={c_data?.slug_type}
        categoryId={categoryId}
        slug={slug}
        categoryName={catRes?.data?.name}
      />
    );
  }

  // Case: parent category without page
  if (slug.length === 1) {
    const catRes = await apiGetCategoryUniqueId(slug[0], c_data.unique_id);
    if (catRes?.data?.parent_category_id != null) {
      const parsedUrl = `/${catRes?.data?.url.replace(/^category\//, "all-products/")}`;
      return redirect(parsedUrl)
    }
    const categoryId = catRes?.data?.unique_id;
    if (!categoryId) return notFound();
    return (
      <ProductsLayout
        companyId={c_data?.unique_id}
        storeSlug={c_data?.store_slug}
        slugType={c_data?.slug_type}
        categoryId={categoryId}
        slug={slug}
        categoryName={catRes?.data?.name}
      />
    );
  }

  // Case: parent category with page
  if (slug.length === 3 && slug[1] === 'page') {
    const catRes = await apiGetCategoryUniqueId(slug[0], c_data.unique_id);
    if (catRes?.data?.parent_category_id != null) {
      const parsedUrl = `/${catRes?.data?.url.replace(/^category\//, "all-products/")}`;
      return redirect(parsedUrl)
    }
    const categoryId = catRes?.data?.unique_id;
    if (!categoryId) return notFound();

    return (
      <ProductsLayout
        page={slug[2]}
        companyId={c_data?.unique_id}
        storeSlug={c_data?.store_slug}
        slugType={c_data?.slug_type}
        categoryId={categoryId}
        slug={slug}
        categoryName={catRes?.data?.name}
      />
    );
  }

  // Case: child category with page
  if (slug.length === 4 && slug[2] === 'page') {
    const catRes = await apiGetCategoryUniqueId(slug[1], c_data.unique_id);
    const categoryId = catRes?.data?.unique_id;
    if (!categoryId) return notFound();

    return (
      <ProductsLayout
        page={slug[3]}
        companyId={c_data?.unique_id}
        storeSlug={c_data?.store_slug}
        slugType={c_data?.slug_type}
        categoryId={categoryId}
        slug={slug}
        categoryName={catRes?.data?.name}
      />
    );
  }
  else if (slug.length > 4) {
    return notFound();
  }
  return notFound();
};

export default Page;

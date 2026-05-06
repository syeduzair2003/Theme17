import { apiGetMerchantUniqueId } from '@/apis/merchant';
import { apiCompanyUpdatedData, apiGetProductCategoryUniqueId, apiGetProductDetails } from '@/apis/user';
import CategoryProductOffers from '@/components/Theme-17/comp/CategoryProductOffers';
import MerchantProductsPage from '@/components/Theme-17/comp/MerchantProductsPage';
import OfferDetailsPage from '@/components/Theme-17/comp/OfferDetailsPage';
import { extractTrailingId } from '@/constants/hooks';
import cookieService from '@/services/CookiesService';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

type Props = Promise<{ slug: string[] }>;

const page = async ({ params }: { params: Props }) => {
    const { slug } = await params;
    const companyDomain = (await cookieService.get("domain"));
    const companyData = (await apiCompanyUpdatedData(companyDomain)).data;

    if (slug.length === 1) {
        // /products/merchant
        return <MerchantProductsPage
            slug={slug[0]}
            companyId={companyData?.unique_id}
            storeSlug={companyData?.store_slug}
            slugType={companyData?.slug_type}
        />

    } else if (slug.length === 2) {
        const catRes = await apiGetProductCategoryUniqueId(slug[1], companyData.unique_id);
        const catId = catRes?.data?.unique_id;
        const productId = extractTrailingId(slug[1]);

        if (productId) {
            const response = (await apiGetProductDetails(companyData.unique_id, productId, slug[0])).data;
            if (response == null || !response?.category) return notFound();
            return redirect(`/products/${slug[0]}/${response?.category?.slug}/${slug[1]}`)
        } else {
            if (!catId) return notFound();
            return <CategoryProductOffers
                slug={slug[0]}
                companyId={companyData?.unique_id}
                storeSlug={companyData?.store_slug}
                slugType={companyData?.slug_type}
                category={slug[1]}
            />;
        }

    } else if (slug.length === 3) {
        // /products/merchant/category/offer-detail
        const merRes = await apiGetMerchantUniqueId(slug[0], companyData.unique_id);
        const merchantId = merRes?.data?.unique_id;
        if (!merchantId) return notFound();

        const productId = extractTrailingId(slug[2]); // slug[2] is the offer, slug[1] is the category
        if (!productId) return notFound();

        return <OfferDetailsPage
            store_slug={companyData.store_slug}
            slug_type={companyData.slug_type}
            company_id={companyData.unique_id}
            product_id={productId}
            current_merchant_slug={slug[0]}
            categorySlug={slug[1]}
        />;

    } else {
        return notFound();
    }
}

export default page
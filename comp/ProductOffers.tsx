import React from 'react';
import { apiGetAllProducts } from '@/apis/user';
import { getMerchantHref, getProductDetailHref } from '@/constants/hooks';
import cookieService from '@/services/CookiesService';
import { OffersOffer } from '@/services/dataTypes';
import Pagination from './Pagination';
import ProductCard from './ProductCard';

interface Props {
    page?: string;
    company_id: string;
    mer_slug: string;
    mer_slug_type: string;
    category_id?: string;
    slug?: string[];
}

const ProductOffers = async ({ page, company_id, mer_slug, mer_slug_type, category_id, slug }: Props) => {
    const currentPage = Math.max(1, parseInt(page || "1", 10));
    const offers = (await apiGetAllProducts(company_id, category_id, currentPage.toString(), 30)).data;
    const totalPages = offers?.pagination?.last_page || 0;
    const domainObj = await cookieService.get("domain");
    const domain = domainObj?.domain || "";

    const cleanedSlug = slug?.length
        ? slug.filter((s, i) => {
            // remove "page" and the number immediately after it
            if (s === "page" && !isNaN(Number(slug[i + 1]))) return false;
            if (i > 0 && slug[i - 1] === "page" && !isNaN(Number(s))) return false;
            return true;
        })
        : [];

    const baseUrl = cleanedSlug.length
        ? `/all-products/${cleanedSlug.join("/")}`
        : `/all-products`;

    return (
        <div className="w-full h-full flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 w-full mb-10 min-h-[300px]">
                {offers && offers?.offers?.length > 0 ? (
                    offers?.offers?.map((item: OffersOffer, i: number) => (
                        <div key={i} className="flex h-full w-full">
                            <ProductCard
                                product={item?.offer}
                                merchantHref={getMerchantHref(item?.merchant, mer_slug, mer_slug_type)}
                                domain={domain}
                                merchant_logo={item?.merchant?.merchant_logo}
                                merchant_name={item?.merchant?.merchant_name}
                                productDetailUrl={item?.offer?.slug ? getProductDetailHref(item.merchant, mer_slug_type, item?.offer?.slug, item?.offer?.category?.slug) : null}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full w-full py-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                             <span className="text-3xl text-gray-300 font-bold">Oops</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 m-0">No Offers Found</h3>
                        <p className="text-gray-400 mt-2">Try browsing another category or check back later.</p>
                    </div>
                )}
            </div>
            
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={baseUrl}
            />
        </div>
    );
};

export default ProductOffers;

import { apiGetCategoryProductsOffer } from "@/apis/user";
import { faGreaterThan, FontAwesomeIcon } from "@/constants/icons";
import cookieService from "@/services/CookiesService";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getMerchantHref, getProductDetailHref } from "@/constants/hooks";
import { apiGetMerchantUniqueId } from "@/apis/merchant";
import ProductCategorySchema from "@/components/shared/SchemaScripts/ProductCategorySchema";
import EventsOfferCard from "./EventsOfferCard";

interface Props {
  slug: string;
  companyId: string;
  storeSlug: string;
  slugType: string;
  category: string;
}

const CategoryOffersPage = async ({
  slug,
  companyId,
  storeSlug,
  slugType,
  category,
}: Props) => {
  const companyDomain = await cookieService.get("domain");

  const [products, merRes] = await Promise.all([
    apiGetCategoryProductsOffer(companyId, slug, category).then(
      (res) => res.data,
    ),
    apiGetMerchantUniqueId(slug, companyId).then((res) => res.data),
  ]);
  const formatCategoryName = (slug: string): string =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <section className="banner-section index-one overflow-hidden position-relative s1-2nd-bg-color rounded-3 cus-border border">
        <div className="container position-relative">
          <div className="row g-9 g-lg-0 align-items-center d-flex">
            <div className="col-lg-6 pe-4 pe-md-10 d-flex flex-column">
              <div className="d-grid gap-4 gap-md-6 position-relative cus-z1">
                <h1 className="display-four n17-color f-35 text-capitalize">
                  {formatCategoryName(category)}
                </h1>
                <div className="breadcrumb-area">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb second position-relative m-0 d-center justify-content-start gap-2 gap-md-3">
                      <li className="d-flex align-items-center fs-seven justify-content-center gap-2">
                        <Link href={`/`} className="n17-color">
                          Home
                        </Link>
                        <FontAwesomeIcon
                          icon={faGreaterThan}
                          style={{
                            width: "12px",
                            height: "12px",
                            color: "#222e48",
                          }}
                        />
                      </li>
                      <li className="d-flex align-items-center fs-seven justify-content-center gap-2">
                        <Link href={`/products`} className="n17-color">
                          Products
                        </Link>
                        <FontAwesomeIcon
                          icon={faGreaterThan}
                          style={{
                            width: "12px",
                            height: "12px",
                            color: "#222e48",
                          }}
                        />
                      </li>
                      <li className="d-flex align-items-center fs-seven justify-content-center gap-2">
                        <Link
                          href={`/products/${slug}`}
                          className="n17-color text-capitalize"
                        >
                          {merRes?.merchant_name || slug}
                        </Link>
                        <FontAwesomeIcon
                          icon={faGreaterThan}
                          style={{
                            width: "12px",
                            height: "12px",
                            color: "#222e48",
                          }}
                        />
                      </li>
                      <li
                        className="breadcrumb-item d-flex align-items-center fs-seven active"
                        aria-current="page"
                      >
                        <span className="fw-mid f5-color text-capitalize">
                          {formatCategoryName(category)}
                        </span>
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>

            <div className="col-lg-6 pe-4 pe-md-10 d-flex flex-column">
              <div
                className="img-area d-flex justify-content-end align-items-end position-relative"
                style={{ width: "100%", minHeight: "350px" }}
              >
                <Image
                  src="/shared-assets/BANNER.png"
                  alt="img"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-sidebar"
        style={{ paddingTop: "20px", paddingBottom: "50px" }}
      >
        <div className="container">
          <h2 className="display-four n17-color f-28 py-5 text-capitalize">
            {`Discover ${formatCategoryName(category)} Products from ${merRes?.merchant_name}`}
          </h2>

          <div className="row">
            <div className="col-xxl-12 cus-z1">
              {products?.length > 0 && (
                <div className="row cus-row d-flex justify-content-center justify-content-md-start gy-3 gy-md-4 top-stores trending-categories third">
                  {products.map((item, i) => (
                    <div
                      key={i}
                      className="col-xl-3 col-lg-3 col-md-6 col-12 cus-z1"
                    >
                      <EventsOfferCard
                        product={item}
                        merchantHref={getMerchantHref(
                          merRes,
                          storeSlug,
                          slugType,
                        )}
                        domain={companyDomain.domain}
                        merchant_name={merRes?.merchant_name}
                        merchant_logo={merRes?.merchant_logo}
                        productDetailUrl={getProductDetailHref(
                          merRes,
                          slugType,
                          item?.slug,
                          item?.category?.slug,
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ProductCategorySchema
        company_id={companyId}
        merchantSlug={slug}
        merchantName={merRes?.merchant_name}
        categorySlug={category}
        categoryName={formatCategoryName(category)}
      />
    </>
  );
};

export default CategoryOffersPage;

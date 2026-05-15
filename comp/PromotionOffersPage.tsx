import {
  apiGetPromoOfferBanners,
  apiGetPromotionOffers,
  apiGetSubPromoBanners,
  apiGetSubPromoSuggestedMerchant,
} from "@/apis/page_optimization";
import {
  apiCompanyUpdatedData,
  apiGetAllPromotion,
  apiGetPromotionCategories,
} from "@/apis/user";
import {
  cleanHtmlContent,
  extractAllOffers,
  extractFirstSentences,
  getMerchantHref,
  getProductDetailHref,
  splitHeading,
  getPromotionHref,
  filterOfferBanners,
  getBaseImageUrl,
} from "@/constants/hooks";
import BreadcrumbSection from "./BreadcrumbSection";
import VerticalPromotionOfferBanner from "./VerticalPromotionOfferBanner";
import {
  faAngleRight,
  faBolt,
  faCheck,
  faGreaterThan,
  FontAwesomeIcon,
} from "@/constants/icons";
import { MerchantWithOffers, Offer } from "@/services/dataTypes";
import cookieService from "@/services/CookiesService";
import notFound from "@/app/not-found";
import { stripHtml } from "string-strip-html";
import EventsOfferCard, { EventsGrid } from "./EventsOfferCard";
import Link from "next/link";
import Image from "next/image";

type MerchantOfferItem = {
  offer: Offer;
  merchant: MerchantWithOffers;
};

const PromotionOffersPage = async ({ params }: { params: string }) => {
  const slug = params;
  const companyDomain = await cookieService.get("domain");
  const response = await apiCompanyUpdatedData(companyDomain);
  const companyData = response?.data;
  const [
    promotion,
    banners,
    eventMerchants,
    suggestedPromo,
    promoOfferBanners,
    promoCategories,
  ] = await Promise.all([
    apiGetPromotionOffers(companyData?.unique_id, slug).then((res) => res.data),
    apiGetSubPromoBanners(companyData?.unique_id, slug).then((res) => res.data),
    apiGetSubPromoSuggestedMerchant(companyData?.unique_id, slug).then(
      (res) => res.data,
    ),
    apiGetAllPromotion(companyDomain.domain).then((res) => res.data),
    apiGetPromoOfferBanners(companyData?.unique_id, slug).then(
      (res) => res.data,
    ),
    apiGetPromotionCategories(companyData?.unique_id, slug).then(
      (res) => res.data,
    ),
  ]);
  const suggestedCategories = promoCategories?.selected_categories;

  const suggestedPromotions = suggestedPromo?.filter(
    (promo) => promo.slug !== slug,
  );

  if (!promotion) {
    return notFound();
  }
  // const eventOfferBanners = (await apiGetEventOfferBanners(companyData?.unique_id, event?.event?.slug))?.data
  const offerBanners = extractAllOffers(promoOfferBanners);
  const filteredVerticalBanners = filterOfferBanners(
    offerBanners || [],
    50,
    2000,
    65,
    2000,
  );

  const filteredOfferBanners = filterOfferBanners(
    offerBanners || [],
    250,
    600,
    100,
    200,
  );

  const allOffers: MerchantOfferItem[] =
    promotion?.merchants?.flatMap((merchant) =>
      (merchant?.offers || []).map((offer) => ({
        offer,
        merchant,
      })),
    ) || [];

  const description = promotion?.promotion?.description || "";
  const cleanDesc = cleanHtmlContent(description);
  const plainDesc = stripHtml(cleanDesc).result;
  const shortDesc = extractFirstSentences(plainDesc, 20);
  const isLongDescription = plainDesc.length > 400;
  const [firstWord, restWords] = splitHeading(
    promotion?.promotion?.name || "Exclusive Promotion",
  );

  return (
    <>
      <BreadcrumbSection
        title={promotion?.promotion?.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Promotions", href: `/${companyData?.promotion_slug}` },
          {
            label: promotion?.promotion?.name,
            href: `/${companyData?.promotion_slug}/${slug}`,
          },
        ]}
      />
      <section className={isLongDescription ? "pb-12" : "pb-24"}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#8bc94a15] rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faBolt}
                      className="text-[#8bc94a] text-xl"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-2xl md:text-3xl font-black text-[#222e48]">
                      Verified Offers & Deals
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff912f]">
                      Today&apos;s Featured Savings
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <EventsGrid cols={3}>
                {allOffers.map((item, index) => (
                  <EventsOfferCard
                    key={`${item.offer.unique_id}-${index}`}
                    product={item.offer}
                    merchantHref={getMerchantHref(
                      item.merchant,
                      companyData?.store_slug,
                      companyData?.slug_type,
                    )}
                    domain={companyDomain?.domain}
                    merchant_name={item.merchant?.merchant_name}
                    merchant_logo={item.merchant?.merchant_logo}
                    productDetailUrl={
                      item.offer?.slug
                        ? getProductDetailHref(
                            item.merchant,
                            companyData?.slug_type,
                            item.offer.slug,
                            item.offer.category?.slug,
                          )
                        : null
                    }
                  />
                ))}
              </EventsGrid>

              {allOffers.length === 0 && (
                <div className="bg-white rounded-[3rem] py-24 px-10 text-center border border-dashed border-gray-200">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <FontAwesomeIcon
                      icon={faBolt}
                      className="text-gray-200 text-4xl"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-[#222e48] mb-4">
                    No Active Offers Found
                  </h3>
                  <p className="text-gray-400 max-w-sm mx-auto font-medium">
                    We&apos;re currently refreshing our database with new deals.
                    Please check back shortly!
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Area */}
            <aside className="lg:col-span-4 flex flex-col gap-10">
              {/* Suggested Categories */}
              {suggestedCategories?.length > 0 && (
                <div className="relative group/sidebar">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#8bc94a20] to-[#ff912f10] rounded-[2.5rem] blur opacity-50 group-hover/sidebar:opacity-100 transition duration-1000 -z-10" />
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white/50 overflow-hidden">
                    <h4 className="text-xl font-black text-[#222e48] mb-8 pb-4 border-b border-gray-50">
                      Suggested Categories
                    </h4>
                    <div className="flex flex-col gap-1">
                      {suggestedCategories.map((cat, i) => (
                        <Link
                          key={i}
                          href={`/${cat?.url}`}
                          className="group flex items-center justify-between py-3.5 px-2 rounded-xl hover:bg-white hover:shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all duration-500 relative overflow-hidden"
                        >
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 bg-[#8bc94a] group-hover:h-3 transition-all duration-300 rounded-full" />
                          <div className="flex items-center gap-4 pl-0 group-hover:pl-2 transition-all duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#222e4815] group-hover:bg-[#ff912f] transition-colors duration-300" />
                            <span className="text-sm font-bold text-[#222e4870] group-hover:text-[#222e48] transition-colors duration-300">
                              {cat?.category_name}
                            </span>
                          </div>
                          <FontAwesomeIcon
                            icon={faAngleRight}
                            className="text-[10px] text-[#222e4810] group-hover:text-[#8bc94a] group-hover:translate-x-0.5 transition-all duration-300"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Banner Offers */}
              {filteredVerticalBanners?.length > 0 && (
                <VerticalPromotionOfferBanner
                  bannerResponse={filteredVerticalBanners}
                  domain={companyDomain?.domain}
                  mer_slug={companyData?.store_slug}
                  slug_type={companyData?.slug_type}
                />
              )}

              {/* Suggested Promotions */}
              {suggestedPromotions?.length > 0 && (
                <div className="relative group/sidebar">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#ff912f15] to-[#8bc94a10] rounded-[2.5rem] blur opacity-50 group-hover/sidebar:opacity-100 transition duration-1000 -z-10" />
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-white/50 overflow-hidden">
                    <h4 className="text-xl font-black text-[#222e48] mb-8 pb-4 border-b border-gray-50">
                      You May Also Like
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {suggestedPromotions.map((suggestedPromotion, i) => (
                        <Link
                          key={i}
                          href={getPromotionHref(
                            suggestedPromotion,
                            companyData?.promotion_slug,
                          )}
                          className="px-5 py-2.5 rounded-full bg-[#f8fafc] border border-gray-100 text-xs font-bold text-[#222e48] hover:bg-[#ff912f] hover:text-white hover:border-[#ff912f] hover:shadow-lg hover:shadow-[#ff912f]/20 transition-all duration-300 truncate max-w-full"
                        >
                          {suggestedPromotion?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
      {promotion?.merchants && promotion.merchants.length > 0 && (
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                <div className="w-1.5 h-8 bg-[#8bc94a] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black text-[#222e48]">
                  Top Brands in {promotion?.promotion?.name}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {promotion.merchants.slice(0, 12).map((merchant) => (
                  <Link
                    key={merchant.unique_id}
                    href={getMerchantHref(
                      merchant,
                      companyData?.store_slug,
                      companyData?.slug_type,
                    )}
                    className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-4"
                  >
                    <div className="relative w-full h-16">
                      <Image
                        src={getBaseImageUrl(
                          companyData?.domain,
                          merchant.merchant_logo,
                          "",
                        )}
                        alt={merchant.merchant_name}
                        fill
                        unoptimized
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                        sizes="120px"
                      />
                    </div>
                    <span className="text-xs font-black text-[#222e48] text-center line-clamp-1 group-hover:text-[#8bc94a] transition-colors uppercase tracking-wider">
                      {merchant.merchant_name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PromotionOffersPage;

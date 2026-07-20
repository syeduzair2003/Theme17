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

// 🔥 Dynamic Sticky Layout Component Import
import DynamicStickyLayout from "./DynamicStickyLayout";

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

  const fancySuggestedPromotions = suggestedPromo?.filter(
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
      }))
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
      <section
        className={`pt-10 md:pt-16 ${isLongDescription ? "pb-12" : "pb-24"}`}
      >
        <div className="container mx-auto px-4">
          
          {/* 🔥 DynamicStickyLayout Implementation with exact layout slots */}
          <DynamicStickyLayout
            sidebarPosition="right"
            hasSidebar={!!(suggestedCategories?.length || fancySuggestedPromotions?.length)}
            hasBanners={!!filteredVerticalBanners?.length}
            
            // 1. LEFT OFFERS SLOT (Main Stream Content)
            leftOffers={
              <div className="flex flex-col gap-10">
                {/* Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-6 md:p-10 rounded-[2.5rem] border border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.015)]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#ff6b00]/10 rounded-2xl flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faBolt}
                        className="text-[#ff6b00] text-xl"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b00] mb-1">
                        Today&apos;s Featured Savings
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-black">
                        <span className="text-black">{firstWord}</span>{" "}
                        <span className="text-[#ff6b00]">{restWords}</span>
                      </h2>
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
                  <div className="bg-white rounded-[3rem] py-24 px-10 text-center border border-dashed border-neutral-200">
                    <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <FontAwesomeIcon
                        icon={faBolt}
                        className="text-neutral-300 text-4xl"
                      />
                    </div>
                    <h3 className="text-2xl font-black text-black mb-4">
                      No Active Offers Found
                    </h3>
                    <p className="text-neutral-400 max-w-sm mx-auto font-medium">
                      We&apos;re currently refreshing our database with new deals.
                      Please check back shortly!
                    </p>
                  </div>
                )}
              </div>
            }

            // 2. RIGHT SIDEBAR SLOT (Categories & Suggested List)
            rightSidebar={
              <>
                {suggestedCategories && suggestedCategories.length > 0 && (
                  <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.015)] border border-neutral-100 overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative">
                      <div className="flex flex-col">
                        <h4 className="text-lg font-black text-black tracking-tight">
                          Suggested{" "}
                          <span className="text-[#ff6b00]">Categories</span>
                        </h4>
                        <div className="w-6 h-1 bg-[#ff6b00] rounded-full mt-1.5" />
                      </div>

                      <Link
                        href={`/${companyData?.store_slug || ""}`}
                        className="px-4 py-1.5 rounded-full border border-[#ff6b00]/20 bg-[#ff6b00]/5 text-[10px] font-black uppercase tracking-wider text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white hover:border-[#ff6b00] transition-all duration-300"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="flex flex-col gap-3">
                      {suggestedCategories.map((cat, i) => (
                        <Link
                          key={i}
                          href={`/${cat?.url}`}
                          className="group flex items-center justify-between py-3.5 px-4 bg-neutral-50 hover:bg-[#2d2d2d] rounded-2xl transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#ff6b00] rotate-45 group-hover:bg-white group-hover:rotate-0 group-hover:rounded-sm transition-all duration-300 shrink-0" />
                            <span className="text-xs font-bold text-neutral-800 group-hover:text-[#ff6b00] transition-colors duration-300">
                              {cat?.category_name}
                            </span>
                          </div>
                          <FontAwesomeIcon
                            icon={faAngleRight}
                            className="text-[11px] text-[#ff6b00] group-hover:text-white transition-colors duration-300"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {fancySuggestedPromotions && fancySuggestedPromotions.length > 0 && (
                  <div className="relative group/sidebar">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-neutral-200/50 to-[#ff6b00]/10 rounded-[2.5rem] blur opacity-40 group-hover/sidebar:opacity-80 transition duration-700 -z-10" />
                    <div className="relative bg-white rounded-[2.5rem] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.015)] border border-neutral-100 overflow-hidden">
                      <div className="flex flex-col mb-6">
                        <h4 className="text-lg font-black text-black tracking-tight">
                          You May Also{" "}
                          <span className="text-[#ff6b00]">Like</span>
                        </h4>
                        <div className="w-6 h-1 bg-[#ff6b00] rounded-full mt-1.5" />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {fancySuggestedPromotions.map((suggestedPromotion, i) => (
                          <Link
                            key={i}
                            href={getPromotionHref(
                              suggestedPromotion,
                              companyData?.promotion_slug,
                            )}
                            className="px-5 py-2.5 rounded-full bg-neutral-50 border border-neutral-200/60 text-xs font-bold text-neutral-700 hover:bg-[#ff6b00] hover:text-white hover:border-[#ff6b00] hover:shadow-[0_8px_25px_rgba(255,107,0,0.25)] hover:-translate-y-0.5 transition-all duration-300 truncate max-w-full"
                          >
                            {suggestedPromotion?.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            }

            // 3. RIGHT BANNERS SLOT
            rightBanners={
              filteredVerticalBanners && filteredVerticalBanners.length > 0 ? (
                <VerticalPromotionOfferBanner
                  bannerResponse={filteredVerticalBanners}
                  domain={companyDomain?.domain}
                  mer_slug={companyData?.store_slug}
                  slug_type={companyData?.slug_type}
                />
              ) : undefined
            }
          />

        </div>
      </section>

      {/* Top Brands Section */}
      {promotion?.merchants && promotion.merchants.length > 0 && (
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col border-b border-neutral-100/80 pb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b00] mb-2">
                  Curated Partners
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">
                  Top <span className="text-[#ff6b00]">Brands</span>{" "}
                </h2>
                <div className="w-8 h-1 bg-[#ff6b00] rounded-full mt-3" />
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
                    className="group relative bg-white rounded-[2rem] p-5 border border-neutral-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(255,107,0,0.07)] hover:border-[#ff6b00]/20 hover:-translate-y-1.5 transition-all duration-500 flex flex-col items-center gap-4 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ff6b00] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

                    <div className="relative w-full h-20 bg-neutral-50/60 group-hover:bg-white rounded-2xl p-3 flex items-center justify-center transition-all duration-500">
                      <div className="relative w-full h-full">
                        <Image
                          src={getBaseImageUrl(
                            companyData?.domain,
                            merchant.merchant_logo,
                            "",
                          )}
                          alt={merchant.merchant_name}
                          fill
                          unoptimized
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                          sizes="140px"
                        />
                      </div>
                    </div>

                    <span className="text-[11px] font-black text-neutral-500 text-center line-clamp-1 group-hover:text-[#ff6b00] transition-colors duration-300 uppercase tracking-widest mt-1">
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
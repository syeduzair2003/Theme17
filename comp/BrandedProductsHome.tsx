// import { apiHomeBrandedProducts } from '@/apis/user';
// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { discardHTMLTags, getBaseImageUrl, getCurrencySymbol, getFinalDiscountTag } from '@/constants/hooks';
// import OfferOutUrl from '@/components/shared/OfferOutUrl';
// import cookieService from '@/services/CookiesService';
// import { ProductData } from '@/services/dataTypes';
// import { faArrowRightLong, faBolt, faFire, faTag, FontAwesomeIcon } from '@/constants/icons';

// interface Props {
//   companyId: string;
//   mer_slug: string;
//   mer_slug_type: string;
// }

// const BrandedProductsHome = async ({ companyId, mer_slug, mer_slug_type }: Props) => {
//   const products = await apiHomeBrandedProducts(companyId).then((res) => res.data);
//   const companyDomain = await cookieService.get("domain");
//   const domain = companyDomain.domain;

//   if (!products?.products?.length) return null;

//   const displayProducts = products.products.slice(0, 8);

//   return (
//     <section className="relative overflow-hidden py-[50px] md:py-[60px] bg-gradient-to-b from-white via-[#fdf6f0] to-[#fff8f2]">
//       {/* Decorative Background Elements */}
//       <div className="absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(255,148,61,0.08)_0%,transparent_70%)] pointer-events-none" />
//       <div className="absolute -bottom-[40px] -left-[40px] w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(255,123,0,0.06)_0%,transparent_70%)] pointer-events-none" />

//       <div className="container mx-auto px-4">
//         {/* ═══ Section Header ═══ */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-9 gap-4">
//           <div className="flex flex-col gap-1.5">
//             <span className="inline-flex items-center gap-1.5 bg-gradient-to-br from-[#fff4ec] to-[#ffe8d6] text-[#d4731a] text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-[#ff943d]/20 w-fit animate-pulse">
//               <FontAwesomeIcon icon={faBolt} className="w-3 h-3" />
//               Trending Now
//             </span>
//             <h2 className="text-[1.3rem] md:text-[1.85rem] font-extrabold text-[#222e48] leading-tight m-0">
//               Brand <span className="bg-gradient-to-r from-[#ff7b00] to-[#ff943d] bg-clip-text text-transparent">Spotlight</span>
//             </h2>
//             <p className="text-[0.8rem] md:text-[0.9rem] text-[#6a7283] m-0 max-w-[400px]">
//               Handpicked products from top brands at unbeatable prices
//             </p>
//           </div>
//           <div className="hidden md:flex items-center">
//             <Link 
//               href="/products" 
//               className="group inline-flex items-center gap-2 text-[#ff7b00] font-bold text-[0.9rem] no-underline px-5 py-2 border-2 border-[#ff7b00] rounded-full transition-all duration-300 hover:bg-[#ff7b00] hover:text-white hover:translate-x-1 hover:shadow-[0_4px_15px_rgba(255,123,0,0.3)]"
//             >
//               <span>View All</span>
//               <FontAwesomeIcon icon={faArrowRightLong} className="w-4 h-4" />
//             </Link>
//           </div>
//         </div>

//         {/* ═══ Products Grid ═══ */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
//           {displayProducts.map((product: ProductData, index: number) => {
//             const type = product?.offer_type?.name;
//             const imageSrc = getBaseImageUrl(domain, product?.product_image, "");
//             const originalPrice = product?.original_price ? parseFloat(product?.original_price) : 0;
//             const salePrice = product?.sale_price ? parseFloat(product?.sale_price) : 0;
//             const discountPercent = originalPrice > 0 && salePrice > 0
//               ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
//               : null;
//             const finalDiscountTag = getFinalDiscountTag(
//               product?.offer_title || product?.offer_detail,
//               discountPercent,
//             );

//             return (
//               <div key={product.id || index} className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#f0ebe5] transition-all duration-400 hover:-translate-y-1.5 hover:border-[#ff943d]/40 hover:shadow-[0_12px_40px_rgba(255,148,61,0.12),0_4px_12px_rgba(0,0,0,0.06)]">
                
//                 {/* Discount Badge */}
//                 {finalDiscountTag !== null && (
//                   <div className="absolute top-3 left-0 z-10 flex items-center gap-1 bg-gradient-to-r from-[#ff7b00] to-[#ff943d] text-white text-[10px] md:text-[11px] font-bold tracking-tight py-1 pl-2.5 pr-3 rounded-r-full shadow-[0_2px_8px_rgba(255,123,0,0.3)]">
//                     <FontAwesomeIcon icon={faTag} className="w-2.5 h-2.5" />
//                     <span>{finalDiscountTag}</span>
//                   </div>
//                 )}

//                 {/* Image Area */}
//                 <div className="relative bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] p-3.5 md:p-5 flex items-center justify-center min-height-[120px] md:min-h-[180px] overflow-hidden">
//                   <div className="w-full h-[90px] md:h-[140px] flex items-center justify-center transition-transform duration-500 group-hover:scale-108">
//                     <Image
//                       src={imageSrc}
//                       alt={discardHTMLTags(product?.offer_title) || 'Product'}
//                       className="max-w-full max-h-full"
//                       height={200}
//                       width={200}
//                       style={{ objectFit: 'contain' }}
//                       unoptimized
//                     />
//                   </div>
//                   {/* Shine Overlay */}
//                   <div className="absolute top-0 -left-full w-3/5 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-[20deg] pointer-events-none group-hover:animate-[shineSweep_0.7s_ease-out_forwards]" />
//                 </div>

//                 {/* Diagonal Separator SVG */}
//                 <div className="mt-[-1px] leading-none text-white">
//                   <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="block w-full h-4">
//                     <path d="M0,20 L400,0 L400,20 Z" fill="currentColor" />
//                   </svg>
//                 </div>

//                 {/* Content Area */}
//                 <div className="p-2.5 md:p-4 flex flex-col gap-2 flex-grow">
//                   <h3 className="text-[0.7rem] md:text-[0.85rem] font-semibold text-[#222e48] leading-[1.4] m-0 line-clamp-2 transition-colors duration-200 group-hover:text-[#ff7b00]">
//                     {discardHTMLTags(product?.offer_title)}
//                   </h3>

//                   {/* Price Block */}
//                   {type === 'product' && (salePrice > 0 || originalPrice > 0) && (
//                     <div className="flex flex-wrap items-baseline gap-1.5">
//                       {product?.sale_price && salePrice > 0 && (
//                         <span className="text-[0.95rem] md:text-[1.1rem] font-extrabold text-[#1a8f3f]">
//                           {getCurrencySymbol(product?.currency)}{product?.sale_price}
//                         </span>
//                       )}
//                       {product?.original_price && originalPrice > 0 && salePrice > 0 && (
//                         <span className="text-[0.7rem] md:text-[0.8rem] text-[#a6aab5] line-through font-medium">
//                           {getCurrencySymbol(product?.currency)}{product?.original_price}
//                         </span>
//                       )}
//                       {discountPercent && discountPercent > 0 && (
//                         <span className="hidden sm:inline-block text-[10px] md:text-[0.65rem] font-bold text-[#d4731a] bg-[#fff4ec] px-1.5 py-0.5 rounded tracking-tighter">
//                           Save {discountPercent}%
//                         </span>
//                       )}
//                     </div>
//                   )}

//                   {/* CTA Button */}
//                   <div className="mt-auto pt-1.5">
//                     {product?.coupon_code ? (
//                       <OfferOutUrl
//                         unique_id={product?.unique_id}
//                         outUrl={product?.url}
//                         merchantHref={`/products`}
//                         domain={domain}
//                         customClass="flex items-center justify-center gap-1.5 w-full py-2 md:py-2.5 rounded-xl text-[0.72rem] md:text-[0.8rem] font-bold no-underline transition-all duration-300 bg-white text-[#ff7b00] border-2 border-dashed border-[#ff943d] hover:bg-[#fff8f2] hover:border-[#ff7b00] hover:-translate-y-0.5 hover:shadow-lg"
//                       >
//                         <span>Show Code</span>
//                         <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
//                       </OfferOutUrl>
//                     ) : (
//                       <OfferOutUrl
//                         unique_id={product?.unique_id}
//                         outUrl={product?.url}
//                         merchantHref={`/products`}
//                         domain={domain}
//                         customClass="flex items-center justify-center gap-1.5 w-full py-2 md:py-2.5 rounded-xl text-[0.72rem] md:text-[0.8rem] font-bold no-underline transition-all duration-300 bg-gradient-to-r from-[#ff7b00] to-[#ff943d] text-white hover:from-[#e86e00] hover:to-[#ff8730] hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(255,123,0,0.35)]"
//                       >
//                         <span>{type === 'product' ? 'Buy Now' : 'Get Deal'}</span>
//                         <FontAwesomeIcon icon={faArrowRightLong} className="w-3.5 h-3.5" />
//                       </OfferOutUrl>
//                     )}
//                   </div>
//                 </div>

//                 {/* Corner Accent */}
//                 <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-transparent via-[#ff943d]/[0.06] to-[#ff943d]/[0.06] transition-all duration-300 group-hover:w-14 group-hover:h-14 group-hover:via-[#ff943d]/10 group-hover:to-[#ff943d]/10 pointer-events-none" />
//               </div>
//             );
//           })}
//         </div>

//         {/* ═══ Mobile View-All ═══ */}
//         <div className="text-center mt-7 md:hidden">
//           <Link href="/products" className="inline-flex items-center gap-2 text-white font-bold text-[0.9rem] no-underline px-7 py-3 bg-gradient-to-r from-[#ff7b00] to-[#ff943d] rounded-full shadow-[0_4px_15px_rgba(255,123,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,123,0,0.35)]">
//             <span>Browse All Products</span>
//             <FontAwesomeIcon icon={faArrowRightLong} className="w-3.5 h-3.5" />
//           </Link>
//         </div>
//       </div>

//       {/* Tailwind handles global styles here, but for custom animations add this to your globals.css or keep this style tag */}
//       <style jsx global>{`
//         @keyframes shineSweep {
//           0% { left: -100%; }
//           100% { left: 130%; }
//         }
//         .scale-108 {
//           transform: scale(1.08);
//         }
//       `}</style>
//     </section>
//   );
// };

// export default BrandedProductsHome;
import React from 'react'
import { getBaseImageUrl, parseDiscountTag } from '@/constants/hooks';
import { faArrowRight, FontAwesomeIcon } from '@/constants/icons';
import Image from 'next/image'
import Link from 'next/link';

interface Props {
    merchant_name: string;
    merchant_logo: string;
    companyDomain: string;
    merchant_href: string;
    discountTag?: string | null;
}

const MerchantForProduct = async ({ merchant_name, merchant_logo, companyDomain, merchant_href, discountTag }: Props) => {
    const parsedDiscount = parseDiscountTag(discountTag)
    
    return (
        <div className="container mx-auto px-4">
            <Link href={merchant_href} className="group block w-full h-full">
                <div className="flex flex-col h-full bg-white border border-gray-100 bg-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#8bc94a]/50 hover:-translate-y-1 transition-all duration-300">
                    
                    {/* Header Banner */}
                    <div className="h-20 w-full bg-white group-hover:bg-[#8bc94a]/5 transition-colors duration-500 relative">
                        
                        {/* Decorative Pattern / Accent */}
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(139, 201, 74, 0.4) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

                        {parsedDiscount && (
                            <div className="absolute top-3 right-3 flex items-center justify-center  shadow-sm border border-gray-200 px-2.5 py-1 rounded-lg z-10 transition-transform">
                                <span className="text-[#ff912f] font-bold text-xs">
                                    {parsedDiscount.value} {parsedDiscount.middle}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col items-center px-5 pb-5 pt-0 flex-grow relative -mt-10">
                        
                        {/* Logo Ring */}
                        <div className="relative w-[84px] h-[84px] rounded-full bg-white border-4 border-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300 z-10 shrink-0">
                            <div className="w-full h-full relative rounded-full overflow-hidden flex items-center justify-center bg-white p-3">
                                <Image
                                    src={getBaseImageUrl(companyDomain, merchant_logo, "")}
                                    alt={`${merchant_name} logo`}
                                    fill
                                    className="object-contain p-2"
                                    sizes="(max-width: 84px) 100vw, 84px"
                                />
                            </div>
                        </div>

                        {/* Merchant Name */}
                        <h3 className="mt-3 text-lg font-bold text-gray-900 text-center line-clamp-1 group-hover:text-[#ff912f] transition-colors duration-300">
                            {merchant_name}
                        </h3>
                        
                        {/* Optional tags or meta info */}
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                            Official Store
                        </p>

                        {/* Action Button */}
                        <div className="mt-auto w-full pt-5">
                            <div className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white border border-gray-100 text-gray-600 font-medium text-sm group-hover:bg-[#8bc94a] group-hover:text-white group-hover:border-[#8bc94a] transition-all duration-300">
                                <span>View All Products</span>
                                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>

                    </div>
                </div>
            </Link>
        </div>
    )
}

export default MerchantForProduct

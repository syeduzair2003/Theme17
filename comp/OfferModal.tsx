"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { Offer, ProductData } from "@/services/dataTypes";
import OfferDuration from "./OfferDuration";
import { discardHTMLTags, getBaseImageUrl } from "@/constants/hooks";
import Link from "next/link";
import { faCheck, faCopy, faTimes, faThumbsUp, faThumbsDown, FontAwesomeIcon, faChevronRight } from "@/constants/icons";
import dynamic from 'next/dynamic';
import { apiUpdateOfferLikes } from '@/apis/offers';
import { toast } from "react-toastify";

const RateUs = dynamic(() => import('./RateUs'), { ssr: false });
const SocialMediaShare = dynamic(() => import('./SocialMediaShare'), { ssr: false });

interface Props {
    data: Offer | ProductData;
    companyId: string;
    onClose: () => void;
    domain: string;
    merchantHref: string;
    finalDiscountTag?: string | null;
    merchantImg?: string | null;
    productImg?: string | null;
}

const OfferModal = ({ data, companyId, onClose, domain, merchantHref, finalDiscountTag, merchantImg, productImg }: Props) => {
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [imageSrc, setImageSrc] = useState<string>('');
    const [isLiked, setIsLiked] = useState<number | null>(null);
    const [hasLiked, setHasLiked] = useState(false);
    const [offerUrl, setOfferUrl] = useState("");

    useEffect(() => {
        if (productImg) {
            setImageSrc(getBaseImageUrl(domain, productImg, ""));
        } else if (merchantImg) {
            setImageSrc(getBaseImageUrl(domain, merchantImg, ""));
        } else if ((data as Offer).merchant?.merchant_logo) {
            setImageSrc(getBaseImageUrl(domain, (data as Offer).merchant.merchant_logo, ""));
        }
    }, [data, domain, merchantImg, productImg]);

    useEffect(() => {
        setMounted(true);
        setOfferUrl(typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "");
        
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        if (data?.unique_id) {
            const lastLiked = localStorage.getItem(`hasLiked_${data?.unique_id}`);
            if (lastLiked && new Date().getTime() - parseInt(lastLiked) < 86400000) {
              setHasLiked(true);
            }
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
            setMounted(false);
        };
    }, [onClose, data?.unique_id]);

    const handleCopy = () => {
        if (data?.coupon_code) {
            const textToCopy = data.coupon_code;

            const performCopy = () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy)
                    .then(performCopy)
                    .catch(() => {
                        // Fallback if promise rejects
                        fallbackCopy(textToCopy, performCopy);
                    });
            } else {
                // Fallback for older browsers or non-secure contexts
                fallbackCopy(textToCopy, performCopy);
            }
        }
    };

    const fallbackCopy = (text: string, callback: () => void) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) callback();
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    };

    const handleLikeStatus = async (val: number, e: React.MouseEvent) => {
        e.preventDefault();
        if (hasLiked) {
          toast.error("You have already rated, please try again later!", { autoClose: 2000 });
          return;
        }
        try {
          if (data) {
            const response = await apiUpdateOfferLikes(companyId, data?.unique_id, val);
            if (response.status === "success" || (response as any).status === 200) {
              toast.success("Thank you for your feedback!", { autoClose: 2000 });
              setIsLiked(val);
              localStorage.setItem(`hasLiked_${data?.unique_id}`, new Date().getTime().toString());
              setHasLiked(true);
            }
          }
        } catch (error) {
          toast.error("An error occurred while submitting your feedback.", { autoClose: 2000 });
        }
      };

    if (!mounted) return null;

    const finalUrl = data?.url?.startsWith('/') ? data?.url.replace(/^\/+/, '') : data?.url;
    const absoluteOutUrl = `/${finalUrl}`;
    const offerTitleStr = encodeURIComponent(data?.offer_title || discardHTMLTags(data?.offer_detail || ""));

    return ReactDOM.createPortal(
        <div 
            className="fixed top-[64px] md:top-[110px] inset-x-0 bottom-0 z-[50000] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95%] sm:max-h-[90vh] animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Close Button ── */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                </button>

                {/* ── Modal Content Wrapper (Scrollable) ── */}
                <div className="overflow-y-auto flex-grow custom-scrollbar">
                    
                    {/* Header Section */}
                    <div className="bg-white p-6 sm:p-8 lg:p-12 text-center border-b border-gray-100 relative">
                        {/* Secondary Color (#ff912f) for "Exclusive Offer" badge to grab attention */}
                        <span className="inline-block px-3 py-1 rounded-full bg-[#ff912f]/10 text-[#ff912f] text-[10px] font-bold uppercase tracking-widest mb-4">
                            Exclusive Offer
                        </span>
                        
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 leading-snug max-w-2xl mx-auto">
                            {data.offer_title}
                        </h2>

                        <Link
                            href={absoluteOutUrl}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#8bc94a] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#7ab33f] transition-colors shadow-lg shadow-[#8bc94a]/20 group"
                            onClick={onClose}
                        >
                            Get Deal Now
                            <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Split Layout Body */}
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        
                        {/* Left Side: Offer Info */}
                        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
                            
                            <div className="flex flex-wrap items-center gap-2 mb-8">
                                {/* Primary Color (#8bc94a) for Verified Badge */}
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#8bc94a]/10">
                                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-[#8bc94a]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8bc94a]">Verified</span>
                                </span>
                                <OfferDuration endDate={data?.end_date} />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
                                <div className="w-24 h-24 bg-white rounded-2xl border border-gray-100 p-3 flex items-center justify-center shrink-0">
                                    <Image
                                        src={imageSrc}
                                        alt="merchant logo"
                                        width={80}
                                        height={80}
                                        className="object-contain max-h-full"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Offer Details</h4>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {discardHTMLTags(data?.offer_detail || "")}
                                    </p>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            {data.coupon_code && (
                                <div>
                                    <div className="flex items-center justify-between bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-1.5 mb-2 hover:border-[#8bc94a]/50 transition-colors">
                                        <span className="text-lg font-mono font-bold text-gray-900 px-4 tracking-widest select-all">
                                            {data.coupon_code}
                                        </span>
                                        <button
                                            onClick={handleCopy}
                                            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold transition-all duration-300 shadow-sm ${
                                                copied 
                                                ? 'bg-[#8bc94a] text-white shadow-[#8bc94a]/20' 
                                                : 'bg-[#ff912f] text-white hover:bg-[#e68228] hover:shadow-md hover:shadow-[#ff912f]/30 active:scale-95'
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-3.5 h-3.5" />
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                                        Use code at checkout
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Rating & Interactions */}
                        <div className="lg:col-span-5 bg-gray-50 p-6 sm:p-8 lg:p-10 flex items-center justify-center">
                            <RateUs offer_id={data?.unique_id || ""} company_id={companyId} />
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="bg-white border-t border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Did it work?</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => handleLikeStatus(1, e)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
                                    isLiked === 1 
                                    ? 'bg-[#8bc94a] border-[#8bc94a] text-white' 
                                    : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FontAwesomeIcon icon={faThumbsUp} className="w-4 h-4" />
                            </button>
                            <button
                                onClick={(e) => handleLikeStatus(0, e)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
                                    isLiked === 0 
                                    ? 'bg-red-500 border-red-500 text-white' 
                                    : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FontAwesomeIcon icon={faThumbsDown} className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <SocialMediaShare
                        offerUrl={offerUrl}
                        offerTitle={offerTitleStr}
                        merchantHref={merchantHref}
                        unique_id={data?.unique_id}
                        domain={domain}
                    />
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default OfferModal;
"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import { Offer, ProductData } from "@/services/dataTypes";
import OfferDuration from "./OfferDuration";
import { discardHTMLTags, getBaseImageUrl } from "@/constants/hooks";
import Link from "next/link";
import {
  faCheck,
  faCopy,
  faTimes,
  faThumbsUp,
  faThumbsDown,
  FontAwesomeIcon,
  faChevronRight,
} from "@/constants/icons";
import dynamic from "next/dynamic";
import { apiUpdateOfferLikes } from "@/apis/offers";
import { toast } from "react-toastify";

const RateUs = dynamic(() => import("./RateUs"), { ssr: false });
const SocialMediaShare = dynamic(() => import("./SocialMediaShare"), {
  ssr: false,
});

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

const OfferModal = ({
  data,
  companyId,
  onClose,
  domain,
  merchantHref,
  finalDiscountTag,
  merchantImg,
  productImg,
}: Props) => {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isLiked, setIsLiked] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [offerUrl, setOfferUrl] = useState("");

  useEffect(() => {
    if (productImg) {
      setImageSrc(getBaseImageUrl(domain, productImg, ""));
    } else if (merchantImg) {
      setImageSrc(getBaseImageUrl(domain, merchantImg, ""));
    } else if ((data as Offer).merchant?.merchant_logo) {
      setImageSrc(
        getBaseImageUrl(domain, (data as Offer).merchant.merchant_logo, ""),
      );
    }
  }, [data, domain, merchantImg, productImg]);

  useEffect(() => {
    setMounted(true);
    setOfferUrl(
      typeof window !== "undefined"
        ? encodeURIComponent(window.location.href)
        : "",
    );

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    if (data?.unique_id) {
      const lastLiked = localStorage.getItem(`hasLiked_${data?.unique_id}`);
      if (lastLiked && new Date().getTime() - parseInt(lastLiked) < 86400000) {
        setHasLiked(true);
      }
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
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
        navigator.clipboard
          .writeText(textToCopy)
          .then(performCopy)
          .catch(() => {
            fallbackCopy(textToCopy, performCopy);
          });
      } else {
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
      const successful = document.execCommand("copy");
      if (successful) callback();
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  const handleLikeStatus = async (val: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (hasLiked) {
      toast.error("You have already rated, please try again later!", {
        autoClose: 2000,
      });
      return;
    }
    try {
      if (data) {
        const response = await apiUpdateOfferLikes(
          companyId,
          data?.unique_id,
          val,
        );
        if (response.status === "success" || (response as any).status === 200) {
          toast.success("Thank you for your feedback!", { autoClose: 2000 });
          setIsLiked(val);
          localStorage.setItem(
            `hasLiked_${data?.unique_id}`,
            new Date().getTime().toString(),
          );
          setHasLiked(true);
        }
      }
    } catch (error) {
      toast.error("An error occurred while submitting your feedback.", {
        autoClose: 2000,
      });
    }
  };

  if (!mounted) return null;

  const finalUrl = data?.url?.startsWith("/")
    ? data?.url.replace(/^\/+/, "")
    : data?.url;
  const absoluteOutUrl = `/${finalUrl}`;
  const offerTitleStr = encodeURIComponent(
    data?.offer_title || discardHTMLTags(data?.offer_detail || ""),
  );

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[50000] flex items-center justify-center p-4 bg-neutral-950/40 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-neutral-200/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-98 duration-200 text-neutral-900 pt-[3px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF5A00] z-50" />

        {/* HEADER SECTION */}
        <div className="w-full flex items-center justify-center relative px-5 py-4 border-b border-neutral-100 bg-neutral-50/60 shrink-0 min-h-[84px]">
          <div className="flex items-center gap-3.5 justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-xl border border-neutral-200 p-1.5 flex items-center justify-center shrink-0 shadow-3xs">
              <Image
                src={imageSrc}
                alt="merchant logo"
                width={64}
                height={64}
                className="object-contain max-h-full"
              />
            </div>

            <div className="flex flex-col items-start gap-1">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-[9px] font-black uppercase tracking-wider text-[#FF5A00]">
                <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />{" "}
                Verified
              </span>

              <span className="inline-flex items-center text-[9px] font-black uppercase tracking-wider text-white bg-neutral-950 py-1 rounded-md shadow-3xs h-6 overflow-hidden border-none outline-none lifetime-badge-override">
                <OfferDuration endDate={data?.end_date} />
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute right-5 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:bg-red-500 hover:border-red-500 hover:text-white hover:shadow-3xs transition-all duration-200"
          >
            <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow custom-scrollbar px-6 pt-6 pb-8 space-y-6">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#FF5A00] block">
              ⚡ Exclusive Verified Offer
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-950 tracking-tight leading-snug">
              {data.offer_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-5 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block">
                  Offer Details & Terms
                </span>
                <p className="text-neutral-600 leading-relaxed text-xs sm:text-sm font-medium">
                  {discardHTMLTags(data?.offer_detail || "")}
                </p>
              </div>

              {data.coupon_code ? (
                <div className="pt-1">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white border border-neutral-200 rounded-lg p-1.5 gap-2.5 focus-within:border-neutral-950 transition-colors duration-200">
                    <span className="text-base font-mono font-black text-neutral-950 px-3 tracking-widest select-all flex items-center justify-center sm:justify-start min-h-[38px]">
                      {data.coupon_code}
                    </span>
                    <button
                      onClick={handleCopy}
                      className={`px-5 py-2.5 rounded-md flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-200 shrink-0 ${
                        copied
                          ? "bg-neutral-950 text-white"
                          : "bg-[#FF5A00] text-white hover:bg-neutral-950 shadow-3xs"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={copied ? faCheck : faCopy}
                        className="w-3 h-3"
                      />
                      {copied ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center mt-2">
                    Apply code at checkout window to claim discount
                  </p>
                </div>
              ) : (
                <div className="pt-1">
                  <Link
                    href={absoluteOutUrl}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-950 text-white text-xs font-black uppercase tracking-widest hover:bg-[#FF5A00] transition-all duration-200 shadow-3xs group w-full text-center"
                    onClick={onClose}
                  >
                    Get Deal Direct
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-2.5 h-2.5 transform group-hover:translate-x-0.5 transition-transform"
                    />
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 border border-neutral-200/80 rounded-xl p-5 bg-white shadow-3xs">
              <div className="w-full">
                <RateUs
                  offer_id={data?.unique_id || ""}
                  company_id={companyId}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50/90 border-t border-neutral-100 px-5 py-2 flex flex-row items-center justify-between gap-4 shrink-0 min-h-[48px]">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hidden xxs:block">
              Was it helpful?
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => handleLikeStatus(1, e)}
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all border ${
                  isLiked === 1
                    ? "bg-[#FF5A00] border-[#FF5A00] text-white"
                    : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <FontAwesomeIcon icon={faThumbsUp} className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={(e) => handleLikeStatus(0, e)}
                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all border ${
                  isLiked === 0
                    ? "bg-neutral-950 border-neutral-950 text-white"
                    : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <FontAwesomeIcon icon={faThumbsDown} className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          <div className="scale-90 origin-right flex items-center max-h-8 overflow-hidden whitespace-nowrap">
            <SocialMediaShare
              offerUrl={offerUrl}
              offerTitle={offerTitleStr}
              merchantHref={merchantHref}
              unique_id={data?.unique_id}
              domain={domain}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }

        :global(.lifetime-badge-override) {
          background-color: #0a0a0a !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        :global(.lifetime-badge-override *) {
          color: #ffffff !important;
          fill: #ffffff !important;
          stroke: #ffffff !important;
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>,
    document.body,
  );
};

export default OfferModal;

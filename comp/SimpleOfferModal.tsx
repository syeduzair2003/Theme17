"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Offer, ProductData } from "@/services/dataTypes";
import {
  FontAwesomeIcon,
  faTimes,
  faCopy,
  faCheck,
  faChevronRight,
  faChevronDown,
  faChevronUp,
} from "@/constants/icons";
import { discardHTMLTags, getBaseImageUrl } from "@/constants/hooks";
import OfferDuration from "./OfferDuration";

interface Props {
  data: Offer | ProductData;
  onClose: () => void;
  domain: string;
  merchantHref: string;
  finalDiscountTag?: string | null;
  merchantImg?: string | null;
  productImg?: string | null;
}

const SimpleOfferModal = ({
  data,
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
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
      setMounted(false);
    };
  }, [onClose]);

  useEffect(() => {
    if (productImg) {
      setImageSrc(getBaseImageUrl(domain, productImg, ""));
    } else if (
      (data as any)?.offer_type?.name === "product" &&
      (data as ProductData)?.product_image
    ) {
      setImageSrc(
        getBaseImageUrl(domain, (data as ProductData)?.product_image, ""),
      );
    } else if (merchantImg) {
      setImageSrc(getBaseImageUrl(domain, merchantImg, ""));
    } else if ((data as Offer).merchant?.merchant_logo) {
      setImageSrc(
        getBaseImageUrl(domain, (data as Offer).merchant.merchant_logo, ""),
      );
    }
  }, [data, domain, merchantImg, productImg]);

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

  const finalUrl = data?.url?.startsWith("/")
    ? data?.url.replace(/^\/+/, "")
    : data?.url;
  const absoluteOutUrl = `/${finalUrl}`;
  const cleanDesc = discardHTMLTags(data?.offer_detail || "");
  const isLongDesc = cleanDesc.length > 150;

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[60000] flex items-center justify-center p-4 sm:p-6 bg-[#1a1612]/60 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close Button ── */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-white hover:bg-[#FF5F1F] transition-all duration-300 shadow-sm"
        >
          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto flex-grow custom-scrollbar">
          {/* Header & Logo */}
          <div className="pt-10 pb-5 flex justify-center relative">
            <div className="relative w-24 h-24 bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-4 flex items-center justify-center group">
              {finalDiscountTag && (
                <div className="absolute -top-3 -right-3 z-20 bg-[#1a1612] text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border-2 border-white transition-transform duration-300 group-hover:scale-105">
                  {finalDiscountTag}
                </div>
              )}
              <Image
                src={imageSrc}
                alt="merchant logo"
                width={80}
                height={80}
                className="object-contain max-h-full"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="px-6 sm:px-8 pb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a1612]/5 border border-[#1a1612]/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5F1F] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1612]">
                  Verified
                </span>
              </span>
              <OfferDuration endDate={data?.end_date} />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#1a1612] leading-tight mb-6 tracking-tight">
              {data?.offer_title}
            </h2>

            {/* ── Actions ── */}
            <div className="mb-8">
              {data?.coupon_code ? (
                <div>
                  <div className="flex items-center justify-between bg-[#fcfcfc] border-2 border-dashed border-gray-200 rounded-2xl p-2 mb-3 hover:border-[#1a1612]/30 transition-colors">
                    <span className="text-xl font-mono font-black text-[#1a1612] px-4 tracking-widest select-all">
                      {data.coupon_code}
                    </span>
                    <button
                      onClick={handleCopy}
                      className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all duration-300 shadow-sm ${
                        copied
                          ? "bg-[#FF5F1F] text-white shadow-[0_8px_20px_rgba(255,95,31,0.25)]"
                          : "bg-[#1a1612] text-white hover:bg-[#2a241e] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={copied ? faCheck : faCopy}
                        className="w-4 h-4"
                      />
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Use code at checkout
                  </p>
                </div>
              ) : (
                <Link
                  href={absoluteOutUrl}
                  target="_blank"
                  className="w-full py-4 rounded-2xl bg-[#FF5F1F] text-white text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#e6551b] transition-all duration-300 shadow-[0_10px_25px_rgba(255,95,31,0.3)] hover:shadow-[0_15px_35px_rgba(255,95,31,0.4)] hover:-translate-y-1"
                  onClick={onClose}
                >
                  Get Deal Now
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* ── Details ── */}
            <div className="text-left border-t border-gray-100 pt-6">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1a1612] mb-3">
                Offer Details
              </h4>
              <p
                className={`text-sm text-gray-500 leading-relaxed ${!showFullDesc && isLongDesc ? "line-clamp-2" : ""}`}
              >
                {cleanDesc ||
                  "This exclusive offer is waiting for you! Click the button above to unlock the discount directly at the store."}
              </p>

              {isLongDesc && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#FF5F1F] hover:text-[#e6551b] transition-colors uppercase tracking-widest"
                >
                  {showFullDesc ? "Show Less" : "Read More"}
                  <FontAwesomeIcon
                    icon={showFullDesc ? faChevronUp : faChevronDown}
                    className="w-3 h-3"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer Link ── */}
        <div className="bg-[#fcfcfc] border-t border-gray-100 p-5 text-center shrink-0">
          <Link
            href={merchantHref}
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#1a1612] transition-colors"
            onClick={onClose}
          >
            Explore more offers from this store
            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
          </Link>
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
    document.body,
  );
};

export default SimpleOfferModal;

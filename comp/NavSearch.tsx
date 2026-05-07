"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SearchCategories, SearchMerchant } from "@/services/dataTypes";
import { keywordsAction, searchAction } from "@/app/actions/index";
import { getCategoryHref, getMerchantHref } from "@/constants/hooks";
import { FontAwesomeIcon } from "@/constants/icons";
import {
  faStore,
  faSearch,
  faArrowRight,
  faBed,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

interface Props {
  companyId: string;
  mer_slug: string;
  slug_type: string;
  cat_slug: string;
}

const SearchBar = ({ companyId, mer_slug, slug_type, cat_slug }: Props) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [search, setSearch] = useState<string>(params.get("query") || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [tagsData, setTagsData] = useState<any>([]);
  const [categoriesData, setCategoriesData] = useState<SearchCategories[]>([]);
  const [merchantData, setMerchantData] = useState<SearchMerchant[]>([]);
  const [errMsg, setErrMessage] = useState({
    show: false,
    err: false,
    msg: "",
  });
  const [loading, setLoading] = useState(false);

  const pathName = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const handleKeywords = async () => {
    const response = await keywordsAction(companyId);
    if (response?.data) setTagsData(response.data);
  };

  useEffect(() => {
    handleKeywords();
  }, [companyId]);

  const handleSearch = async (searchTerm: string) => {
    try {
      if (searchTerm.trim().length >= 3) {
        setLoading(true);
        const response = await searchAction(searchTerm, companyId);
        if (
          response?.data?.merchants?.length > 0 ||
          response?.data?.categories?.length > 0
        ) {
          setCategoriesData(response.data?.categories || []);
          setMerchantData(response.data?.merchants || []);
          setIsDropdownVisible(pathName !== "/search");
          setErrMessage({ show: false, err: false, msg: "" });
        } else {
          setMerchantData([]);
          setCategoriesData([]);
          setErrMessage({
            show: true,
            err: true,
            msg: "No luxury suites found matching your search.",
          });
        }
      } else {
        setMerchantData([]);
        setCategoriesData([]);
        if (searchTerm.trim().length > 0 && searchTerm.trim().length < 3) {
          setErrMessage({
            show: true,
            err: true,
            msg: "Please enter at least 3 characters.",
          });
        }
      }
    } catch {
      setErrMessage({
        show: true,
        err: true,
        msg: "Connectivity issue. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim() === "") {
        setMerchantData([]);
        setCategoriesData([]);
        setErrMessage({ show: false, err: false, msg: "" });
      } else {
        handleSearch(search);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, companyId]);

  useEffect(() => {
    const query = params.get("query") || "";
    if (query !== search && document.activeElement !== inputRef.current) {
      setSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (pathName === "/search") setIsDropdownVisible(false);
  }, [pathName]);

  const submitSearchNow = () => {
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
      setIsDropdownVisible(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderMerchant = (merchant: SearchMerchant) => (
    <Link
      key={merchant.merchant_name}
      href={getMerchantHref<SearchMerchant>(merchant, mer_slug, slug_type)}
      className="flex flex-col items-center justify-center p-1.5 border border-white/5 rounded-xl bg-[#1A1A1A] hover:bg-[#FF5F1F]/10 hover:border-[#FF5F1F]/40 transition-all w-full h-[85px] group/item"
    >
      <div className="h-[40px] w-full flex items-center justify-center mb-1 p-1">
        {merchant.merchant_logo ? (
          <Image
            src={merchant.merchant_logo}
            alt={merchant.merchant_name}
            width={60}
            height={35}
            style={{ objectFit: "contain" }}
            className="block group-hover/item:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-white/20 text-[9px] uppercase font-bold">
            No Logo
          </span>
        )}
      </div>
      <div className="text-center w-full px-1">
        <strong className="text-[10px] text-white/60 group-hover/item:text-[#FF5F1F] line-clamp-1 leading-tight font-medium">
          {merchant.merchant_name}
        </strong>
      </div>
    </Link>
  );

  const renderCategories = (category: SearchCategories) => (
    <Link
      key={category?.name}
      href={getCategoryHref<SearchCategories>(category, cat_slug, slug_type)}
      className="inline-flex no-underline group"
    >
      <div className="px-3 py-1 border border-white/10 rounded-lg bg-white/5 group-hover:bg-[#FF5F1F] group-hover:border-orange-500 transition-all duration-300">
        <span className="text-[11px] font-semibold text-white/60 group-hover:text-white">
          {category?.name}
        </span>
      </div>
    </Link>
  );

  return (
    <div
      ref={searchWrapperRef}
      className="relative flex justify-end w-full max-w-[400px] xl:max-w-[450px] group"
      onMouseEnter={() => setIsDropdownVisible(true)}
      onMouseLeave={() => setIsDropdownVisible(false)}
    >
      {/* Search Input Container: Compact height 42px */}
      <div
        className={`
          relative flex items-center h-[42px] rounded-xl transition-all duration-500 ease-in-out
          w-32 group-hover:w-full group-focus-within:w-full
          bg-transparent group-hover:bg-[#1A1A1A] group-focus-within:bg-[#1A1A1A]
          border border-transparent group-hover:border-white/10 group-focus-within:border-white/10
          ${search.length > 0 || isDropdownVisible ? "w-full bg-[#1A1A1A] border-white/10 shadow-lg" : ""}
        `}
      >
        <span
          className={`
            absolute left-4 text-[11px] font-black text-white/40 tracking-[0.2em] pointer-events-none transition-all duration-300 uppercase
            ${search.length > 0 || isDropdownVisible ? "opacity-0 -translate-x-4" : "opacity-100"}
          `}
        >
          Search
        </span>

        <input
          type="text"
          placeholder="Find hotels,resorts,villas..."
          className={`
            bg-transparent border-none outline-none text-[13px] w-full text-white placeholder-white/20 font-medium px-4 z-10
            transition-all duration-500
            ${search.length > 0 || isDropdownVisible ? "opacity-100" : "opacity-0"}
          `}
          ref={inputRef}
          value={search}
          autoComplete="off"
          onChange={(e) => {
            setSearch(e.target.value);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && search.trim()) submitSearchNow();
          }}
        />

        <button
          className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center text-white/30 group-hover:text-[#FF5F1F] transition-all z-20"
          onClick={submitSearchNow}
        >
          <FontAwesomeIcon icon={faSearch} className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-full mt-2 w-[420px] max-w-[90vw] z-[9999] transition-all duration-300 ${
          isDropdownVisible && (search.trim().length > 0 || tagsData.length > 0)
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}
      >
        <div className="bg-[#141414] p-4 rounded-2xl shadow-[0_30px_70px_-10px_rgba(0,0,0,0.9)] border border-white/10 max-h-[70vh] overflow-y-auto custom-scrollbar backdrop-blur-3xl">
          {loading &&
            search.trim().length >= 3 &&
            merchantData.length === 0 && (
              <div className="text-center text-[12px] py-4 text-[#FF5F1F] font-bold flex items-center justify-center gap-2 animate-pulse">
                <div className="w-4 h-4 rounded-full border-2 border-[#FF5F1F] border-t-transparent animate-spin"></div>
                Searching...
              </div>
            )}

          {errMsg.show && search.trim().length > 0 && !loading && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5 mb-3 text-center">
              <p className="text-[11px] font-semibold text-red-400">
                {errMsg.msg}
              </p>
            </div>
          )}

          {merchantData.length > 0 && !loading && (
            <div className="mb-5">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faStore}
                  className="mr-2 text-[#FF5F1F] w-2.5 h-2.5"
                />
                Premium Brands
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {merchantData.slice(0, 8).map(renderMerchant)}
              </div>
            </div>
          )}

          {categoriesData.length > 0 && !loading && (
            <div className="mb-5">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faBed}
                  className="mr-2 text-[#FF5F1F] w-2.5 h-2.5"
                />
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {categoriesData.slice(0, 8).map(renderCategories)}
              </div>
            </div>
          )}

          {/* Tags / Destinations */}
          {tagsData.length > 0 && search.trim().length === 0 && (
            <div className="mb-1">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 flex items-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="mr-2 text-[#FF5F1F] w-2.5 h-2.5"
                />
                Popular Search
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tagsData.map((item: string, i: number) => (
                  <Link
                    key={i}
                    href={`/search?query=${item}`}
                    className="px-3 py-1.5 bg-white/5 text-white/50 border border-white/5 text-[11px] font-bold rounded-lg hover:bg-[#FF5F1F] hover:text-white transition-all"
                    onClick={() => setIsDropdownVisible(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {search.trim().length >= 3 &&
            !loading &&
            (merchantData.length > 0 || categoriesData.length > 0) && (
              <div className="mt-4 pt-3 border-t border-white/5 text-center">
                <button
                  onClick={submitSearchNow}
                  className="text-[11px] font-black text-[#FF5F1F] hover:text-orange-400 transition-all flex items-center justify-center mx-auto gap-2 uppercase tracking-widest"
                >
                  View Results
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-2.5 h-2.5"
                  />
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

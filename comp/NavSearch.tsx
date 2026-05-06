"use client";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState, Suspense } from 'react';
import Image from "next/image";
import { SearchCategories, SearchMerchant } from '@/services/dataTypes';
import { keywordsAction, searchAction } from '@/app/actions/index';
import { getCategoryHref, getMerchantHref } from '@/constants/hooks';
import { FontAwesomeIcon } from '@/constants/icons';
import { faStore, faTags, faBoxOpen, faSearch, faArrowRight, faBed, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

interface Props {
  companyId: string;
  mer_slug: string;
  slug_type: string;
  cat_slug: string;
}

const SearchBar = ({ companyId, mer_slug, slug_type, cat_slug }: Props) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [search, setSearch] = useState<string>(params.get('query') || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [tagsData, setTagsData] = useState<any>([]);
  const [categoriesData, setCategoriesData] = useState<SearchCategories[]>([]);
  const [merchantData, setMerchantData] = useState<SearchMerchant[]>([]);
  const [errMsg, setErrMessage] = useState({ show: false, err: false, msg: '' });
  const [loading, setLoading] = useState(false);
  
  const pathName = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const handleKeywords = async () => {
    const response = await keywordsAction(companyId);
    if (response?.data) setTagsData(response.data);
  };

  useEffect(() => { handleKeywords(); }, [companyId]);

  const handleSearch = async (searchTerm: string) => {
    try {
      if (searchTerm.trim().length >= 3) {
        setLoading(true);
        const response = await searchAction(searchTerm, companyId);
        if (response?.data?.merchants?.length > 0 || response?.data?.categories?.length > 0) {
          setCategoriesData(response.data?.categories || []);
          setMerchantData(response.data?.merchants || []);
          setIsDropdownVisible(!!(pathName !== '/search'));
          setErrMessage({ show: false, err: false, msg: '' });
        } else {
          setMerchantData([]);
          setCategoriesData([]);
          setErrMessage({ show: true, err: true, msg: 'No luxury suites found matching your search.' });
        }
      } else {
        setMerchantData([]);
        setCategoriesData([]);
        setErrMessage({ show: true, err: true, msg: 'Please enter at least 3 characters.' });
      }
    } catch {
      setErrMessage({ show: true, err: true, msg: 'Connectivity issue. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderMerchant = (merchant: SearchMerchant) => (
    <Link
      key={merchant.merchant_name}
      href={getMerchantHref<SearchMerchant>(merchant, mer_slug, slug_type)}
      className="flex flex-col items-center justify-center p-2 border border-white/5 rounded-2xl bg-[#1A1A1A] hover:bg-[#FF5F1F]/10 hover:border-[#FF5F1F]/40 hover:shadow-[0_0_20px_rgba(255,95,31,0.1)] transition-all w-[105px] h-[105px] group/item"
    >
      <div className="h-[55px] w-full flex items-center justify-center mb-1.5 p-1">
        {merchant.merchant_logo ? (
          <Image
            src={merchant.merchant_logo}
            alt={merchant.merchant_name}
            width={75}
            height={45}
            style={{ objectFit: "contain" }}
            className="block group-hover/item:scale-110 transition-transform duration-300 brightness-110"
          />
        ) : (
          <span className="text-white/20 text-[10px] uppercase font-bold">No Logo</span>
        )}
      </div>
      <div className="text-center w-full px-1">
        <strong className="text-[11px] text-white/70 group-hover/item:text-[#FF5F1F] line-clamp-2 leading-tight font-medium transition-colors">
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
      <div className="px-4 py-1.5 border border-white/10 rounded-xl bg-white/5 group-hover:bg-[#FF5F1F] group-hover:border-orange-500 transition-all duration-300 shadow-sm">
        <span className="text-[12px] font-semibold text-white/70 group-hover:text-white transition-colors">
          {category?.name}
        </span>
      </div>
    </Link>
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim() === "") {
        setMerchantData([]);
        setCategoriesData([]);
        setErrMessage({ show: false, err: false, msg: '' });
      } else {
        handleSearch(search);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, companyId]);

  useEffect(() => {
    const query = params.get('query') || "";
    if (query !== search && document.activeElement !== inputRef.current) {
      setSearch(query);
    }
  }, [searchParams]);

  useEffect(() => {
    if (pathName === '/search') setIsDropdownVisible(false);
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={searchWrapperRef} 
      className="relative w-full max-w-[400px] xl:max-w-[480px] group"
      // Desktop Hover Logic:
      onMouseEnter={() => setIsDropdownVisible(true)}
      onMouseLeave={() => setIsDropdownVisible(false)}
    >
      {/* Input Container - Luxury Orange Focus */}
      <div className="relative flex items-center bg-[#1A1A1A] rounded-2xl px-5 py-[10px] shadow-2xl border border-white/10 transition-all duration-300 focus-within:border-[#FF5F1F]/50 focus-within:shadow-[0_0_20px_rgba(255,95,31,0.15)] w-full">
        <input 
          type="text" 
          placeholder="Find hotels, villas or suites..." 
          className="bg-transparent border-none outline-none text-[14px] w-full text-white placeholder-white/30 font-medium z-10"
          ref={inputRef}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search.trim()) {
              submitSearchNow();
            }
          }}
          aria-label="Search luxury hotels"
        />
        <button 
          className="text-white/40 hover:text-[#FF5F1F] transition-all ml-2 z-10 active:scale-90" 
          onClick={submitSearchNow}
          aria-label="Search submit"
        >
          <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
        </button>

        {/* Dropdown - Luxury Night UI */}
        {/* Visible logic updated for smooth hover/focus transition */}
        <div className={`absolute left-0 right-0 top-full mt-3 w-full sm:w-[500px] z-[60] transition-all duration-300 ${
          isDropdownVisible && (search.trim().length > 0 || tagsData.length > 0) 
          ? "opacity-100 translate-y-0 visible" 
          : "opacity-0 -translate-y-2 invisible pointer-events-none"
        }`}>
          <div className="bg-[#141414] p-5 sm:p-6 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 max-h-[75vh] overflow-y-auto custom-scrollbar backdrop-blur-3xl">
            
            {loading && search.trim().length >= 3 && merchantData.length === 0 && categoriesData.length === 0 && !errMsg.show && (
              <div className="text-center text-[13px] py-6 text-[#FF5F1F] font-bold flex items-center justify-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-[#FF5F1F] border-t-transparent animate-spin"></div>
                Searching Suites...
              </div>
            )}

            {errMsg.show && search.trim().length > 0 && !loading && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <p className={`text-[13px] text-center font-semibold ${errMsg.err ? 'text-red-400' : 'text-[#FF5F1F]'}`}>
                  {errMsg.msg}
                </p>
              </div>
            )}

            {/* Merchants (Hotel Brands) */}
            {merchantData.length > 0 && !loading && (
              <div className="mb-6">
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <FontAwesomeIcon icon={faStore} className="mr-2 text-[#FF5F1F] w-3 h-3" />
                  Premium Hotel Brands
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {merchantData.slice(0, 8).map(renderMerchant)}
                </div>
              </div>
            )}

            {/* Categories (Stay Types) */}
            {categoriesData.length > 0 && !loading && (
              <div className="mb-6">
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <FontAwesomeIcon icon={faBed} className="mr-2 text-[#FF5F1F] w-3 h-3" />
                  Accommodations
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {categoriesData.slice(0, 10).map(renderCategories)}
                </div>
              </div>
            )}

            {/* Trending Tags (Popular Locations) */}
            {tagsData.length > 0 && search.trim().length === 0 && (
              <div className="mb-2">
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-[#FF5F1F] w-3 h-3" />
                  Top Rental Destinations
                </p>
                <div className="flex flex-wrap gap-2">
                  {tagsData.map((item: string, i: number) => (
                    <Link
                      key={i}
                      href={`/search?query=${item}`}
                      className="px-4 py-2 bg-white/5 text-white/60 border border-white/5 text-[12px] font-bold rounded-xl hover:bg-[#FF5F1F] hover:text-white hover:border-orange-500 transition-all duration-300"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {search.trim().length >= 3 && !loading && (merchantData.length > 0 || categoriesData.length > 0) && (
              <div className="mt-5 pt-5 border-t border-white/5 text-center">
                <button 
                  onClick={submitSearchNow}
                  className="group text-[13px] font-black text-[#FF5F1F] hover:text-orange-400 transition-all flex items-center justify-center mx-auto gap-2 uppercase tracking-widest"
                >
                  Explore All Destinations
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
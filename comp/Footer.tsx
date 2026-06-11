import { apiGetTopCategories } from "@/apis/page_optimization";
import { apiGetDisclaimer } from "@/apis/user";
import { getBaseImageUrl } from "@/constants/hooks";
import cookieService from "@/services/CookiesService";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import {
  faEnvelopeOpen,
  faMapPin,
  faPhone,
  FontAwesomeIcon,
} from "@/constants/icons";
import BackToTopButton from "./BackToTopButton";
import FooterNewsletter from "./FooterNewsletter";

interface Props {
  companyFooterLogo: string | null;
  company_id: string;
  socialLinks: {
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    pinterest?: string | null;
    youtube?: string | null;
    flipboard?: string | null;
    threads?: string | null;
    tiktok?: string | null;
    trust_pilot?: string | null;
  };
  blog_title?: string;
  blog_url?: string;
  companyName: string;
}

const Footer = async ({
  companyFooterLogo,
  company_id,
  socialLinks,
  blog_title,
  companyName,
  blog_url,
}: Props) => {
  const topCategoriesResponse = (await apiGetTopCategories(company_id)).data;
  const companyDomain = await cookieService.get("domain");
  const disclaimer = (await apiGetDisclaimer(companyDomain.domain)).data;

  const socialMediaPlatforms = [
    {
      key: "twitter",
      label: "Twitter",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-[#1DA1F2]",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-[#1877F2]",
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-none stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      bgColor:
        "bg-white/5 hover:bg-gradient-to-tr from-[#FD1D1D] via-[#F56040] to-[#833AB4]",
    },
    {
      key: "pinterest",
      label: "Pinterest",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-[#E60023]",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-[#FF0000]",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-[#0A66C2]",
    },
    {
      key: "tiktok",
      label: "TikTok",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.03 1.62 4.15 1.13 1.25 2.73 1.93 4.39 2.01v3.86c-1.52-.1-3.01-.65-4.24-1.58-.82-.62-1.48-1.43-1.93-2.35v7.35c.01 2.3-.87 4.54-2.5 6.13-1.82 1.78-4.36 2.65-6.88 2.33-2.8-.35-5.32-2.36-6.19-5.06-.99-3.05-.12-6.57 2.21-8.74 1.63-1.51 3.86-2.23 6.06-1.95v3.9c-1.15-.22-2.38.12-3.23.93-.89.85-1.2 2.16-.81 3.34.42 1.3 1.7 2.21 3.08 2.22 1.52.02 2.87-1.07 3.12-2.57.06-.33.08-.66.08-1v-12.2z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-black",
    },
    {
      key: "flipboard",
      label: "Flipboard",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M0 0h24v24H0zm14.4 4.8v4.8H19.2V4.8h-4.8zm-4.8 0v4.8h4.8V4.8H9.6zm-4.8 0v4.8h4.8V4.8H4.8zm0 4.8v4.8h4.8V9.6H4.8zm0 4.8v4.8h4.8v-4.8H4.8zm4.8 0v4.8h4.8v-4.8H9.6z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-[#E12828]",
    },
    {
      key: "threads",
      label: "Threads",
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="w-[18px] h-[18px] text-white fill-current"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.3 13.7c-.5.5-1.1.7-1.8.7-1.1 0-1.9-.5-2.2-1.5-.3-.8-.2-1.8.3-2.5.3-.4.7-.6 1.3-.7.5 0 1 .1 1.3.4v-.1c0-.6-.3-1-.9-1-.5 0-.9.2-1.2.6l-1-.7c.5-.7 1.3-1.1 2.3-1.1 1.5 0 2.4.9 2.4 2.5v2.7c0 .4.1.5.3.6l-.6.9c-.4-.1-.4-.4-.4-.7zm-1.4-2.9c-.2 0-.3.1-.4.2-.2.2-.2.6-.1.9.1.3.4.5.8.5.4 0 .7-.2.8-.5v-.8c-.1-.1-.3-.2-.5-.3s-.4-.1-.6 0z" />
        </svg>
      ),
      bgColor: "bg-white/5 hover:bg-black",
    },
  ];

  return (
    <footer className="w-full bg-[#0a0a0a] text-slate-300 py-16 md:py-24 relative mt-auto border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-12 gap-x-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105 origin-left"
            >
              <Image
                src={getBaseImageUrl(
                  companyDomain.domain,
                  companyFooterLogo,
                  "/themes/Theme_3/images/logo.png",
                )}
                height={200}
                width={200}
                className="w-auto h-12 max-w-[200px] object-contain brightness-125"
                alt="logo"
              />
            </Link>
            <p className="text-slate-400 text-[13px] leading-relaxed max-w-sm italic font-medium">
              Your premium destination for{" "}
              <span className="text-orange-500 font-black">
                verified savings
              </span>
              . We curate high-performance deals to fuel your shopping
              experience.
            </p>

            {(disclaimer?.CompanyContactUs?.phone_no ||
              disclaimer?.CompanyContactUs?.email ||
              disclaimer?.CompanyContactUs?.address) && (
              <ul className="flex flex-col gap-4 mt-2">
                {disclaimer?.CompanyContactUs?.email && (
                  <li className="flex items-center gap-4 group cursor-pointer">
                    <div className="flex justify-center items-center w-10 h-10 rounded-2xl bg-white/5 text-slate-400 group-hover:text-[#0a0a0a] group-hover:bg-orange-500 border border-white/5 transition-all duration-300">
                      <FontAwesomeIcon
                        icon={faEnvelopeOpen}
                        className="w-3.5 h-3.5"
                      />
                    </div>
                    <span className="text-xs font-black tracking-tighter text-slate-400 group-hover:text-white transition-colors uppercase italic">
                      {disclaimer.CompanyContactUs.email}
                    </span>
                  </li>
                )}
                {disclaimer?.CompanyContactUs?.phone_no && (
                  <li className="flex items-center gap-4 group cursor-pointer">
                    <div className="flex justify-center items-center w-10 h-10 rounded-2xl bg-white/5 text-slate-400 group-hover:text-[#0a0a0a] group-hover:bg-orange-500 border border-white/5 transition-all duration-300">
                      <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-black tracking-tighter text-slate-400 group-hover:text-white transition-colors uppercase italic">
                      {disclaimer.CompanyContactUs.phone_no}
                    </span>
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic border-l-2 border-orange-500 pl-4">
              Navigation
            </h3>
            <ul className="flex flex-col gap-4">
              {["Home", "All Stores", "Categories", "Contact"].map(
                (label, idx) => {
                  const hrefs = [
                    "/",
                    "/all-stores/A",
                    "/category",
                    "/contact-us",
                  ];
                  return (
                    <li key={idx}>
                      <Link
                        href={hrefs[idx]}
                        className="text-slate-400 text-[11px] font-black hover:text-orange-500 transition-all uppercase tracking-[0.15em] flex items-center gap-2 group italic"
                      >
                        <span className="w-0 h-[1.5px] bg-orange-500 group-hover:w-4 transition-all duration-300" />{" "}
                        {label}
                      </Link>
                    </li>
                  );
                },
              )}
              {blog_title && blog_url && (
                <li>
                  <Link
                    href={blog_url}
                    className="text-slate-400 text-[11px] font-black hover:text-orange-500 transition-all uppercase tracking-[0.15em] flex items-center gap-2 group italic"
                  >
                    <span className="w-0 h-[1.5px] bg-orange-500 group-hover:w-4 transition-all duration-300" />{" "}
                    {blog_title}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic border-l-2 border-orange-500 pl-4">
              Trending
            </h3>
            <ul className="flex flex-col gap-4">
              {topCategoriesResponse?.categories?.slice(0, 5).map((item, i) => (
                <li key={i}>
                  <Link
                    href={`/${item?.url}`}
                    className="text-slate-400 text-[11px] font-black hover:text-orange-500 transition-all uppercase tracking-[0.15em] flex items-center gap-2 group italic"
                  >
                    <span className="w-0 h-[1.5px] bg-orange-500 group-hover:w-4 transition-all duration-300" />{" "}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Container */}
          <div className="lg:col-span-4 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md relative overflow-hidden group">
            <h3 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-4 italic">
              Exclusive Feed
            </h3>
            <p className="text-slate-400 text-[11px] mb-6 font-medium">
              Join our inner circle for real-time deal drops.
            </p>
            <FooterNewsletter companyId={company_id} />
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
          <div className="text-center lg:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-relaxed italic">
              {companyDomain.domain === "gettopdiscounts.com" ? (
                <>
                  © {new Date().getFullYear()}{" "}
                  <Link
                    href="/"
                    className="text-orange-500 hover:text-white transition-colors"
                  >
                    GetTopDiscounts LLC
                  </Link>{" "}
                  • Crafted with <span className="text-orange-600">⚡</span> for
                  the Elite.
                </>
              ) : (
                <>
                  © {new Date().getFullYear()}{" "}
                  <Link
                    href="/"
                    className="text-orange-500 hover:text-white transition-colors"
                  >
                    {companyName}
                  </Link>{" "}
                  • Engineered for Savings.
                </>
              )}
            </p>
          </div>

          {/* Social Media Links */}
          <ul className="flex items-center gap-4">
            {socialMediaPlatforms?.map((platform) => {
              const link =
                socialLinks[platform.key as keyof typeof socialLinks];
              if (!link) return null;

              return (
                <li key={platform.key}>
                  <Link
                    href={link}
                    aria-label={platform.label}
                    className={`flex justify-center items-center w-11 h-11 rounded-2xl ${platform.bgColor} border border-white/5 transition-all duration-300 hover:-translate-y-1.5 shadow-2xl`}
                    rel={"nofollow"}
                    target="_blank"
                  >
                    {platform.icon}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Affiliate Link Disclosure */}
        {disclaimer?.disclaimer?.disclaimer && (
          <div
            className="text-center text-[10px] font-bold text-slate-400 max-w-5xl mx-auto leading-relaxed border-t border-white/5 pt-8 italic tracking-wide uppercase opacity-60"
            dangerouslySetInnerHTML={{
              __html: disclaimer?.disclaimer?.disclaimer || "",
            }}
          />
        )}
      </div>

      <BackToTopButton />
    </footer>
  );
};

export default Footer;

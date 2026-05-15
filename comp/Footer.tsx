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
      icon: "twitter-2.png",
      bgColor: "bg-white/5 hover:bg-[#1DA1F2]",
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: "facebook.png",
      bgColor: "bg-white/5 hover:bg-[#1877F2]",
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: "instagram.png",
      bgColor:
        "bg-white/5 hover:bg-gradient-to-tr from-[#FD1D1D] via-[#F56040] to-[#833AB4]",
    },
    {
      key: "pinterest",
      label: "Pinterest",
      icon: "pinterest.png",
      bgColor: "bg-white/5 hover:bg-[#E60023]",
    },
    {
      key: "youtube",
      label: "YouTube",
      icon: "youtube.png",
      bgColor: "bg-white/5 hover:bg-[#FF0000]",
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: "linkedin.png",
      bgColor: "bg-white/5 hover:bg-[#0A66C2]",
    },
    {
      key: "tiktok",
      label: "TikTok",
      icon: "tiktok.png",
      bgColor: "bg-white/5 hover:bg-black",
    },
    {
      key: "flipboard",
      label: "Flipboard",
      icon: "flip-board.png",
      bgColor: "bg-white/5 hover:bg-[#E12828]",
    },
    {
      key: "threads",
      label: "Threads",
      icon: "thread.png",
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

        {/* ── Divider ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />

        {/* ── Bottom Section ── */}
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
                    <Image
                      src={getBaseImageUrl(
                        companyDomain.domain,
                        `/shared-assets/social/${platform.icon}`,
                        "",
                      )}
                      alt={platform.label}
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] object-contain brightness-0 invert"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Affiliate Link Disclosure */}
        {disclaimer?.disclaimer?.disclaimer && (
          <div
            className="text-center text-[10px] font-bold text-slate-600 max-w-5xl mx-auto leading-relaxed border-t border-white/5 pt-8 italic tracking-wide uppercase opacity-60"
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

import React from "react";
import { apiFooter } from "@/apis/user";
import Link from "next/link";
import { FooterResponse } from "@/services/dataTypes";
import { discardHTMLTags } from "@/constants/hooks";

interface Props {
  companyId: string;
  blog_url: string;
}

const BlogShow = ({ data }: { data: FooterResponse }) => {
  return (
    <div className="group relative flex flex-col h-full bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/5 transition-all duration-500 hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(249,115,22,0.05)] overflow-hidden">
      {/* Orange accent line on top hover */}
      <div className="absolute top-0 left-0 w-0 h-[2px] bg-orange-500 transition-all duration-500 group-hover:w-full" />

      <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
        {/* Title */}
        <div className="mb-4">
          <Link href={data.link} target="_blank" className="no-underline block">
            <h4 className="text-lg md:text-xl font-black text-slate-100 group-hover:text-orange-500 transition-colors duration-300 line-clamp-2 leading-tight m-0 uppercase italic tracking-tighter">
              {discardHTMLTags(data?.title)}
            </h4>
          </Link>
        </div>

        {/* Excerpt */}
        <div className="text-[13px] md:text-[14px] text-slate-400 line-clamp-3 leading-relaxed flex-grow font-medium italic">
          {discardHTMLTags(data.text)}
        </div>

        {/* Action Link */}
        <div className="mt-6">
          <Link
            href={data.link}
            target="_blank"
            className="inline-flex items-center gap-3 text-[11px] font-black no-underline transition-all group/link py-2.5 px-5 rounded-xl bg-white/5 border border-white/10 hover:bg-orange-500 hover:text-[#1a1612] hover:border-orange-500"
            style={{ color: "#94a3b8" }}
          >
            <span className="group-hover/link:text-[#1a1612] transition-colors uppercase tracking-[0.2em]">
              Read Article
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 transition-all group-hover/link:translate-x-1 duration-300"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Blog = async ({ companyId, blog_url }: Props) => {
  const blog = await apiFooter(companyId);

  if (!blog?.status || !blog?.data?.length) {
    return null;
  }

  return (
    <section
      aria-label="Blog Section"
      className="relative w-full py-12 md:py-16 lg:py-24 bg-[#1a1612] overflow-hidden"
    >
      {/* Orange Background Glow REMOVED as requested */}

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-8 h-[2px] rounded-full bg-orange-500"
                aria-hidden="true"
              />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
                Inside Insights
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white leading-none m-0 uppercase italic tracking-tighter">
              Weekly <span className="text-orange-500">News Feed</span>
            </h2>
          </div>

          <div className="flex items-start shrink-0">
            <Link
              href={blog_url}
              target="_blank"
              className="inline-flex items-center gap-2 text-[12px] font-black no-underline px-8 py-4 rounded-2xl border transition-all duration-300 group uppercase tracking-widest italic"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: "#f97316",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <span className="group-hover:text-[#f8fafc] transition-colors">
                Open Journal
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 text-orange-500"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div
          className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blog.data.slice(0, 3).map((item: FooterResponse, i: number) => (
            <BlogShow key={i} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
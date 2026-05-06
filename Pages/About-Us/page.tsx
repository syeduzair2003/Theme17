import React from 'react'
import BreadcrumbSection from '../../comp/BreadcrumbSection'
import cookieService from '@/services/CookiesService';
import { apiFooterPagesData } from '@/apis/user';

const page = async () => {
    const companyDomain = (await cookieService.get("domain")).domain;
    const SLUG = 'about-us';
    const pageData = (await apiFooterPagesData(companyDomain, SLUG)).data;

    return (
        <div className="bg-[#fcfcfa] min-h-screen">
            <BreadcrumbSection 
                title={pageData?.page_name || "About Us"} 
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "About Us", href: "/about-us" }
                ]} 
            />

            <section className="py-12 md:py-20 px-4 relative overflow-hidden">
                {/* ── Theme Background Accents ── */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 opacity-[0.04] pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF5F1F] rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#1a1612] rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto max-w-4xl relative z-10">
                    {/* ── Refined Content Card ── */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        {/* Subtle Luxury Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
                            <div className="w-16 h-full bg-[#FF5F1F]"></div>
                        </div>

                        <div
                            className="about-us-content text-gray-600 text-base leading-relaxed tracking-normal"
                            dangerouslySetInnerHTML={{ __html: pageData?.page_description || "<p class='text-center py-10'>Content not available.</p>" }}
                        />
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{ __html: `
                .about-us-content a {
                    color: #FF5F1F;
                    font-weight: 700;
                    text-decoration: none;
                    box-shadow: inset 0 -1px 0 rgba(255, 95, 31, 0.3);
                    transition: all 0.3s ease;
                }
                .about-us-content a:hover {
                    color: #1a1612;
                    box-shadow: inset 0 -18px 0 rgba(255, 95, 31, 0.1);
                }
                .about-us-content h1, .about-us-content h2, .about-us-content h3 {
                    color: #1a1612;
                    font-weight: 800;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                    letter-spacing: -0.01em;
                }
                /* Compact Sizes */
                .about-us-content h1 { 
                    font-size: 1.75rem; 
                    border-left: 4px solid #FF5F1F; 
                    padding-left: 1rem; 
                }
                .about-us-content h2 { font-size: 1.5rem; }
                .about-us-content h3 { font-size: 1.25rem; }
                
                .about-us-content p {
                    margin-bottom: 1.25rem;
                }
                .about-us-content ul, .about-us-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1rem;
                }
                .about-us-content li {
                    margin-bottom: 0.6rem;
                    position: relative;
                    list-style: none;
                    padding-left: 1.5rem;
                }
                .about-us-content ul li::before {
                    content: "→"; 
                    color: #FF5F1F;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    font-size: 0.9rem;
                }
                .about-us-content strong {
                    color: #1a1612;
                    font-weight: 700;
                }
            ` }} />
        </div>
    )
}

export default page
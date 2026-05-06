import React from 'react'
import BreadcrumbSection from '../../comp/BreadcrumbSection'
import cookieService from '@/services/CookiesService';
import { apiFooterPagesData } from '@/apis/user';

const page = async () => {
    const companyDomain = (await cookieService.get("domain")).domain;
    const SLUG = 'terms-conditions';
    const pageData = (await apiFooterPagesData(companyDomain, SLUG)).data;

    return (
        <div className="bg-[#fcfcfa] min-h-screen">
            {/* Breadcrumb jaisa hai wesa hi rehne diya hai */}
            <BreadcrumbSection 
                title={pageData?.page_name || "Terms & Conditions"} 
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Terms & Conditions", href: "/terms-of-services" }
                ]} 
            />

            <section className="py-12 md:py-20 px-4 relative overflow-hidden">
                {/* ── Theme Background Accents (Luxury Orange & Dark Charcoal) ── */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 opacity-[0.04] pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-[#FF5F1F] rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#1a1612] rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto max-w-4xl relative z-10">
                    {/* ── Refined Content Card ── */}
                    <div className="bg-white rounded-[2rem] p-8 md:p-14 border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                        {/* Luxury Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
                            <div className="w-20 h-full bg-[#FF5F1F]"></div>
                        </div>

                        <div
                            className="page-content text-gray-600 text-base leading-relaxed tracking-tight"
                            dangerouslySetInnerHTML={{ __html: pageData?.page_description || "<p class='text-center py-10'>Content not available.</p>" }}
                        />
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{ __html: `
                /* ── Page Content Styling Only ── */
                .page-content a {
                    color: #FF5F1F;
                    font-weight: 700;
                    text-decoration: none;
                    box-shadow: inset 0 -1px 0 rgba(255, 95, 31, 0.3);
                    transition: all 0.3s ease;
                }
                .page-content a:hover {
                    color: #1a1612;
                    box-shadow: inset 0 -18px 0 rgba(255, 95, 31, 0.1);
                }
                .page-content h1, .page-content h2, .page-content h3 {
                    color: #1a1612;
                    font-weight: 800;
                    margin-top: 2rem;
                    margin-bottom: 1.25rem;
                    line-height: 1.3;
                }
                .page-content h1 { 
                    font-size: 1.75rem; 
                    border-left: 4px solid #FF5F1F; 
                    padding-left: 1rem; 
                }
                .page-content h2 { font-size: 1.45rem; }
                .page-content h3 { font-size: 1.2rem; }
                
                .page-content p {
                    margin-bottom: 1.25rem;
                }
                .page-content ul, .page-content ol {
                    margin-bottom: 1.5rem;
                    padding-left: 1rem;
                }
                .page-content li {
                    margin-bottom: 0.6rem;
                    position: relative;
                    list-style: none;
                    padding-left: 1.5rem;
                }
                .page-content ul li::before {
                    content: "→"; 
                    color: #FF5F1F;
                    font-weight: bold;
                    position: absolute;
                    left: 0;
                    font-size: 0.9rem;
                }
                .page-content strong {
                    color: #1a1612;
                    font-weight: 700;
                }
            ` }} />
        </div>
    )
}

export default page
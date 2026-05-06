import React from 'react'
import BreadcrumbSection from '../../comp/BreadcrumbSection'
import ContactForm from '../../comp/ContactForm'
import cookieService from '@/services/CookiesService'
import { apiContactPage } from '@/apis/user'
import { faMapPin, faEnvelopeOpen, faPhone, faEarth, FontAwesomeIcon, faFacebook, faTwitter, faPinterest, faYoutube, faLinkedin, faInstagram, faTiktok, faFlipboard, faXTwitter } from '@/constants/icons';
import Link from 'next/link'

const page = async () => {
    const companyDomain = (await cookieService.get("domain")).domain;
    const fullPageData = (await apiContactPage(companyDomain))?.data;
    const pageData = fullPageData?.CompanyContactUs;

    const socialPlatforms = [
        { key: 'facebook', icon: faFacebook, color: '#FF5F1F', label: 'Facebook' },
        { key: 'twitter', icon: faTwitter, color: '#FF5F1F', label: 'Twitter' },
        { key: 'instagram', icon: faInstagram, color: '#FF5F1F', label: 'Instagram' },
        { key: 'pinterest', icon: faPinterest, color: '#FF5F1F', label: 'Pinterest' },
        { key: 'youtube', icon: faYoutube, color: '#FF5F1F', label: 'YouTube' },
        { key: 'linkedin', icon: faLinkedin, color: '#FF5F1F', label: 'LinkedIn' },
        { key: 'tiktok', icon: faTiktok, color: '#FF5F1F', label: 'TikTok' },
        { key: 'flipboard', icon: faFlipboard, color: '#FF5F1F', label: 'Flipboard' },
        { key: 'x_twitter', icon: faXTwitter, color: '#FF5F1F', label: 'X' },
    ];

    return (
        <div className="bg-[#fcfcfa] min-h-screen">
            <BreadcrumbSection 
                title="Contact Us" 
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Contact Us", href: "/contact-us" }
                ]} 
            />

            <section className="py-16 md:py-24 px-4 relative overflow-hidden">
                {/* ── Theme Accents ── */}
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none">
                    <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF5F1F] rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#1a1612] rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        
                        {/* ── Left: Contact Form (Clean White Card) ── */}
                        <div className="order-2 lg:order-1">
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50">
                                <h2 className="text-3xl font-black text-[#1a1612] mb-8 tracking-tight">
                                    Send us a <span className="text-[#FF5F1F]">Message</span>
                                </h2>
                                <ContactForm domain={companyDomain} />
                            </div>
                        </div>

                        {/* ── Right: Contact Info (Orange & Black Theme) ── */}
                        <div className="order-1 lg:order-2 flex flex-col gap-8">
                            
                            <div className="space-y-4">
                                <h3 className="text-4xl font-black text-[#1a1612] uppercase tracking-tighter leading-none">
                                    Need Help?
                                </h3>
                                <div 
                                    className="text-gray-500 leading-relaxed text-lg border-l-4 border-[#FF5F1F] pl-6"
                                    dangerouslySetInnerHTML={{ __html: pageData?.details || "We're here to help you find the best deals and answer any questions you may have." }}
                                />
                            </div>

                            {/* Info Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Address */}
                                {pageData?.address && (
                                    <div className="group bg-[#1a1612] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/5">
                                        <div className="w-10 h-10 rounded-xl bg-[#FF5F1F] flex items-center justify-center text-white mb-4">
                                            <FontAwesomeIcon icon={faMapPin} className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-bold text-white mb-1 text-sm tracking-wide">Main Office</h4>
                                        <p className="text-gray-400 text-xs leading-relaxed">{pageData.address}</p>
                                    </div>
                                )}

                                {/* Email */}
                                {pageData?.email && (
                                    <div className="group bg-white rounded-3xl p-6 border border-gray-100 transition-all duration-300 hover:border-[#FF5F1F]/30 hover:shadow-xl">
                                        <div className="w-10 h-10 rounded-xl bg-[#1a1612] flex items-center justify-center text-[#FF5F1F] mb-4">
                                            <FontAwesomeIcon icon={faEnvelopeOpen} className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-bold text-[#1a1612] mb-1 text-sm tracking-wide">Email Us</h4>
                                        <p className="text-[#FF5F1F] text-xs font-bold truncate">{pageData.email}</p>
                                    </div>
                                )}

                                {/* Phone */}
                                {pageData?.phone_no && (
                                    <div className="group bg-white rounded-3xl p-6 border border-gray-100 transition-all duration-300 hover:border-[#FF5F1F]/30 hover:shadow-xl">
                                        <div className="w-10 h-10 rounded-xl bg-[#1a1612] flex items-center justify-center text-[#FF5F1F] mb-4">
                                            <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                                        </div>
                                        <h4 className="font-bold text-[#1a1612] mb-1 text-sm tracking-wide">Call Now</h4>
                                        <p className="text-gray-500 text-xs font-black">{pageData.phone_no}</p>
                                    </div>
                                )}

                                {/* Website/Support */}
                                <div className="group bg-[#FF5F1F] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#FF5F1F]/20">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF5F1F] mb-4">
                                        <FontAwesomeIcon icon={faEarth} className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-bold text-white mb-1 text-sm tracking-wide">Support</h4>
                                    <p className="text-white/80 text-xs">24/7 Premium Assistance</p>
                                </div>
                            </div>

                            {/* ── Social Capsules ── */}
                            <div className="bg-[#f2f2f2] rounded-[2.5rem] p-6 border border-gray-200 shadow-inner">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-5 text-center">Follow our journey</h5>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {socialPlatforms.map((platform) => {
                                        const link = fullPageData?.company_data?.[platform.key as keyof typeof fullPageData.company_data];
                                        if (!link) return null;

                                        return (
                                            <Link 
                                                key={platform.key}
                                                href={link as string}
                                                target="_blank"
                                                rel="nofollow"
                                                className="h-11 px-4 rounded-full bg-white border border-gray-100 flex items-center gap-2.5 shadow-sm hover:border-[#FF5F1F] hover:text-[#FF5F1F] transition-all duration-300 group"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={platform.icon} 
                                                    className="w-3.5 h-3.5 text-[#1a1612] group-hover:text-[#FF5F1F] transition-colors"
                                                />
                                                <span className="text-[9px] font-black uppercase tracking-tight text-[#1a1612] group-hover:text-[#FF5F1F]">{platform.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default page
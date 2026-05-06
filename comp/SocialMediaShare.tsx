"use client";

import { getBaseImageUrl } from '@/constants/hooks';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
    offerUrl: string;
    offerTitle: string;
    domain: string;
    merchantHref?: string;
    unique_id?: string;
}

const SocialMediaShare = ({ offerUrl, offerTitle, domain, merchantHref, unique_id }: Props) => {
    // 1. Construct the full, absolute URL to be shared
    const finalDomain = `https://${domain}`;
    const finalUrlPath = offerUrl?.startsWith("/") ? offerUrl : `/${offerUrl}`;
    const absoluteOutUrl = `${finalDomain}${finalUrlPath}`;
    const encodedUrl = encodeURIComponent(absoluteOutUrl);
    const encodedTitle = encodeURIComponent(offerTitle);

    // 2. Define social media platforms in an array for easy mapping
    const socialPlatforms = [
        {
            name: 'Facebook',
            icon: 'facebook.png',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            name: 'Twitter',
            icon: 'twitter.png',
            href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        },
        {
            name: 'WhatsApp',
            icon: 'whatsapp.png',
            href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
        },
        {
            name: 'LinkedIn',
            icon: 'linkedin.png',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
        {
            name: 'Telegram',
            icon: 'telegram.png',
            href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            {socialPlatforms.map((platform) => (
                <Link
                    key={platform.name}
                    rel="nofollow sponsored noopener noreferrer"
                    href={platform.href}
                    target="_blank"
                    className="link"
                    style={{ borderRadius: '50%', display: 'flex' }} // Added display flex for alignment
                >
                    <Image
                        src={getBaseImageUrl(domain, `/shared-assets/social/${platform.icon}`, "")}
                        alt={`Share on ${platform.name}`}
                        width={20}
                        height={20}
                    />
                </Link>
            ))}
        </div>
    );
};

export default SocialMediaShare;
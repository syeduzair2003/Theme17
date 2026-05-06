import { calculateOfferDuration } from '@/constants/hooks';
import { faCalendarDays, FontAwesomeIcon } from '@/constants/icons';
import React from 'react'

interface Props {
    endDate: string | null;
    className?: string;
}
const OfferDuration = ({ endDate, className }: Props) => {
    const durationText = calculateOfferDuration(endDate);
    const isExpiring = endDate !== null && endDate !== undefined;

    return (
        <div className={`flex items-center gap-1.5 ${className ?? ''}`}>
            {isExpiring ? (
                /* ── Expiring / Limited Time Style ── */
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff912f10] border border-[#ff912f20] animate-pulse">
                    <FontAwesomeIcon 
                        icon={faCalendarDays} 
                        className="w-3 h-3 text-[#ff912f]" 
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#ff912f]">
                        {durationText}
                    </span>
                </div>
            ) : (
                /* ── Always Active / Verified Style ── */
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#8bc94a10] border border-[#8bc94a15]">
                    <FontAwesomeIcon 
                        icon={faCalendarDays} 
                        className="w-3 h-3 text-[#8bc94a]" 
                    />
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#8bc94a]">
                        {durationText}
                    </span>
                </div>
            )}
        </div>
    );
}

export default OfferDuration

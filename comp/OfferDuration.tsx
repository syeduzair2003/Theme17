import { calculateOfferDuration } from "@/constants/hooks";
import { faCalendarDays, FontAwesomeIcon } from "@/constants/icons";
import React from "react";

interface Props {
  endDate: string | null;
  className?: string;
}

const OfferDuration = ({ endDate, className }: Props) => {
  const durationText = calculateOfferDuration(endDate);
  const isExpiring = endDate !== null && endDate !== undefined;

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      {isExpiring ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/20 animate-pulse">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="w-3 h-3 text-[#FF5A00]"
          />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A00]">
            {durationText}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/20 transition-all duration-300 group-hover/capsule:bg-neutral-900 group-hover/capsule:border-neutral-800">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="w-3 h-3 text-[#FF5A00]"
          />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5A00] group-hover/capsule:text-neutral-200 transition-colors duration-300">
            {durationText}
          </span>
        </div>
      )}
    </div>
  );
};

export default OfferDuration;

"use client";
import { apiAddComment } from "@/apis/offers";
import { emptyStar, filledStar, FontAwesomeIcon } from "@/constants/icons";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

interface RatingProps {
  offer_id: string;
  company_id: string;
}

const RateUs = ({ offer_id, company_id }: RatingProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const lastRated = localStorage.getItem(`hasRated_${offer_id}`);
    if (lastRated && new Date().getTime() - parseInt(lastRated) < 86400000) {
      setHasRated(true);
    }
  }, [offer_id]);

  const handleRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasRated) {
      toast.error("You have already rated, please try again later!", {
        autoClose: 2000,
      });
      return;
    }
    handleSubmit();
    localStorage.setItem(
      `hasRated_${offer_id}`,
      new Date().getTime().toString(),
    );
    setHasRated(true);
  };

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!rating && !comment.trim()) {
      toast.error("Please select a rating or add a comment.", {
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiAddComment(
        offer_id,
        company_id,
        comment,
        rating.toString(),
      );

      if (response.status === "success" || (response as any).status === 200) {
        toast.success("Thank you for your feedback!", { autoClose: 2000 });
        setRating(0);
        setComment("");
      } else {
        toast.error("An error occurred. Please try again later!", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while submitting feedback.", {
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white p-1">
      <ToastContainer />
      
      {/* Premium Clean Title Element */}
      <h4 className="text-sm font-black text-neutral-950 mb-4 uppercase tracking-widest text-center sm:text-left">
        Rate This Offer
      </h4>

      <form onSubmit={handleRate} autoComplete="off" className="space-y-5">
        
        {/* Star Rating Section with Sync Accents */}
        <div className="space-y-1.5 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <button
                type="button"
                key={index}
                onClick={() => handleStarClick(index)}
                className="focus:outline-none transform transition-transform active:scale-90"
              >
                <FontAwesomeIcon
                  icon={index < rating ? filledStar : emptyStar}
                  className={`w-5 h-5 ${
                    index < rating ? "text-[#FF5A00]" : "text-neutral-200"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
          <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
            {rating
              ? `${rating} Star${rating > 1 ? "s" : ""}`
              : "Select Rating"}
          </p>
        </div>

        {/* Comment Section with Minimalist Styling */}
        <div className="space-y-1.5">
          <label
            htmlFor="comment"
            className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block text-left"
          >
            Add a Comment
          </label>
          <textarea
            id="comment"
            placeholder="Share your experience..."
            className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-950 transition-all duration-200 resize-none h-24 text-xs font-medium text-neutral-800 outline-none placeholder-neutral-400"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Premium Action Button (Black to Orange Smooth Inversion) */}
        <button
          type="submit"
          disabled={loading || (hasRated && rating === 0 && comment === "")}
          className="w-full py-3.5 rounded-xl bg-neutral-950 text-white text-xs font-black uppercase tracking-[0.15em] hover:bg-[#FF5A00] transition-all duration-300 disabled:opacity-40 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed group shadow-xs"
        >
          {loading ? (
            "Submitting..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              Submit Feedback
            </span>
          )}
        </button>
      </form>
    </div>
  );
};

export default RateUs;
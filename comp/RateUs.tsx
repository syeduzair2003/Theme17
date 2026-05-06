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
            toast.error("You have already rated, please try again later!", { autoClose: 2000 });
            return;
        }
        handleSubmit();
        localStorage.setItem(`hasRated_${offer_id}`, new Date().getTime().toString());
        setHasRated(true);
    };

    const handleStarClick = (index: number) => {
        setRating(index + 1);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!rating && !comment.trim()) {
            toast.error("Please select a rating or add a comment.", { autoClose: 2000 });
            return;
        }

        setLoading(true);

        try {
            const response = await apiAddComment(offer_id, company_id, comment, rating.toString());

            if (response.status === "success" || (response as any).status === 200) {
                toast.success("Thank you for your feedback!", { autoClose: 2000 });
                setRating(0);
                setComment("");
            } else {
                toast.error("An error occurred. Please try again later!", { autoClose: 2000 });
            }
        } catch (error) {
            toast.error("An error occurred while submitting feedback.", { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <ToastContainer />
            <h4 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-wider">Rate This Offer</h4>
            
            <form onSubmit={handleRate} autoComplete="off" className="space-y-6">
                {/* Star Rating Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, index) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => handleStarClick(index)}
                                className="focus:outline-none transform transition-transform active:scale-90"
                            >
                                <FontAwesomeIcon
                                    icon={index < rating ? filledStar : emptyStar}
                                    className={`w-6 h-6 ${index < rating ? 'text-yellow-400' : 'text-gray-200'} transition-colors duration-200`}
                                />
                            </button>
                        ))}
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {rating ? `${rating} Star${rating > 1 ? 's' : ''}` : "Select Rating"}
                    </p>
                </div>

                {/* Comment Section */}
                <div className="space-y-2">
                    <label htmlFor="comment" className="text-xs font-black text-gray-900 uppercase tracking-widest block">
                        Add a Comment
                    </label>
                    <textarea
                        id="comment"
                        placeholder="Share your experience..."
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#8bc94a] focus:ring-4 focus:ring-[#8bc94a10] transition-all duration-300 resize-none h-24 text-sm text-gray-700 outline-none"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={loading || (hasRated && rating === 0 && comment === "")}
                    className="w-full py-4 rounded-2xl bg-[#8bc94a] text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ff912f] transition-all duration-500 shadow-lg shadow-[#8bc94a20] hover:shadow-[#ff912f40] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? "Submitting..." : (
                        <span className="flex items-center justify-center gap-2">
                            Submit Feedback
                            <span className="transform group-hover:translate-x-1 transition-transform duration-300"/>
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default RateUs;

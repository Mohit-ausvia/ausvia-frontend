"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type ProductReviewsProps = {
  productId: number;
  productName: string;
};

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewer, setReviewer] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const displayRating = hoverRating || rating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1 || !review.trim()) {
      setErrorMessage("Please choose a rating and write your review.");
      setStatus("error");
      return;
    }
    if (!reviewer.trim() || !reviewerEmail.trim()) {
      setErrorMessage("Please enter your name and email.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMessage("");
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          review: review.trim(),
          reviewer: reviewer.trim(),
          reviewer_email: reviewerEmail.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit review");
      }
      setStatus("success");
      setRating(0);
      setReview("");
      setReviewer("");
      setReviewerEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="py-6 md:py-8 border-t border-[#E0E0E0]">
      <p className="font-sans text-[#0E7C86] text-xs uppercase tracking-[0.2em] font-semibold mb-2">
        Reviews
      </p>
      <h2 className="font-serif text-[#1d1d1f] text-lg md:text-xl mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        What others say
      </h2>

      <p className="font-sans text-[#6e6e73] text-sm mb-6">
        No reviews yet. Be the first to leave a review for {productName}.
      </p>

      <div className="rounded-lg border border-[#E0E0E0] bg-white p-4 md:p-6">
        <h3 className="font-sans text-[#1d1d1f] font-semibold text-sm mb-4">Leave a review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="review-rating" className="font-sans text-[#1d1d1f] text-sm font-medium block mb-2">
              Rating
            </label>
            <div className="flex gap-1" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/50"
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                >
                  <Star
                    className="w-7 h-7 transition-colors"
                    fill={value <= displayRating ? "#0E7C86" : "none"}
                    stroke={value <= displayRating ? "#0E7C86" : "#d2d2d7"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-comment" className="font-sans text-[#1d1d1f] text-sm font-medium block mb-2">
              Your review
            </label>
            <textarea
              id="review-comment"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full font-sans text-sm text-[#1d1d1f] border border-[#E0E0E0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 focus:border-[#0E7C86]/50"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="review-name" className="font-sans text-[#1d1d1f] text-sm font-medium block mb-2">
                Name
              </label>
              <input
                id="review-name"
                type="text"
                value={reviewer}
                onChange={(e) => setReviewer(e.target.value)}
                placeholder="Your name"
                className="w-full font-sans text-sm text-[#1d1d1f] border border-[#E0E0E0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 focus:border-[#0E7C86]/50"
              />
            </div>
            <div>
              <label htmlFor="review-email" className="font-sans text-[#1d1d1f] text-sm font-medium block mb-2">
                Email
              </label>
              <input
                id="review-email"
                type="email"
                value={reviewerEmail}
                onChange={(e) => setReviewerEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full font-sans text-sm text-[#1d1d1f] border border-[#E0E0E0] rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 focus:border-[#0E7C86]/50"
              />
            </div>
          </div>
          {status === "error" && errorMessage && (
            <p className="font-sans text-sm text-[#C0392B]">{errorMessage}</p>
          )}
          {status === "success" && (
            <p className="font-sans text-sm text-[#1A6B3C]">Thank you! Your review has been submitted.</p>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="font-sans text-sm font-medium text-white bg-[#0E7C86] hover:bg-[#0E7C86]/90 rounded-[980px] px-6 py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Submitting…" : "Submit review"}
          </button>
        </form>
      </div>
    </section>
  );
}

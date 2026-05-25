import React, { useState } from "react";
import { Eye, Play, Check, X, FileText, Loader2 } from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import API from "../../api/authApi.js"; // ✅ use your existing API instance

const statusStyles = {
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-purple-100 text-purple-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

const ReviewerManuscriptCard = ({ manuscript, onStartReview, onSubmitReview }) => {
  const [reviewText, setReviewText] = useState("");
  const [isOpening, setIsOpening] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitDecision, setSubmitDecision] = useState(null); // "accepted" or "rejected"
  const [loading, setLoading] = useState(false);

  // ✅ Cloudinary / backend download
  const handleReadClick = async () => {
    setIsOpening(true);
    try {
      const res = await API.get(`/reviewer/manuscripts/${manuscript._id}/file`, {
        responseType: "blob", // important for file download
      });

      const blob = new Blob([res.data], { type: manuscript.contentType || "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = manuscript.filename || "manuscript.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to open manuscript");
    } finally {
      setIsOpening(false);
    }
  };

  const handlePrepareSubmit = (decision) => {
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      alert("You must write at least 10 characters for the review.");
      return;
    }
    setSubmitDecision(decision);
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    await onSubmitReview(manuscript, submitDecision, reviewText);
    setLoading(false);
    setShowSubmitModal(false);
    setReviewText("");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow mb-4">
        {/* Thumbnail */}
        <div className="w-full md:w-32 h-44 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-inner">
          {manuscript.imageUrl ? (
            <img src={manuscript.imageUrl} alt="Manuscript" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <FileText size={32} strokeWidth={1} />
              <span className="text-[10px] mt-2 uppercase tracking-tighter">No Preview</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl text-slate-800 leading-tight">{manuscript.title}</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Author: {manuscript.author?.name}</p>
            </div>
            {/* <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusStyles[manuscript.status]}`}> */}
              {manuscript.status.replace("_", " ")}
            </span>
          </div>

          {manuscript.status === "under_review" && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
                Mandatory Expert Feedback
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here (Minimum 10 characters)..."
                className="w-full border border-slate-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[100px]"
              />
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handlePrepareSubmit("accepted")}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Check size={18} /> Accept Manuscript
                </button>
                <button
                  onClick={() => handlePrepareSubmit("rejected")}
                  className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <X size={18} /> Reject Manuscript
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-auto pt-4">
            <button
              onClick={handleReadClick}
              disabled={isOpening}
              className="px-5 py-2 bg-slate-800 hover:bg-black text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isOpening ? <Loader2 size={16} className="animate-spin" /> : <Eye size={16} />}
              Read Paper
            </button>

            {manuscript.status === "submitted" && (
              <button
                onClick={() => onStartReview(manuscript)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <Play size={16} /> Begin Evaluation
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title={`Submit Review?`}
        message={`Are you sure you want to submit this review as "${submitDecision?.toUpperCase()}"?`}
        confirmText="Yes, Submit"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
};

export default ReviewerManuscriptCard;

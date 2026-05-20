import React, { useState } from "react";
// 1. IMPORT YOUR API INSTANCE INSTEAD OF AXIOS
import API from "../../api/authApi.js"; 
import {
  Eye,
  Edit3,
  Trash2,
  Calendar,
  MessageSquare,
  X,
  User,
  BookOpenCheck,
} from "lucide-react";
import ConfirmModal from "../ConfirmModal";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  under_review: "bg-indigo-50 text-indigo-700 border-indigo-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  published: "bg-slate-900 text-indigo-400 border-slate-800",
};

const ManuscriptCard = ({ manuscript, onDelete, onEdit }) => {
  const [showReview, setShowReview] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 2. UPDATED FILE VIEW LOGIC
  //  const handleViewFile = async () => {
  //   try {
  //     // 1. Get the signed URL from the Vercel backend
  //     // const response = await API.get(`/author/manuscripts/${manuscript._id}/file`);
  //     console.log("response ",response)
      
  //     const { downloadUrl } = response.data;
  //     console.log("download ",downloadUrl)

  //     if (downloadUrl) {
  //       // 2. Open directly in a new tab. 
  //       // This lets the browser handle the download stream natively, 
  //       // which fixes the "d7eatm... (1)" filename corruption.
  //       window.open(downloadUrl, "_blank");
  //     }
  //   } catch (error) {
  //     console.error("Error opening file:", error);
  //     alert("Could not open file. Check your internet or login status.");
  //   }
  // };

  const handleViewFile = async () => {
  try {
    setIsDownloading(true);

    const response = await API.get(
      `/author/manuscripts/${manuscript._id}/download`,
      {
        responseType: "blob", // 🔥 IMPORTANT
      }
    );


    console.log("res",response)
    // ✅ Create downloadable file
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = manuscript.filename; // ✅ correct name
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    alert("File download failed");
  } finally {
    setIsDownloading(false);
  }
};


  return (
    <>
      <div className="group relative flex flex-col sm:flex-row gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
        
        {/* Thumbnail */}
        <div className="w-full sm:w-32 h-44 flex-shrink-0 relative overflow-hidden rounded-xl bg-slate-100 shadow-inner">
          {manuscript.imageUrl ? (
            <img src={manuscript.imageUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <BookOpenCheck size={32} strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase ${statusStyles[manuscript.status]}`}>
              {manuscript.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg leading-tight text-slate-900 group-hover:text-indigo-600 line-clamp-2">
              {manuscript.title}
            </h3>
            <div className="mt-3 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <User size={14} className="text-indigo-500" /> Author
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} /> {new Date(manuscript.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleViewFile}
              className="flex-1 px-3 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-2"
            >
              <Eye size={14} /> View
              
            </button>

            {(manuscript.reviewerComments || manuscript.reviewedAt) && (
              <button
                onClick={() => setShowReview(true)}
                className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center justify-center gap-2"
              >
                <MessageSquare size={14} /> Review
              </button>
            )}

            {manuscript.status === "pending" && (
              <>
                <button
                  onClick={() => onEdit(manuscript)}
                  className="px-3 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-indigo-50"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3 py-2 bg-white text-rose-500 border border-slate-200 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-bold">Reviewer Feedback</h2>
                <button onClick={() => setShowReview(false)}><X /></button>
              </div>
              <p className="text-sm text-slate-600 italic">
                {manuscript.reviewerComments || "No comments"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Manuscript?"
        message="Are you sure? This cannot be undone."
        confirmText="Yes, Delete"
        onConfirm={() => {
          onDelete(manuscript._id);
          setShowDeleteModal(false);
        }}
      />
    </>
  );
};

export default ManuscriptCard;
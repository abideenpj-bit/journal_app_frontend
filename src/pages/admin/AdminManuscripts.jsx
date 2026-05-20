import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Filter as FilterIcon, Loader2, BookOpen } from "lucide-react";
import AdminManuscriptCard from "../../components/admin/AdminManuscriptCard.jsx";
import AdminFilterSidebar from "../../components/admin/AdminFilterSidebar.jsx"; 
import API from "../../api/authApi.js";
import { fetchAllManuscripts } from "../../features/admin/adminSlice.jsx";

const AdminManuscripts = () => {
  const dispatch = useDispatch();
  const { manuscripts, loading, error } = useSelector((state) => state.adminManuscripts);

  // States for Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchAllManuscripts());
  }, [dispatch]);

  // Filtering Logic
  const filteredManuscripts = manuscripts.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Fetch the manuscript from the backend with auth, then open it.
   * This preserves the backend-provided filename and content type.
   */
  const handleRead = async (manuscript) => {
    const toastId = toast.loading(`Opening ${manuscript.title}...`);

    try {
      const url = `${API.defaults.baseURL}/admin/manuscripts/${manuscript._id}/download`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch manuscript");
      }

      const disposition = res.headers.get("content-disposition") || "";
      let filename = manuscript.filename || "manuscript.pdf";

      if (disposition.includes("filename=")) {
        filename = disposition
          .split("filename=")[1]
          .replace(/"/g, "")
          .trim();
      }

      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      if (blob.type === "application/pdf") {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
      } else {
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }

      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 10000);

      toast.update(toastId, {
        render: "Document opened",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: "Failed to open file",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (loading && manuscripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium">Loading editorial database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex relative">
      <AdminFilterSidebar 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-3 bg-white border border-slate-200 rounded-2xl text-slate-600"
              >
                <FilterIcon size={20} />
              </button>
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">Editorial Overview</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  Managing {filteredManuscripts.length} submissions in the pipeline
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex bg-indigo-50 px-4 py-2 rounded-xl items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
              <BookOpen size={16} /> Admin Portal
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredManuscripts.length > 0 ? (
                filteredManuscripts.map((m, index) => (
                  <motion.div 
                    layout
                    key={m._id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <AdminManuscriptCard manuscript={m} onRead={handleRead} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                   <p className="text-slate-400 italic">No manuscripts found matching these filters.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminManuscripts;

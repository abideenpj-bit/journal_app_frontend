import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter as FilterIcon } from "lucide-react";
import { toast } from "react-toastify";
import FilterSidebar from "./FilterSidebar";
import ManuscriptCard from "./ManuscriptCard.jsx";
import ConfirmModal from "../ConfirmModal"; // 🔹 Import your modal
import { fetchMyManuscripts, deleteManuscript } from "../../features/author/authorActions.jsx";

const ManuscriptList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { manuscripts, loading } = useSelector((state) => state.author);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedManuscriptId, setSelectedManuscriptId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    dispatch(fetchMyManuscripts());
  }, [dispatch]);

  // 🔹 Use a ref flag to prevent double triggers
  const [deleteClicked, setDeleteClicked] = useState(false);

  const handleDeleteClick = (id) => {
    console.log(1)
    if (deleteClicked) return; // prevent multiple opens
    console.log(2)
    setDeleteClicked(true);
    setSelectedManuscriptId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedManuscriptId) return;
    setLoadingDelete(true);
    await dispatch(deleteManuscript(selectedManuscriptId));
    toast.success("Manuscript deleted successfully");
    setLoadingDelete(false);
    setShowDeleteModal(false);
    setSelectedManuscriptId(null);
    setDeleteClicked(false); // reset flag
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedManuscriptId(null);
    setDeleteClicked(false); // reset flag
  };

  const handleEdit = (manuscript) => {
    navigate(`/author/edit/${manuscript._id}`);
  };

  const filteredManuscripts = manuscripts.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
  statusFilter === "All" ||
  statusFilter === "all" ||
  m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex relative">
      {/* FILTER SIDEBAR */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <FilterIcon size={20} />
              </button>
              <div>
                <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">My Manuscripts</h2>
                <div className="h-1.5 w-24 bg-indigo-600 mt-2 rounded-full"></div>
                <p className="text-slate-400 text-sm mt-3 font-medium">
                  Tracking {filteredManuscripts.length} scientific submissions
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/upload-manuscript")}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus size={20} /> New Submission
            </button>
          </div>

          {/* MANUSCRIPT GRID */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredManuscripts.length > 0 ? (
                  filteredManuscripts.map((m) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={m._id}
                    >
                      <ManuscriptCard
                        manuscript={m}
                        onDelete={() => handleDeleteClick(m._id)} // 🔹 Open modal only once
                        onEdit={handleEdit}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium italic">No manuscripts match your filters.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete} // 🔹 cancel resets the flag
        title="Delete Manuscript?"
        message="Are you sure you want to delete this manuscript? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        loading={loadingDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ManuscriptList;

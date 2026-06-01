import React from "react";
import { motion } from "framer-motion";
import { Search, X, Filter as FilterIcon } from "lucide-react";

const FilterSidebar = ({ 
  isOpen, 
  setIsOpen, 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}) => {
  const statuses = [
    { value: "All", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "accepted", label: "Accepted" },
    { value: "published", label: "Published" },
    { value: "rejected", label: "Rejected" },
  ];

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: "-100%", opacity: 0 }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className={`fixed lg:sticky top-0 lg:top-20 left-0 h-full lg:h-[calc(100vh-80px)] w-72 bg-white border-r border-slate-200 p-6 z-50 lg:z-0 lg:block ${
          isOpen ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex justify-between items-center lg:hidden mb-6">
          <span className="font-bold text-slate-900">Filters</span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Search Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search size={14} /> Search Title
            </h3>
            <input 
              type="text"
              placeholder="Filter by title..."
              className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FilterIcon size={14} /> Status Filter
            </h3>
            <div className="space-y-1.5">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    statusFilter === status.value 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default FilterSidebar;
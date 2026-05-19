import { useEffect, useState } from "react";
import API from "../api/authApi"; // ✅ use your axios instance
import { 
  BookOpen, RefreshCw, User, Calendar, 
  FileText, Loader2, Eye, BookOpenCheck 
} from "lucide-react";

const PublishedManuscripts = () => {
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadManuscripts = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/published-manuscripts");
      const papers = Array.isArray(data.data) ? data.data : [];
      setManuscripts(papers);
    } catch (err) {
      setError("Failed to load published papers.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open PDF using API instance
  const handleReadFile = async (id) => {
    try {
      const response = await API.get(
        `/published-manuscripts/${id}/file`,
        { responseType: "blob" }
      );

      const file = new Blob([response.data], {
        type: "application/pdf",
      });

      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");

      setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
    } catch (err) {
      console.error("Error opening PDF:", err);
      alert("Could not open the manuscript file.");
    }
  };

  useEffect(() => {
    loadManuscripts();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              <BookOpen className="text-indigo-600" size={32} />
              Published Archive
            </h1>
            <p className="text-slate-500 mt-1">
              Reviewing the latest verified academic manuscripts
            </p>
          </div>

          <button
            onClick={loadManuscripts}
            className="btn bg-indigo-600 text-white gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <RefreshCw size={18} />
            )}
            Refresh Archive
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {manuscripts.map((paper) => (
            <div
              key={paper._id}
              className="group relative flex flex-col sm:flex-row gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Cover */}
              <div className="w-full sm:w-32 h-44 flex-shrink-0 relative overflow-hidden rounded-xl bg-slate-100">
                {paper.imageUrl ? (
                  <img
                    src={paper.imageUrl}
                    alt="Cover"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <BookOpenCheck size={40} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                    {paper.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {paper.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-400">
                      <User size={14} className="text-indigo-500" />
                      <span className="text-slate-900">
                        {paper.author?.name || "Author"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-400">
                      <Calendar size={14} />
                      <span className="text-slate-500">
                        {new Date(paper.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleReadFile(paper._id)}
                    className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    <Eye size={14} /> Read Paper
                  </button>

                  
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PublishedManuscripts;

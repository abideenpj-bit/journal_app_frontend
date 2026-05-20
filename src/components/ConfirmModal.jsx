import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  loadingText = "Processing...", // ✅ NEW PROP
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-full">
                <AlertTriangle size={20} />
              </div>

              <h2 className="text-lg font-bold text-slate-800">
                {title}
              </h2>
            </div>

            {/* Message */}
            <p className="text-sm text-slate-600 mb-6 break-words whitespace-pre-wrap overflow-hidden">
              {message}
            </p>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-50"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                disabled={loading}
                className="px-5 py-2 text-sm font-bold text-white bg-rose-600 rounded-lg hover:bg-rose-700 active:scale-95 transition disabled:opacity-70 flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}

                {loading ? loadingText : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
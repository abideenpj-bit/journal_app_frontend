import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authActions.jsx";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  LogIn,
  Chrome,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import API from "../api/authApi.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form)).then((res) => {
      if (!res.error) {
        // ✅ Redux's loginUser.fulfilled already handles localStorage.setItem("token")
        // and updates the state. The Navbar will re-render automatically.
        navigate("/");
      }
    });
  };

  const handleForgotPassword = async () => {
    try {
      setForgotSuccess("");
      setForgotError("");

      const { data } = await API.post("/auth/forgot-password", {
        email: forgotEmail,
      });

      setForgotSuccess(data.message);
    } catch (err) {
      setForgotError(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-white selection:bg-blue-100 selection:text-blue-700">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-indigo-950 to-black items-center justify-center p-12 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-5%] right-[-5%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-md space-y-6 text-white relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase rounded-full">
            <Sparkles size={14} />
            <span>Welcome Back</span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter leading-tight">
            PSYCHOLOGICAL{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              JOURNAL.
            </span>
          </h1>
          <p className="text-lg text-slate-300">
            Sign in to continue your research journey.
          </p>
        </motion.div>
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="text-4xl font-black text-slate-900 mb-8">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="w-full pl-12 py-4 border rounded-2xl bg-slate-50"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold">Password</label>
                <button
                  type="button"
                  className="text-xs font-bold text-blue-600"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="w-full pl-12 py-4 border rounded-2xl bg-slate-50"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Redux Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-rose-50 text-rose-700 rounded-xl text-sm font-bold flex items-center gap-2"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogIn />
              )}
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          {/* Google Login */}
          <button
            className="w-full mt-8 py-4 border rounded-2xl font-bold flex justify-center gap-2"
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_API_URL}/auth/google`,
                "_self"
              )
            }
          >
            <Chrome className="text-red-500" />
            Continue with Google
          </button>

          <p className="mt-8 text-center">
            New here?{" "}
            <Link to="/register" className="text-blue-600 font-bold">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-2xl w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-3">Reset Password</h3>
              <input
                type="email"
                className="w-full mb-3 p-3 border rounded-xl"
                placeholder="name@university.edu"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              {forgotError && (
                <p className="text-red-600 text-sm">{forgotError}</p>
              )}
              {forgotSuccess && (
                <p className="text-green-600 text-sm">{forgotSuccess}</p>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-xl font-bold"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"
                  onClick={handleForgotPassword}
                >
                  Send Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

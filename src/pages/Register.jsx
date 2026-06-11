import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authActions.jsx";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, UserPlus, Chrome, 
  AlertCircle, Loader2, CheckCircle2, Sparkles 
} from "lucide-react";
import API from "../api/authApi"; // ✅ import your axios instance

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form)).then((res) => {
      if (!res.error) navigate("/login");
    });
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await API.get("/auth/google"); // ✅ using axios instance
      // Backend should return the OAuth URL
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed. Please try again.");
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex min-h-screen bg-white selection:bg-blue-100 selection:text-blue-700">
      
      {/* Left Side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-indigo-950 to-black items-center justify-center p-12 relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]" 
        />

        <motion.div initial="hidden" animate="visible" variants={containerVars} className="max-w-md space-y-8 relative z-10 text-white">
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase rounded-full backdrop-blur-xl">
            <Sparkles size={14} className="animate-pulse" />
            <span>Academic Excellence</span>
          </motion.div>
          <motion.h1 variants={itemVars} className="text-2xl font-black leading-tight tracking-tighter">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">PSYCHOLOGICAL JOURNAL Hub</span> of Research.
          </motion.h1>
          <div className="space-y-6 pt-4">
            {[{ title: "Smart Submissions", desc: "AI-driven tracking for your papers.", color: "text-blue-400" },
              { title: "Expert Network", desc: "Verified peer review from top scholars.", color: "text-indigo-400" }].map((feature, i) => (
              <motion.div variants={itemVars} key={i} className="group flex gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-default">
                <div className={`p-2 rounded-lg bg-white/5 ${feature.color}`}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{feature.title}</h4>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium italic">Empowering researchers worldwide.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[{ label: "Full Name", icon: User, type: "text", field: "name", placeholder: "Alex Thompson" },
              { label: "Email Address", icon: Mail, type: "email", field: "email", placeholder: "alex@university.edu" },
              { label: "Password", icon: Lock, type: "password", field: "password", placeholder: "••••••••" }].map((input, i) => (
              <motion.div variants={itemVars} key={i} className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">{input.label}</label>
                <div className="relative group">
                  <input.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                  <input
                    type={input.type}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                    placeholder={input.placeholder}
                    value={form[input.field]}
                    onChange={(e) => setForm({ ...form, [input.field]: e.target.value })}
                    required
                  />
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-2xl text-sm border border-rose-100">
                  <AlertCircle size={20} />
                  <span className="font-bold">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 transition-all disabled:opacity-50 mt-4"
              type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={24} /> : <UserPlus size={24} />}
              {loading ? "Creating Profile..." : "Sign Up"}
            </motion.button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <span className="bg-white px-4">Social Gateway</span>
            </div>
          </div>

          {/* ✅ Updated to use axios instance */}
          <motion.button
            whileHover={{ y: -2 }}
            className="w-full py-4 bg-white border-2 border-slate-100 hover:border-blue-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:bg-slate-50"
            onClick={handleGoogleLogin}
          >
            <Chrome size={20} className="text-blue-500" />
            Continue with Google
          </motion.button>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Joined already? <Link to="/login" className="text-blue-600 font-black hover:text-blue-800 transition-colors underline underline-offset-8">Login</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

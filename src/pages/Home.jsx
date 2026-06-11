import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Added Framer Motion
import { ArrowRight, ShieldCheck, Globe, Microscope } from "lucide-react";
import logoNav from "../assets/Logo_psychological Journals (3).png";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const [nav, setnav] = useState("");
  // const navigate = useNavigate();
  const navigate = useNavigate();
  console.log("nav", nav);
  const handleClick = () => {
    const token = localStorage.getItem("token"); // ٹوکن چیک کرو
    console.log("token ,", token);
    if (token) {
      navigate("/upload-manuscript"); // ٹوکن موجود → UploadManuscript
    } else {
      navigate("/register"); // ٹوکن نہ ہو → Register
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 selection:bg-primary/20 overflow-x-hidden">
      <main>
        {/* 1. HERO SECTION */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <motion.div
            className="max-w-5xl mx-auto px-6 text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            {/* Logo Entrance */}
            <motion.img
              src={logoNav}
              alt="Logo"
              className="h-20 mx-auto mb-12 opacity-90"
              variants={fadeInUp}
            />

            <motion.h1
              className="text-5xl md:text-8xl font-serif font-medium tracking-tight mb-8 leading-[1.05] text-slate-900"
              variants={fadeInUp}
            >
              Advancing the <br />
              <span className="italic font-serif text-primary">
                Science of the Mind.
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
              variants={fadeInUp}
            >
              A premier destination for breakthrough psychological research. We
              provide a rigorous platform for scholars to share empirical
              studies, clinical discoveries, and theoretical advancements.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
              variants={fadeInUp}
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary btn-lg px-12 rounded-xl group shadow-xl shadow-primary/10"
                onClick={handleClick} // ← programmatic navigation
              >
                Submit Manuscript
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </motion.button>
              <Link to="/published">
                <motion.button
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="btn btn-outline btn-lg px-12 rounded-xl border-slate-200"
                  // onClick={published}
                >
                  View Open Access
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* 2. CREDIBILITY STRIP - Reveal on Scroll */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="py-12 border-y border-slate-100 bg-slate-50/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
              Indexed and Recognized By
            </p>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 font-serif text-lg tracking-widest">
              {["APA STYLE", "SCOPUS", "PUBMED", "WEB OF SCIENCE"].map(
                (text) => (
                  <motion.span key={text} whileHover={{ opacity: 1, y: -2 }}>
                    {text}
                  </motion.span>
                ),
              )}
            </div>
          </div>
        </motion.section>

        {/* 3. FEATURES GRID - Reveal on Scroll */}
        <section className="py-32 max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-primary" />}
              title="Double-Blind Review"
              desc="Maintaining the highest standards of integrity with a rigorous peer-review process that ensures unbiased evaluation."
            />
            <FeatureCard
              icon={<Globe className="w-6 h-6 text-primary" />}
              title="Global Scholarly Impact"
              desc="Our open-access model ensures your research reaches psychologists and academic institutions in over 120 countries."
            />
            <FeatureCard
              icon={<Microscope className="w-6 h-6 text-primary" />}
              title="Empirical Rigor"
              desc="Dedicated to the publication of high-quality data, replicable methods, and significant contributions to behavioral science."
            />
          </motion.div>
        </section>
      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-slate-100 bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-2">
            <img src={logoNav} alt="Logo" className="h-10 mb-6 grayscale" />
            <p className="text-slate-500 max-w-sm">
              Supporting the evolution of psychological discourse through
              evidence-based research and academic transparency since 2010.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-serif">Journal Info</h4>
            <ul className="text-slate-500 space-y-2 text-sm">
              {["Aim and Scope", "Editorial Board", "Sponsorships"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-primary cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-serif">Submission</h4>
            <ul className="text-slate-500 space-y-2 text-sm">
              {[
                "Manuscript Template",
                "Conflict of Interest",
                "Privacy Statement",
              ].map((item) => (
                <li
                  key={item}
                  className="hover:text-primary cursor-pointer transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-50 text-center text-slate-400 text-sm">
          © 2026 International Journal of Psychological Studies.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -8 }} className="group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 font-serif">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm text-left">{desc}</p>
    </motion.div>
  );
}

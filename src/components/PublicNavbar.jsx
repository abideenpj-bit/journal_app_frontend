import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice"; // Import logout action
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import imagLogo from "../assets/Logo_psychological Journal_with text (1).png";

const PublicNavbar = () => {
  const [open, setOpen] = useState(false); // About dropdown
  const [publishedOpen, setPublishedOpen] = useState(false); // Published dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // hamburger

  // ✅ Get token directly from Redux state
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // ✅ Use Redux logout (clears state & localStorage)
    localStorage.removeItem("role"); // Clear role if you use it
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) =>
    `px-4 py-2 text-sm font-medium transition-colors ${
      isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="w-full bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-[100]">

      <div className="flex items-center">

        {/* LOGO */}
        <div className="w-1/4">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={imagLogo} alt="" className="h-12 w-auto" />
          </Link>
        </div>

        {/* CENTER NAV */}
        <div className="w-2/4 hidden md:flex justify-center items-center gap-4">

          <NavLink to="/" className={navLinkStyle}>Home</NavLink>

          {/* ✅ Published Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setPublishedOpen(true)}
            onMouseLeave={() => setPublishedOpen(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
              Published
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  publishedOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {publishedOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white shadow-xl rounded-xl border py-2 mt-1"
                >
                  <NavLink
                    to="/published"
                    className="block px-5 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    Recent Published
                  </NavLink>

                 <NavLink to="/old-published" className={navLinkStyle}>
  Old Published
</NavLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* About Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
              About The Journal
              <ChevronDown
                size={14}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white shadow-xl rounded-xl border py-2 mt-1"
                >
                  {[
                    { to: "/about", label: "About Us" },
                    { to: "/editorial-team", label: "Editorial Team" },
                    { to: "/editorial-policies", label: "Editorial Policies" },
                    { to: "/contact", label: "Contact Us" },
                  ].map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="block px-5 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AUTH */}
        <div className="w-1/4 hidden md:flex justify-end gap-3 items-center">
          {!token ? (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-4">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-full"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU ICON */}
        <div className="md:hidden ml-auto">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-4 border-t pt-4 space-y-2"
          >
            <NavLink to="/" className={navLinkStyle}>Home</NavLink>

            {/* Published Mobile */}
            <div>
              <button
                onClick={() => setPublishedOpen(!publishedOpen)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600"
              >
                Published
                <ChevronDown
                  size={14}
                  className={`${publishedOpen ? "rotate-180" : ""}`}
                />
              </button>

              {publishedOpen && (
                <div className="pl-4 space-y-1">
                  <NavLink to="/published" className={navLinkStyle}>
                    Recent Published
                  </NavLink>

                <NavLink
  to="/old-published"
  className="block px-5 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
>
  Old Published
</NavLink>
                </div>
              )}
            </div>

            {/* About Mobile */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600"
            >
              About The Journal
              <ChevronDown size={14} className={`${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="pl-4">
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/editorial-team", label: "Editorial Team" },
                  { to: "/editorial-policies", label: "Editorial Policies" },
                  { to: "/contact", label: "Contact Us" },
                ].map(link => (
                  <NavLink key={link.to} to={link.to} className={navLinkStyle}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}

            {!token ? (
              <>
                <NavLink to="/login" className={navLinkStyle}>Login</NavLink>
                <NavLink to="/register" className={navLinkStyle}>Register</NavLink>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-rose-600 text-sm font-bold"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PublicNavbar;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminNavbar from "./admin/AdminNavbar";
import AuthorNavbar from "./author/AuthorNavbar";
import ReviewerNavbar from "./reviewer/ReviewerNavbar";
import PublicNavbar from "./PublicNavbar";
import jwt_decode from "jwt-decode";

const Navbar = () => {
  const [role, setRole] = useState(null);
  
  // ✅ Get token directly from Redux state
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setRole(decoded.role); // Extract role from token
      } catch (err) {
        console.error("Invalid token", err);
        setRole(null);
      }
    } else {
      setRole(null); // Clear role if no token
    }
  }, [token]); // ✅ Re-run this effect whenever the token in Redux changes

  return (
    <>
      <PublicNavbar />

      {/* ✅ This section will now update instantly when token/role changes */}
      {role && (
        <div className="border-t">
          {role === "admin" && <AdminNavbar />}
          {role === "author" && <AuthorNavbar />}
          {role === "expert" && <ReviewerNavbar />}
        </div>
      )}
    </>
  );
};

export default Navbar;

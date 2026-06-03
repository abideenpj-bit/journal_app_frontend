import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import UploadManuscript from "./pages/author/UploadManuscript";

import AuthorRequestPage from "./pages/author/AuthorRequestPage.jsx";
// import AdminApprovePage from "./pages/AdminApprovePage.jsx";
import LoginSuccess from "./pages/LoginSuccess.jsx";
import Navbar from "./components/Navbar.jsx";
import OldPublished from "./pages/OldPublished.jsx";



import AdminApprove from "./components/admin/AdminApprove.jsx";
import AdminPaperApprove from "./pages/admin/AdminApprovePage.jsx";
import MyManuscripts from "./pages/author/MyManuscripts";
import EditManuscript from "./pages/author/EditManuscript.jsx";
import AdminManuscripts from "./pages/admin/AdminManuscripts.jsx";
import AssignReviewerPage from "./components/admin/AssignReviewerPage.jsx";
import ReviewerDashboard from "./pages/reviewer/ReviewerDashboard.jsx";
import Contact from "./pages/Contact.jsx";
import EditorialTeam from "./pages/EditorialTeam.jsx";
import EditorialPolicies from "./pages/EditorialPolicies.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AdminNavbar from "./components/admin/AdminNavbar.jsx";
import AuthorNavbar from "./components/author/AuthorNavbar.jsx";
import ReviewerNavbar from "./components/reviewer/ReviewerNavbar.jsx";
// import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
// import AutherDashboard from "./pages/author/AuthorDashboard.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminApprovePage from "./pages/admin/AdminApprovePage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import PublishedManuscripts from "./pages/PublishedManuscripts.jsx";

function App() {
  return (
    <>
<ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
          <Navbar/>
      
        <Routes>
          {/* for any one ok  */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
             {/* use the one button for that on hover show the dreopdown menu for (contact, about, editorial team, editorial policies) */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} /> 
        <Route path="/editorial-policies" element={<EditorialPolicies />} />
        <Route path="/editorial-team" element={<EditorialTeam />} />

        <Route path="/login-success" element={<LoginSuccess />} />

        {/* author navbar links */}
        <Route path="/request-expert" element={<AuthorRequestPage />} />
        <Route path="/upload-manuscript" element={<UploadManuscript />} />
        <Route path="/my-manuscripts" element={<MyManuscripts />} />
        <Route path="/author/edit/:id" element={<EditManuscript />} />


        {/* admin navbar links */}
        <Route path="/admin/manuscripts" element={<AdminManuscripts />} />
        <Route path="/approve-request" element={<AdminApprovePage />} />
        <Route path="/admin/assign-reviewer/:manuscriptId" element={<AssignReviewerPage />} />

          <Route path="/old-published" element={<OldPublished />} />

        {/* <Route path="/admin-approve" element={<AdminApprove />} /> */}
        {/* reviewer navbar links */}
        <Route path="/reviewer/dashboard" element={<ReviewerDashboard />} />
           {/* for other purpse */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/published" element={<PublishedManuscripts />} />

        </Routes>
      
    </>
  );
}

export default App;

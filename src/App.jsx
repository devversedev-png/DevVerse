import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import VisitorGate from "./components/Visitor/VisitorGate";

import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/Services/ServiceDetails";
import Portfolio from "./pages/Portfolio/Portfolio";
import Card from "./pages/Card/Card";
import ProjectDetails from "./pages/Portfolio/ProjectDetails";
import Process from "./pages/Process/Process";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

import ChatPage from "./pages/Chat/ChatPage";
import AdminChats from "./pages/Admin/AdminChats";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminLeads from "./pages/Admin/AdminLeads";
import AdminProjects from "./pages/Admin/AdminProjects";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* PUBLIC WEBSITE (no login needed) */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<ProjectDetails />} />
        <Route path="/card" element={<Card />} />
        <Route path="/process" element={<Process />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat" element={<ChatPage />} />

        {/* ADMIN: separate URLs, not linked from the public site */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/leads" replace />} />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute>
              <AdminLeads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chats"
          element={
            <ProtectedRoute>
              <AdminChats />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <VisitorGate />
    </>
  );
}

export default App;

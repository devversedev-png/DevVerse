import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/Auth/ProtectedRoute";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ServiceDetails from "./pages/Services/ServiceDetails";
import Portfolio from "./pages/Portfolio/Portfolio";
import Process from "./pages/Process/Process";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

import ChatPage from "./pages/Chat/ChatPage";
import AdminChats from "./pages/Admin/AdminChats";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route path="/login" element={<Login />} />

      {/* HOME */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* SERVICES */}
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />

      {/* SERVICE DETAILS */}
      <Route
        path="/services/:slug"
        element={
          <ProtectedRoute>
            <ServiceDetails />
          </ProtectedRoute>
        }
      />

      {/* PORTFOLIO */}
      <Route
        path="/portfolio"
        element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        }
      />

      {/* PROCESS */}
      <Route
        path="/process"
        element={
          <ProtectedRoute>
            <Process />
          </ProtectedRoute>
        }
      />

      {/* ABOUT */}
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        }
      />

      {/* CONTACT */}
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      {/* CUSTOMER CHAT */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute customerOnly>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* ADMIN ONLY */}
      <Route
        path="/admin/chats"
        element={
          <ProtectedRoute adminOnly>
            <AdminChats />
          </ProtectedRoute>
        }
      />

      {/* UNKNOWN URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
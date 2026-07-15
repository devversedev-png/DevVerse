import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const {
    loading,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  // Wait until saved login session is loaded
  if (loading) {
    return (
      <div className="auth-loading">
        Loading...
      </div>
    );
  }

  // Not logged in → Login page
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Admin-only page accessed by customer
  if (adminOnly && !isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
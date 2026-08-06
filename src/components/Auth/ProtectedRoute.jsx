import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({
  children,
  adminOnly = false,
  customerOnly = false,
}) {
  const {
    loading,
    isAuthenticated,
    isAdmin,
  } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (customerOnly && isAdmin) {
    return <Navigate to="/admin/chats" replace />;
  }

  return children;
}

export default ProtectedRoute;

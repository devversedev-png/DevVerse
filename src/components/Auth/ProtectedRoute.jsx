import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/*
 * Guards the admin pages only. The public website needs no login.
 * Anyone who is not the signed-in admin is sent to /admin/login.
 */
function ProtectedRoute({ children }) {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

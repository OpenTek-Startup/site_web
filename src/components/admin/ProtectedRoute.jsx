/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="admin-loading">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

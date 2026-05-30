import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "./PageLoader";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Checking permissions…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;

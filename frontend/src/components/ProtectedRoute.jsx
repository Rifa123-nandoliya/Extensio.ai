import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "./PageLoader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader message="Checking your session…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

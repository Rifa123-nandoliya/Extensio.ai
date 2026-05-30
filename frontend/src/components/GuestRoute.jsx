import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "./PageLoader";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Loading…" />;
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;

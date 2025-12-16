import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or <Loading />

  if (!user) {
    return <Navigate to="/accounts" replace />;
  }

  return children;
};

export default ProtectedRoute;

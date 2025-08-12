import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = Cookies.get("token");

  if (!token) {
    Cookies.remove("token");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
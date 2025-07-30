import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("token");
  const user = Cookies.get("user");

  if (!token || !user) {
    Cookies.remove("token");
    Cookies.remove("user");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
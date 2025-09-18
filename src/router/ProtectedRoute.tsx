import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface TokenPayload {
  role: string;
  exp: number;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const token = Cookies.get("token");

  if (!token) {
    Cookies.remove("token");
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (decoded.exp * 1000 < Date.now()) {
      Cookies.remove("token");
      return <Navigate to="/login" replace />;
    }

    if (decoded.role === "user") {
      if (location.pathname !== "/chat") {
        toast.dismiss();
        toast.error("And tidak memiliki akses");
        return <Navigate to="/chat" replace />;
      }
    }

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    Cookies.remove("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

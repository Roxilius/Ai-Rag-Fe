import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface TokenPayload {
  role: "user" | "admin";
  exp: number;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // user
  // Cookies.set(
  //   "token",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTE0ODQ2NDAxNzc3MjUzMDU0MTIiLCJlbWFpbCI6ImZhanJpLm1hc3RpQGlkc3Rhci5ncm91cCIsIm5hbWUiOiJGYWpyaSBNYXN0aSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMcFlLVTNxQzBuNWtLM0tsSHJhenBpLVlYYVFTV21GelNKT1ItWnJaVEpTaHBrZEE9czk2LWMiLCJyb2xlSWQiOiI1ZGIzMzI1Ni1iOTU5LTRiNTAtYjMxNy03OThlMTRkNGYyN2EiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1NTg0ODY1MSwiZXhwIjoxNzU4NDQwNjUxfQ.ZxjkaCp7iqCoGAnMrt5dtBWNAY7-KFDmjpWSEY_zdyY"
  // );
  // admin
  Cookies.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTI5MjUwMDc1NDkyMzkwODExMDQiLCJlbWFpbCI6ImFkbWluLmpvZ2V0QGlkc3Rhci5jby5pZCIsIm5hbWUiOiJBZG1pbiBKb2dldCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKM1E4OHdfdDlLN05FN2liWEJlQkFORlBNMW5mSE5sZXEwM0Jib2VreWdHOE56a0E9czk2LWMiLCJyb2xlSWQiOiJhZDQzZTdhNS02NDFiLTQ0OWEtYmVjNy1kMzJhZDkyY2Y1ZTQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTU5NTY4NjYsImV4cCI6MTc1ODU0ODg2Nn0.4P8uGsS7vt3sBCfmSM1jZ3wCmw1zbdqdME-hUliQFQI"
  );

  const location = useLocation();
  const token = Cookies.get("token");

  if (!token) {
    Cookies.remove("token");
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    // Cek token expired
    if (decoded.exp * 1000 < Date.now()) {
      Cookies.remove("token");
      return <Navigate to="/login" replace />;
    }

    // Role validation
    if (decoded.role === "user") {
      // user hanya boleh akses /chat
      if (location.pathname !== "/chat") {
        toast.dismiss();
        toast.error("And tidak memiliki akses");
        return <Navigate to="/chat" replace />;
      }
    }

    // kalau admin => bebas
    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    Cookies.remove("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

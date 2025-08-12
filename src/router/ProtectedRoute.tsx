import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  Cookies.set(
    "token",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMTE0ODQ2NDAxNzc3MjUzMDU0MTIiLCJlbWFpbCI6ImZhanJpLm1hc3RpQGlkc3Rhci5ncm91cCIsIm5hbWUiOiJGYWpyaSBNYXN0aSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMcFlLVTNxQzBuNWtLM0tsSHJhenBpLVlYYVFTV21GelNKT1ItWnJaVEpTaHBrZEE9czk2LWMiLCJoZCI6Imlkc3Rhci5ncm91cCIsImlhdCI6MTc1NDk2NzU1MCwiZXhwIjoxNzU3NTU5NTUwfQ.K90WmqiTPHznqVqtJEq2-i0A63urLKU4lelurzVIPPQ"
  );
  const token = Cookies.get("token");

  if (!token) {
    Cookies.remove("token");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
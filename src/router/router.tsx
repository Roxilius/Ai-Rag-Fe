import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import ChatPage from "../pages/ChatPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import FileHandlerPage from "../pages/FileHandlerPage";
import ContactHandlerPage from "../pages/ContactHandlerPage";
import UsersHandlerPage from "../pages/UsersHandlerPage";
import RoleHandlerPage from "../pages/RoleHandlerPage";
import SheetshandlerPage from "../pages/SheetsHanlderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <LoginPage />
      </GoogleOAuthProvider>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <div>Oops, something went wrong!</div>,
    children: [
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "files",
        element: <FileHandlerPage />
      },
      {
        path: "sheets",
        element: <SheetshandlerPage />
      },
      {
        path: "contacts",
        element: <ContactHandlerPage />
      },
      {
        path: "users",
        element: <UsersHandlerPage />
      },
      {
        path: "roles",
        element: <RoleHandlerPage />
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;

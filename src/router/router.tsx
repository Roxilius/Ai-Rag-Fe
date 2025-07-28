import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import ChatPage from "../pages/ChatPage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: '/chat',
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        )
      }
    ],
  },
]);

export default router;
import { createBrowserRouter, Navigate } from "react-router-dom"
import MainLayout from "../layouts/MainLayout"
import LoginPage from "../pages/LoginPage"
import ChatPage from "../pages/ChatPage"
import RegisterPage from "../pages/Register"
import UserPage from "../pages/UserPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "chat",
        element: <ChatPage />,
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
])
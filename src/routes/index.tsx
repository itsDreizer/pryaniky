import MainLayout from "@/layouts/MainLayout";
import LoginPage from "@/pages/Login/LoginPage";
import MainPage from "@/pages/Main/MainPage";
import SomePage from "@/pages/SomePage/SomePage";
import { Navigate, RouteObject } from "react-router-dom";

export const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },

      {
        path: "/some",
        element: <SomePage />,
      },
    ],
  },
  { path: "/*", element: <Navigate to={"/"} replace={true} /> },
];

export const publicRoutes: RouteObject[] = [
  { path: "/login", element: <LoginPage /> },

  { path: "/*", element: <Navigate to={"/login"} replace={true} /> },
];

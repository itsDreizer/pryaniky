import { Backdrop, CircularProgress, createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material";
import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { setAuthChecking, setIsAuthorized } from "./redux/reducers/authSlice";
import "./App.scss";
import { privateRoutes, publicRoutes } from "@/routes";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat",
  },
});

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isAuthorized, authChecking } = useAppSelector((state) => {
    return state.authReducer;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setIsAuthorized(true));
    }
    dispatch(setAuthChecking(false));
  }, []);

  if (authChecking) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const router = createBrowserRouter(isAuthorized ? privateRoutes : publicRoutes);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;

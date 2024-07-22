import DocList from "@/components/DocList/DocList";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchDocs } from "@/redux/reducers/userDocsSlice";
import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import "./MainPage.scss";

const MainPage: React.FC = () => {
  const { docs, isDocsLoading } = useAppSelector((state) => {
    return state.userDocsReducer;
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Главная страница";
    dispatch(fetchDocs());
  }, []);

  if (isDocsLoading) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <main className="main-page main">
      <div className="main-page__container">
        <DocList docs={docs} />
      </div>
    </main>
  );
};

export default MainPage;

import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/redux/hooks";
import { setIsAuthorized } from "@/redux/reducers/authSlice";
import "./Header.scss";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <header className="header">
      <nav className="header-links">
        <Link to={"/"}>Главная</Link>
        <Link to={"/some"}>Другая страница</Link>
      </nav>

      <button
        onClick={() => {
          dispatch(setIsAuthorized(false));
          localStorage.removeItem("token");
        }}
        className="header__logout">
        Выйти
      </button>
    </header>
  );
};

export default Header;

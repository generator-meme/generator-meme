import React from "react";
import logo from "../../images/logo.svg";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Like } from "../../images/header/like-black.svg";
import { ReactComponent as Bell } from "../../images/header/bell.svg";
import { ReactComponent as Avatar } from "../../images/header/avatar.svg";

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="Логотип." />
      </Link>
      {!isLoggedIn && (
        <botton className="header__button" onClick={(e) => navigate("/login")}>
          Войти
        </botton>
      )}
      {isLoggedIn && (
        <div className="header__container">
          <button
            className="header__button"
            onClick={(e) => e.preventDefault()}
          >
            <Like className="header__button_type_like" />
          </button>
          <button
            className="header__button"
            onClick={(e) => e.preventDefault()}
          >
            <Bell className="header__button_type_bell" />
          </button>
          <button
            className="header__button"
            onClick={(e) => e.preventDefault()}
          >
            <Avatar className="header__button_type_avatar" />
            <p>Username</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;

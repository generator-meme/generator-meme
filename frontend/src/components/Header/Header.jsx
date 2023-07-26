import React, { useState } from "react";
import logo from "../../images/logo.svg";
import "./Header.css";
import { Link } from "react-router-dom";
import { ReactComponent as Like } from "../../images/header/like-black.svg";
import { ReactComponent as Bell } from "../../images/header/bell.svg";
import { ReactComponent as Avatar } from "../../images/header/avatar.svg";

const Header = () => {
  const [isLogged, setIsLogged] = useState(false);

  return (
    <div className="header">
      <Link to="/">
        <img className="header__logo" src={logo} alt="Логотип." />
      </Link>
      {!isLogged && (
        <Link className="header__link" to="/login">
          Войти
        </Link>
      )}
      {isLogged && (
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
          <Link className="header__link header__link-container" to="/">
            <Avatar className="header__button_type_avatar" />
            <p>Username</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;

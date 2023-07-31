import React from "react";
import logo from "../../images/logo.svg";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Like } from "../../images/header/like-black.svg";
import { ReactComponent as Bell } from "../../images/header/bell.svg";
import { ReactComponent as Avatar } from "../../images/header/avatar.svg";
import { ReactComponent as Burger } from "../../images/header/burger.svg";
import { getCookie, deleteCookie } from "../../utils/cookie";
import { authorisation } from "../../utils/autorisation";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const savedToken = getCookie("token");
      console.log(savedToken);
      await authorisation.logOut(savedToken);
      deleteCookie("token");
      setIsLoggedIn(false);
      navigate("/"); // подумать, должно ли выбрасывать, когда пользователь выходит из личного кабинета
    } catch (err) {
      console.log(err);
    }
  };

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
      {isLoggedIn && window.innerWidth > 690 && (
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
            onClick={(e) => handleLogOut()}
            // onClick={(e) => e.preventDefault()}
          >
            <Avatar className="header__button_type_avatar" />
            <p>Username</p>
          </button>
        </div>
      )}
      {isLoggedIn && window.innerWidth < 691 && (
        <button className="header__button" onClick={(e) => e.preventDefault()}>
          <Burger className="header__button_type_burger" />
        </button>
      )}
    </div>
  );
};

export default Header;

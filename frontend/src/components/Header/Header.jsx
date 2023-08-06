import React, { useState, useRef, useEffect } from "react";
import logo from "../../images/logo.svg";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Like } from "../../images/header/like-black.svg";
import { ReactComponent as Bell } from "../../images/header/bell.svg";
import { ReactComponent as Avatar } from "../../images/header/avatar.svg";
import { ReactComponent as Burger } from "../../images/header/burger.svg";
import { getCookie, deleteCookie } from "../../utils/cookie";
import { authorisation } from "../../utils/autorisation";
import Menu from "../Menu/Menu.jsx";
import { setIsLoggedOut } from "../../services/actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [myMainMenuIsOpen, setMyMainMenuIsOpen] = useState(false);
  const [myExtraMenuIsOpen, setMyExtraMenuIsOpen] = useState(false);
  const myMainMenu = useRef(null);
  const myExtraMenu = useRef(null);
  const userData = useSelector((state) => state.user.userInfo);

  const handleLogOut = async (e) => {
    e.stopPropagation();
    try {
      const savedToken = getCookie("token");
      await authorisation.logOut(savedToken);
      deleteCookie("token");
      dispatch(setIsLoggedOut());
      setMyMainMenuIsOpen(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (myMainMenuIsOpen || myExtraMenuIsOpen) {
      const hideMenu = (e) => {
        if (!myMainMenu?.current.contains(e.target) && myMainMenuIsOpen) {
          setMyMainMenuIsOpen(false);
        }

        if (!myExtraMenu?.current.contains(e.target) && myExtraMenuIsOpen) {
          setMyExtraMenuIsOpen(false);
        }
      };

      window.addEventListener("click", hideMenu);

      return () => {
        window.removeEventListener("click", hideMenu);
      };
    }
  }, [myMainMenuIsOpen, myExtraMenuIsOpen]);

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
          {window.innerWidth >= 690 && (
            <>
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
                onClick={() => setMyMainMenuIsOpen(true)}
                ref={myMainMenu}
              >
                <Avatar className="header__button_type_avatar" />
                <p>{userData.username}</p>
              </button>
            </>
          )}
          {window.innerWidth < 690 && (
            <>
              <button
                className="header__button"
                onClick={() => setMyMainMenuIsOpen(true)}
                ref={myMainMenu}
              >
                <Avatar className="header__button_type_avatar" />
              </button>
              <button
                className="header__button"
                onClick={() => setMyExtraMenuIsOpen(true)}
                ref={myExtraMenu}
              >
                <Burger className="header__button_type_burger" />
              </button>
            </>
          )}
          {myMainMenuIsOpen && (
            <Menu
              options={[
                {
                  name: "Личный\u00A0кабинет",
                  onClick: (e) => e.preventDefault(),
                },
                {
                  name: "Выйти",
                  onClick: (e) => handleLogOut(e),
                },
              ]}
            ></Menu>
          )}
          {myExtraMenuIsOpen && (
            <Menu
              options={[
                {
                  name: "Избранное",
                  onClick: (e) => e.preventDefault(),
                },
                {
                  name: "Уведомления",
                  onClick: (e) => e.preventDefault(),
                },
              ]}
            ></Menu>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;

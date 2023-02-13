import React from "react";
import "./Navigation.css";
import { NavLink } from "react-router-dom";
import arrow from "../../images/arrow-nav.svg";

function Navigation ({ isSavedMeme, id }) {
  return (
    <section className="navigation">
      <nav>
        <ul className="navigation__container">
          <li className="navigation__element">
            <NavLink end to="/generator-meme"
              className={({ isActive }) =>
                `navigation__link
                ${isActive ? "navigation__link_active": ""}`
              }
            >
              Главная
            </NavLink>
            <img className="navigation__arrow" src={arrow} alt="Стрелка справо."/>
          </li>
          <li className="navigation__element">
            <NavLink to={`/generator-meme/${id}`}
              className={({ isActive }) =>
                `navigation__link
                ${isActive ? "navigation__link_active": ""}`
              }
            >
              Редактор
            </NavLink>
            <img className="navigation__arrow" src={arrow} alt="Стрелка справо."/>
          </li>
          {isSavedMeme && (
          <li className="navigation__element">
            <NavLink to="/generator-meme/saved"
              className={({ isActive }) =>
                `navigation__link
                ${isActive ? "navigation__link_active": ""}`
              }
            >
              Готовый мем
            </NavLink>
            <img className="navigation__arrow" src={arrow} alt="Стрелка справо."/>
          </li>
          )}
        </ul>
      </nav>
    </section>
  )
};

export default Navigation;
import React from "react";
import "./Menu.css";

const Menu = ({ options }) => {
  return (
    <ul className="menu">
      {options.map((el, index) => {
        return (
          <li key={index} className="menu__option">
            <button onClick={el.onClick} className="menu__button">
              {el.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;

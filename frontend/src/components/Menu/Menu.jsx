import React, { useState } from "react";
import "./Menu.css";
import Prompt from "../Prompt/Prompt";

const Menu = ({ options }) => {
  const [isHover, setIsHover] = useState(null);

  return (
    <ul className="menu">
      {options.map((el, index) => {
        return (
          <li key={index} className="menu__option">
            <button
              onClick={el.onClick}
              className="menu__button"
              onMouseEnter={(e) => setIsHover(el.name)}
              onMouseLeave={(e) => setIsHover(null)}
              style={{
                color:
                  el.inProgress && isHover === el.name
                    ? "rgba(155, 155, 155, 0.50)"
                    : isHover === el.name
                    ? "#AC52D1"
                    : "#1E1D1D",
              }}
            >
              {el.name}
            </button>
            {el.inProgress && isHover === el.name && (
              <Prompt text={"В РАЗРАБОТКЕ"} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default Menu;

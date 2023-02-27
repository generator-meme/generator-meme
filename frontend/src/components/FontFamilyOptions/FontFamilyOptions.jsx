import React, { useEffect, useState } from "react";
import { fontFamilyOptions } from "../../utils/constants";
import "./FontFamilyOptions.css";

function FontFamilyOptions({ setFontFamily, selectedOption, setSelectedOption }) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const optionsList = [
    fontFamilyOptions.arial,
    fontFamilyOptions.impact,
    fontFamilyOptions.verdana,
    fontFamilyOptions.comicSans,
    fontFamilyOptions.timesNewRoman,
    fontFamilyOptions.courier,
    fontFamilyOptions.calibri
  ];

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const setSelectedThenCloseDropdown = (index) => {
    setSelectedOption(index);
    setIsOptionsOpen(false);
  };

  const handleKeyDown = (index) => (e) => {
    switch (e.key) {
      case " ":
      case "SpaceBar":
      case "Enter":
        e.preventDefault();
        setSelectedThenCloseDropdown(index);
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (e) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOptionsOpen(false);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedOption(
          selectedOption - 1 >= 0 ? selectedOption - 1 : optionsList.length - 1
        );
        break;
      case "ArrowDown":
        e.preventDefault();
        setSelectedOption(
          selectedOption == optionsList.length - 1 ? 0 : selectedOption + 1
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setFontFamily(optionsList[selectedOption]);
  }, [selectedOption, setFontFamily]);

  return (
      <div className="font-family">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOptionsOpen}
          className={`font-family__button ${isOptionsOpen ? "font-family__button_expanded" : ""}`}
          onClick={toggleOptions}
          onKeyDown={handleListKeyDown}
        >
          {optionsList[selectedOption]}
        </button>
        <ul
          className={`font-family__options ${isOptionsOpen ? "font-family__options_show" : ""}`}
          role="listbox"
          aria-activedescendant={optionsList[selectedOption]}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {optionsList.map((option, index) => (
            <li
              className="font-family__option"
              id={option}
              role="option"
              aria-selected={selectedOption == index}
              tabIndex={0}
              onKeyDown={handleKeyDown(index)}
              onClick={() => {
                setSelectedThenCloseDropdown(index);
              }}
            >
              {option.toLowerCase()}
            </li>
          ))}
        </ul>
      </div>
  );
};

export default FontFamilyOptions;
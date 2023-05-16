import React, { useEffect } from "react";
import { optionsList } from "../../utils/constants";
import "./FontFamilyOptions.css";

function FontFamilyOptions({
  textValues,
  setTextValues,
  isOptionsOpen,
  setIsOptionsOpen,
}) {

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const setSelectedThenCloseDropdown = (index) => {
    setTextValues({ ...textValues, selectedOption: index});
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
        setTextValues({
          ...textValues,
          selectedOption: textValues.selectedOption - 1 >= 0 ? (textValues.selectedOption - 1) : (optionsList.length - 1)});
        break;
      case "ArrowDown":
        e.preventDefault();
        setTextValues({
          ...textValues,
          selectedOption: textValues.selectedOption === (optionsList.length - 1) ? 0 : (textValues.selectedOption + 1)});
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setTextValues({ ...textValues, fontFamily: optionsList[textValues.selectedOption]});
  }, [textValues, setTextValues]);

  return (
      <div className="font-family">
        <button
          id="smallWindow"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOptionsOpen}
          className={`font-family__button ${isOptionsOpen ? "font-family__button_expanded" : ""}`}
          onClick={toggleOptions}
          onKeyDown={handleListKeyDown}
        >
          {optionsList[textValues.selectedOption]}
        </button>
        <ul
          className={`font-family__options ${isOptionsOpen ? "font-family__options_show" : ""}`}
          role="listbox"
          aria-activedescendant={optionsList[textValues.selectedOption]}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {optionsList.map((option, index) => (
            <li
              className="font-family__option"
              id={option}
              role="option"
              aria-selected={textValues.selectedOption == index}
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
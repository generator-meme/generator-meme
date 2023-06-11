import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Panel.css";
import Palette from "../Palette/Palette";
import OpacityPanel from "../OpacityPanel/OpacityPanel.jsx";
import FontFamilyOptions from "../FontFamilyOptions/FontFamilyOptions";
import { hexToRgb, updateTextValues } from "../../utils/textPanelFunctions.js";

function Panel({ textValues, setTextValues }) {
  const form = useRef();

  const [isOpenTextColor, setIsOpenTextColor] = useState(false);
  const [isOpenStrokeColor, setIsOpenStrokeColor] = useState(false);
  const [isOpenBackgroundColor, setIsOpenBackgroundColor] = useState(false);
  const [isOpenOpacity, setIsOpenOpacity] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false); // для выбора fontFamily

  const extraWindow = useRef();

  const increaseSize = (e) => {
    e.preventDefault();
    setTextValues({ ...textValues, fontSize: textValues.fontSize + 1 });
  };

  const decreaseSize = (e) => {
    e.preventDefault();
    setTextValues({ ...textValues, fontSize: textValues.fontSize - 1 });
  };

  const openTextColor = (e) => {
    e.preventDefault();
    if (!isOpenTextColor) {
      setIsOpenTextColor(true);
      setIsOpenStrokeColor(false);
      setIsOpenBackgroundColor(false);
      setIsOpenOpacity(false);
    } else {
      setIsOpenTextColor(false);
    }
  };

  const openStrokeColor = (e) => {
    e.preventDefault();
    if (!isOpenStrokeColor) {
      setIsOpenStrokeColor(true);
      setIsOpenBackgroundColor(false);
      setIsOpenTextColor(false);
      setIsOpenOpacity(false);
    } else {
      setIsOpenStrokeColor(false);
    }
  };

  const toggleOpacityPanel = (e) => {
    e.preventDefault();
    if (!isOpenOpacity) {
      setIsOpenOpacity(true);
      setIsOpenStrokeColor(false);
      setIsOpenTextColor(false);
      setIsOpenBackgroundColor(false);
    } else if (e.target.classList.contains("panel__button_opacity")) {
      setIsOpenOpacity(false);
    }
  };

  const openBackgroundColor = (e) => {
    e.preventDefault();
    if (!isOpenBackgroundColor) {
      setIsOpenBackgroundColor(true);
      setIsOpenStrokeColor(false);
      setIsOpenTextColor(false);
      setIsOpenOpacity(false);
    } else {
      setIsOpenBackgroundColor(false);
    }
  };

  const closeAllSmallWindows = () => {
    setIsOpenTextColor(false);
    setIsOpenStrokeColor(false);
    setIsOpenBackgroundColor(false);
    setIsOpenOpacity(false);
    setIsOptionsOpen(false);
  };

  const setTextColor = (color) => {
    setTextValues({ ...textValues, fillTextColor: color });
  };

  const setStrokeTextColor = (color) => {
    setTextValues({ ...textValues, strokeTextColor: color });
  };

  const setBackColor = (color) => {
    if (color !== "transparent") {
      setTextValues({
        ...textValues,
        backColor: `rgba(${hexToRgb(color)}, ${textValues.opacity})`,
      });
    } else {
      setTextValues({ ...textValues, backColor: color });
    }
  };

  const resetForm = (e) => {
    e.preventDefault();
    updateTextValues(setTextValues, textValues, false);
    form.current.reset();
  };

  useEffect(() => {
    if (
      isOpenTextColor ||
      isOpenStrokeColor ||
      isOpenBackgroundColor ||
      isOpenOpacity ||
      isOptionsOpen
    ) {
      function closeExtraWindows(event) {
        if (!event.target.closest("#smallWindow")) {
          closeAllSmallWindows();
        }
      }
      document.addEventListener("click", closeExtraWindows);

      return () => {
        document.removeEventListener("click", closeExtraWindows);
      };
    }
  }, [
    isOpenTextColor,
    isOpenStrokeColor,
    isOpenBackgroundColor,
    isOpenOpacity,
    isOptionsOpen,
    extraWindow,
  ]);

  return (
    <form ref={form} className="panel" noValidate>
      <fieldset className="panel__section">
        <FontFamilyOptions
          textValues={textValues}
          setTextValues={setTextValues}
          isOptionsOpen={isOptionsOpen}
          setIsOptionsOpen={setIsOptionsOpen}
        />
        <button
          className="panel__button panel__button_type_in-size"
          onClick={(e) => increaseSize(e)}
        />
        <button
          className="panel__button panel__button_type_dec-size"
          onClick={(e) => decreaseSize(e)}
        />
      </fieldset>
      <fieldset className="panel__section">
        <label className="panel__container">
          <input
            checked={textValues.fontWeight}
            type="checkbox"
            className="panel__invisible-input"
            onChange={(e) =>
              setTextValues({
                ...textValues,
                fontWeight: !textValues.fontWeight,
              })
            }
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_bold"></span>
        </label>
        <label className="panel__container">
          <input
            checked={textValues.fontStyle}
            type="checkbox"
            className="panel__invisible-input"
            onChange={(e) =>
              setTextValues({ ...textValues, fontStyle: !textValues.fontStyle })
            }
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_italic"></span>
        </label>
        <label className="panel__container">
          <input
            checked={textValues.underline}
            type="checkbox"
            className="panel__invisible-input"
            onChange={(e) =>
              setTextValues({ ...textValues, underline: !textValues.underline })
            }
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_underline"></span>
        </label>
        <label className="panel__container">
          <input
            checked={textValues.lineThrough}
            type="checkbox"
            className="panel__invisible-input"
            onChange={(e) =>
              setTextValues({
                ...textValues,
                lineThrough: !textValues.lineThrough,
              })
            }
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_line-through"></span>
        </label>
      </fieldset>
      <fieldset className="panel__section">
        <button
          id="smallWindow"
          className={`panel__button panel___button_type_color panel___button_type_text-color ${
            isOpenTextColor ? "panel__button_type_pressed" : ""
          }`}
          onClick={(e) => openTextColor(e)}
        >
          {isOpenTextColor && (
            <Palette
              selectedColor={setTextColor}
              closePalette={closeAllSmallWindows}
            />
          )}
        </button>
        <button
          id="smallWindow"
          className={`panel__button panel___button_type_color panel___button_type_stroke-color ${
            isOpenStrokeColor ? "panel__button_type_pressed" : ""
          }`}
          onClick={(e) => openStrokeColor(e)}
        >
          {isOpenStrokeColor && (
            <Palette
              selectedColor={setStrokeTextColor}
              closePalette={closeAllSmallWindows}
            />
          )}
        </button>
        <button
          id="smallWindow"
          className={`panel__button panel___button_type_color panel___button_type_back-color ${
            isOpenBackgroundColor ? "panel__button_type_pressed" : ""
          }`}
          onClick={(e) => openBackgroundColor(e)}
        >
          {isOpenBackgroundColor && (
            <Palette
              selectedColor={setBackColor}
              closePalette={closeAllSmallWindows}
            />
          )}
        </button>
        <button
          id="smallWindow"
          className={`panel__button panel___button_type_opacity ${
            isOpenOpacity ? "panel__button_type_pressed" : ""
          }`}
          onClick={(e) => toggleOpacityPanel(e)}
        >
          {isOpenOpacity && (
            <OpacityPanel
              textValues={textValues}
              setTextValues={setTextValues}
            />
          )}
        </button>
      </fieldset>
      <fieldset className="panel__section">
        <label className="panel__container">
          <input
            checked={textValues.fontPosition === "start" ? true : false}
            type="radio"
            className="panel__invisible-input"
            onChange={(e) =>
              setTextValues({ ...textValues, fontPosition: "start" })
            }
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_start"></span>
        </label>
        <label className="panel__container">
          <input
            checked={textValues.fontPosition === "center" ? true : false}
            type="radio"
            className="panel__invisible-input"
            onChange={(e) =>
              setTextValues({ ...textValues, fontPosition: "center" })
            }
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_center"></span>
        </label>
        <label className="panel__container">
          <input
            checked={textValues.fontPosition === "end" ? true : false}
            type="radio"
            className="panel__invisible-input"
            onChange={(e) =>
              setTextValues({ ...textValues, fontPosition: "end" })
            }
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_end"></span>
        </label>
      </fieldset>
      <button
        type="reset"
        className="panel__button panel__button_type_reset"
        onClick={(e) => resetForm(e)}
      ></button>
      <span className="panel__btn-reset-message">сбросить форматирование</span>
    </form>
  );
}

export default Panel;

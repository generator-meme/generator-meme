import React, { useEffect, useState, useRef } from "react";
import "./Panel.css";
import sizePlus from "../../images/icons/font-size+.svg";
import sizeMinus from "../../images/icons/font-size-.svg";
import textColor from "../../images/icons/text-color.svg";
import strokeColor from "../../images/icons/stroke-color.svg";
import backgroundColor from "../../images/icons/background-color.svg";
import opacityImg from "../../images/icons/opacity.svg";
import reset from "../../images/icons/reset.svg";
import Palette from "../Palette/Palette";
import OpacityPanel from "../OpacityPanel/OpacityPanel.jsx";
import { fontFamilyOptions } from "../../utils/constants";
import FontFamilyOptions from "../FontFamilyOptions/FontFamilyOptions";

function Panel ({
    fontSize,
    setFontSize,
    setFontBold,
    setFontItalic,
    setFontUnderline,
    setFontLineThrough,
    boldChecked,
    italicChecked,
    underlineChecked,
    lineThroughChecked,
    textPosition,
    setFontPosition,
    setFontFamily,
    setTextColor,
    setStrokeTextColor,
    setBackColor,
    setOpacity
  }) {

  const form = useRef();

  const [isOpenTextColor, setIsOpenTextColor] = useState(false);
  const [isOpenStrokeColor, setIsOpenStrokeColor] = useState(false);
  const [isOpenBackgroundColor, setIsOpenBackgroundColor] = useState(false);
  const [isOpenOpacity, setIsOpenOpacity] = useState(false);
  const [opacityLevel, setOpacityLevel] = useState(100);
  // для выбора fontFamily
  const [selectedOption, setSelectedOption] = useState(0);

  const extraWindow = useRef();

  const increaseSize = (e) => {
    e.preventDefault();
    setFontSize(fontSize + 1);
  };

  const decreaseSize = (e) => {
    e.preventDefault();
    setFontSize(fontSize - 1);
  };

  const changeFontWeight = (e) => {
    e.preventDefault();
    if (boldChecked === "normal") {
        setFontBold("bold")
    } else {
        setFontBold("normal")
    };
  };

    const changeFontStyle = (e) => {
    e.preventDefault();
    if (italicChecked === "normal") {
        setFontItalic("italic")
    } else {
        setFontItalic("normal")
    };
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

  const changeTextColor = (color) => {
    console.log(color, 'changeTextColor');
    setTextColor(color);
    setStrokeTextColor(null);
  };

  const toggleOpacityPanel = (e) => {
    e.preventDefault();
    if (!isOpenOpacity) {
      setIsOpenOpacity(true);
      setIsOpenStrokeColor(false);
      setIsOpenTextColor(false);
      setIsOpenBackgroundColor(false);
    } else if(e.target.classList.contains("panel__button_opacity")){
       setIsOpenOpacity(false);
      }
  }

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
  };
  
  const resetForm = (e) => {
    e.preventDefault();
    setFontSize(40);
    setFontBold('normal');
    setFontItalic('normal');
    setFontUnderline(false);
    setFontLineThrough(false);
    setFontPosition('center');
    setFontFamily(fontFamilyOptions.arial);
    setSelectedOption(0);
    setTextColor('black');
    setStrokeTextColor(null);
    setBackColor('transparent');
    setOpacity(1);
    setOpacityLevel(100);
    form.current.reset();
  };

  useEffect(() => {
    if (isOpenTextColor || isOpenStrokeColor || isOpenBackgroundColor || isOpenOpacity) {
      function closeExtraWindows(event) {
        if (!event.target.closest("#smallWindow")) {
          closeAllSmallWindows();
        }
      };
      document.addEventListener('click', closeExtraWindows);

      return () => {
        document.removeEventListener('click', closeExtraWindows)
      }
    }
  }, [isOpenTextColor, isOpenStrokeColor, isOpenBackgroundColor,isOpenOpacity, extraWindow]);

  return (
    <form ref={form} className="panel" noValidate>
      <fieldset className="panel__section panel__section_type_1">
        <FontFamilyOptions
          setFontFamily={setFontFamily}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
        <button className="panel__button" onClick={e => increaseSize(e)}>
          <img src={sizePlus} alt="Увеличить шрифт." />
        </button>
        <button className="panel__button" onClick={e => decreaseSize(e)}>
          <img src={sizeMinus} alt="Уменьшить шрифт." />
        </button>
      </fieldset>
      <fieldset className="panel__section panel__section_type_2">
        <label className="panel__container">
          <input
            checked={(boldChecked === "bold")? true : false}
            type="checkbox"
            className="panel__invisible-input"
            onChange={e => changeFontWeight(e)}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_bold">
          </span>
        </label>
         <label className="panel__container">
          <input
            checked={(italicChecked === "italic")? true : false}
            type="checkbox"
            className="panel__invisible-input"
            onChange={e => changeFontStyle(e)}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_italic">
          </span>
        </label>
         <label className="panel__container">
          <input
            checked={underlineChecked}
            type="checkbox"
            className="panel__invisible-input"
            onChange={e => setFontUnderline(!underlineChecked)}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_underline">
          </span>
        </label>
         <label className="panel__container">
          <input
            checked={lineThroughChecked}
            type="checkbox"
            className="panel__invisible-input"
            onChange={e => setFontLineThrough(!lineThroughChecked)}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_line-through">
          </span>
        </label>
      </fieldset>
      <fieldset className="panel__section panel__section_type_3">
        <button id="smallWindow" className="panel__button panel___buttom_type_color" onClick={e => openTextColor(e)}>
          <img src={textColor} alt="Цвет текста." />
          <span className={`panel__choose-color panel__choose-color_type_text ${isOpenTextColor? "panel__choose-color_visible": "" }`}>
            <Palette selectedColor={changeTextColor} closePalette={closeAllSmallWindows} />
          </span>
        </button>
        <button id="smallWindow" className="panel__button panel___buttom_type_color" onClick={e => openStrokeColor(e)}>
          <img src={strokeColor} alt="Цвет контура." />
          <span className={`panel__choose-color ${isOpenStrokeColor? "panel__choose-color_visible": "" }`}>
            <Palette selectedColor={setStrokeTextColor} closePalette={closeAllSmallWindows} />
          </span>
        </button>
        <button id="smallWindow" className="panel__button panel___buttom_type_color" onClick={e => openBackgroundColor(e)}>
          <img src={backgroundColor} alt="Цвет заливки." />
          <span className={`panel__choose-color ${isOpenBackgroundColor? "panel__choose-color_visible": "" }`}>
            <Palette selectedColor={setBackColor} closePalette={closeAllSmallWindows} />
          </span>
        </button>
        <button  id="smallWindow" className="panel__button panel__button_opacity" onClick={e => toggleOpacityPanel(e)}>
          <img className="panel__button_opacity" src={opacityImg} alt="Прозрачность." />
          <span className={`panel__opacity ${isOpenOpacity? "panel__opacity_visible": "" }`}>
            <OpacityPanel setOpacity={setOpacity} opacityLevel={opacityLevel} setOpacityLevel={setOpacityLevel} closePalette={closeAllSmallWindows} />
          </span>
        </button>
      </fieldset>
      <fieldset className="panel__section panel__section_type_4">
        <label className="panel__container">
          <input
            checked={(textPosition === "start")? true : false}
            type="radio"
            className="panel__invisible-input"
            onChange={e => setFontPosition('start')}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_start">
          </span>
        </label>
        <label className="panel__container">
          <input
            checked={(textPosition === "center")? true : false}
            type="radio"
            className="panel__invisible-input"
            onChange={e => setFontPosition('center')}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_center">
          </span>
        </label>
        <label className="panel__container">
          <input
            checked={(textPosition === "end")? true : false}
            type="radio"
            className="panel__invisible-input"
            onChange={e => setFontPosition('end')}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_end">
          </span>
        </label>
      </fieldset>
      <button type="reset" className="panel__button panel__btn-reset" onClick={e => resetForm(e)}>
          <img src={reset} alt="Сбросить." />
      </button>
      <span className="panel__btn-reset-message">сбросить форматирование</span>
    </form>
  )
};

export default Panel;
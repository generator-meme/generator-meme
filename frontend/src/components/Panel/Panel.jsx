import React, { useState } from "react";
import "./Panel.css";
import fontFamily from "../../images/icons/font-family.svg";
import sizePlus from "../../images/icons/font-size+.svg";
import sizeMinus from "../../images/icons/font-size-.svg";
import textColor from "../../images/icons/text-color.svg";
import strokeColor from "../../images/icons/stroke-color.svg";
import backgroundColor from "../../images/icons/background-color.svg";
import opacity from "../../images/icons/opacity.svg";
import reset from "../../images/icons/reset.svg";

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
  }) {

  const [areOpenFonts, setAreOpenFonts] = useState(false);
  const [isOpenTextColor, setisOpenTextColor] = useState(false);
  const [isOpenStrokeColor, setIsOpenStrokeColor] = useState(false);
  const [isOpenBackgroundColor, setIsOpenBackgroundColore] = useState(false);
  const [isOpenOpacity, setIsOpenOpacity] = useState(false);

  const increaseSize = (size, setFontFunction) => {
    setFontFunction(size + 1);
  };

  const decreaseSize = (size, setFontFunction) => {
    setFontFunction(size - 1);
  };

  const openFonts = () => {
    setAreOpenFonts(true);
  };

  return (
    <form className="panel" noValidate>
      <fieldset className="panel__section panel__section_type_1">
        <button className="panel__button" onClick={openFonts}>
          <img src={fontFamily} alt="Шрифты." />
        </button>
        <button className="panel__button" onClick={e => increaseSize(fontSize, setFontSize)}>
          <img src={sizePlus} alt="Увеличить шрифт." />
        </button>
        <button className="panel__button" onClick={e => decreaseSize(fontSize, setFontSize)}>
          <img src={sizeMinus} alt="Уменьшить шрифт." />
        </button>
      </fieldset>
      <fieldset className="panel__section panel__section_type_2">
        <label className="panel__container">
          <input
            checked={boldChecked}
            type="checkbox"
            className="panel__invisible-input"
            onChange={e => setFontBold(!boldChecked)}
          ></input>
          <span className="panel__pseudo-input panel__pseudo-input_type_bold">
          </span>
        </label>
         <label className="panel__container">
          <input
            checked={italicChecked}
            type="checkbox"
            className="panel__invisible-input"
            onChange={e => setFontItalic(!italicChecked)}
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
        <button className="panel__button" onClick={e=> setisOpenTextColor(true)}>
          <img src={textColor} alt="Цвет текста." />
        </button>
        <button className="panel__button" onClick={e => setIsOpenStrokeColor(true)}>
          <img src={strokeColor} alt="Цвет контура." />
        </button>
        <button className="panel__button" onClick={e => setIsOpenBackgroundColore(true)}>
          <img src={backgroundColor} alt="Цвет заливки." />
        </button>
        <button className="panel__button" onClick={e => setIsOpenOpacity(true)}>
          <img src={opacity} alt="Прозрачность." />
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
      <button className="panel__button panel__btn-reset">
          <img src={reset} alt="Сбросить." />
          <span className="panel__btn-reset-message">сбросить форматирование</span>
      </button>
      {/* <select>
        <option onClick={e => setTopFontFamily('Comic Sans MS')}>Comic Sans MS</option>
        <option onClick={e => setTopFontFamily('Arial')}>Arial</option>
        <option onClick={e => setTopFontFamily('Serif')}>Serif</option>
      </select> */}
    </form>
  )
};

export default Panel;
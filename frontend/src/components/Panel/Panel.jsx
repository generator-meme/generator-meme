import React, { useEffect, useState, useRef } from "react";
import "./Panel.css";
import fontFamily from "../../images/icons/font-family.svg";
import sizePlus from "../../images/icons/font-size+.svg";
import sizeMinus from "../../images/icons/font-size-.svg";
import textColor from "../../images/icons/text-color.svg";
import strokeColor from "../../images/icons/stroke-color.svg";
import backgroundColor from "../../images/icons/background-color.svg";
import opacity from "../../images/icons/opacity.svg";
import reset from "../../images/icons/reset.svg";
import Palette from "../Palette/Palette";

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
    setBackColor
  }) {

//   const [areOpenFonts, setAreOpenFonts] = useState(false);
  const [isOpenTextColor, setIsOpenTextColor] = useState(false);
  const [isOpenStrokeColor, setIsOpenStrokeColor] = useState(false);
  const [isOpenBackgroundColor, setIsOpenBackgroundColor] = useState(false);
  const [isOpenOpacity, setIsOpenOpacity] = useState(false);

  const extraWindow = useRef();

  const increaseSize = (e) => {
    e.preventDefault();
    setFontSize(fontSize + 1);
  };

  const decreaseSize = (e) => {
    e.preventDefault();
    setFontSize(fontSize - 1);
  };

//   const openFonts = () => {
//     setAreOpenFonts(true);
//   };

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
    setIsOpenTextColor(true);
  };

    const openStrokeColor = (e) => {
    e.preventDefault();
    setIsOpenStrokeColor(true);
  };

  const changeTextColor = (color) => {
    setTextColor(color);
    setStrokeTextColor(null);
  };

  const openBackgroundColor = (e) => {
    e.preventDefault();
    setIsOpenBackgroundColor(true);
  };

  const resetForm = (e) => {
    e.preventDefault();
  };

  const closeAllPalettes = () => {
    setIsOpenTextColor(false);
    setIsOpenStrokeColor(false);
    setIsOpenBackgroundColor(false);
    setIsOpenOpacity(false);
  };

  // попытка повесить слушатели для закрытия мелких околон
  // useEffect(() => {
  //   function closeExtraWindows(event) {
  //     event.preventDefault();
  //     console.log('функ')
  //     if(event.target !== extraWindow.current) {
  //       closeAllPalettes();
  //       console.log("усл")
  //     }
  //   };
    
  //   if (isOpenTextColor || isOpenStrokeColor || isOpenBackgroundColor || isOpenOpacity) {
  //     window.addEventListener('click', closeExtraWindows);
  //   };

  //   return (
  //     window.removeEventListener('click', closeExtraWindows)
  //   )
  // }, [isOpenTextColor, isOpenStrokeColor, isOpenBackgroundColor, isOpenOpacity, extraWindow]);

  return (
    <form className="panel" noValidate>
      <fieldset className="panel__section panel__section_type_1">
        <select className="panel__selector">
          <option onClick={e => setFontFamily('Comic Sans MS')}>Comic Sans MS</option>
          <option onClick={e => setFontFamily('Arial')}>Arial</option>
          <option onClick={e => setFontFamily('Serif')}>Serif</option>
        </select>
        {/* <button className="panel__button" onClick={openFonts}>
          <img src={fontFamily} alt="Шрифты." />
        </button> */}
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
        <button className="panel__button panel___buttom_type_color" onClick={e => openTextColor(e)}>
          <img src={textColor} alt="Цвет текста." />
          <span className={`panel__choose-color ${isOpenTextColor? "panel__choose-color_visible": "" }`}>
            <Palette ref={extraWindow} selectedColor={changeTextColor} closePalette={closeAllPalettes} />
          </span>
        </button>
        <button className="panel__button panel___buttom_type_color" onClick={e => openStrokeColor(e)}>
          <img src={strokeColor} alt="Цвет контура." />
          <span className={`panel__choose-color ${isOpenStrokeColor? "panel__choose-color_visible": "" }`}>
            <Palette ref={extraWindow} selectedColor={setStrokeTextColor} closePalette={closeAllPalettes} />
          </span>
        </button>
        <button className="panel__button panel___buttom_type_color" onClick={e => openBackgroundColor(e)}>
          <img src={backgroundColor} alt="Цвет заливки." />
          <span className={`panel__choose-color ${isOpenBackgroundColor? "panel__choose-color_visible": "" }`}>
            <Palette ref={extraWindow} selectedColor={setBackColor} closePalette={closeAllPalettes} />
          </span>
        </button>
        <button className="panel__button" onClick={e => e.preventDefault()}>
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
      <button className="panel__button panel__btn-reset" onClick={e => resetForm(e)}>
          <img src={reset} alt="Сбросить." />
      </button>
      <span className="panel__btn-reset-message">сбросить форматирование</span>
    </form>
  )
};

export default Panel;
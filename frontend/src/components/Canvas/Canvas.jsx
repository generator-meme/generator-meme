import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from "../Navigation/Navigation";
import './Canvas.css'
import Panel from '../Panel/Panel';
import { fontFamilyOptions } from '../../utils/constants';
import {
  contain,
  marginX,
  addLineToText,
  addTextBackground,
  lineHeight,
  wrapText,
  changeOpacity,
  changeBackColor
} from "../../utils/functionsForCanvas.js";

const Canvas = ({ currentMeme, handleCreateNewMeme, setIsNewMeme, isNewMeme }) => {
  const navigate = useNavigate();

  const image = useMemo(() => {
    const img = new Image();
    if (currentMeme) {
      img.src = currentMeme.image;
    } else {
      img.src = JSON.parse(localStorage.getItem("currentMeme")).image;
    }
    return img;
  }, [currentMeme]);

  const canvas = useRef()

  const [topText, setTopText] = useState('')
  const [topFontSize, setTopFontSize] = useState(40)
  const [topFontFamily, setTopFontFamily] = useState(fontFamilyOptions.roboto)
  const [topSelectedOption, setTopSelectedOption] = useState(0);
  const [topFontPosition, setTopFontPosition] = useState('center')
  const [topFontWeight, setTopFontWeight] = useState(false)
  const [topFontStyle, setTopFontStyle] = useState(false)
  const [topFillTextColor, setTopFillTextColor] = useState('black');
  const [topStrokeTextColor, setTopStrokeTextColor] = useState('transparent');
  const [topUnderline, setTopUnderline] = useState(false);
  const [topLineThrough, setTopLineThrough] = useState(false);
  const [topBackColor, setTopBackColor] = useState('transparent');
  const [topOpacity, setTopOpacity] = useState(1);
  const [topOpacityLevel, setTopOpacityLevel] = useState(100);

  const [bottomText, setBottomText] = useState('')
  const [bottomFontSize, setBottomFontSize] = useState(40)
  const [bottomFontFamily, setBottomFontFamily] = useState(fontFamilyOptions.roboto);
  const [bottomSelectedOption, setBottomSelectedOption] = useState(0);
  const [bottomFontPosition, setBottomFontPosition] = useState('center')
  const [bottomFontWeight, setBottomFontWeight] = useState(false)
  const [bottomFontStyle, setBottomFontStyle] = useState(false)
  const [bottomFillTextColor, setBottomFillTextColor] = useState('black');
  const [bottomStrokeTextColor, setbottomStrokeTextColor] = useState('transparent');
  const [bottomUnderline, setBottomUnderline] = useState(false);
  const [bottomLineThrough, setBottomLineThrough] = useState(false);
  const [bottomBackColor, setBottomBackColor] = useState('transparent');
  const [bottomOpacity, setBottomOpacity] = useState(1);
  const [bottomOpacityLevel, setBottomOpacityLevel] = useState(100);

  const [firstPanelIsOpen, setFirstPanelIsOpen] = useState(false);
  const [secondPanelIsOpen, setSecondPanelIsOpen] = useState(false);

  const createMeme = () => {
    const id = currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id;
    handleCreateNewMeme(canvas.current.toDataURL(), id)
      .finally(()=> {
        navigate('/saved')
      });
  };

  // изменение цвета и прозрачности сверху
  const changeTopBackColor = (color) => {
    changeBackColor(color, setTopBackColor, topOpacity);
  }

  const changeTopOpacity = (opacity) => {
    changeOpacity(opacity, setTopOpacity, topBackColor, setTopBackColor);
  };

  // изменение цвета и прозрачности снизу
  const changeBottomBackColor = (color) => {
    changeBackColor(color, setBottomBackColor, bottomOpacity);
  };

  const changeBottomOpacity = (opacity) => {
    changeOpacity(opacity, setBottomOpacity, bottomBackColor, setBottomBackColor);
  };
  
  // открытие/закрытие панелей
  const openMyPanel = (e, setMyPanelIsOpen, setOtherPanelIsOpen) => {
    e.preventDefault();
    setMyPanelIsOpen(true);
    setOtherPanelIsOpen(false);
  }

  useEffect(() => {
    const ctx = canvas.current.getContext('2d') // создание canvas с картинкой на фоне
    const {
      offsetX, 
      offsetY, 
      width, 
      height
    } = contain(canvas.current.width, canvas.current.height, image.naturalWidth, image.naturalHeight); // масштабирование шаблона в рамки канваса
    ctx.drawImage(image, offsetX, offsetY, width, height);

    ctx.miterLimit = 2; // настройка выступа контура для strokeText
    ctx.lineJoin = 'round'; // настройка сглаживания контура для strokeText
    const textMarginX = 30; // значение бокового отступа текста
    const textWidth = width - textMarginX * 2; // значение ширины, где текст отображается
    const textMarginYTop = 50;
    const textMarginYBottom = 20;

    // вычисление границ для текста
    const lineTop = offsetY + textMarginYTop;
    const lineBottom = canvas.current.height - offsetY - textMarginYBottom;

    // нижний текст основные характеристики
    ctx.font = `${bottomFontStyle ? "italic" : ""} ${bottomFontWeight ? "bold" : ""} ${bottomFontSize}px ${bottomFontFamily}`;
    ctx.textAlign = bottomFontPosition;
    
    const bottomMarginX = marginX(canvas.current, bottomFontPosition, offsetX, textMarginX); // вычисление отступа по оси X в зависимости от расположения текста
    const bottomTextWrap = wrapText(ctx, bottomText, textWidth); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок
    
    // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    bottomTextWrap.split('\n').reverse().forEach(function (t, i) {
      if (t[t.length - 1] === " ") { // если последний символ - пробел (не поставленный пользователем) - убрать его из строки (важно, чтобы не было подчеркивания или выделения пустоты)
        t = t.slice(0, t.length - 1);
      };

      const bottomMarginY = canvas.current.height - offsetY - i * (lineHeight(bottomFontSize)) - textMarginYBottom; // вычисление отступа по оси Y для каждой строчки текста
      
      if (bottomMarginY < lineTop || bottomMarginY > lineBottom) { // ограничение видимости нижних заливки и контура до верхнего края
        ctx.fillStyle = "transparent"
        ctx.strokeStyle = "transparent";
        
      } else {
        ctx.fillStyle = bottomBackColor;
        ctx.strokeStyle = bottomStrokeTextColor;
      };

      addTextBackground(ctx, t, bottomMarginX, bottomMarginY, lineHeight(bottomFontSize)); // добавление заливки (default - transparent)
      
      if (bottomMarginY < lineTop || bottomMarginY > lineBottom) { // ограничение видимости нижнего текста до верхнего края
        ctx.fillStyle = "transparent"
      } else {
        ctx.fillStyle = bottomFillTextColor; // переключение цвета с заливки на текст
      };
      
      ctx.lineWidth = 7; // увеличение ширины линии для адекватного контура текста
      ctx.strokeText(t, bottomMarginX, bottomMarginY); // добавление контура
      ctx.lineWidth = 1; // возвращение ширины линии до стандарта (для подчеркивания и зачеркивания)
      
      ctx.fillText(t, bottomMarginX, bottomMarginY, textWidth); // добавление текста построчно
      
      if (bottomUnderline) {
        addLineToText(ctx, t, bottomMarginX, (bottomMarginY + 0.125 * bottomFontSize), bottomFontSize); // отрисовка подчеркивания
      };
      
      if(bottomLineThrough) {
        addLineToText(ctx, t, bottomMarginX, (bottomMarginY - bottomFontSize / 4), bottomFontSize); // отрисовка зачеркивания
      };
    });

    // верхний текст основные характеристики
    ctx.font = `${topFontStyle ? "italic" : ""} ${topFontWeight ? "bold" : ""} ${topFontSize}px ${topFontFamily}`;
    ctx.textAlign = topFontPosition;
    
    const topMarginX = marginX(canvas.current, topFontPosition, offsetX, textMarginX); // вычисление отступа по оси X в зависимости от расположения текста
    const topTextWrap = wrapText(ctx, topText, textWidth); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок

    // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    topTextWrap.split('\n').forEach(function (t, i) {
      if (t[t.length - 1] === " ") { // если последний символ - пробел (не поставленный пользователем) - убрать его из строки (важно, чтобы не было подчеркивания или выделения пустоты)
        t = t.slice(0, t.length - 1);
      };

      const topMarginY = offsetY + i * (lineHeight(topFontSize)) + textMarginYTop ; // вычисление отступа по оси Y для каждой строчки текста

      if (topMarginY > lineBottom || topMarginY < lineTop) { // ограничение видимости верхних заливки и контура до нижнего края
        ctx.fillStyle = "transparent"
        ctx.strokeStyle = "transparent";
        
      } else {
        ctx.fillStyle = topBackColor;
        ctx.strokeStyle = topStrokeTextColor;
      };

      addTextBackground(ctx, t, topMarginX, topMarginY, lineHeight(topFontSize)); // добавление заливки (default - transparent), выше, чтобы было за текстом
      
      if (topMarginY > lineBottom || topMarginY < lineTop) { // ограничение видимости верхнего текста до нижнего края
        ctx.fillStyle = "transparent"
      } else {
        ctx.fillStyle = topFillTextColor; // переключение цвета с заливки на текст
      };

      ctx.lineWidth = 7; // увеличение ширины линии для адекватного контура текста
      ctx.strokeText(t, topMarginX, topMarginY); // добавление контура
      ctx.lineWidth = 1; // возвращение ширины линии до стандарта (для подчеркивания и зачеркивания)
      
      ctx.fillText(t, topMarginX, topMarginY, textWidth); // добавление текста построчно

      if (topUnderline) {
        addLineToText(ctx, t, topMarginX, (topMarginY + 0.125 * topFontSize), topFontSize); // отрисовка подчеркивания
      };

      if (topLineThrough) {
        addLineToText(ctx, t, topMarginX, (topMarginY - topFontSize / 4), topFontSize); // отрисовка зачеркивания
      };
    });

  }, [
    image,
    bottomText,
    bottomFontSize,
    bottomFontStyle,
    bottomFontWeight,
    bottomFontFamily,
    bottomFontPosition,
    bottomStrokeTextColor,
    bottomFillTextColor,
    bottomUnderline,
    bottomLineThrough,
    bottomBackColor,
    topText,
    topFontSize,
    topFontStyle,
    topFontWeight,
    topFontFamily,
    topFontPosition,
    topFillTextColor,
    topStrokeTextColor,
    topUnderline,
    topLineThrough,
    topBackColor,
  ]);

  const top = useMemo(() => {
    return {
      text: topText,
      fontSize: topFontSize,
      fontFamily: topFontFamily,
      fontPosition: topFontPosition,
      fontWeight: topFontWeight,
      fontStyle: topFontStyle,
      fillTextColor: topFillTextColor,
      strokeTextColor: topStrokeTextColor,
      underline: topUnderline,
      lineThrough: topLineThrough,
      backColor: topBackColor,
      opacity: topOpacity,
      selectedOption: topSelectedOption,
      opacityLevel: topOpacityLevel
    }
  }, [topText,
      topFontSize,
      topFontFamily,
      topFontPosition,
      topFontWeight,
      topFontStyle,
      topFillTextColor,
      topStrokeTextColor,
      topUnderline,
      topLineThrough,
      topBackColor,
      topOpacity,
      topSelectedOption,
      topOpacityLevel
  ]);

  const bottom = useMemo(() => {
    return {
      text: bottomText,
      fontSize: bottomFontSize,
      fontFamily: bottomFontFamily,
      fontPosition: bottomFontPosition,
      fontWeight: bottomFontWeight,
      fontStyle: bottomFontStyle,
      fillTextColor: bottomFillTextColor,
      strokeTextColor: bottomStrokeTextColor,
      underline: bottomUnderline,
      lineThrough: bottomLineThrough,
      backColor: bottomBackColor,
      opacity: bottomOpacity,
      selectedOption: bottomSelectedOption,
      opacityLevel: bottomOpacityLevel
    }
  }, [bottomText,
      bottomFontSize,
      bottomFontFamily,
      bottomFontPosition,
      bottomFontWeight,
      bottomFontStyle,
      bottomFillTextColor,
      bottomStrokeTextColor,
      bottomUnderline,
      bottomLineThrough,
      bottomBackColor,
      bottomOpacity,
      bottomSelectedOption,
      bottomOpacityLevel
  ]);

  const putValues = useCallback((
      values,
      setText,
      setFontSize,
      setFontFamily,
      setFontPosition,
      setFontBold,
      setFontItalic,
      setFillTextColor,
      setStrokeTextColor,
      setUnderline,
      setLineThrough,
      setOpacity,
      setBackColor,
      setSelectedOption,
      setOpacityLevel
    ) => {
    setText(values.text);
    setFontSize(values.fontSize);
    setFontFamily(values.fontFamily);
    setFontPosition(values.fontPosition);
    setFontBold(values.fontWeight);
    setFontItalic(values.fontStyle);
    setFillTextColor(values.fillTextColor);
    setStrokeTextColor(values.strokeTextColor);
    setUnderline(values.underline);
    setLineThrough(values.lineThrough);
    setOpacity(values.opacity);
    setBackColor(values.backColor);
    setSelectedOption(values.selectedOption);
    setOpacityLevel(values.opacityLevel)
  }, []);

  useEffect(()=> {
    setIsNewMeme(false);
    
    if (!isNewMeme && localStorage.getItem("topText") !== null) {
      const topText = JSON.parse(localStorage.getItem("topText"));
      putValues(topText, setTopText, setTopFontSize, setTopFontFamily, setTopFontPosition, setTopFontWeight, setTopFontStyle, setTopFillTextColor, setTopStrokeTextColor, setTopUnderline, setTopLineThrough, setTopOpacity, setTopBackColor, setTopSelectedOption, setTopOpacityLevel);
    };

    if (!isNewMeme && localStorage.getItem("bottomText") !== null) {
      const bottomText = JSON.parse(localStorage.getItem("bottomText"));
      putValues(bottomText, setBottomText, setBottomFontSize, setBottomFontFamily, setBottomFontPosition, setBottomFontWeight, setBottomFontStyle, setBottomFillTextColor, setbottomStrokeTextColor, setBottomUnderline, setBottomLineThrough, setBottomOpacity, setBottomBackColor, setBottomSelectedOption, setBottomOpacityLevel);
    };
    
  }, []);

  useEffect(() => {
    localStorage.setItem("topText", JSON.stringify(top));
  }, [top]);

  useEffect(() => {
    localStorage.setItem("bottomText", JSON.stringify(bottom));
  }, [bottom]);

  return (
    <main className='main-editor'>
      <Navigation isSavedMeme={false} id={currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id} />
      <section className="editor" aria-label="Editor">
        {firstPanelIsOpen && (
          <div className="editor__panel_type_top">
            <Panel
              fontSize={topFontSize}
              setFontSize={setTopFontSize}
              setFontBold={setTopFontWeight}
              setFontItalic={setTopFontStyle}
              setFontUnderline={setTopUnderline}
              setFontLineThrough={setTopLineThrough}
              boldChecked={topFontWeight}
              italicChecked={topFontStyle}
              underlineChecked={topUnderline}
              lineThroughChecked={topLineThrough}
              textPosition={topFontPosition}
              setFontPosition={setTopFontPosition}
              setFontFamily={setTopFontFamily}
              setTextColor={setTopFillTextColor}
              setStrokeTextColor={setTopStrokeTextColor}
              setBackColor={changeTopBackColor}
              setOpacity={changeTopOpacity}
              selectedOption={topSelectedOption}
              setSelectedOption={setTopSelectedOption}
              opacityLevel={topOpacityLevel}
              setOpacityLevel={setTopOpacityLevel}
            />
        </div>
        )}
        {secondPanelIsOpen && (
          <div className="editor__panel_type_bottom">
            <Panel
              fontSize={bottomFontSize}
              setFontSize={setBottomFontSize}
              setFontBold={setBottomFontWeight}
              setFontItalic={setBottomFontStyle}
              setFontUnderline={setBottomUnderline}
              setFontLineThrough={setBottomLineThrough}
              boldChecked={bottomFontWeight}
              italicChecked={bottomFontStyle}
              underlineChecked={bottomUnderline}
              lineThroughChecked={bottomLineThrough}
              textPosition={bottomFontPosition}
              setFontPosition={setBottomFontPosition}
              setFontFamily={setBottomFontFamily}
              setTextColor={setBottomFillTextColor}
              setStrokeTextColor={setbottomStrokeTextColor}
              setBackColor={changeBottomBackColor}
              setOpacity={changeBottomOpacity}
              selectedOption={bottomSelectedOption}
              setSelectedOption={setBottomSelectedOption}
              opacityLevel={bottomOpacityLevel}
              setOpacityLevel={setBottomOpacityLevel}
            />
        </div>
        )}
        <canvas
            className="editor__image"
            ref={canvas}
            width={675}
            height={556}
        >
        </canvas>
        <div className="editor__box">
          <form className="editor__text-form">
              <textarea
                className="editor__text"
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Текст сверху"
                onClick={e => openMyPanel(e, setFirstPanelIsOpen, setSecondPanelIsOpen)}
              />
              <textarea
                className="editor__text"
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Текст снизу"
                onClick={e => openMyPanel(e, setSecondPanelIsOpen, setFirstPanelIsOpen)}
              />
          </form>
          <button onClick={createMeme} className="btn editor__btn">сгенерить мем</button>
        </div>
      </section>
    </main>
  )
}

export default Canvas
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from "../Navigation/Navigation";
import './Canvas.css'
import { contain } from "../../utils/fit.js";
import Panel from '../Panel/Panel';
import { fontFamilyOptions } from '../../utils/constants';
import { hexToRgb } from '../../utils/hexToRgb';


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
  const [topFontFamily, setTopFontFamily] = useState(fontFamilyOptions.arial)
  const [topFontPosition, setTopFontPosition] = useState('center')
  const [topFontWeight, setTopFontWeight] = useState(false)
  const [topFontStyle, setTopFontStyle] = useState(false)
  const [topFillTextColor, setTopFillTextColor] = useState('black');
  const [topStrokeTextColor, setTopStrokeTextColor] = useState('transparent');
  const [topUnderline, setTopUnderline] = useState(false);
  const [topLineThrough, setTopLineThrough] = useState(false);
  const [topBackColor, setTopBackColor] = useState('transparent');
  const [topOpacity, setTopOpacity] = useState(1);

  const [bottomText, setBottomText] = useState('')
  const [bottomFontSize, setBottomFontSize] = useState(40)
  const [bottomFontFamily, setBottomFontFamily] = useState(fontFamilyOptions.arial)
  const [bottomFontPosition, setBottomFontPosition] = useState('center')
  const [bottomFontWeight, setBottomFontWeight] = useState(false)
  const [bottomFontStyle, setBottomFontStyle] = useState(false)
  const [bottomFillTextColor, setBottomFillTextColor] = useState('black');
  const [bottomStrokeTextColor, setbottomStrokeTextColor] = useState('transparent');
  const [bottomUnderline, setBottomUnderline] = useState(false);
  const [bottomLineThrough, setBottomLineThrough] = useState(false);
  const [bottomBackColor, setBottomBackColor] = useState('transparent');
  const [bottomOpacity, setBottomOpacity] = useState(1);

  const [firstPanelIsOpen, setFirstPanelIsOpen] = useState(false);
  const [secondPanelIsOpen, setSecondPanelIsOpen] = useState(false);

  function createMeme () {
    const id = currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id;
    handleCreateNewMeme(canvas.current.toDataURL(), id)
      .finally(()=> {
        navigate('/saved')
      });
  };

  // изменение цвета и прозрачности сверху
  function changeTopBackColor(color){
    if(color !== "transparent"){
      setTopBackColor(`rgba(${hexToRgb(color)}, ${topOpacity})`);
      return;
    }
    setTopBackColor(color);
    return;
  }

  function changeTopOpacity(opacity) {
    // регулярное выражение которое возвращает все между последней запятой и последней скобкой включительно
    const regExpFromLastCommaToLastRoundBracket = /\,(?=[^,]*$)([\s\S]+?)\)(?=[^)]*$)/g;
    setTopOpacity(opacity);
    if (topBackColor !== "transparent") {
      // меняем значение opacity (последнее значение в rgba)
      let replacedColor = topBackColor.replace(regExpFromLastCommaToLastRoundBracket, `,${opacity})`);
      setTopBackColor(replacedColor);
      return;
    }
    return;
  }
  // изменение цвета и прозрачности снизу
  function changeBottomBackColor(color){
    if(color !== "transparent"){
      setBottomBackColor(`rgba(${hexToRgb(color)}, ${bottomOpacity})`);
      return;
    }
    setBottomBackColor(color);
    return;
  ;}

  function changeBottomOpacity(opacity) {
    // регулярное выражение которое возвращает все между последней запятой и последней скобкой включительно
    const regExpFromLastCommaToLastRoundBracket = /\,(?=[^,]*$)([\s\S]+?)\)(?=[^)]*$)/g;
    setBottomOpacity(opacity);
    if (bottomBackColor !== "transparent") {
      // меняем значение opacity (последнее значение в rgba)
      let replacedColor = bottomBackColor.replace(regExpFromLastCommaToLastRoundBracket, `,${opacity})`);
      setBottomBackColor(replacedColor);
      return;
    }
    return;
  };
  
  const openMyPanel = (e, setMyPanelIsOpen, setOtherPanelIsOpen) => {
    e.preventDefault();
    setMyPanelIsOpen(true);
    setOtherPanelIsOpen(false);
  }

  // коллбэк-расчет координаты по оси X текста
  const marginX = useCallback((fontPosition, offsetX, textMargin) => {
    if(fontPosition === "start") {
      return textMargin + offsetX;
    } else if (fontPosition === "end") {
      return canvas.current.width - offsetX - textMargin;
    } else {
      return canvas.current.width / 2;
    }
  }, []);

  // отрисовка подчеркивания или зачеркивания
  const addLineToText = useCallback((ctx, text, x, y, fontSize) => {
    let metrics = ctx.measureText(text); // вычисление метрик текста (нас интересует ширина)
    
    switch (ctx.textAlign) { // вычисление начальной координаты OX 
      case "center":
        x -= (metrics.width / 2);
        break;
      case "end":
        x -= metrics.width;
        break;
      default:
        x += 0;
    }
    // рисование линии
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle; // цвет линии - цвет шрифта
    ctx.lineWidth = Math.ceil(fontSize * 0.05); // вычисление ширины линии в зависимости от размера шрифта
    ctx.moveTo(x, y);
    ctx.lineTo(x + metrics.width, y);
    ctx.stroke();
    ctx.restore();
  }, []);
  
  // отрисовка заливки фона текста
  const addTextBackground = useCallback((ctx, text, x, y, lineHeight) => {
    let metrics = ctx.measureText(text); // вычисление метрик текста (нас интересует ширина)
    
    switch (ctx.textAlign) { // вычисление начальной координаты OX
      case "center":
        x -= (metrics.width / 2 + 5);
        break;
      case "end":
        x -= (metrics.width + 5);
        break;
      default:
        x -= 5;
    }
    
    y -= (0.78125 * lineHeight); // вычисление начальной коодинаты OY

    if (metrics.width > 0) {
    ctx.fillRect(x, y, (metrics.width + 10), (1.1 * lineHeight));
    };
  }, []);

  const lineHeight = (fontSize) => {
    return fontSize * 1.12;
  };

  const wrapText = useCallback((ctx, text, maxWidth) => {
    // First, start by splitting all of our text into words, but splitting it into an array split by spaces
    let words = text.split(' ');
    let line = ''; // This will store the text of the current line
    let testLine = ''; // This will store the text when we add a word, to test if it's too long
    let lineArray = []; // This is an array of lines, which the function will return

    // Lets iterate over each word
    for(var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
            // Then the line is finished, add to line '\n' and push the current line into "lineArray"
            line += "\n";
            lineArray.push(line);
            // Update line and test line to use this word as the first word on the next line
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            // If the test line is still less than the max width, then add the word to the current line
            line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if (n === words.length - 1) {
            lineArray.push(line);
        }
    }
    // Return the new string
    return lineArray.join("");
  }, []);

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
    ctx.font = `${bottomFontStyle ? "italic" : "normal"} ${bottomFontWeight ? "bold" : "normal"} ${bottomFontSize}px ${bottomFontFamily}`;
    ctx.textAlign = bottomFontPosition;
    
    const bottomMarginX = marginX(bottomFontPosition, offsetX, textMarginX); // вычисление отступа по оси X в зависимости от расположения текста
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
    ctx.font = `${topFontStyle ? "italic" : "normal"} ${topFontWeight ? "bold" : "normal"} ${topFontSize}px ${topFontFamily}`;
    ctx.textAlign = topFontPosition;
    
    const topMarginX = marginX(topFontPosition, offsetX, textMarginX); // вычисление отступа по оси X в зависимости от расположения текста
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
    marginX,
    addLineToText,
    addTextBackground,
    wrapText,
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
      opacity: topOpacity
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
      topOpacity
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
      opacity: bottomOpacity
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
      bottomOpacity
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
      setBackColor
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
  }, []);

  useEffect(()=> {
    setIsNewMeme(false);
   
    if (!isNewMeme && localStorage.getItem("topText") !== null) {
      const topText = JSON.parse(localStorage.getItem("topText"));
      putValues(topText, setTopText, setTopFontSize, setTopFontFamily, setTopFontPosition, setTopFontWeight, setTopFontStyle, setTopFillTextColor, setTopStrokeTextColor, setTopUnderline, setTopLineThrough, setTopOpacity, setTopBackColor)
    };

    if (!isNewMeme && localStorage.getItem("bottomText") !== null) {
      const bottomText = JSON.parse(localStorage.getItem("bottomText"));
      putValues(bottomText, setBottomText, setBottomFontSize, setBottomFontFamily, setBottomFontPosition, setBottomFontWeight, setBottomFontStyle, setBottomFillTextColor, setbottomStrokeTextColor, setBottomUnderline, setBottomLineThrough, setBottomOpacity, setBottomBackColor)
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
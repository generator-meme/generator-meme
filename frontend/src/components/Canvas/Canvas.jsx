import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from "../Navigation/Navigation";
import './Canvas.css'
import { contain } from "../../utils/fit.js";
import Panel from '../Panel/Panel';
import { fontFamilyOptions } from '../../utils/constants';

const Canvas = ({ currentMeme, handleCreateNewMeme }) => {
  const navigate = useNavigate();

  const image = useMemo(() => {
    const img = new Image();
    img.src = currentMeme.image;
    return img;
  }, [currentMeme]);

  const canvas = useRef()

  const [topText, setTopText] = useState('')
  const [topFontSize, setTopFontSize] = useState(40)
  const [topFontFamily, setTopFontFamily] = useState(fontFamilyOptions.arial)
  const [topFontPosition, setTopFontPosition] = useState('center')
  const [topFontWeight, setTopFontWeight] = useState('normal')
  const [topFontStyle, setTopFontStyle] = useState('normal')
  const [topFillTextColor, setTopFillTextColor] = useState('black');
  const [topStrokeTextColor, setTopStrokeTextColor] = useState(null);
  const [topUnderline, setTopUnderline] = useState(false);
  const [topLineThrough, setTopLineThrough] = useState(false);
  const [topBackColor, setTopBackColor] = useState('transparent');
  const [topOpacity, setTopOpacity] = useState(1);

  const topStrokeText = useMemo(() => {
    if (topStrokeTextColor) {
      return true;
    };
     return false;
  }, [topStrokeTextColor]);

  const [bottomText, setBottomText] = useState('')
  const [bottomFontSize, setBottomFontSize] = useState(40)
  const [bottomFontFamily, setBottomFontFamily] = useState(fontFamilyOptions.arial)
  const [bottomFontPosition, setBottomFontPosition] = useState('center')
  const [bottomFontWeight, setBottomFontWeight] = useState('normal')
  const [bottomFontStyle, setBottomFontStyle] = useState('normal')
  const [bottomFillTextColor, setBottomFillTextColor] = useState('black');
  const [bottomStrokeTextColor, setbottomStrokeTextColor] = useState(null);
  const [bottomUnderline, setBottomUnderline] = useState(false);
  const [bottomLineThrough, setBottomLineThrough] = useState(false);
  const [bottomBackColor, setBottomBackColor] = useState('transparent');
  const [bottomOpacity, setBottomOpacity] = useState(1);

  const [firstPanelIsOpen, setFirstPanelIsOpen] = useState(false);
  const [secondPanelIsOpen, setSecondPanelIsOpen] = useState(false);

  const bottomStrokeText = useMemo(() => {
    if (bottomStrokeTextColor) {
      return true;
    };
     return false;
  }, [bottomStrokeTextColor]);

  function createMeme () {
    handleCreateNewMeme(canvas.current.toDataURL(), currentMeme.id)
      .finally(()=> {
        navigate('/saved')
      });
  };
  // изменение цвета и прозрачности сверху
  function changeTopBackColor(color){
    if(color !== "transparent"){
      setTopBackColor(`rgba(${color}, ${topOpacity})`);
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
      setBottomBackColor(`rgba(${color}, ${bottomOpacity})`);
      return;
    }
    setBottomBackColor(color);
    return;
    
  }
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
  }
  const openMyPanel = (e, setMyPanelIsOpen, setOtherPanelIsOpen) => {
    e.preventDefault();
    setMyPanelIsOpen(true);
    setOtherPanelIsOpen(false);
  }

  // коллбэк-расчет координаты по оси X текста
  const marginX = useCallback((fontPosition, offsetX) => {
    if(fontPosition === "start") {
      return 30 + offsetX;
    } else if (fontPosition === "end") {
      return canvas.current.width - offsetX - 30;
    } else {
      return canvas.current.width / 2;
    }
  }, []);

  // отрисовка подчеркивания или зачеркивания
  const addLineToText = useCallback((ctx, text, x, y, fontSize) => {
    // вычисление метрик текста (нас интересует ширина)
    let metrics = ctx.measureText(text);
    // вычисление начальной координаты OX
    switch (ctx.textAlign) {
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
    ctx.save()
    ctx.beginPath()
    // цвет линии - цвет шрифта
    ctx.strokeStyle = ctx.fillStyle
    // вычисление ширины линии в зависимости от размера шрифта
    ctx.lineWidth = Math.ceil(fontSize * 0.05)
    ctx.moveTo(x, y)
    ctx.lineTo(x + metrics.width, y)
    ctx.stroke()
    ctx.restore()
  }, []);
  
  // отрисовка заливки фона текста
  const addTextBackground = useCallback((ctx, text, x, y, fontSize, color) => {
    
    // вычисление метрик текста (нас интересует ширина)
    let metrics = ctx.measureText(text);
    // вычисление начальной координаты OX
    switch (ctx.textAlign) {
      case "center":
        x -= (metrics.width / 2 + 5);
        break;
      case "end":
        x -= (metrics.width + 5);
        break;
      default:
        x -= 5;
    }
    
    y -= (fontSize - 5);

    ctx.fillStyle = color;
    if (metrics.width > 0) {
    ctx.fillRect(x, y, (metrics.width + 10), (fontSize + 8));
    };
  }, []);

  useEffect(() => {
    // создание canvas с картинкой на фоне
    const ctx = canvas.current.getContext('2d')
    // масштабирование шаблона в рамки
    const {
      offsetX, 
      offsetY, 
      width, 
      height
    } = contain(canvas.current.width, canvas.current.height, image.naturalWidth, image.naturalHeight);
    ctx.drawImage(image, offsetX, offsetY, width, height);

    // нижний текст основные характеристики
    ctx.font = `${bottomFontStyle} ${bottomFontWeight} ${bottomFontSize}px ${bottomFontFamily}`;
    // ctx.fillStyle = bottomFillTextColor; - лишняя строка, тк ниже настройка меняется, пока закомментировала
    ctx.strokeStyle = bottomStrokeTextColor;
    ctx.textAlign = bottomFontPosition;
    // вычисление отступа по оси X в зависимости от расположения текста
    const bottonMarginX = marginX(bottomFontPosition, offsetX);

    // добавление текста с возмоностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    bottomText.split('\n').reverse().forEach(function (t, i) {
      // вычисление отступа по оси Y для каждой строчки текста
      const bottonMarginY = canvas.current.height - offsetY - i * (bottomFontSize + 5) - 20;

      // добавление заливки (default - transparent), выше, чтобы было за текстом
      addTextBackground(ctx, t, bottonMarginX, bottonMarginY, bottomFontSize, bottomBackColor);

      // переключение цвета для текста
      ctx.fillStyle = bottomFillTextColor;
      // добавление текста построчно (обычный или контурный)
      if (bottomStrokeText) {
        ctx.strokeText(t, bottonMarginX, bottonMarginY, image.width);
      } else {
        ctx.fillText(t, bottonMarginX, bottonMarginY, image.width);
      };
      // отрисовка подчеркивания
      if (bottomUnderline) {
        addLineToText(ctx, t, bottonMarginX, (bottonMarginY + 5), bottomFontSize);
      };
      // отрисовка зачеркивания
      if(bottomLineThrough) {
        addLineToText(ctx, t, bottonMarginX, (bottonMarginY - bottomFontSize / 4), bottomFontSize);
      };
    });

    // верхний текст основные характеристики
    ctx.font = `${topFontStyle} ${topFontWeight} ${topFontSize}px ${topFontFamily}`;
    // ctx.fillStyle = topFillTextColor; - лишняя строка, тк ниже настройка меняется, пока закомментировала
    ctx.strokeStyle = topStrokeTextColor;
    ctx.textAlign = topFontPosition;
    // вычисление отступа по оси X в зависимости от расположения текста
    const topMarginX = marginX(topFontPosition, offsetX);
     // добавление текста с возмоностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    topText.split('\n').forEach(function (t, i) {
      // вычисление отступа по оси Y для каждой строчки текста
      const topMarginY = offsetY + 50 + i * (topFontSize + 5);

      // добавление заливки (default - transparent), выше, чтобы было за текстом
      addTextBackground(ctx, t, topMarginX, topMarginY, topFontSize, topBackColor);

      // переключение цвета для текста
      ctx.fillStyle = topFillTextColor;

      // добавление текста построчно (обычный или контур)
      if (topStrokeText) {
        ctx.strokeText(t, topMarginX, topMarginY, image.width);
      } else {
        ctx.fillText(t, topMarginX, topMarginY, image.width);
      };
      // отрисовка подчеркивания
      if (topUnderline) {
        addLineToText(ctx, t, topMarginX, (topMarginY + 5), topFontSize);
      };
      // отрисовка зачеркивания
      if (topLineThrough) {
        addLineToText(ctx, t, topMarginX, (topMarginY - topFontSize / 4), topFontSize);
      };
    });

  }, [image,
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
    bottomStrokeText,
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
    topStrokeText,
    topBackColor,
    marginX,
    addLineToText,
    addTextBackground,
  ])

  return (
    <main className='main-editor'>
      <Navigation isSavedMeme={false} id={currentMeme.id} />
      <section className="editor" aria-label="Editor">
        <div className={`editor__panel_type_top ${firstPanelIsOpen? "editor__panel_typr_open" : "" }`}>
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
        <div className={`editor__panel_type_bottom ${secondPanelIsOpen? "editor__panel_typr_open": ""}`}>
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
        <canvas
            className="editor__image"
            ref={canvas}
            width={538}
            height={558}
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
          <button onClick={createMeme} className="editor__btn btn">сгенерить мем</button>
        </div>
      </section>
    </main>
  )
}

export default Canvas
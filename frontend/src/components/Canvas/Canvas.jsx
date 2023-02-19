import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from "../Navigation/Navigation";
import textLeft from '../../images/icons/align-left.png'
import textRight from '../../images/icons/align-right.png'
import textCenter from '../../images/icons/align-center.png'
import textBold from '../../images/icons/bold.png'
import textItalic from '../../images/icons/italic.png'
import './Canvas.css'
import { contain } from "../../utils/fit.js";

const Canvas = ({ currentMeme, handleCreateNewMeme }) => {
  const navigate = useNavigate();

  const image = useMemo(() => {
    const img = new Image();
    img.src = currentMeme.image;
    return img;
  }, [currentMeme]);

  const canvas = useRef()

  const [topText, setTopText] = useState('')
  const [topFontSize, setTopFontSize] = useState(50)
  const [topFontFamily, setTopFontFamily] = useState('Comic Sans MS')
  const [topFontPosition, setTopFontPosition] = useState('center')
  const [topFontWeight, setTopFontWeight] = useState('normal')
  const [topFontStyle, setTopFontStyle] = useState('normal')
  const [topFillTextColor, setTopFillTextColor] = useState('black');
  const [topStrokeTextColor, setTopStrokeTextColor] = useState('black');
  const [topUnderline, setTopUnderline] = useState(false);
  const [topLineThrough, setTopLineThrough] = useState(false);
  const [topStrokeText, setTopStrokeText] = useState(false);
  const [topBackColor, setTopBackColor] = useState('transparent');

  const [bottomText, setBottomText] = useState('')
  const [bottomFontSize, setBottomFontSize] = useState(50)
  const [bottomFontFamily, setBottomFontFamily] = useState('Comic Sans MS')
  const [bottomFontPosition, setBottomFontPosition] = useState('center')
  const [bottomFontWeight, setBottomFontWeight] = useState('normal')
  const [bottomFontStyle, setBottomFontStyle] = useState('normal')
  const [bottomFillTextColor, setBottomFillTextColor] = useState('black');
  const [bottomStrokeTextColor, setbottomStrokeTextColor] = useState('black');
  const [bottomUnderline, setBottomUnderline] = useState(false);
  const [bottomLineThrough, setBottomLineThrough] = useState(false);
  const [bottomStrokeText, setBottomStrokeText] = useState(false);
  const [bottomBackColor, setBottomBackColor] = useState('transparent');

  function changeFontSize (size, setFontFunction) {
    setFontFunction(size);
  }

  function increaseSize (size, setFontFunction) {
    setFontFunction(size + 1);
  }

  function decreaseSize (size, setFontFunction) {
    setFontFunction(size - 1);
  }

  function createMeme () {
    handleCreateNewMeme(canvas.current.toDataURL(), currentMeme.id)
      .finally(()=> {
        navigate('/saved')
      });
  };

  // коллбэк-расчет координаты по оси X текста
  const marginX = useCallback((fontPosition) => {
    if(fontPosition === "start") {
      return 30;
    } else if (fontPosition === "end") {
      return image.width - 30;
    } else {
      return image.width / 2;
    }
  }, [image.width]);

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
    ctx.fillRect(x, y, (metrics.width + 10), (fontSize + 10));
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
    } = contain(538, 558, image.naturalWidth, image.naturalHeight);
    ctx.drawImage(image, offsetX, offsetY, width, height);

    // нижний текст основные характеристики
    ctx.font = `${bottomFontStyle} ${bottomFontWeight} ${bottomFontSize}px ${bottomFontFamily}`;
    // ctx.fillStyle = bottomFillTextColor; - лишняя строка, тк ниже настройка меняется, пока закомментировала
    ctx.strokeStyle = bottomStrokeTextColor;
    ctx.textAlign = bottomFontPosition;
    // вычисление отступа по оси X в зависимости от расположения текста
    const bottonMarginX = marginX(bottomFontPosition);

    // добавление текста с возмоностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    bottomText.split('\n').reverse().forEach(function (t, i) {
      // вычисление отступа по оси Y для каждой строчки текста
      const bottonMarginY = image.height - i * bottomFontSize - 20;

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
    const topMarginX = marginX(topFontPosition);
     // добавление текста с возмоностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    topText.split('\n').forEach(function (t, i) {
      // вычисление отступа по оси Y для каждой строчки текста
      const topMarginY = 50 + i * topFontSize;

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
        <h1 className="editor__title">Редактор мемов</h1>
        <div className="editor__boxes">
          <canvas
              className="editor__image-box"
              ref={canvas}
              width={538}
              height={558}
          >
            {/* <img ref={canvasImage} calssName="editor__image" src={currentMeme.image} alt="Текущий мем." /> */}
          </canvas>
          <div className="editor__text-box">
            <div className="editor__text-control-panel">
              <input type="color" onChange={e => setTopFillTextColor(e.target.value)} className="editor__color" />
              <input type="range" onChange={e => changeFontSize(e.target.value, setTopFontSize)} min="10" max="72" defaultValue="50" step="1"/>
              <button onClick={e => increaseSize(topFontSize, setTopFontSize)} className="icon-size">A+</button>
              <button onClick={e => decreaseSize(topFontSize, setTopFontSize)} className="icon-size">A-</button>
              <button onClick={e => setTopFontPosition('start')}>
                <img src={textLeft} alt="Текст слева" className="icon" />
              </button>
              <button onClick={e => setTopFontPosition('center')}>
                <img src={textCenter} alt="Текст по середине" className="icon" />
              </button>
              <button onClick={e => setTopFontPosition('end')}>
                <img src={textRight} alt="Текст справа" className="icon" />
              </button>
              <button onClick={e => setTopFontWeight('bold')}>
                <img src={textBold} alt="Жирный текст" className="icon" />
              </button>
              <button onClick={e => setTopFontStyle('italic')}>
                <img src={textItalic} alt="Курсивный текст" className="icon" />
              </button>
              <select>
                <option onClick={e => setTopFontFamily('Comic Sans MS')}>Comic Sans MS</option>
                <option onClick={e => setTopFontFamily('Arial')}>Arial</option>
                <option onClick={e => setTopFontFamily('Serif')}>Serif</option>
              </select>
            </div>
            <textarea
              className="editor__text"
              type="text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
              placeholder="Текст сверху"
              width={image.width}
            />
            <div className="editor__text-control-panel">
              <input type="color" onChange={e => setBottomFillTextColor(e.target.value)} className="editor__color" />
              <input type="range" onChange={e => changeFontSize(e.target.value, setBottomFontSize)} min="10" max="72" defaultValue="50" step="1"/>
              <button onClick={e => increaseSize(bottomFontSize, setBottomFontSize)} className="icon-size">A+</button>
              <button onClick={e => decreaseSize(bottomFontSize, setBottomFontSize)} className="icon-size">A-</button>
              <button onClick={e => setBottomFontPosition('start')}>
                <img src={textLeft} alt="Текст слева" className="icon" />
              </button>
              <button onClick={e => setBottomFontPosition('center')}>
                <img src={textCenter} alt="Текст по середине" className="icon" />
              </button>
              <button onClick={e => setBottomFontPosition('end')}>
                 <img src={textRight} alt="Текст справа" className="icon" />
               </button>
               <button onClick={e => setBottomFontWeight('bold')}>
                 <img src={textBold} alt="Жирный текст" className="icon" />
              </button>
              <button onClick={e => setBottomFontStyle('italic')}>
                <img src={textItalic} alt="Курсивный текст" className="icon" />
              </button>
              <select>
                <option onClick={e => setBottomFontFamily('Comic Sans MS')}>Comic Sans MS</option>
                <option onClick={e => setBottomFontFamily('Arial')}>Arial</option>
                <option onClick={e => setBottomFontFamily('Serif')}>Serif</option>
              </select>
            </div>
            <textarea
              className="editor__text"
              type="text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
              placeholder="Текст снизу"
            />
          </div>
        </div>
        <button onClick={createMeme} className="editor__btn btn">сгенерить мем</button>
      </section>
    </main>
  )
}

export default Canvas
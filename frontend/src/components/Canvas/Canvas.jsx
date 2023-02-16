import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from "../Navigation/Navigation";
import textLeft from '../../images/icons/align-left.png'
import textRight from '../../images/icons/align-right.png'
import textCenter from '../../images/icons/align-center.png'
import textBold from '../../images/icons/bold.png'
import textItalic from '../../images/icons/italic.png'
import './Canvas.css'

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
  const [topFillTextColor, setTopFillTextColor] = useState(null);
  const [topStrokeTextColor, setTopStrokeTextColor] = useState(null);
  const [topUnderline, setTopUnderline] = useState(false);
  const [topLineThrough, setTopLineThrough] = useState(false);
  const [topStrokeText, setTopStrokeText] = useState(false);

  const [bottomText, setBottomText] = useState('')
  const [bottomFontSize, setBottomFontSize] = useState(50)
  const [bottomFontFamily, setBottomFontFamily] = useState('Comic Sans MS')
  const [bottomFontPosition, setBottomFontPosition] = useState('center')
  const [bottomFontWeight, setBottomFontWeight] = useState('normal')
  const [bottomFontStyle, setBottomFontStyle] = useState('normal')
  const [bottomFillTextColor, setBottomFillTextColor] = useState(null);
  const [bottomStrokeTextColor, setbottomStrokeTextColor] = useState(null);
  const [bottomUnderline, setBottomUnderline] = useState(false);
  const [bottomLineThrough, setBottomLineThrough] = useState(false);
  const [bottomStrokeText, setBottomStrokeText] = useState(false);

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

  useEffect(() => {
    // создание canvas с картинкой на фоне
    const ctx = canvas.current.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.drawImage(image, 0, 0)

    // нижний текст основные характеристики
    ctx.font = `${bottomFontStyle} ${bottomFontWeight} ${bottomFontSize}px ${bottomFontFamily}`;
    ctx.fillStyle = bottomFillTextColor;
    ctx.strokeStyle = bottomStrokeTextColor;
    ctx.textAlign = bottomFontPosition;
    // вычисление отступа по оси X в зависимости от расположения текста
    const bottonMarginX = marginX(bottomFontPosition);
    // добавление текста с возмоностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    bottomText.split('\n').reverse().forEach(function (t, i) {
      // вычисление отступа по оси Y для каждой строчки текста
      const bottonMarginY = image.height - i * bottomFontSize - 20;
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
      }
    });

    // верхний текст основные характеристики
    ctx.font = `${topFontStyle} ${topFontWeight} ${topFontSize}px ${topFontFamily}`;
    ctx.fillStyle = topFillTextColor;
    ctx.strokeStyle = topStrokeTextColor;
    ctx.textAlign = topFontPosition;
    // вычисление отступа по оси X в зависимости от расположения текста
    const topMarginX = marginX(topFontPosition);
     // добавление текста с возмоностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    topText.split('\n').forEach(function (t, i) {
      // вычисление отступа по оси Y для каждой строчки текста
      const topMarginY = 45 + i * topFontSize;
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
    marginX,
    addLineToText,
  ])


  // СТАРЫЙ ВАРИАНТ КОДА, ЧТОБЫ СВЕРЯТЬСЯ 
  // useEffect(() => {
  //   const topFontctx = canvas.current.getContext('2d')

  //   topFontctx.font = `${topFontStyle} ${topFontWeight} ${topFontSize}px ${topFontFamily}`
  //   topFontctx.fillStyle = color
  //   topFontctx.textAlign = topFontPosition

  //   let topMarginX;
  //   if (topFontPosition === "start") {
  //     topMarginX = 30;
  //   } else if (topFontPosition === "end") {
  //     topMarginX = image.width - 30;
  //   } else {
  //     topMarginX = image.width / 2;
  //   };

  // // деление на строки, для каждой высчитывается начало текста (x, y) + задается ширина экрана
  //   topText.split('\n').forEach(function (t, i) {
  //     topFontctx.fillText(t, topMarginX, 40 + i * topFontSize, image.width);
  //   });

  // }, [image, topText, topFontSize, topFontStyle, topFontWeight, topFontFamily, topFontPosition, color])

  // useEffect(() => {
  //   const ctx = canvas.current.getContext('2d')
  //   ctx.fillStyle = 'black'
  //   ctx.drawImage(image, 0, 0)

  //   ctx.font = `${bottomFontStyle} ${bottomFontWeight} ${bottomFontSize}px ${bottomFontFamily}`
  //   ctx.fillStyle = color
  //   ctx.textAlign = bottomFontPosition
  
  //   bottomText.split('\n').reverse().forEach(function (t, i) {
  //     ctx.fillText(t, image.width / 2, image.height - i * bottomFontSize - 10, image.width);
  //   });

  // }, [image, canvas, fillStyle, bottomText, bottomFontSize])

  // useEffect(() => {
  //   const topFontctx = canvas.current.getContext('2d')
  //   topFontctx.font = `${topFontStyle} ${topFontWeight} ${topFontSize}px ${topFontFamily}`
  //   topFontctx.fillStyle = color
  //   topFontctx.textAlign = topFontPosition


  //   topText.split('\n').forEach(function (t, i) {
  //     topFontctx.fillText(t, image.width / 2,40 + i * topFontSize, image.width);
  //   });

  // }, [topText, topFontSize, bottomText, bottomFontSize, fillStyle])

  return (
    <main className='main-editor'>
      <Navigation isSavedMeme={false} id={currentMeme.id} />
      <section className="editor" aria-label="Editor">
        <h1 className="editor__title">Редактор мемов</h1>
        <div className="editor__boxes">
          <canvas
              className="editor__image-box"
              ref={canvas}
              width={image.naturalWidth}
              height={image.naturalHeight}
            />
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
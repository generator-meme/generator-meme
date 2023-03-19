import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from "../Navigation/Navigation";
import './Canvas.css'
import Panel from '../Panel/Panel';
import { fontFamilyOptions } from '../../utils/constants';
import {
  contain,
  calculateMarginX,
  wrapText,
  changeOpacity,
  changeBackColor,
  drawText
} from "../../utils/functionsForCanvas.js";

const Canvas = ({ currentMeme, handleCreateNewMeme, setIsNewMeme, isNewMeme, memes, setImageNotFoundOpen }) => {
  const navigate = useNavigate();

  const image = useMemo(() => {
    const img = new Image();
    if (currentMeme) {
      img.src = currentMeme.image;
    } else if (JSON.parse(localStorage.getItem("currentMeme")) !== null) {
      img.src = JSON.parse(localStorage.getItem("currentMeme")).image;
    };
    return img;
  }, [currentMeme]);

  const canvas = useRef()

  const [topTextValues, setTopTextValues] = useState({
    text: "",
    fontSize: 40,
    fontFamily: fontFamilyOptions.roboto,
    selectedOption: 0,
    fontPosition: "center",
    fontWeight: false,
    fontStyle: false,
    fillTextColor: "black",
    strokeTextColor: "transparent",
    underline: false,
    lineThrough: false,
    backColor: "transparent",
    opacity: 1,
    opacityLevel: 100
  });

  const [bottomTextValues, setBottomTextValues] = useState({
    text: "",
    fontSize: 40,
    fontFamily: fontFamilyOptions.roboto,
    selectedOption: 0,
    fontPosition: "center",
    fontWeight: false,
    fontStyle: false,
    fillTextColor: "black",
    strokeTextColor: "transparent",
    underline: false,
    lineThrough: false,
    backColor: "transparent",
    opacity: 1,
    opacityLevel: 100
});

  const [firstPanelIsOpen, setFirstPanelIsOpen] = useState(false);
  const [secondPanelIsOpen, setSecondPanelIsOpen] = useState(false);

  const createMeme = () => {
    let id = currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id;
    const template = memes.some((item) => {
      return item.id === id;
    });
    if (template) {
      handleCreateNewMeme(canvas.current.toDataURL(), id)
        .finally(()=> {
          navigate('/saved')
        });
    } else {
      handleCreateNewMeme(canvas.current.toDataURL())
        .finally(()=> {
          navigate('/saved')
        });
    };
  };

  // изменение цвета и прозрачности сверху
  const changeTopBackColor = (color) => {
    changeBackColor(color, setTopTextValues, topTextValues);
  }

  const changeTopOpacity = (opacity) => {
    changeOpacity(opacity, setTopTextValues, topTextValues);
  };

  // изменение цвета и прозрачности снизу
  const changeBottomBackColor = (color) => {
    changeBackColor(color, setBottomTextValues, bottomTextValues);
  };

  const changeBottomOpacity = (opacity) => {
    changeOpacity(opacity, setBottomTextValues, bottomTextValues);
  };
  
  // открытие/закрытие панелей
  const openMyPanel = (e, setMyPanelIsOpen, setOtherPanelIsOpen) => {
    e.preventDefault();
    setMyPanelIsOpen(true);
    setOtherPanelIsOpen(false);
  };

  useEffect(() => { // отрисовка канвас
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
    ctx.font = `${bottomTextValues.fontStyle ? "italic" : ""} ${bottomTextValues.fontWeight ? "bold" : ""} ${bottomTextValues.fontSize}px ${bottomTextValues.fontFamily}`;
    ctx.textAlign = bottomTextValues.fontPosition;
    
    const bottomMarginX = calculateMarginX(canvas.current, bottomTextValues.fontPosition, offsetX, textMarginX); // вычисление отступа по оси X в зависимости от расположения текста
    const bottomTextWrap = wrapText(ctx, bottomTextValues.text, textWidth); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок
    
    // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    bottomTextWrap.split('\n').reverse().forEach((t, i) => drawText(
      t,
      i,
      ctx,
      false,
      canvas.current,
      offsetY,
      textMarginYBottom,
      textMarginYTop,
      lineTop,
      lineBottom,
      bottomMarginX,
      textWidth,
      bottomTextValues
    ));

    // верхний текст основные характеристики
    ctx.font = `${topTextValues.fontStyle ? "italic" : ""} ${topTextValues.fontWeight ? "bold" : ""} ${topTextValues.fontSize}px ${topTextValues.fontFamily}`;
    ctx.textAlign = topTextValues.fontPosition;
    
    const topMarginX = calculateMarginX(canvas.current, topTextValues.fontPosition, offsetX, textMarginX); // вычисление отступа по оси X в зависимости от расположения текста
    const topTextWrap = wrapText(ctx, topTextValues.text, textWidth); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок

    // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    topTextWrap.split('\n').forEach((t, i) => drawText(
      t,
      i,
      ctx,
      true,
      canvas.current,
      offsetY,
      textMarginYBottom,
      textMarginYTop,
      lineTop,
      lineBottom,
      topMarginX,
      textWidth,
      topTextValues
    ));

  }, [image, bottomTextValues, topTextValues]);

  const handleOnBeforeUnload = (event) => {
    event.preventDefault();
    return event.returnValue = '';
  };

  useEffect(()=> {
    // изображение пользователя не сохраняется с localStorage, и при обновлении страницы его данные пропадут
    // в этом случае осуществляется переход на главную страницу с пояснением - временное решение, мб будет другое
    if (!currentMeme && localStorage.getItem("currentMeme") === null) {
      setImageNotFoundOpen(true);
      navigate("/");
      return;
    };

    setIsNewMeme(false);
    localStorage.removeItem("createdMeme");
    
    if (!isNewMeme && localStorage.getItem("topText") !== null) {
      const topText = JSON.parse(localStorage.getItem("topText"));
      setTopTextValues(topText);
    };

    if (!isNewMeme && localStorage.getItem("bottomText") !== null) {
      const bottomText = JSON.parse(localStorage.getItem("bottomText"));
      setBottomTextValues(bottomText);
    };

    // личные изображения не созраняются в localstorage,
    // если это личное изображение - навешиваем слушатель на закрытие вкладки,
    // чтобы предупредить пользователя о том, что изменения не сохранятся
    if (localStorage.getItem("currentMeme") === null) {
      window.addEventListener('beforeunload', handleOnBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleOnBeforeUnload);
      };
    };
    
  }, []);

  useEffect(() => {
    localStorage.setItem("topText", JSON.stringify(topTextValues));
  }, [topTextValues]);

  useEffect(() => {
    localStorage.setItem("bottomText", JSON.stringify(bottomTextValues));
  }, [bottomTextValues]);







  



  const canvasWrapper = useRef();
  console.log(canvasWrapper)
  const onMouseMoveCaptureHandler = () => {
    console.log("onMouseMoveCapture Event!");
  };



  const formTop = {top:0, right:0}

  return (
    <main className='main-editor'>
      <Navigation isSavedMeme={false} id={currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme"))?.id} />
      <section className="editor" aria-label="Editor">
        {firstPanelIsOpen && (
          <div className="editor__panel_type_top" onMouseMoveCapture={onMouseMoveCaptureHandler}>
            <Panel
              textValues={topTextValues}
              setTextValues={setTopTextValues}
              setBackColor={changeTopBackColor}
              setOpacity={changeTopOpacity}
            />
        </div>
        )}
        {secondPanelIsOpen && (
          <div className="editor__panel_type_bottom">
            <Panel
              textValues={bottomTextValues}
              setTextValues={setBottomTextValues}
              setBackColor={changeBottomBackColor}
              setOpacity={changeBottomOpacity}
            />
        </div>
        )}






        <div className='editor-canvas_wrapper' ref={canvasWrapper}>
        <textarea
                style={formTop}
                className="editor__text"
                type="text"
                value={topTextValues.text}
                onChange={(e) => setTopTextValues({ ...topTextValues, text: e.target.value})}
                placeholder="Текст сверху"
                onClick={e => openMyPanel(e, setFirstPanelIsOpen, setSecondPanelIsOpen)}
              />
        <canvas
            className="editor__image"
            ref={canvas}
            width={675}
            height={556}
        >
          
        </canvas>
        </div>




        <div className="editor__box">
          <form className="editor__text-form">
              
              <textarea
                className="editor__text"
                type="text"
                value={bottomTextValues.text}
                onChange={(e) => setBottomTextValues({ ...bottomTextValues, text: e.target.value})}
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
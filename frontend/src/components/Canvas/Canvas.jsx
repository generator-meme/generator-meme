import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import './Canvas.css';
import TextareaCanvas from "../TextareaCanvas/TextareaCanvas";
import EditorButtonsList from "../EditorButtonsList/EditorButtonsList";
import { fontFamilyOptions } from '../../utils/constants';
import {
  contain,
  calculateMarginX,
  wrapText,
  drawText,
} from "../../utils/functionsForCanvas.js";

const Canvas = ({
  currentMeme,
  handleCreateNewMeme,
  setIsNewMeme,
  isNewMeme,
  memes,
  setImageNotFoundOpen,
}) => {
  const canvas = useRef(null);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const imageSizes = useMemo(() => {
    if (image) {
      return contain(675, 556, image.naturalWidth, image.naturalHeight); // масштабирование шаблона в рамки канваса, подстраивание канваса под размеры масштабированной картинки
    }
    return null;
  }, [image]);

  const outsideTextHeight = 80;

  // const [outsideTopTextValues, setOutsideTopTextValues] = useState({
  //   name: "outsideTopTextValues",
  //   isOutside: true,
  //   isCurrent: false,
  //   isVisible: false,
  //   hover: false,
  //   text: "",
  //   fontSize: 40,
  //   fontFamily: fontFamilyOptions.roboto,
  //   selectedOption: 0,
  //   fontPosition: "center",
  //   fontWeight: false,
  //   fontStyle: false,
  //   fillTextColor: "black",
  //   strokeTextColor: "transparent",
  //   underline: false,
  //   lineThrough: false,
  //   backColor: "transparent",
  //   opacity: 1,
  //   opacityLevel: 100,
  //   width: imageSizes?.width - 4,
  //   maxWidth: imageSizes?.width - 4,
  //   textAreaWidth: 0,
  //   height: outsideTextHeight,
  //   top: -80,
  //   left: 0,
  //   bottom: null,
  //   canvasTop: 0,
  //   canvasLeft: 0,
  //   canvasBottom: null,
  // });

  // const [outsideBottomTextValues, setOutsideBottomTextValues] = useState({
  //   name: "outsideBottomTextValues",
  //   isOutside: true,
  //   isCurrent: false,
  //   isVisible: false,
  //   hover: false,
  //   text: "",
  //   fontSize: 40,
  //   fontFamily: fontFamilyOptions.roboto,
  //   selectedOption: 0,
  //   fontPosition: "center",
  //   fontWeight: false,
  //   fontStyle: false,
  //   fillTextColor: "black",
  //   strokeTextColor: "transparent",
  //   underline: false,
  //   lineThrough: false,
  //   backColor: "transparent",
  //   opacity: 1,
  //   opacityLevel: 100,
  //   width: imageSizes?.width - 4,
  //   maxWidth: imageSizes?.width - 4,
  //   textAreaWidth: 0,
  //   height: outsideTextHeight,
  //   top: null,
  //   left: 0,
  //   bottom: -80,
  //   canvasTop: null,
  //   canvasLeft: 0,
  //   canvasBottom: 0,
  // });

  // const [topTextValues, setTopTextValues] = useState({
  //   name: "topTextValues",
  //   isOutside: false,
  //   isCurrent: false,
  //   isVisible: true,
  //   hover: false,
  //   text: "",
  //   fontSize: 40,
  //   fontFamily: fontFamilyOptions.roboto,
  //   selectedOption: 0,
  //   fontPosition: "center",
  //   fontWeight: false,
  //   fontStyle: false,
  //   fillTextColor: "black",
  //   strokeTextColor: "transparent",
  //   underline: false,
  //   lineThrough: false,
  //   backColor: "transparent",
  //   opacity: 1,
  //   opacityLevel: 100,
  //   width: imageSizes?.width,
  //   maxWidth: imageSizes?.width,
  //   textAreaWidth: 0,
  //   height: 70,
  //   top: 0,
  //   left: 0,
  //   bottom: null,
  //   startTop: 0,
  //   startLeft: 0,
  //   isMoving: false,
  //   oldX: null,
  //   oldY: null,
  // });

  // const [bottomTextValues, setBottomTextValues] = useState({
  //   name: "bottomTextValues",
  //   isOutside: false,
  //   isCurrent: false,
  //   isVisible: true,
  //   text: "",
  //   fontSize: 40,
  //   fontFamily: fontFamilyOptions.roboto,
  //   selectedOption: 0,
  //   fontPosition: "center",
  //   fontWeight: false,
  //   fontStyle: false,
  //   fillTextColor: "black",
  //   strokeTextColor: "transparent",
  //   underline: false,
  //   lineThrough: false,
  //   backColor: "transparent",
  //   opacity: 1,
  //   opacityLevel: 100,
  //   width: imageSizes?.width,
  //   maxWidth: imageSizes?.width,
  //   height: 70,
  //   top: null,
  //   left: 0,
  //   bottom: 0,
  //   startTop: 0,
  //   startLeft: 0,
  //   isMoving: false,
  //   oldX: null,
  //   oldY: null,
  // });

  const [extraTexts, setExtraTexts] = useState([
    {
      name: "outsideTopTextValues",
      isOutside: true,
      isCurrent: false,
      isVisible: false,
      hover: false,
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
      opacityLevel: 100,
      width: imageSizes?.width - 4,
      maxWidth: imageSizes?.width - 4,
      textAreaWidth: 0,
      height: outsideTextHeight,
      top: -80,
      left: 0,
      bottom: null,
      canvasTop: 0,
      canvasLeft: 0,
      canvasBottom: null,
    },
    {
      name: "outsideBottomTextValues",
      isOutside: true,
      isCurrent: false,
      isVisible: false,
      hover: false,
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
      opacityLevel: 100,
      width: imageSizes?.width - 4,
      maxWidth: imageSizes?.width - 4,
      textAreaWidth: 0,
      height: outsideTextHeight,
      top: null,
      left: 0,
      bottom: -80,
      canvasTop: null,
      canvasLeft: 0,
      canvasBottom: 0,
    },
    {
      name: "topTextValues",
      isOutside: false,
      isCurrent: false,
      isVisible: true,
      hover: false,
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
      opacityLevel: 100,
      width: imageSizes?.width,
      maxWidth: imageSizes?.width,
      textAreaWidth: 0,
      height: 70,
      top: 0,
      left: 0,
      bottom: null,
      startTop: 0,
      startLeft: 0,
      isMoving: false,
      oldX: null,
      oldY: null,
    },
    {
      name: "bottomTextValues",
      isOutside: false,
      isCurrent: false,
      isVisible: true,
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
      opacityLevel: 100,
      width: imageSizes?.width,
      maxWidth: imageSizes?.width,
      height: 70,
      top: null,
      left: 0,
      bottom: 0,
      startTop: 0,
      startLeft: 0,
      isMoving: false,
      oldX: null,
      oldY: null,
    }
  ]);

  const canvasHeight = useMemo(() => {
    // изменение высоты canvas в зависимости от текста внутри мема или снаружи
    if (imageSizes) {
      if (extraTexts[0].isVisible && extraTexts[1].isVisible) return imageSizes.height + outsideTextHeight * 2;
      if (extraTexts[0].isVisible || extraTexts[1].isVisible) return imageSizes.height + outsideTextHeight;
      return imageSizes.height;
    }
    return null;
  }, [imageSizes, extraTexts, outsideTextHeight]);

  const createMeme = () => {
    let id =
      currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id;
    const template = memes.some((item) => {
      return item.id === id;
    });
    if (template) {
      handleCreateNewMeme(
        canvas.current.toDataURL("image/jpeg", 0.92),
        id
      ).finally(() => {
        navigate("/saved");
      });
    } else {
      handleCreateNewMeme(canvas.current.toDataURL()).finally(() => {
        navigate("/saved");
      });
    }
  };

  useEffect(() => { // отрисовка канвас
    if (!image) {
      return;
    }

    const ctx = canvas.current.getContext("2d"); // создание canvas с картинкой на фоне

    let imageInitialY = 0;
    
    if(extraTexts[0].isVisible) { // верхнее пространство для текста снаружи
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, imageSizes.width, outsideTextHeight);
      imageInitialY = outsideTextHeight;
    };
    
    ctx.drawImage(image, 0, imageInitialY, imageSizes.width, imageSizes.height); // картинка мема

    if(extraTexts[1].isVisible) { // нижнее пространство для текста снаружи
      ctx.fillStyle = "white";
      ctx.fillRect(0, extraTexts[0].isVisible? imageSizes.height + outsideTextHeight : imageSizes.height, imageSizes.width, outsideTextHeight);
    };

    ctx.miterLimit = 2; // настройка выступа контура для strokeText
    ctx.lineJoin = "round"; // настройка сглаживания контура для strokeText

    // watermark
    ctx.font = "bold 12px Inter";
    ctx.textAlign = "end";
    ctx.strokeStyle = "#737270";
    ctx.lineWidth = 2;
    ctx.strokeText("ilovememes.ru", imageSizes.width - 10, canvasHeight - 10);
    ctx.lineWidth = 1;
    ctx.fillStyle = "#EBDFDF";
    ctx.fillText("ilovememes.ru", imageSizes.width - 10, canvasHeight - 10, 86);

    const textMarginX = 30; // значение бокового отступа текста
    const textMarginYTop = 58; //50
    const textMarginYBottom = 20; //20

    // if (outsideTopTextValues.isVisible) {
    //   // const outsideTopOffsetY = outsideTopTextValues.canvasTop;
    //   // const outsideTopOffsetX = outsideTopTextValues.canvasLeft;

    //   // ctx.font = `${outsideTopTextValues.fontStyle ? "italic" : ""}
    //   //             ${outsideTopTextValues.fontWeight ? "bold" : ""}
    //   //             ${outsideTopTextValues.fontSize}px ${outsideTopTextValues.fontFamily}`;
    //   // ctx.textAlign = outsideTopTextValues.fontPosition;
  
    //   // const outsideTopMarginX = calculateMarginX(outsideTopTextValues.width, outsideTopTextValues.fontPosition, textMarginX, outsideTopOffsetX); // вычисление отступа по оси X в зависимости от расположения текста
    //   // const outsideTopTextWrap = wrapText(ctx, outsideTopTextValues.text, outsideTopTextValues.width); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок
  
    //     // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    //   outsideTopTextWrap.split('\n').forEach((t, i) => drawText(
    //     t,
    //     i,
    //     ctx,
    //     true,
    //     canvasHeight,
    //     outsideTopOffsetY,
    //     textMarginYBottom,
    //     textMarginYTop,
    //     outsideTopMarginX,
    //     outsideTopTextValues,
    //   ));
    // };

    // if (topTextValues.isVisible) { // верхний текст основные характеристики
      // const topOffsetY = topTextValues.top + (outsideTopTextValues.isVisible ? outsideTextHeight : 0);
      // const topOffsetX = topTextValues.left;

      // ctx.font = `${topTextValues.fontStyle ? "italic" : ""}
      //             ${topTextValues.fontWeight ? "bold" : ""}
      //             ${topTextValues.fontSize}px ${topTextValues.fontFamily}`;
      // ctx.textAlign = topTextValues.fontPosition;

      // const topMarginX = calculateMarginX(
      //   topTextValues.width,
      //   topTextValues.fontPosition,
      //   textMarginX,
      //   topOffsetX
      // ); // вычисление отступа по оси X в зависимости от расположения текста
      // const topTextWrap = wrapText(
      //   ctx,
      //   topTextValues.text,
      //   topTextValues.width
      // ); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок

      // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    //   topTextWrap
    //     .split("\n")
    //     .forEach((t, i) =>
    //       drawText(
    //         t,
    //         i,
    //         ctx,
    //         true,
    //         canvasHeight,
    //         topOffsetY,
    //         textMarginYBottom,
    //         textMarginYTop,
    //         topMarginX,
    //         topTextValues
    //       )
    //     );
    // }

    // if (bottomTextValues.isVisible) { // нижний текст основные характеристики
      // const bottomOffsetY = bottomTextValues.bottom + (outsideBottomTextValues.isVisible ? outsideTextHeight : 0);
      // // const bottomOffsetX = bottomTextValues.left;
      // ctx.font = `${bottomTextValues.fontStyle ? "italic" : ""}
      //             ${bottomTextValues.fontWeight ? "bold" : ""}
      //             ${bottomTextValues.fontSize}px ${
      //   bottomTextValues.fontFamily
      // }`;
      // ctx.textAlign = bottomTextValues.fontPosition;

      // const bottomMarginX = calculateMarginX(
      //   bottomTextValues.width,
      //   bottomTextValues.fontPosition,
      //   textMarginX,
      //   bottomOffsetX
      // ); // вычисление отступа по оси X в зависимости от расположения текста
      // const bottomTextWrap = wrapText(
      //   ctx,
      //   bottomTextValues.text,
      //   bottomTextValues.width
      // ); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок

      // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    //   bottomTextWrap
    //     .split("\n")
    //     .reverse()
    //     .forEach((t, i) =>
    //       drawText(
    //         t,
    //         i,
    //         ctx,
    //         false,
    //         canvasHeight,
    //         bottomOffsetY,
    //         textMarginYBottom,
    //         textMarginYTop,
    //         bottomMarginX,
    //         bottomTextValues
    //       )
    //     );
    // };

    // if (outsideBottomTextValues.isVisible) { // нижний текст основные характеристики
      // const outsideBottomOffsetY = outsideBottomTextValues.canvasBottom;
      // const outsideBottomOffsetX = outsideBottomTextValues.canvasLeft;
      // ctx.font = `${outsideBottomTextValues.fontStyle ? "italic" : ""}
      //             ${outsideBottomTextValues.fontWeight ? "bold" : ""}
      //             ${outsideBottomTextValues.fontSize}px ${outsideBottomTextValues.fontFamily}`;
      // ctx.textAlign = outsideBottomTextValues.fontPosition;
      
      // const outsideBottomMarginX = calculateMarginX(outsideBottomTextValues.width, outsideBottomTextValues.fontPosition, textMarginX, outsideBottomOffsetX); // вычисление отступа по оси X в зависимости от расположения текста
      // const outsideBottomTextWrap = wrapText(ctx, outsideBottomTextValues.text, outsideBottomTextValues.width); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок

      // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
    //   outsideBottomTextWrap.split('\n').reverse().forEach((t, i) => drawText(
    //     t,
    //     i,
    //     ctx,
    //     false,
    //     canvasHeight,
    //     outsideBottomOffsetY,
    //     textMarginYBottom,
    //     textMarginYTop,
    //     outsideBottomMarginX,
    //     outsideBottomTextValues,
    //   ));
    // };

    const getOffsetY = (element) => { // пока оставила фнукцию здесь, потом вынести из UseEffect
        if (element.isOutside) {
          if (element.canvasTop !== null) return element.canvasTop;
          if (element.canvasBottom !== null) return element.canvasBottom;
        } else {
          let pointOY;
          if (element.top !== null) pointOY = element.top;
          if (element.bottom !== null) pointOY = element.bottom;
          return pointOY + (extraTexts[0].isVisible ? outsideTextHeight : 0);
        }
    };

    extraTexts.forEach((element)=> {
      if (element.isVisible) { // дополнительный текст основные характеристики
      // const elementOffsetY = element.isOutside ? element.canvasTop : element.top + (extraTexts[0].isVisible ? outsideTextHeight : 0);
      const elementOffsetY = getOffsetY(element);
      
      const elementOffsetX = element.isOutside ? element.canvasLeft : element.left;
      console.log(elementOffsetY);
      ctx.font = `${element.fontStyle ? "italic" : ""}
                  ${element.fontWeight ? "bold" : ""}
                  ${element.fontSize}px ${element.fontFamily}`;
      ctx.textAlign = element.fontPosition;

      const elementMarginX = calculateMarginX(
        element.width,
        element.fontPosition,
        textMarginX,
        elementOffsetX
      ); // вычисление отступа по оси X в зависимости от расположения текста
      const elementTextWrap = wrapText(
        ctx,
        element.text,
        element.width
      ); // проверка текста на соответсвие длине зоны расположения текста, добавление "\n" для автоматического переноса срок

      // добавление текста с возможностью переноса строк при нажатии на enter (t - текст, i - номер строки)
      elementTextWrap
        .split("\n")
        .forEach((t, i) =>
          drawText(
            t,
            i,
            ctx,
            (element.bottom === null) ? true : false,
            canvasHeight,
            elementOffsetY,
            textMarginYBottom,
            textMarginYTop,
            elementMarginX,
            element
          )
        );
    }
    })

  }, [image, imageSizes, canvasHeight, extraTexts]);

  const handleOnBeforeUnload = (event) => {
    event.preventDefault();
    return (event.returnValue = "");
  };

  useEffect(() => {
    // изображение пользователя не сохраняется с localStorage, и при обновлении страницы его данные пропадут
    // в этом случае осуществляется переход на главную страницу с пояснением - временное решение, мб будет другое
    if (!currentMeme && localStorage.getItem("currentMeme") === null) {
      setImageNotFoundOpen(true);
      navigate("/");
      return;
    }

    setIsNewMeme(false); // true - сразу после выбора нового шаблона, данные из хранилища подгружаться не будут, false - условие для подгрузки данных из хранилища при последующей перезагрузке страницы;
    localStorage.removeItem("createdMeme");

    const img = new Image(); // создаем мзображеиние только при первом рендере, затем оно будет храниться в стейте // создаем мзображеиние только при первом рендере, затем оно будет храниться в стейте
    if (currentMeme) {
      img.src = currentMeme.image;
    } else if (JSON.parse(localStorage.getItem("currentMeme")) !== null) {
      img.src = JSON.parse(localStorage.getItem("currentMeme")).image;
    }
    img.addEventListener("load", () => {
      setImage(img);
    });

    // if (!isNewMeme && localStorage.getItem("topText") !== null) {
    //   const topText = JSON.parse(localStorage.getItem("topText"));
    //   setTopTextValues(topText);
    // }

    // if (!isNewMeme && localStorage.getItem("bottomText") !== null) {
    //   const bottomText = JSON.parse(localStorage.getItem("bottomText"));
    //   setBottomTextValues(bottomText);
    // }

    // if (!isNewMeme && localStorage.getItem("outsideTopText") !== null) {
    //   const outsideTopText = JSON.parse(localStorage.getItem("outsideTopText"));
    //   setOutsideTopTextValues(outsideTopText);
    // };

    // if (!isNewMeme && localStorage.getItem("outsideBottomText") !== null) {
    //   const outsideBottomText = JSON.parse(localStorage.getItem("outsideBottomText"));
    //   setOutsideBottomTextValues(outsideBottomText);
    // };

    // личные изображения не созраняются в localstorage,
    // если это личное изображение - навешиваем слушатель на закрытие вкладки,
    // чтобы предупредить пользователя о том, что изменения не сохранятся
    if (localStorage.getItem("currentMeme") === null) {
      window.addEventListener("beforeunload", handleOnBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleOnBeforeUnload);
      };
    };
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("topText", JSON.stringify(topTextValues));
  // }, [topTextValues]);

  // useEffect(() => {
  //   localStorage.setItem("bottomText", JSON.stringify(bottomTextValues));
  // }, [bottomTextValues]);

  // useEffect(() => {
  //   localStorage.setItem("outsideTopText", JSON.stringify(outsideTopTextValues));
  // }, [outsideTopTextValues]);

  // useEffect(() => {
  //   localStorage.setItem("outsideBottomText", JSON.stringify(outsideBottomTextValues));
  // }, [outsideBottomTextValues]);

  if (!image) {
    return null;
  }

  return (
    <main className="main-editor">
      <Navigation
        isSavedMeme={false}
        id={
          currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme"))?.id
        }
      />
      <section className="editor" aria-label="Editor">
        <div className="editor__canvas">
          <canvas
            className="editor__image"
            ref={canvas}
            width={imageSizes.width}
            height={canvasHeight}
          ></canvas>
        </div>
        <div 
          className="editor__box"
          style={{
            height: canvasHeight,
          }}
        >
          <form 
            className="editor__text-form"
            style={{
              position: "absolute",
              top: extraTexts[0].isVisible ? 81 + outsideTextHeight : 81,
              left: imageSizes.offsetX,
              height: imageSizes.height,
              width: imageSizes.width,
            }}
          >
            <fieldset
              className="editor__fieldset"
            >
              {/* <TextareaCanvas 
                textValues={outsideTopTextValues}
                imageSizes={imageSizes}
                setTextValues={setOutsideTopTextValues}
                outsideTopTextValues={outsideTopTextValues}
              />
              <TextareaCanvas 
                textValues={topTextValues}
                imageSizes={imageSizes}
                setTextValues={setTopTextValues}
                outsideTopTextValues={outsideTopTextValues}
              /> */}
              {extraTexts.map((extraText, index) => {
                return (
                  <TextareaCanvas 
                    key={index}
                    textValues={extraText}
                    imageSizes={imageSizes}
                    setTextValues={(newExtraText) => {
                      const newExtraTexts = [...extraTexts];
                      newExtraTexts[index] = newExtraText;
                      setExtraTexts(newExtraTexts)
                    }}
                    // outsideTopTextValues={extraTexts[0]}
                    outsideTopTextValues={extraTexts}
                  />
                );
              })}
              {/* <TextareaCanvas
                textValues={bottomTextValues}
                imageSizes={imageSizes}
                setTextValues={setBottomTextValues}
                outsideTopTextValues={outsideTopTextValues}
              />
              <TextareaCanvas 
                textValues={outsideBottomTextValues}
                imageSizes={imageSizes}
                setTextValues={setOutsideBottomTextValues}
                outsideTopTextValues={outsideTopTextValues}
              /> */}
            </fieldset>
          </form>
          <EditorButtonsList 
            setOutsideTopVisible={() => {
                      const newExtraTexts = [...extraTexts];
                      newExtraTexts[0].isVisible = true;
                      setExtraTexts(newExtraTexts)
                    }}
            setOutsideBottomVisible={() => {
                      const newExtraTexts = [...extraTexts];
                      newExtraTexts[1].isVisible = true;
                      setExtraTexts(newExtraTexts)
                    }}
            extraTexts={extraTexts}
            setExtraTexts={setExtraTexts}
            imageSizes={imageSizes}
          />
          <button onClick={createMeme} className="btn editor__btn_type_create-mem">сгенерить мем</button>
        </div>
      </section>
    </main>
  );
};

export default Canvas;

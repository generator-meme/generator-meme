import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import "./Canvas.css";
import TextareaCanvas from "../TextareaCanvas/TextareaCanvas";
import EditorButtonsList from "../EditorButtonsList/EditorButtonsList";
import { fontFamilyOptions } from "../../utils/constants";
import {
  calculateMarginX,
  wrapText,
  drawText,
} from "../../utils/functionsForCanvas.js";

import TextFieldset from "../TextFieldset/TextFieldset";

const Canvas = ({
  currentMeme,
  handleCreateNewMeme,
  setIsNewMeme,
  isNewMeme,
  memes,
  setImageNotFoundOpen,
  imageSizes,
  image,
}) => {
  const canvas = useRef(null);
  const navigate = useNavigate();
  const [outsideTextHeight, setOusideTextHeight] = useState(80);

  const [textsValues, setTextsValues] = useState([
    {
      name: "outsideTopTextValues",
      isOutside: true,
      isVisible: false,
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
      height: 70,
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
      isVisible: false,
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
      height: 70,
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
    },
  ]);

  const canvasHeight = useMemo(() => {
    // изменение высоты canvas в зависимости от текста внутри мема или снаружи
    if (imageSizes) {
      if (textsValues[0].isVisible && textsValues[1].isVisible)
        return imageSizes.height + outsideTextHeight * 2;
      if (textsValues[0].isVisible || textsValues[1].isVisible)
        return imageSizes.height + outsideTextHeight;
      return imageSizes.height;
    }
    return null;
  }, [imageSizes, textsValues, outsideTextHeight]);

  const createMeme = () => {
    let id =
      currentMeme?.id || JSON.parse(localStorage.getItem("currentMeme")).id;
    const template = memes.some((item) => {
      return item.id === id;
    });
    if (template) {
      console.log("it's a meme from array");
      handleCreateNewMeme(
        canvas.current.toDataURL("image/jpeg", 0.92),
        id
      ).finally(() => {
        navigate("/saved");
      });
    } else {
      console.log("it's my image");
      handleCreateNewMeme(canvas.current.toDataURL("image/jpeg", 0.92)).finally(
        () => {
          navigate("/saved");
        }
      );
    }
  };

  useEffect(() => {
    // отрисовка канвас
    if (!image) {
      return;
    }

    const ctx = canvas.current.getContext("2d"); // создание canvas с картинкой на фоне

    let imageInitialY = 0;

    if (textsValues[0].isVisible) {
      // верхнее пространство для текста снаружи
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, imageSizes.width, outsideTextHeight);
      imageInitialY = outsideTextHeight;
    }

    ctx.drawImage(image, 0, imageInitialY, imageSizes.width, imageSizes.height); // картинка мема

    if (textsValues[1].isVisible) {
      // нижнее пространство для текста снаружи
      ctx.fillStyle = "white";
      ctx.fillRect(
        0,
        textsValues[0].isVisible
          ? imageSizes.height + outsideTextHeight
          : imageSizes.height,
        imageSizes.width,
        outsideTextHeight
      );
    }

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

    const getOffsetY = (element) => {
      if (element.isOutside) {
        if (element.canvasTop !== null) return element.canvasTop;
        if (element.canvasBottom !== null) return element.canvasBottom;
      } else {
        let pointOY;
        if (element.top !== null) {
          pointOY = element.top;
          return pointOY + (textsValues[0].isVisible ? outsideTextHeight : 0);
        } else {
          pointOY = element.bottom;
          return pointOY + (textsValues[1].isVisible ? outsideTextHeight : 0);
        }
      }
    };

    textsValues.forEach((element) => {
      if (!element.isVisible) return; // текст основные характеристики
      const elementOffsetY = getOffsetY(element);

      const elementOffsetX = element.isOutside
        ? element.canvasLeft
        : element.left;

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

      let elementTextWrap;

      if (element.bottom === null) {
        elementTextWrap = wrapText(ctx, element.text, element.width).split(
          "\n"
        ); // если обычный текст - перенос строк сверху вниз
      } else {
        elementTextWrap = wrapText(ctx, element.text, element.width)
          .split("\n")
          .reverse(); // если нижний текст - перенос строк снизу вверх
      }

      elementTextWrap.forEach((t, i) =>
        drawText(
          t,
          i,
          ctx,
          element.bottom === null ? true : false,
          canvasHeight,
          elementOffsetY,
          textMarginYBottom,
          textMarginYTop,
          elementMarginX,
          element
        )
      );
    });
  }, [image, imageSizes, canvasHeight, textsValues, outsideTextHeight]);

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

    if (!isNewMeme && localStorage.getItem("textsValues") !== null) {
      const oldTextsValues = JSON.parse(localStorage.getItem("textsValues"));
      setTextsValues(oldTextsValues);
    }

    // личные изображения не созраняются в localstorage,
    // если это личное изображение - навешиваем слушатель на закрытие вкладки,
    // чтобы предупредить пользователя о том, что изменения не сохранятся
    const handleOnBeforeUnload = (event) => {
      event.preventDefault();
      console.log("handleOnBeforeUnload");
      return (event.returnValue = "");
    };

    if (localStorage.getItem("currentMeme") === null) {
      window.addEventListener("beforeunload", handleOnBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleOnBeforeUnload);
      };
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("textsValues", JSON.stringify(textsValues));
  }, [textsValues]);

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
              top: textsValues[0].isVisible ? 81 + outsideTextHeight : 81,
              left: imageSizes.offsetX,
              height: imageSizes.height,
              width: imageSizes.width,
            }}
          >
            <TextFieldset
              textsValues={textsValues}
              setTextsValues={setTextsValues}
              imageSizes={imageSizes}
            />
          </form>
          <EditorButtonsList
            setOutsideTextsVisible={(indexes) => {
              setTextsValues((textsValues) => {
                const newExtraTexts = [...textsValues];
                indexes.forEach((index) => {
                  return (newExtraTexts[index].isVisible = true);
                });
                return newExtraTexts;
              });
            }}
            textsValues={textsValues}
            setTextsValues={setTextsValues}
            imageSizes={imageSizes}
          />
          <button
            onClick={createMeme}
            className="btn editor__btn_type_create-mem"
          >
            сгенерить мем
          </button>
        </div>
      </section>
    </main>
  );
};

export default Canvas;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import "./Canvas.css";
import EditorButtonsList from "../EditorButtonsList/EditorButtonsList";
import { fontFamilyOptions } from "../../utils/constants";
import {
  getOffsetY,
  calculateMarginX,
  wrapText,
  drawText,
} from "./canvasFunctions";

import Fieldset from "../Fieldset/Fieldset";
import { useSelector } from "react-redux";
import { getCanvasSettings } from "../../utils/canvasData";

const Canvas = ({
  // currentMeme,
  handleCreateNewMeme,
  setIsNewMeme,
  isNewMeme,
  memes,
  imageSizes,
  image,
  canvasSizes,
  fontSize,
  outsideTextHeight,
}) => {
  const canvas = useRef(null);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [textsValues, setTextsValues] = useState(
    getCanvasSettings(
      fontSize,
      fontFamilyOptions,
      imageSizes,
      outsideTextHeight
    )
  );
  const { currentMeme } = useSelector((state) => state.setCurrentMeme);

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
    const template = memes.results.some((item) => {
      return item.id === id;
    });
    if (template) {
      handleCreateNewMeme(
        canvas.current.toDataURL("image/jpeg", 0.92),
        id
      ).finally(() => {
        navigate(
          `/saved/${JSON.parse(localStorage.getItem("createdMeme")).id}`,
          { state: JSON.parse(localStorage.getItem("createdMeme")).id }
        );
      });
    } else {
      handleCreateNewMeme(canvas.current.toDataURL("image/jpeg", 0.92)).finally(
        () => {
          navigate(
            `/saved/${JSON.parse(localStorage.getItem("createdMeme")).id}`
          );
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

    images.forEach((element) => {
      ctx.drawImage(
        element.image,
        element.left,
        element.top,
        element.width,
        element.heightToWidthRayio * element.width
      );
    });

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

    textsValues.forEach((element) => {
      if (!element.isVisible) return; // текст основные характеристики
      const elementOffsetY = getOffsetY(
        element,
        textsValues,
        outsideTextHeight
      );

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

      elementTextWrap.forEach((string, index) =>
        drawText(
          string,
          index,
          ctx,
          element.bottom === null ? true : false,
          canvasHeight,
          elementOffsetY,
          textMarginYBottom,
          textMarginYTop,
          elementMarginX,
          element,
          elementTextWrap.length
        )
      );
    });
  }, [image, images, imageSizes, canvasHeight, textsValues, outsideTextHeight]);

  useEffect(() => {
    // личные изображения не созраняются в localstorage,
    // если это личное изображение - навешиваем слушатель на закрытие вкладки,
    // чтобы предупредить пользователя о том, что изменения не сохранятся
    const handleOnBeforeUnload = (event) => {
      event.preventDefault();
      return (event.returnValue = "");
    };

    if (localStorage.getItem("currentMeme") === null || images.length > 0) {
      window.addEventListener("beforeunload", handleOnBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleOnBeforeUnload);
      };
    }
  }, [images]);

  useEffect(() => {
    setIsNewMeme(false); // true - сразу после выбора нового шаблона, данные из хранилища подгружаться не будут, false - условие для подгрузки данных из хранилища при последующей перезагрузке страницы;
    localStorage.removeItem("createdMeme");

    if (!isNewMeme && localStorage.getItem("textsValues") !== null) {
      const oldTextsValues = JSON.parse(localStorage.getItem("textsValues"));
      setTextsValues(oldTextsValues);
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
        <div className="editor__canvas" style={{ width: canvasSizes.width }}>
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
            height: window.innerWidth > 1140 ? canvasHeight : "auto",
          }}
        >
          <form
            className="editor__text-form"
            style={{
              position: "absolute",
              top:
                window.innerWidth > 1140
                  ? textsValues[0].isVisible
                    ? 81 + outsideTextHeight
                    : 81
                  : window.innerWidth > 700
                  ? textsValues[0].isVisible
                    ? 96 + outsideTextHeight
                    : 96
                  : window.innerWidth > 570
                  ? textsValues[0].isVisible
                    ? 132 + outsideTextHeight
                    : 132
                  : textsValues[0].isVisible
                  ? 122 + outsideTextHeight
                  : 122,
              left: imageSizes.offsetX,
              height: imageSizes.height,
              width: imageSizes.width,
            }}
          >
            <Fieldset
              textsValues={textsValues}
              setTextsValues={setTextsValues}
              imageSizes={imageSizes}
              images={images}
              setImages={setImages}
              outsideTextHeight={outsideTextHeight}
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
            images={images}
            setImages={setImages}
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

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLatest } from "react-use";
import "./TextareaCanvas.css";
import TextareaAutosize from "react-textarea-autosize";
import Panel from "../Panel/Panel";
import {
  updateTextValues,
  move,
  pickup,
} from "../../utils/canvasElementsFunctions";

const TextareaCanvas = ({
  index,
  textValues,
  imageSizes,
  setTextValues,
  outsideTopTextValues,
  deleteTextFromArray,
  isCurrentTextIndex,
  setIsCurrentTextIndex,
  deleteCurrentImage,
}) => {
  const latestTextValues = useLatest(textValues);
  const latestImageSizes = useLatest(imageSizes);
  const text = useRef(null);
  const textMoving = useRef(null);
  const panel = useRef(null);
  const deleteTextButton = useRef(null);
  const [placeholderText, setPlaceholderText] = useState("Введите текст");
  const [isHover, setIsHover] = useState(false);

  const onMove = (e) => {
    if (latestTextValues.current.isMoving) {
      move(e, latestTextValues.current, setTextValues);
      // console.log("move text");
    }
  };

  const drop = (e) => {
    if (latestTextValues.current.isMoving) {
      setTextValues({
        ...latestTextValues.current,
        isMoving: false,
        startTop:
          latestTextValues.current.bottom === null
            ? latestTextValues.current.top
            : -latestTextValues.current.bottom,
        startLeft: latestTextValues.current.left,
      });
      // console.log("drop text");
    }
  };

  const deleteText = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log("delete text");
    if (e.target === deleteTextButton.current) {
      if (textValues.isOutside) {
        updateTextValues(setTextValues, latestTextValues.current, true);
      } else {
        deleteTextFromArray();
      }
    }
  };

  const onTexteareaBoxClick = (e) => {
    e.stopPropagation();
    deleteCurrentImage();
    if (isCurrentTextIndex !== index) {
      setIsCurrentTextIndex();
    }
  };

  useEffect(() => {
    // при смене положения экрана (телефона) - обновление ширины области текста (если текст не был внесен) + размера шрифта
    const updateWidth = () => {
      let size;
      if (window.innerWidth > 700) {
        size = 40;
      } else if (window.innerWidth > 570) {
        size = 30;
      } else {
        size = 25;
      }

      if (
        latestTextValues.current.width < latestImageSizes.current.width &&
        latestTextValues.current.text === ""
      ) {
        setTextValues({
          ...latestTextValues.current,
          width: latestImageSizes.current.width,
          fontSize: size,
        });
      } else {
        if (latestTextValues.current.fontSize === size) return;
        setTextValues({
          ...latestTextValues.current,
          fontSize: size,
        });
      }
    };

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    // подписка на изменение размера области textarea
    if (text.current !== null && textValues.isVisible) {
      const textObserved = text.current;
      const observer = new ResizeObserver(() => {
        setTextValues({
          ...latestTextValues.current,
          width: text.current?.offsetWidth,
          height: text.current?.offsetHeight,
        });
        // console.log("observer", textValues.name);
      });
      observer.observe(textObserved);
      return () => {
        observer.unobserve(textObserved);
      };
    }
  }, [textValues.isVisible]);

  useEffect(() => {
    if (
      !latestTextValues.current.isOutside &&
      latestTextValues.current.isVisible
    ) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("mouseup", drop);
      window.addEventListener("touchend", drop, { passive: true });

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove, { passive: true });
        window.removeEventListener("mouseup", drop);
        window.removeEventListener("touchend", drop, { passive: true });
      };
    }
  }, []);

  if (!textValues.isVisible || !textValues) return null;

  return (
    <>
      <div
        className={`textarea__box ${
          textValues.isOutside
            ? "textarea__box_type_ungrabbing"
            : "textarea__box_type_grabbing"
        }`}
        ref={textMoving}
        style={{
          top: textValues.top,
          left: textValues.left,
          bottom: textValues.bottom,
          maxWidth: imageSizes?.width,
          minHeight: textValues.isOutside
            ? 70
            : window.innerWidth > 700
            ? 70
            : window.innerWidth > 570
            ? 60
            : 50,
          height: textValues.height,
          maxHeight: imageSizes?.height,
          backgroundColor:
            textValues.text === "" ? "rgba(29, 27, 27, 0.5)" : "transparent",
          borderColor:
            isCurrentTextIndex === index || isHover ? "#EBFF00" : "transparent",
          zIndex: isCurrentTextIndex === index ? 3 : 0,
        }}
        onMouseDown={(e) =>
          pickup(e, textMoving.current, textValues, setTextValues)
        }
        onTouchStart={(e) =>
          pickup(e, textMoving.current, textValues, setTextValues)
        }
        onMouseEnter={(e) => setIsHover(true)}
        onMouseLeave={(e) => setIsHover(false)}
        onClick={(e) => onTexteareaBoxClick(e)}
      >
        <div className="textarea__container">
          {(isCurrentTextIndex === index || isHover) && (
            <>
              <button
                ref={deleteTextButton}
                className="textarea__delete-text"
                onClick={(e) => deleteText(e)}
              ></button>
              <div
                className="textarea__resizer"
                style={{
                  display: textValues.isOutside ? "none" : "block",
                }}
              ></div>
            </>
          )}
          <TextareaAutosize
            wrap="hard"
            ref={text}
            className="textarea__text"
            type="text"
            value={textValues.text}
            onChange={(e) =>
              setTextValues({ ...textValues, text: e.target.value })
            }
            placeholder={placeholderText}
            onFocus={(e) => setPlaceholderText("")}
            onBlur={(e) => setPlaceholderText("Введите текст")}
            style={{
              width: textValues.width || imageSizes?.width,
              maxWidth: imageSizes?.width,
              height: textValues.height,
              minHeight: textValues.isOutside
                ? 70
                : window.innerWidth > 700
                ? 70
                : window.innerWidth > 570
                ? 60
                : 50,
              maxHeight: imageSizes?.height,
              fontFamily: textValues.fontFamily,
              fontStyle: textValues.fontStyle ? "italic" : "normal",
              fontWeight: textValues.fontWeight ? 700 : 400,
              fontSize: textValues.fontSize,
              lineHeight: 1.12,
              textAlign: textValues.fontPosition,
              paddingLeft: textValues.isOutside ? 28 : 30,
              paddingRight: textValues.isOutside ? 28 : 30,
              paddingBottom:
                textValues.name === "bottomTextValues" && textValues.height > 80
                  ? 12
                  : 0,
              resize: textValues.isOutside ? "none" : "horizontal",
            }}
            autocorrect="off"
            spellcheck="false"
          />
        </div>
      </div>
      {isCurrentTextIndex === index && (
        <div
          ref={panel}
          className="textarea__panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            top:
              window.innerWidth > 700
                ? outsideTopTextValues[0].isVisible
                  ? -36 - 30 - 80
                  : -36 - 30
                : outsideTopTextValues[0].isVisible
                ? -36 - 30 - 80 - 36
                : -36 - 30 - 36,
            left:
              imageSizes.width < 609 && window.innerWidth > 700
                ? -((609 - imageSizes.width) / 2)
                : imageSizes.width < 331 && window.innerWidth < 701
                ? -((331 - imageSizes.width) / 2)
                : 0,
          }}
        >
          <Panel textValues={textValues} setTextValues={setTextValues} />
        </div>
      )}
    </>
  );
};

export default TextareaCanvas;

import React, { useCallback, useEffect, useRef } from "react";
import "./TextareaCanvas.css";
import TextareaAutosize from 'react-textarea-autosize';
import Panel from '../Panel/Panel';
import { updateTextValues } from "../../utils/textPanelFunctions.js";
import { move } from "../../utils/functionsForCanvas.js";


const TextareaCanvas = ({
    textValues,
    imageSizes,
    setTextValues,
    outsideTopTextValues
  }) => {

  const text = useRef(null);
  const textMoving = useRef(null);
  const panel = useRef(null);
  const deleteTextButton = useRef(null);

  // второй вариант перемещения текста (все переменные в textValues)
  const pickup = (e) => {
    if (!(e.target === textMoving.current)) return;

    if (e.clientX) {
      setTextValues((prev) => ({ ...prev, isMoving: true, oldX: e.clientX, oldY: e.clientY }));
    } else {
      setTextValues((prev) => ({
        ...prev,
        isMoving: true,
        oldX: e.touches[0].clientX,
        oldY: e.touches[0].clientY,
      }));
    };
  };

  const onMove = (e) => {
    if (textValues.isMoving) {
      move(e, textValues, setTextValues);
    };
  };

  const drop = (e) => {
    setTextValues((prev) => ({
      ...prev,
      isMoving: false,
      startTop: prev.bottom === null ? prev.top : -prev.bottom,
      startLeft: prev.left,
    }));
  };

  const deleteText = (e) => {
    e.preventDefault();
    if (e.target === deleteTextButton.current) {
      updateTextValues(setTextValues, textValues, true);
    };
  };

  // useEffect(() => { // подписка на изменение размера области textarea
  //   if (text.current !== null) {
  //     new ResizeObserver(
  //       () => {
  //       console.log(text.current?.offsetHeight);
  //       if (textValues.isOutside && text.current?.offsetHeight > 80) {  // автоматическое уменьшение размера текста (работает неправильно из-за рассинхронизации курсора на маленьких размерах шрифта)
  //         setTextValues((prev) => ({ ...prev, height: 80, fontSize: textValues.fontSize * 0.62}));
  //       } else {
  //         setTextValues((prev) => ({ ...prev, width: text.current?.offsetWidth, height: text.current?.offsetHeight}));
  //       }
  //     }
  //     ).observe(text.current);
  //   };

  // }, [text.current]);

    useEffect(() => { // подписка на изменение размера области textarea
    if (text.current !== null) {
      new ResizeObserver(
        () => {
        setTextValues((prev) => ({ ...prev, width: text.current?.offsetWidth, height: text.current?.offsetHeight}));
      }
      ).observe(text.current);
    };
  }, [text.current]);

  useEffect(() => {
    if (!textValues.isOutside) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("touchmove", onMove, {passive: true});
      window.addEventListener("mouseup", drop);
      window.addEventListener("touchend", drop, {passive: true});

      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("touchmove", onMove, {passive: true});
        window.removeEventListener("mouseup", drop);
        window.removeEventListener("touchend", drop, {passive: true});
      };
    }
  }, [textValues.isMoving]);

  useEffect(() => {
    const removeCurrentPosition = (e) => {
      if (!textMoving.current?.contains(e.target) && !panel.current?.contains(e.target) && (textValues.isCurrent || textValues.hover)) {
        console.log(textValues.name, "remove current")
        setTextValues({ ...textValues, isCurrent: false, hover: false });
      }
    };
    window.addEventListener("click", removeCurrentPosition);
    return () => {
      window.removeEventListener("click", removeCurrentPosition);
    };

  }, [textValues, setTextValues]);

  if (!textValues.isVisible) return null;

  return (
    <>
      <div
        className={`textarea__box ${textValues.isOutside? "textarea__box_type_ungrabbing" : "textarea__box_type_grabbing"}`}
        ref={textMoving}
        style={{
          top: textValues.top,
          left: textValues.left,
          bottom: textValues.bottom,
          maxWidth: textValues.maxWidth,
          minHeight: 70,
          height: textValues.height,
          // maxHeight: textValues.isOutside ? 80 : imageSizes?.height,
          maxHeight: imageSizes?.height,
          backgroundColor:
            textValues.text === "" ? "rgba(29, 27, 27, 0.5)" : "transparent",
          borderColor:
            textValues.isCurrent || textValues.hover
              ? "#EBFF00"
              : "transparent",
        }}
        onMouseDown={pickup}
        onTouchStart={pickup}
        onMouseEnter={(e) =>
          setTextValues({ ...textValues, hover: true })
        }
        onMouseLeave={(e) =>
          setTextValues({ ...textValues, hover: false })
        }
      >
        <div className="textarea__container">
          {(textValues.isCurrent || textValues.hover) && (
            <>
              <button
                ref={deleteTextButton}
                className="textarea__delete-text"
                onClick={e => deleteText(e)}
              >
              </button>
              <div
                className="textarea__resizer"
                style={{
                  display: textValues.isOutside ? "none" : "block",
                }}
              >
              </div>
          </>
          )}
          <TextareaAutosize
            // wrap={`${textValues.isOutside ? "off" : "hard"}`}
            wrap="hard"
            ref={text}
            className="textarea__text"
            type="text"
            value={textValues.text}
            onChange={e => setTextValues({ ...textValues, text: e.target.value})}
            placeholder="Введите текст"
            onClick={e => setTextValues({ ...textValues, isCurrent: true })}
            style={{
              width: textValues.width || imageSizes?.width,
              maxWidth: textValues.maxWidth,
              height: textValues.height,
              minHeight: 70,
              maxHeight: imageSizes?.height,
              // maxHeight: textValues.isOutside ? 70 : imageSizes?.height,
              fontFamily: textValues.fontFamily,
              fontStyle: textValues.fontStyle ? "italic" : "normal",
              fontWeight: textValues.fontWeight ? 700 : 400,
              fontSize: textValues.fontSize,
              lineHeight: 1.12,
              textAlign: textValues.fontPosition,
              paddingLeft: textValues.isOutside ? 28 : 30,
              paddingRight: textValues.isOutside ? 28 : 30,
              paddingBottom: (textValues.name === "bottomTextValues" && textValues.height > 80) ? 12 : 0,
              resize: textValues.isOutside ? "none" : "horizontal",
            }}
            autocorrect="off"
            spellcheck="false"
          />
        </div>
      </div>
      {textValues.isCurrent && (
        <div
          ref={panel}
          className="textarea__panel"
          style={{
            top: outsideTopTextValues.isVisible? - 36 - 30 - 80 : - 36 - 30,
            // top: outsideTopTextValues.isVisible? - 36 - 30 - outsideTopTextValues.height : - 36 - 30,
            left: (imageSizes.width < 609) ? - ((609 - imageSizes.width) / 2) : 0,
          }}
        >
          <Panel
            textValues={textValues}
            setTextValues={setTextValues}
          />
        </div>
      )}
    </>
  );
};

export default TextareaCanvas;

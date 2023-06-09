import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLatest } from 'react-use';
import "./TextareaCanvas.css";
import TextareaAutosize from 'react-textarea-autosize';
import Panel from '../Panel/Panel';
import { updateTextValues } from "../../utils/textPanelFunctions.js";
import { move } from "../../utils/functionsForCanvas.js";


const TextareaCanvas = ({
    index,
    textValues,
    imageSizes,
    setTextValues,
    outsideTopTextValues,
    deleteTextFromArray,
  }) => {

  const latestTextValues = useLatest(textValues);
  const text = useRef(null);
  const textMoving = useRef(null);
  const panel = useRef(null);
  const deleteTextButton = useRef(null);
  const [placeholderText, setPlaceholderText] = useState("Введите текст");
  const [isHover, setIsHover] = useState(false);

  const pickup = (e) => {
    if (!(e.target === textMoving.current)) return;
    if (latestTextValues.current.isMoving) return;

    if (e.clientX) {
      setTextValues({ ...latestTextValues.current, isMoving: true, oldX: e.clientX, oldY: e.clientY });
    } else {
      setTextValues({
        ...latestTextValues.current,
        isMoving: true,
        oldX: e.touches[0].clientX,
        oldY: e.touches[0].clientY,
      });
    };
    console.log("pick up")
  };

  const onMove = (e) => {
  if (latestTextValues.current.isMoving) {
      move(e, latestTextValues.current, setTextValues);
    console.log("move")
    };
  };

  const drop = (e) => {
    if (latestTextValues.current.isMoving) {
      setTextValues({
        ...latestTextValues.current,
        isMoving: false,
        startTop: latestTextValues.current.bottom === null ? latestTextValues.current.top : -latestTextValues.current.bottom,
        startLeft: latestTextValues.current.left,
      });
      console.log("drop")
    }
  };

  const deleteText = (e) => {
    e.preventDefault();
    if (e.target === deleteTextButton.current) {
      if (textValues.isOutside) {
        updateTextValues(setTextValues, latestTextValues.current, true)
      } else {
        deleteTextFromArray(index);
      }
    };
  };

  useEffect(() => { // подписка на изменение размера области textarea
    if (text.current !== null && textValues.isVisible) {
      const textObserved = text.current;
      const observer = new ResizeObserver(
        () => {
          setTextValues({ ...latestTextValues.current, width: text.current?.offsetWidth, height: text.current?.offsetHeight});
          console.log("observer")
        }
      );
      observer.observe(textObserved);
      return () => {
        observer.unobserve(textObserved);
      }
    };
  }, [textValues.isVisible]);

  useEffect(() => {
    if (!latestTextValues.current.isOutside && latestTextValues.current.isVisible) {
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
  }, []);

  // useEffect(() => {
  //   const checkCurrentPosition = (e) => {
  //     console.log("Count");
  //     if (text.current?.contains(e.target)) {
  //       setTextValues({ ...latestTextValues.current, isCurrent: true });
  //     } else if (panel.current?.contains(e.target)) {
  //       return;
  //     } else if ((!textMoving.current?.contains(e.target) && (latestTextValues.current.isCurrent))) { // удалено: || latestTextValues.current.hover
  //       setTextValues({ ...latestTextValues.current, isCurrent: false}); // удалено: , hover: false
  //     }
  //   };
    
  //   if (text.current === null) return;

  //     window.addEventListener("click", checkCurrentPosition);
  //     return () => {
  //       window.removeEventListener("click", checkCurrentPosition);
  //   };
  // }, []);

  if (!textValues.isVisible || !textValues) return null;

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
          maxHeight: imageSizes?.height,
          backgroundColor:
            textValues.text === "" ? "rgba(29, 27, 27, 0.5)" : "transparent",
          borderColor:
            textValues.isCurrent || isHover
              ? "#EBFF00"
              : "transparent",
          zIndex: textValues.isCurrent? 3 : 0,
        }}
        onMouseDown={pickup}
        onTouchStart={pickup}
        onMouseEnter={(e) => setIsHover(true)}
        onMouseLeave={(e) => setIsHover(false)}
      >
        <div className="textarea__container">
          {(textValues.isCurrent || isHover) && (
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
            wrap="hard"
            ref={text}
            className="textarea__text"
            type="text"
            value={textValues.text}
            onChange={e => setTextValues({ ...textValues, text: e.target.value})}
            placeholder={placeholderText}
            onFocus={e => setPlaceholderText("")}
            onBlur={e => setPlaceholderText("Введите текст")}
            // onClick={e => setTextValues({ ...textValues, isCurrent: true })}
            style={{
              width: textValues.width || imageSizes?.width,
              maxWidth: textValues.maxWidth,
              height: textValues.height,
              minHeight: 70,
              maxHeight: imageSizes?.height,
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
            top: outsideTopTextValues[0].isVisible? - 36 - 30 - 80 : - 36 - 30,
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

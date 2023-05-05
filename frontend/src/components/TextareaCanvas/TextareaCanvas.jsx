import React, { useEffect, useRef } from 'react';
import "./TextareaCanvas.css";
import TextareaAutosize from 'react-textarea-autosize';
import Panel from '../Panel/Panel';

const TextareaCanvas = ({ textValues, imageSizes, setTextValues, setCurrentTextarea }) => {
  const text = useRef(null);
  const textMoving = useRef(null);
  const panel = useRef(null);
  const deleteTextButton = useRef(null);

  // второй вариант перемещения текста (все переменные в textValues)
  const pickup = (e) => {
    setCurrentTextarea(textValues.name);

    if (!(e.target === textMoving.current)) return;
    setTextValues((prev) => ({ ...prev, isMoving: true }))

    if (e.clientX) {
      setTextValues((prev) => ({ ...prev, oldX: e.clientX, oldY: e.clientY}))
    } else {
      setTextValues((prev) => ({ ...prev, oldX: e.touches[0].clientX, oldY: e.touches[0].clientY}))
    };
  };

  // const move = (e) => { // теперь в dunctionForCanvas
  //   if (!textValues.isMoving) return;

  //   let distX;
  //   let distY;

  //   if (e.clientX) {
  //     distX = e.clientX - textValues.oldX;
  //     distY = e.clientY - textValues.oldY;
  //   } else {
  //     distX = e.touches[0].clientX - textValues.oldX;
  //     distY = e.touches[0].clientY - textValues.oldY;
  //   }

  //   const newY = textValues.startTop + distY;
  //   const newX = textValues.startLeft + distX;

  //   setTextValues((prev) => ({
  //     ...prev,
  //     top: (prev.top !== null) ? newY : null,
  //     left: newX,
  //     bottom: (prev.bottom !== null) ? - newY : null,
  //   }))
  // };

  const drop = (e) => {
    setTextValues((prev) => ({
      ...prev,
      isMoving: false,
      startTop: (prev.bottom === null) ? prev.top : - prev.bottom,
      startLeft: prev.left
    }))
  };


  // первый вариант перемещения с внутренним стейтом
  // const [textArea, setTextArea] = useState({
  //   isMoving: false,
  //   oldX: null,
  //   oldY: null,
  // });

  // const pickup = (e) => {
  //   if (!(e.target === textMoving.current)) return;
  //   setTextArea((prev) => ({ ...prev, isMoving: true }))

  //   if (e.clientX) {
  //     setTextArea((prev) => ({ ...prev, oldX: e.clientX, oldY: e.clientY}))
  //   } else {
  //     setTextArea((prev) => ({ ...prev, oldX: e.touches[0].clientX, oldY: e.touches[0].clientY}))
  //   };
  // };

  // const move = (e) => {
  //   if (!textArea.isMoving) return;

  //   let distX;
  //   let distY;

  //   if (e.clientX) {
  //     distX = e.clientX - textArea.oldX;
  //     distY = e.clientY - textArea.oldY;
  //   } else {
  //     distX = e.touches[0].clientX - textArea.oldX;
  //     distY = e.touches[0].clientY - textArea.oldY;
  //   }

  //   const newY = textValues.startTop + distY;
  //   const newX = textValues.startLeft + distX;

  //   setTextValues((prev) => ({
  //     ...prev,
  //     top: (prev.top !== null) ? newY : null,
  //     left: newX,
  //     bottom: (prev.bottom !== null) ? - newY : null,
  //   }))
  // };

  // const drop = (e) => {
  //   setTextArea((prev) => ({ ...prev, isMoving: false }))
  //   setTextValues((prev) => ({
  //     ...prev,
  //     startTop: (prev.bottom === null) ? prev.top : - prev.bottom,
  //     startLeft: prev.left
  //   }))
  // };

  const deleteText = (e) => {
    e.preventDefault();
    console.log(e.target);
    if (e.target === deleteTextButton.current) {
      setTextValues((prev) => ({ ...prev, isVisible: false }));
    };
  };

  useEffect(() => {
    const removeCurrentPosition = (e) => {
      if (textMoving.current?.contains(e.target) || panel.current?.contains(e.target)) return;
      setTextValues((prev) => ({ ...prev, isCurrent: false }));
    };
    
    if (textValues.isOutside) {
      window.addEventListener("click", removeCurrentPosition);
      return () => {
        window.removeEventListener("click", removeCurrentPosition);
      };
    } else {
      window.addEventListener("mouseup", drop);
      window.addEventListener("touchend", drop, {passive: true});
      window.addEventListener("click", removeCurrentPosition);

      return () => {
        window.removeEventListener("mouseup", drop);
        window.removeEventListener("touchend", drop, {passive: true});
        window.removeEventListener("click", removeCurrentPosition);
      };
    }
  }, []);

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
          maxHeight: imageSizes?.height,
          backgroundColor: (textValues.text === "") ? "rgba(29, 27, 27, 0.5)" : "transparent",
          borderColor: (textValues.isCurrent || textValues.hover) ? "#EBFF00" : 'transparent',
        }}
        onMouseDown={pickup}
        onMouseEnter={e => setTextValues((prev) => ({ ...prev, hover: true }))}
        onMouseLeave={e => setTextValues((prev) => ({ ...prev, hover: false }))}
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
            wrap="hard"
            ref={text}
            className="textarea__text"
            type="text"
            value={textValues.text}
            onChange={e => setTextValues((prev) => ({ ...prev, text: e.target.value}))}
            placeholder="Введите свой текст"
            onClick={e => setTextValues((prev) => ({ ...prev, isCurrent: true }))}
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
              paddingLeft: textValues.isOutside ? 28 : 29,
              paddingRight: textValues.isOutside ? 28 : 29,
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
            top: - 36 - 30,
          }}
        >
          <Panel
            textValues={textValues}
            setTextValues={setTextValues}
          />
        </div>
      )}
    </>
  )
};

export default TextareaCanvas;
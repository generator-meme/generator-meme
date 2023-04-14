import React, { useEffect, useRef, useState } from 'react';
import "./TextareaCanvas.css";
import TextareaAutosize from 'react-textarea-autosize';

const TextareaCanvas = ({ textValues, imageSizes, setTextValues, setMyPanelIsOpen, setOtherPanelIsOpen, paddingTop, setCurrentTextarea }) => {
  const text = useRef(null);
  const textMoving = useRef(null);

  const openMyPanel = (e) => { // открытие/закрытие панелей
    e.preventDefault();
    setMyPanelIsOpen(true);
    setOtherPanelIsOpen(false);
  };

  const outputSize = () => {
    setTextValues((prev) => ({ ...prev, width: text.current.offsetWidth, height: text.current.offsetHeight}));
  };

  useEffect(() => { // подписка на изменение размера
    if (text.current) {
      new ResizeObserver(outputSize).observe(text.current);
    };
  }, [text.current]);

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

  useEffect(() => {
    window.addEventListener("mouseup", drop);
    window.addEventListener("touchend", drop, {passive: true});

    return () => {
      window.removeEventListener("mouseup", drop);
      window.removeEventListener("touchend", drop, {passive: true});
    };
  }, []);

  return (
    <label
      className="textarea__moving"
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
      }}
      onMouseDown={pickup}
    >
      <TextareaAutosize
        ref={text}
        className="textarea__text"
        type="text"
        value={textValues.text}
        onChange={e => setTextValues((prev) => ({ ...prev, text: e.target.value}))}
        placeholder="Введите свой текст"
        onClick={e => openMyPanel(e)}
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
          paddingTop: paddingTop,
          textAlign: textValues.fontPosition,
        }}
        autocorrect="off"
        spellcheck="false"
      />
    </label>
  )
};

export default TextareaCanvas;
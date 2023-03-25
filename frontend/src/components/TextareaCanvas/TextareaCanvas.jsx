import React, { useEffect, useRef } from 'react';
import "./TextareaCanvas.css";
import TextareaAutosize from 'react-textarea-autosize';

const TextareaCanvas = ({ textValues, imageSizes, setTextValues, setMyPanelIsOpen, setOtherPanelIsOpen, top, left, bottom }) => {
  const text = useRef(null);

  const openMyPanel = (e) => { // открытие/закрытие панелей
    e.preventDefault();
    setMyPanelIsOpen(true);
    setOtherPanelIsOpen(false);
  };

  const outputSize = () => {
    setTextValues((prev) => ({ ...prev, width: text.current.offsetWidth}));
  };

  useEffect(() => { // подписка на изменение размера
      if (text.current) {
        new ResizeObserver(outputSize).observe(text.current);
      }
  }, [text.current]);

  return (
    <TextareaAutosize
      ref={text}
      className="editor__text"
      type="text"
      value={textValues.text}
      onChange={e => setTextValues((prev) => ({ ...prev, text: e.target.value}))}
      placeholder="Введите свой текст"
      onClick={e => openMyPanel(e)}
      style={{
        width: textValues.width || imageSizes?.width,
        maxWidth: imageSizes?.width,
        height: textValues.height,
        minHeight: 80,
        maxHeight: imageSizes?.height,
        top: top,
        left: left,
        bottom: bottom,
        backgroundColor: (textValues.text !== "")? "transparent" : "rgba(29, 27, 27, 0.5)",
      }}
      autocorrect="off"
      spellcheck="false"
    />
  )
};

export default TextareaCanvas;
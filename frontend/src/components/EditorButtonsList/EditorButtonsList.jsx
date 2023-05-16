import React, { useState, useRef, useEffect } from 'react';
import "./EditorButtonsList.css";
import { ReactComponent as OutsideTextImage } from "../../images/editor/outside-text.svg";
import { ReactComponent as AddTextImage } from "../../images/editor/add-text-main-part.svg";
import { ReactComponent as AddImageImage } from "../../images/editor/add-image-main-part.svg";
import { ReactComponent as Plus } from "../../images/editor/add-something.svg";
import { createExtraText } from '../../utils/constants';

const EditorButtonsList = ({
  setOutsideTopVisible,
  setOutsideBottomVisible,
  extraTexts,
  setExtraTexts,
  imageSizes
}) => {
  const [listIsVisible, setListIsVisible] = useState(false);
  const outsizeTextList = useRef(null);
  const bthList = useRef(null);

  const openOutsideText = (e, top, bottom) => {
    if (top) {
      setOutsideTopVisible((prev) => ({ ...prev, isVisible: true}));
    };
    if (bottom) {
      setOutsideBottomVisible((prev) => ({ ...prev, isVisible: true}));
    };
  };

  const addExtraText = () => {
    if (extraTexts.length > 9) {
      console.log("Вы не можете создавать более 10 дополнительных текстов")
      return; //вывести сообщение пользователю?
    };

    const newExtraText = createExtraText(imageSizes);
    console.log(newExtraText);
    setExtraTexts([...extraTexts, newExtraText]);
  };

  useEffect(() => {
    const hideList = (e) => {
      if (!outsizeTextList.current.contains(e.target) || bthList.current.contains(e.target)) {
        setListIsVisible(false);
      };
    };

    window.addEventListener("click", hideList);

    return () => {
      window.removeEventListener("click", hideList);
    };
  }, []);

  return (
    <ul className="buttons__container">
      <li>
        <button 
          className="buttons__bth buttons__bth_type_outside-text"
          ref={outsizeTextList}
          onClick={e => setListIsVisible(true)}
        >
          <OutsideTextImage className="buttons__svg-outside" />
          <p className="buttons__bth-text">текст снаружи</p>
          {listIsVisible && (
            <ul className="buttons__bth-list" ref={bthList}>
              <li
                onClick={e => openOutsideText(e, true, false)}
                className="buttons__bth-list-element"
              >верхнее поле</li>
              <li
                onClick={e => openOutsideText(e, false, true)}
                className="buttons__bth-list-element"
              >нижнее поле</li>
              <li 
                onClick={e => openOutsideText(e, true, true)}
                className="buttons__bth-list-element"
              >оба поля</li>
            </ul>
          )}
        </button>
      </li>
      <li>
        <button 
          className="buttons__bth buttons__bth_type_add-text"
          onClick={e => e.preventDefault()}
          >
          <div className="buttons__bth-img">
            <AddTextImage className="buttons__svg-add-text" />
            <Plus className="buttons__svg-plus" />
          </div>
          <p className="buttons__bth-text">добавить текст</p>
          <p className="buttons__prompt">В РАЗРАБОТКЕ</p>
        </button>
      </li>
      <li>
        <button 
          className="buttons__bth buttons__bth_type_add-image"
          onClick={e => e.preventDefault()}
        >
          <div className="buttons__bth-img">
            <AddImageImage className="buttons__svg-add-image" />
            <Plus className="buttons__svg-plus" />
          </div>
          <p className="buttons__bth-text">добавить изображение</p>
          <p className="buttons__prompt">В РАЗРАБОТКЕ</p>
        </button>
      </li>
          </ul>
  )
};

export default EditorButtonsList;

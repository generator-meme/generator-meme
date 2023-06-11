import React, { useState, useRef, useEffect } from "react";
import "./EditorButtonsList.css";
import { ReactComponent as OutsideTextImage } from "../../images/editor/outside-text.svg";
import { ReactComponent as AddTextImage } from "../../images/editor/add-text-main-part.svg";
import { ReactComponent as AddImageImage } from "../../images/editor/add-image-main-part.svg";
import { ReactComponent as Plus } from "../../images/editor/add-something.svg";
import { createExtraText } from "../../utils/constants";

const EditorButtonsList = ({
  setOutsideTextsVisible,
  textsValues,
  setTextsValues,
  imageSizes,
}) => {
  const [listIsVisible, setListIsVisible] = useState(false);
  const outsizeTextList = useRef(null);
  const bthList = useRef(null);

  const openOutsideText = (e, top, bottom) => {
    let indexesArrey = [];
    if (top && !textsValues[0].isVisible) {
      indexesArrey.push(0);
    }
    if (bottom && !textsValues[1].isVisible) {
      indexesArrey.push(1);
    }
    if (indexesArrey.length > 0) {
      setOutsideTextsVisible(indexesArrey);
    }
  };

  const addExtraText = () => {
    if (textsValues.length > 13) {
      alert(
        "На данный момент создание более 10 дополнительных текстов не предусмотрено"
      );
      return;
    }

    const newExtraText = createExtraText(imageSizes);
    setTextsValues([...textsValues, newExtraText]);
  };

  useEffect(() => {
    const hideList = (e) => {
      if (
        !outsizeTextList.current.contains(e.target) ||
        bthList.current.contains(e.target)
      ) {
        setListIsVisible(false);
      }
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
          onClick={(e) => setListIsVisible(true)}
        >
          <OutsideTextImage className="buttons__svg-outside" />
          <p className="buttons__bth-text">текст снаружи</p>
          {listIsVisible && (
            <ul className="buttons__bth-list" ref={bthList}>
              <li
                onClick={(e) => openOutsideText(e, true, false)}
                className="buttons__bth-list-element"
              >
                верхнее поле
              </li>
              <li
                onClick={(e) => openOutsideText(e, false, true)}
                className="buttons__bth-list-element"
              >
                нижнее поле
              </li>
              <li
                onClick={(e) => openOutsideText(e, true, true)}
                className="buttons__bth-list-element"
              >
                оба поля
              </li>
            </ul>
          )}
        </button>
      </li>
      <li>
        <button
          className="buttons__bth buttons__bth_type_add-text"
          onClick={(e) => addExtraText(e)}
        >
          <div className="buttons__bth-img">
            <AddTextImage className="buttons__svg-add-text" />
            <Plus className="buttons__svg-plus buttons__svg-plus-text" />
          </div>
          <p className="buttons__bth-text">добавить текст</p>
        </button>
      </li>
      <li>
        <button
          className="buttons__bth buttons__bth_type_add-image"
          onClick={(e) => e.preventDefault()}
        >
          <div className="buttons__bth-img">
            <AddImageImage className="buttons__svg-add-image" />
            <Plus className="buttons__svg-plus buttons__svg-plus-image" />
          </div>
          <p className="buttons__bth-text">добавить изображение</p>
          <p className="buttons__prompt">В РАЗРАБОТКЕ</p>
        </button>
      </li>
    </ul>
  );
};

export default EditorButtonsList;

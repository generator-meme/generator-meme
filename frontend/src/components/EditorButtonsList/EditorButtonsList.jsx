import React, { useState, useRef, useEffect } from 'react';
import "./EditorButtonsList.css";
import { ReactComponent as OutsideTextImage } from "../../images/editor/outside-text.svg";
import { ReactComponent as AddTextImage } from "../../images/editor/add-text-main-part.svg";
import { ReactComponent as AddImageImage } from "../../images/editor/add-image-main-part.svg";
import { ReactComponent as Plus } from "../../images/editor/add-something.svg";


const EditorButtonsList = () => {
  const [listIsVisible, setListIsVisible] = useState(false);
  const outsizeTextList = useRef(null);

  useEffect(() => {
      const hideList = (e) => {
      if (!outsizeTextList.current.contains(e.target)) {
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
            <ul className="buttons__bth-list">
              <li className="buttons__bth-list-element">верхнее поле</li>
              <li className="buttons__bth-list-element">нижнее поле</li>
              <li className="buttons__bth-list-element">оба поля</li>
            </ul>
          )}
        </button>
      </li>
      <li>
        <button className="buttons__bth buttons__bth_type_add-text">
          <div className="buttons__bth-img">
            <AddTextImage className="buttons__svg-add-text" />
            <Plus className="buttons__svg-plus" />
          </div>
          <p className="buttons__bth-text">добавить текст</p>
        </button>
      </li>
      <li>
        <button className="buttons__bth buttons__bth_type_add-image">
          <div className="buttons__bth-img">
            <AddImageImage className="buttons__svg-add-image" />
            <Plus className="buttons__svg-plus" />
          </div>
          <p className="buttons__bth-text">добавить изображение</p>
        </button>
      </li>
          </ul>
  )
};

export default EditorButtonsList;

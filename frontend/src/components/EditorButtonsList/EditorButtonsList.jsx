import React, { useState, useRef, useEffect } from "react";
import "./EditorButtonsList.css";
import { ReactComponent as OutsideTextImage } from "../../images/editor/outside-text.svg";
import { ReactComponent as AddTextImage } from "../../images/editor/add-text-main-part.svg";
import { ReactComponent as AddImageImage } from "../../images/editor/add-image-main-part.svg";
import { ReactComponent as Plus } from "../../images/editor/add-something.svg";
import { createExtraText } from "../../utils/constants";
import { v4 as uuidv4 } from "uuid";
import { contain } from "../../utils/imagesFunctions";

const EditorButtonsList = ({
  setOutsideTextsVisible,
  textsValues,
  setTextsValues,
  imageSizes,
  images,
  setImages,
}) => {
  const [listIsVisible, setListIsVisible] = useState(false);
  const outsizeTextList = useRef(null);
  const bthList = useRef(null);
  const [imageValues, setImageValues] = useState(null);
  const [image, setImage] = useState(null);

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
      alert("Cоздание более 10 дополнительных текстов не предусмотрено");
      return;
    }

    const newExtraText = createExtraText(imageSizes);
    setTextsValues([...textsValues, newExtraText]);
  };

  const checkImagesArrey = (e) => {
    if (images.length > 9) {
      alert("Добавление более 10 изображений не предусмотрено");
      return;
    }
  };

  const addImage = (event) => {
    if (event.target.files[0].size > 400000) {
      alert("Вес изображения не должен превышать 400 КБ");
      return;
    }

    const currentImage = event.target.files[0];

    if (event.target.closest("form").checkValidity()) {
      const newCurrentImage = {
        id: uuidv4(),
        image: URL.createObjectURL(currentImage),
      };
      setImageValues(newCurrentImage);
    }

    event.target.value = null;
  };

  useEffect(() => {
    const img = new Image();
    if (imageValues) {
      img.src = imageValues.image;
    }
    img.addEventListener("load", () => {
      setImage(img);
    });
  }, [imageValues]);

  useEffect(() => {
    let imgSizes;
    if (image) {
      imgSizes = contain(
        imageSizes.width / 1.7, // 1.7 - квардратный корень из трех (площадь изображения дб не более 1/3 площади мема)
        imageSizes.height / 1.7,
        image.naturalWidth,
        image.naturalHeight
      );

      const widthToHeightRayio = image.naturalWidth / image.naturalHeight;
      const heightToWidthRayio = image.naturalHeight / image.naturalWidth;

      const newImage = {
        image: image,
        id: imageValues.id,
        width: imgSizes.width,
        height: imgSizes.height,
        top: imageSizes.height / 2 - imgSizes.height / 2,
        left: imageSizes.width / 2 - imgSizes.width / 2,
        startTop: imageSizes.height / 2 - imgSizes.height / 2,
        startLeft: imageSizes.width / 2 - imgSizes.width / 2,
        isMoving: false,
        oldX: null,
        oldY: null,
        widthToHeightRayio: widthToHeightRayio,
        heightToWidthRayio: heightToWidthRayio,
      };

      setImages([...images, newImage]);
      setImageValues(null);
    }
  }, [image]);

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
        <form>
          <label
            className="buttons__bth buttons__bth_type_add-image"
            onClick={(e) => checkImagesArrey(e)}
          >
            <div className="buttons__bth-img">
              <AddImageImage className="buttons__svg-add-image" />
              <Plus className="buttons__svg-plus buttons__svg-plus-image" />
            </div>
            <p className="buttons__bth-text">добавить изображение</p>
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              name="image"
              onChange={(e) => addImage(e)}
              className="buttons__invisible-input"
              disabled={images.length > 9 ? true : false}
            />
          </label>
        </form>
      </li>
    </ul>
  );
};

export default EditorButtonsList;

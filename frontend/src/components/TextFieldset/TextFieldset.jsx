import React, { useEffect, useState } from "react";
import TextareaCanvas from "../TextareaCanvas/TextareaCanvas";
import ExtraImage from "../ExtraImage/ExtraImage";

const TextFieldset = ({
  textsValues,
  setTextsValues,
  imageSizes,
  images,
  setImages,
}) => {
  const [isCurrentTextIndex, setIsCurrentTextIndex] = useState(null);

  useEffect(() => {
    const checkCurrentText = (e) => {
      setIsCurrentTextIndex(null);
    };

    window.addEventListener("click", checkCurrentText);
    return () => {
      window.removeEventListener("click", checkCurrentText);
    };
  }, []);

  return (
    <fieldset className="text-fieldset">
      {textsValues.map((text, index) => {
        return (
          <TextareaCanvas
            key={index}
            index={index}
            textValues={text}
            imageSizes={imageSizes}
            setTextValues={(newText) => {
              setTextsValues((textsValues) => {
                const newTexts = [...textsValues];
                newTexts[index] = newText;
                return newTexts;
              });
            }}
            deleteTextFromArray={(index) => {
              setTextsValues((textsValues) => {
                const newTexts = [...textsValues];
                newTexts.splice(index, 1);
                return newTexts;
              });
            }}
            outsideTopTextValues={textsValues}
            isCurrentTextIndex={isCurrentTextIndex}
            setIsCurrentTextIndex={() => {
              setIsCurrentTextIndex(index);
            }}
          />
        );
      })}
      {images.map((image, index) => {
        return (
          <ExtraImage
            key={image.id}
            image={image}
            images={images}
            setImages={setImages}
            imageSizes={imageSizes}
          />
          // <div
          //   key={image.id}
          //   style={{
          //     height: image.height,
          //     width: image.width,
          //     position: "absolute",
          //     top: 0,
          //     left: 0,
          //   }}
          // >
          //   <img
          //     src={image.image.currentSrc}
          //     alt="Дополнительное изображение."
          //     style={{
          //       height: image.height,
          //       width: image.width,
          //     }}
          //   />
          // </div>
        );
      })}
    </fieldset>
  );
};

export default TextFieldset;

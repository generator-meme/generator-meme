import React, { useEffect, useState } from "react";
import "./Fieldset.css";
import TextareaCanvas from "../TextareaCanvas/TextareaCanvas";
import ExtraImage from "../ExtraImage/ExtraImage";

const Fieldset = ({
  textsValues,
  setTextsValues,
  imageSizes,
  images,
  setImages,
  outsideTextHeight,
}) => {
  const [isCurrentTextIndex, setIsCurrentTextIndex] = useState(null);
  const [isCurrentImageIndex, setIsCurrentImageIndex] = useState(null);

  useEffect(() => {
    const checkCurrentText = (e) => {
      setIsCurrentTextIndex(null);
      setIsCurrentImageIndex(null);
    };

    window.addEventListener("click", checkCurrentText);
    return () => {
      window.removeEventListener("click", checkCurrentText);
    };
  }, []);

  return (
    <fieldset className="fieldset">
      {textsValues.map((text, index) => {
        return (
          <TextareaCanvas
            key={index}
            index={index}
            textValues={text}
            imageSizes={imageSizes}
            outsideTextHeight={outsideTextHeight}
            setTextValues={(newText) => {
              setTextsValues((textsValues) => {
                const newTexts = [...textsValues];
                newTexts[index] = newText;
                return newTexts;
              });
            }}
            deleteTextFromArray={() => {
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
            deleteCurrentImage={(e) => setIsCurrentTextIndex(null)}
          />
        );
      })}
      {images.map((image, index) => {
        return (
          <ExtraImage
            key={image.id}
            index={index}
            image={image}
            // images={images}
            setImages={(newImage) => {
              setImages((images) => {
                const newImages = [...images];
                newImages[index] = newImage;
                return newImages;
              });
            }}
            imageSizes={imageSizes}
            deleteImageFromArray={() => {
              setImages((images) => {
                const newImages = [...images];
                newImages.splice(index, 1);
                return newImages;
              });
            }}
            isCurrentImageIndex={isCurrentImageIndex}
            setIsCurrentImageIndex={() => {
              setIsCurrentImageIndex(index);
            }}
            deleteCurrentText={(e) => setIsCurrentTextIndex(false)}
          />
        );
      })}
    </fieldset>
  );
};

export default Fieldset;

import React, { useEffect, useState } from "react";
import TextareaCanvas from "../TextareaCanvas/TextareaCanvas";

const TextFieldset = ({ textsValues, setTextsValues, imageSizes }) => {
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
    </fieldset>
  );
};

export default TextFieldset;
